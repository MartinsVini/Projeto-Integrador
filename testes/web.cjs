// Cada cenário usa um contexto descartável, sem acessar o perfil pessoal.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { pathToFileURL } = require('node:url');
const { execFileSync } = require('node:child_process');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const out = path.resolve(root, process.env.EVIDENCIAS_DIR || 'test-results');
const key = 'lendo-pelo-mundo-lista';
const duna = '[data-book="Duna"] [data-list-action]';
fs.mkdirSync(out, { recursive: true });

(async () => {
  const server = http.createServer((req, res) => {
    const files = { '/': 'index.html', '/index.html': 'index.html', '/style.css': 'style.css', '/script.js': 'script.js' };
    const name = files[req.url];
    if (!name) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', name.endsWith('.css') ? 'text/css' : name.endsWith('.js') ? 'text/javascript' : 'text/html; charset=utf-8');
    res.end(fs.readFileSync(path.join(root, name)));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  const results = [];
  const report = {
    inicio: new Date().toISOString(), fuso: Intl.DateTimeFormat().resolvedOptions().timeZone,
    plataforma: process.platform, node: process.version, playwright: require('playwright/package.json').version,
    commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    arquivos: Object.fromEntries(['index.html', 'style.css', 'script.js'].map(f => [f, crypto.createHash('sha256').update(fs.readFileSync(path.join(root, f))).digest('hex')])),
    resultados: results
  };
  try {
    browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', headless: true });
    report.navegador = `${process.env.BROWSER_CHANNEL || 'chrome'} ${browser.version()}`;
    const url = `http://127.0.0.1:${server.address().port}/`;
    async function test(id, description, run, opts = {}) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, ...opts });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      try {
        await run(page, context, url);
        assert.deepEqual(errors, [], 'Erros JavaScript não tratados');
        results.push({ id, descricao: description, resultado: 'APROVADO' });
        console.log(`OK ${id}: ${description}`);
      } catch (error) {
        results.push({ id, descricao: description, resultado: 'REPROVADO', erro: error.message });
        await page.screenshot({ path: path.join(out, `${id}-falha.png`) }).catch(() => {});
        console.error(`FALHA ${id}: ${error.message}`);
      } finally { await context.close(); }
    }
    async function catalog(page, count) {
      assert.equal(await page.locator('.book-card:visible').count(), count);
      assert.equal(await page.locator('#result-count').innerText(), `${count} ${count === 1 ? 'livro encontrado' : 'livros encontrados'}`);
      assert.equal(await page.locator('#empty-message').isVisible(), count === 0);
    }
    async function seed(context, raw) {
      await context.addInitScript(({ key, raw }) => localStorage.setItem(key, raw), { key, raw });
    }
    await test('WEB01', 'Seis livros iniciais e busca por título/autor, caixa e acentos', async (p, c, url) => {
      await p.goto(url); await catalog(p, 6);
      for (const term of ['Duna', '  DUNA  ', 'Frank Herbert', 'Príncipe', 'principe', 'Saint-Exupéry', 'Saint-Exupery', 'García Márquez', 'garcia marquez', 'Capitães', 'capitaes']) {
        await p.locator('#book-search').fill(term); await catalog(p, 1);
      }
      await p.locator('#book-search').fill('Duna');
      assert.equal(await p.locator('.book-card:visible').getAttribute('data-book'), 'Duna');
      await p.locator('#catalogo').screenshot({ path: path.join(out, 'busca-duna.png') });
    });
    await test('WEB02', 'Todos os filtros, combinações, contador e estado vazio', async (p, c, url) => {
      await p.goto(url);
      for (const [genre, n] of [['romance', 2], ['fantasia', 1], ['brasileira', 2], ['ficcao', 1], ['all', 6]]) {
        await p.locator('#genre-filter').selectOption(genre); await catalog(p, n);
      }
      await p.locator('#book-search').fill('Duna');
      await p.locator('#genre-filter').selectOption('ficcao'); await catalog(p, 1);
      await p.locator('#genre-filter').selectOption('romance'); await catalog(p, 0);
      await p.locator('#genre-filter').selectOption('all');
      await p.locator('#book-search').fill('livro-inexistente-xyz'); await catalog(p, 0);
      await p.locator('#book-search').fill(''); await catalog(p, 6);
    });
    await test('WEB03', 'Marcar e desmarcar com persistência após recarga', async (p, c, url) => {
      await p.goto(url); await p.locator(duna).click(); await p.reload();
      assert.equal(await p.locator(duna).getAttribute('aria-pressed'), 'true');
      assert.deepEqual(await p.evaluate(key => JSON.parse(localStorage.getItem(key)), key), ['Duna']);
      await p.locator(duna).click(); await p.reload();
      assert.equal(await p.locator(duna).getAttribute('aria-pressed'), 'false');
      assert.deepEqual(await p.evaluate(key => JSON.parse(localStorage.getItem(key)), key), []);
    });
    await test('WEB04', 'Lista legada válida e duplicações sem perder títulos conhecidos', async (p, c, url) => {
      await seed(c, '["Duna","Duna","Torto Arado"]'); await p.goto(url);
      assert.equal(await p.locator('[aria-pressed="true"]').count(), 2);
      await p.locator(duna).click();
      assert.deepEqual(await p.evaluate(key => JSON.parse(localStorage.getItem(key)), key), ['Torto Arado']);
    });
    const invalids = ['{x', 'null', '{}', '"Duna"', '42', '[1]', '["Duna",null]', '["Título desconhecido"]'];
    for (const [i, raw] of invalids.entries()) {
      await test(`WEB05-${i + 1}`, `Lista inválida ${raw}: aviso, catálogo ativo e recuperação`, async (p, c, url) => {
        await seed(c, raw); await p.goto(url); await catalog(p, 6);
        assert.equal(await p.locator('[aria-pressed="true"]').count(), 0);
        assert.match(await p.locator('#storage-message').innerText(), /Não foi possível carregar/);
        await p.locator('#book-search').fill('Duna'); await catalog(p, 1);
        if (i === 0) await p.locator('#catalogo').screenshot({ path: path.join(out, 'armazenamento-invalido.png') });
        await p.locator(duna).click();
        assert.deepEqual(await p.evaluate(key => JSON.parse(localStorage.getItem(key)), key), ['Duna']);
      });
    }
    await test('WEB06', 'Leitura bloqueada não interrompe busca nem diálogo', async (p, c, url) => {
      await c.addInitScript(key => {
        const get = Storage.prototype.getItem;
        Storage.prototype.getItem = function(k) { if (k === key) throw new DOMException('Bloqueado', 'SecurityError'); return get.call(this, k); };
      }, key);
      await p.goto(url); assert.match(await p.locator('#storage-message').innerText(), /Não foi possível carregar/);
      await p.locator('#book-search').fill('Duna'); await catalog(p, 1);
      await p.locator('[data-open-modal]').first().click(); assert.equal(await p.locator('dialog').isVisible(), true);
    });
    await test('WEB07', 'Gravação bloqueada mantém seleção anterior inclusive após recarga', async (p, c, url) => {
      await p.goto(url); await p.locator(duna).click();
      await p.evaluate(key => {
        const set = Storage.prototype.setItem;
        Storage.prototype.setItem = function(k, value) { if (k === key) throw new DOMException('Sem espaço', 'QuotaExceededError'); return set.call(this, k, value); };
      }, key);
      await p.locator(duna).click();
      assert.equal(await p.locator(duna).getAttribute('aria-pressed'), 'true');
      await p.locator('[data-book="Torto Arado"] [data-list-action]').click();
      assert.equal(await p.locator('[data-book="Torto Arado"] [data-list-action]').getAttribute('aria-pressed'), 'false');
      assert.match(await p.locator('#storage-message').innerText(), /seleção anterior foi mantida/);
      await p.locator('#catalogo').screenshot({ path: path.join(out, 'gravacao-bloqueada.png') });
      await p.reload(); assert.equal(await p.locator(duna).getAttribute('aria-pressed'), 'true');
      assert.equal(await p.locator('[aria-pressed="true"]').count(), 1);
    });
    await test('WEB08', 'Obrigatórios, sucesso demonstrativo, sem envio/persistência dos campos', async (p, c, url) => {
      await p.goto(url); await p.locator('[data-open-modal]').first().click();
      const requests = []; p.on('request', r => requests.push(r.url()));
      await p.locator('[type="submit"]').click();
      assert.equal(await p.locator('#auth-form input:invalid').count(), 2);
      assert.equal(await p.locator('#form-message').innerText(), '');
      await p.locator('#auth-form input[type=text]').fill('Pessoa fictícia');
      await p.locator('[type="submit"]').click();
      assert.equal(await p.locator('#auth-form input:invalid').count(), 1);
      await p.locator('#auth-form input[type=password]').fill('senha-ficticia-teste');
      await p.locator('[type="submit"]').click();
      assert.match(await p.locator('#form-message').innerText(), /Cadastro demonstrativo realizado com sucesso/);
      await p.waitForTimeout(150);
      assert.deepEqual(requests, []);
      assert.deepEqual(await p.evaluate(() => ({local: Object.keys(localStorage), session: Object.keys(sessionStorage), cookies: document.cookie})), {local: [], session: [], cookies: ''});
      await p.keyboard.press('Escape');
      assert.deepEqual(await p.locator('#auth-form input').evaluateAll(xs => xs.map(x => x.value)), ['', '']);
    });
    await test('WEB09', 'Tab e Shift+Tab contidos, Escape, botão fechar e retorno do foco', async (p, c, url) => {
      await p.goto(url);
      for (const opener of await p.locator('[data-open-modal]').all()) {
        await opener.click();
        assert.equal(await p.locator('#auth-form input').first().evaluate(e => e === document.activeElement), true);
        for (const key of ['Tab', 'Shift+Tab']) for (let i = 0; i < 9; i++) {
          await p.keyboard.press(key);
          assert.equal(await p.evaluate(() => !!document.activeElement.closest('dialog')), true);
        }
        await p.keyboard.press('Escape'); assert.equal(await p.locator('dialog').isVisible(), false);
        assert.equal(await opener.evaluate(e => e === document.activeElement), true);
        await opener.click(); await p.locator('[data-close-modal]').click();
        assert.equal(await opener.evaluate(e => e === document.activeElement), true);
      }
    });
    await test('WEB10', 'Foco visível em links, botões, busca, filtro e campos do formulário', async (p, c, url) => {
      await p.goto(url); await p.keyboard.press('Tab');
      for (const selector of ['.brand', '.main-nav a', '[data-open-modal]', '#book-search', '#genre-filter', '[data-list-action]']) {
        await p.locator(selector).first().focus();
        const style = await p.locator(selector).first().evaluate(e => ({width: getComputedStyle(e).outlineWidth, style: getComputedStyle(e).outlineStyle}));
        assert.deepEqual(style, { width: '3px', style: 'solid' }, selector);
      }
      await p.locator('#genre-filter').focus();
      await p.locator('#catalogo').screenshot({ path: path.join(out, 'foco-filtro.png') });
      await p.locator('[data-open-modal]').first().click(); await p.keyboard.press('Tab');
      for (const control of await p.locator('dialog input, dialog button').all()) {
        await control.focus(); assert.equal(await control.evaluate(e => getComputedStyle(e).outlineWidth), '3px');
      }
      await p.locator('dialog').screenshot({ path: path.join(out, 'foco-dialogo.png') });
    });
    for (const width of [1440, 768, 390, 320]) {
      await test(`WEB11-${width}`, `Layout e links das seções em ${width} × 900`, async (p, c, url) => {
        await p.goto(url);
        await p.addStyleTag({ content: 'html { scroll-behavior:auto !important; }' });
        assert.equal(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        for (const link of await p.locator('.main-nav a').all()) {
          assert.equal(await link.isVisible(), true);
          const box = await link.boundingBox(); assert.ok(box.x >= 0 && box.x + box.width <= width);
          await link.click();
          const target = await link.getAttribute('href');
          const top = await p.locator(target).evaluate(e => e.getBoundingClientRect().top);
          const bottom = await p.locator('.site-header').evaluate(e => e.getBoundingClientRect().bottom);
          assert.ok(top >= bottom - 1, `Seção encoberta pelo cabeçalho: ${target}`);
        }
        const boxes = await p.locator('.main-nav a, .main-nav button, .brand').evaluateAll(xs => xs.map(x => {const r=x.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};}));
        for (let i=0;i<boxes.length;i++) for(let j=i+1;j<boxes.length;j++) {
          const a=boxes[i], b=boxes[j]; assert.ok(a.x+a.w<=b.x+1 || b.x+b.w<=a.x+1 || a.y+a.h<=b.y+1 || b.y+b.h<=a.y+1, 'Controles sobrepostos');
        }
        await p.evaluate(() => scrollTo(0, 0));
        if (width === 390) await p.screenshot({ path: path.join(out, 'menu-movel.png') });
        await p.screenshot({ path: path.join(out, `layout-${width}.png`), fullPage: true });
        await p.locator('[data-open-modal]').first().click();
        for (const control of await p.locator('dialog input, dialog button').all()) {
          const box = await control.boundingBox(); assert.ok(box.x >= 0 && box.x + box.width <= width);
        }
      }, { viewport: { width, height: 900 } });
    }
    await test('WEB12', 'Abertura direta file://, busca e marcação após recarga', async p => {
      await p.goto(pathToFileURL(path.join(root, 'index.html')).href);
      await p.locator('#book-search').fill('Duna'); await catalog(p, 1);
      await p.locator(duna).click(); await p.reload();
      assert.equal(await p.locator(duna).getAttribute('aria-pressed'), 'true');
    });
    await test('WEB13', 'Textos explicam demonstração e armazenamento neste navegador', async (p, c, url) => {
      await p.goto(url);
      const text = await p.locator('body').innerText();
      assert.match(text, /livros marcados ficam salvos neste navegador/);
      assert.match(text, /Mapa ilustrativo/);
      assert.doesNotMatch(text, /acompanhe seu progresso|compartilhe suas leituras|descubra pessoas/i);
      await p.locator('[data-open-modal]').first().click();
      assert.match(await p.locator('#modal-description').innerText(), /não são enviados nem salvos/);
    });
  } finally {
    report.fim = new Date().toISOString();
    report.aprovados = results.filter(r => r.resultado === 'APROVADO').length;
    report.reprovados = results.filter(r => r.resultado === 'REPROVADO').length;
    fs.writeFileSync(path.join(out, 'web-resultados.json'), JSON.stringify(report, null, 2) + '\n');
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  if (results.some(r => r.resultado === 'REPROVADO')) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });

# Avaliação final — Módulo 4 do Projeto Integrador II

Executei a avaliação técnica em **14/11/2026**, em Windows, Google Chrome **157.0.8103.78** sem interface, Playwright **1.62.1**, Node.js **24.20.0**, Python **3.13.7** e SQLite **3.50.4**. A versão de código e testes foi `0cdd8fa` (hash completo nos registros). Os commits posteriores desta entrega acrescentam documentação e evidências, sem mudar o código avaliado. As datas dos registros JSON estão em UTC; o fuso local foi America/Cuiaba (UTC−4).

Obtive **23 cenários web aprovados e zero reprovados**, além dos **quatro testes do SQLite aprovados** e da demonstração SQL concluída. São cenários com várias verificações internas; essa contagem não corresponde a percentual de cobertura do código. Os registros estão em [web-resultados.json](evidencias/web-resultados.json) e [sqlite-resultados.json](evidencias/sqlite-resultados.json), com versões, hashes e resultados reais. A tentativa inicial de execução em um ambiente sem acesso à rede local não alcançou a página; a execução válida usou servidor local acessível e perfis descartáveis.

## Requisitos aplicáveis e confirmação

Os códigos C01–C07 abaixo identificam critérios desta entrega, sem renumerar os requisitos históricos do projeto.

| Critério do MVP | Defeito | Correção | Confirmação e resultado | Evidência |
|---|---|---|---|---|
| C01: busca, filtro e contador coerentes | D01: seis cartões permaneciam visíveis | Regra de ocultação com precedência no CSS | WEB01–02 aprovados: título/autor, acentos, todos os gêneros, combinação e vazio | [Duna: um cartão](evidencias/busca-duna.png) e JSON web |
| C02: diálogo operável por teclado | D02: Escape, contenção e retorno do foco ausentes | Diálogo nativo, ciclo de Tab/Shift+Tab e retorno ao acionador | WEB09 aprovado nos dois botões de abertura | [Foco no diálogo](evidencias/foco-dialogo.png) e JSON web |
| C03: foco identificável | D03: controles sem contorno | Contorno de foco visível também na busca e no seletor | WEB10 aprovado em links, botões, busca, gênero e campos | [Foco no filtro](evidencias/foco-filtro.png) |
| C04: lista local consistente e página utilizável sob falha | D04: falhas de leitura/gravação interrompiam a interação | Validação da lista; deduplicação; exceções tratadas; gravação antes de atualizar seleção | WEB03–07 aprovados, incluindo oito formatos inválidos e bloqueios simulados | [Aviso de leitura](evidencias/armazenamento-invalido.png), [gravação bloqueada](evidencias/gravacao-bloqueada.png) e JSON web |
| C05: comunicar o funcionamento real | D05: promessas de progresso/compartilhamento | Textos sobre marcação no navegador e mapa ilustrativo | WEB08 e WEB13 aprovados; formulário sem envio nem gravação dos campos pela aplicação | HTML e JSON web |
| C06: instruções e limites reproduzíveis | D06: documentação incompleta | README com escopo, persistência e comandos; esta matriz | Revisão documental concluída; instalação com npm ci e execução dos comandos verificadas | README, arquivo de versões e registros web/SQLite |
| C07: acesso às seções em telas estreitas | D07: links desapareciam | Cabeçalho reorganizado com quebra de linha; títulos das capas também ajustados | WEB11 aprovado em 1440, 768, 390 e 320 × 900; links sem sobreposição e seções acessíveis | [Menu móvel](evidencias/menu-movel.png) e capturas layout-* |

## Banco independente

Os quatro métodos de teste verificaram guia/histórico, coautoria/releitura, manutenção do guia e restrições. O último método contém oito entradas inválidas, incluindo categoria inexistente, autoria repetida, coordenadas incompletas/fora do intervalo, datas incoerentes/inválidas e categoria duplicada. As rejeições esperadas ocorreram.

A demonstração inseriu o Sebo Temporário no Centro, alterou o bairro para Amambaí, obteve zero no filtro antigo, removeu o cadastro e confirmou zero após a exclusão. O histórico exibiu cinco leituras, quatro concluídas e Duna em andamento. A contagem das concluídas foi Brasil 2, Colômbia 1 e França 1. A coautoria do mesmo país não duplicou uma leitura; uma releitura contou separadamente. Não existe entidade Exemplar ou relação de estoque entre livro e local. Os locais, endereços, coordenadas e leituras são fictícios.

## Validação com o público e limites

Utilizei como evidência histórica a participação presencial de **Luiza Saad dos Santos em 04/11/2026, Campo Grande/MS**, em computador. Ela usou o sistema sozinha, considerou a apresentação bonita, identificou falha na busca por Duna e conseguiu marcar livros. Esperava encontrar a lista em um perfil e dispor de dois mapas: locais físicos relacionados a livros na cidade e países de origem dos autores das obras lidas pelo clube.

Corrigi e confirmei tecnicamente as falhas cobertas pelo recorte, mas **não houve nova sessão de aceitação com Luiza**. Perfil, mapa geográfico funcional e mapa das leituras por país permanecem necessidades não atendidas na página. O SQLite permite consultar os dados de demonstração correspondentes ao guia e ao histórico, mas não está integrado à interface.

Os testes usaram contexto novo a cada cenário, entradas fictícias e bloqueios restritos à chave da lista. Não alteraram o perfil pessoal. O formulário foi examinado quanto a campos obrigatórios, confirmação, requisições de rede e armazenamento local/de sessão/cookies; isso não é uma auditoria completa de segurança. Abertura direta file:// passou no Chrome avaliado, sem garantia para outras configurações. As larguras emuladas não substituem aparelhos reais. Não executei nesta etapa ensaios em Firefox/Safari, leitor de tela, carga ou desempenho com metas quantitativas.

## Versionamento e reprodução

- Base publicada: `ccf2aab`.
- `904812a`: correções do MVP.
- `571f89f`: precedência do contorno de foco na busca.
- `0cdd8fa`: automação, instalação reproduzível, README e ajuste das capas.
- Os registros desta pasta são a execução da entrega. Novas execuções vão para `test-results/` por padrão, preservando estas evidências.

Consulte o [histórico do repositório](https://github.com/MartinsVini/Projeto-Integrador/commits/main) e o [relatório acadêmico](https://docs.google.com/document/d/1JbyrcsAQusv41viKrD2SkZy-mSg-cu0DVEG7Zd8eIiU/edit).

## Fontes técnicas consultadas

- ISTQB. *Certified Tester Foundation Level Syllabus*, v4.0.1, 2024. [Documento oficial](https://istqb.org/?download_id=3345&sdm_process_download=1).
- MDN. [hidden](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/hidden) e [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
- W3C. [Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).
- SQLite. [Foreign Key Support](https://www.sqlite.org/foreignkeys.html).

Acesso em 14 nov. 2026. As fontes orientaram critérios de verificação; os resultados são específicos das execuções registradas neste projeto.

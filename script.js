const searchInput = document.querySelector('#book-search');
const genreFilter = document.querySelector('#genre-filter');
const cards = [...document.querySelectorAll('.book-card')];
const resultCount = document.querySelector('#result-count');
const emptyMessage = document.querySelector('#empty-message');
const storageKey = 'lendo-pelo-mundo-lista';
const storageMessage = document.querySelector('#storage-message');
const knownBooks = new Set(cards.map(card => card.dataset.book));

function loadBooks() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw === null) return new Set();
    const items = JSON.parse(raw);
    if (!Array.isArray(items) || items.some(book => typeof book !== 'string' || !knownBooks.has(book))) {
      throw new Error('Lista inválida');
    }
    return new Set(items);
  } catch {
    storageMessage.textContent = 'Não foi possível carregar sua lista. Você pode continuar usando o catálogo. Uma nova marcação tentará salvar uma nova lista neste navegador.';
    return new Set();
  }
}

let savedBooks = loadBooks();

function normalize(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function updateCatalog() {
  const term = normalize(searchInput.value.trim());
  const genre = genreFilter.value;
  let visible = 0;

  cards.forEach((card) => {
    const matchesText = normalize(`${card.dataset.title} ${card.dataset.author}`).includes(term);
    const matchesGenre = genre === 'all' || card.dataset.genre === genre;
    const show = matchesText && matchesGenre;
    card.hidden = !show;
    if (show) visible += 1;
  });

  resultCount.textContent = `${visible} ${visible === 1 ? 'livro encontrado' : 'livros encontrados'}`;
  emptyMessage.hidden = visible !== 0;
}

function updateListButtons() {
  document.querySelectorAll('[data-list-action]').forEach((button) => {
    const book = button.closest('.book-card').dataset.book;
    const added = savedBooks.has(book);
    button.textContent = added ? '✓ Na minha lista' : '+ Quero ler';
    button.classList.toggle('is-added', added);
    button.setAttribute('aria-pressed', String(added));
  });
}

searchInput.addEventListener('input', updateCatalog);
genreFilter.addEventListener('change', updateCatalog);

document.querySelectorAll('[data-list-action]').forEach((button) => {
  button.addEventListener('click', () => {
    const book = button.closest('.book-card').dataset.book;
    const nextBooks = new Set(savedBooks);
    if (nextBooks.has(book)) nextBooks.delete(book);
    else nextBooks.add(book);
    try {
      localStorage.setItem(storageKey, JSON.stringify([...nextBooks]));
    } catch {
      storageMessage.textContent = 'Não foi possível salvar a alteração. Sua seleção anterior foi mantida. Verifique as permissões de armazenamento do navegador e tente novamente.';
      return;
    }
    savedBooks = nextBooks;
    storageMessage.textContent = 'Lista salva neste navegador.';
    updateListButtons();
  });
});

const modal = document.querySelector('#auth-modal');
const message = document.querySelector('#form-message');
let modalOpener;
document.querySelectorAll('[data-open-modal]').forEach((button) => button.addEventListener('click', () => {
  modalOpener = button;
  message.textContent = '';
  modal.showModal();
  modal.querySelector('input').focus();
}));
document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', () => modal.close()));
modal.addEventListener('click', (event) => { if (event.target === modal) modal.close(); });
modal.addEventListener('close', () => {
  document.querySelector('#auth-form').reset();
  message.textContent = '';
  modalOpener?.focus();
});
modal.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const controls = [...modal.querySelectorAll('button, input')];
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
document.querySelector('#auth-form').addEventListener('submit', (event) => {
  event.preventDefault();
  message.textContent = 'Cadastro demonstrativo realizado com sucesso!';
});

updateListButtons();
updateCatalog();

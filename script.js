const searchInput = document.querySelector('#book-search');
const genreFilter = document.querySelector('#genre-filter');
const cards = [...document.querySelectorAll('.book-card')];
const resultCount = document.querySelector('#result-count');
const emptyMessage = document.querySelector('#empty-message');
const savedBooks = new Set(JSON.parse(localStorage.getItem('lendo-pelo-mundo-lista') || '[]'));

function normalize(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function updateCatalog() {
  const term = normalize(searchInput.value);
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
  });
}

searchInput.addEventListener('input', updateCatalog);
genreFilter.addEventListener('change', updateCatalog);

document.querySelectorAll('[data-list-action]').forEach((button) => {
  button.addEventListener('click', () => {
    const book = button.closest('.book-card').dataset.book;
    if (savedBooks.has(book)) savedBooks.delete(book);
    else savedBooks.add(book);
    localStorage.setItem('lendo-pelo-mundo-lista', JSON.stringify([...savedBooks]));
    updateListButtons();
  });
});

const modal = document.querySelector('#auth-modal');
const message = document.querySelector('#form-message');
document.querySelectorAll('[data-open-modal]').forEach((button) => button.addEventListener('click', () => {
  modal.hidden = false;
  message.textContent = '';
  modal.querySelector('input').focus();
}));
document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', () => { modal.hidden = true; }));
modal.addEventListener('click', (event) => { if (event.target === modal) modal.hidden = true; });
document.querySelector('#auth-form').addEventListener('submit', (event) => {
  event.preventDefault();
  message.textContent = 'Cadastro demonstrativo realizado com sucesso!';
});

updateListButtons();

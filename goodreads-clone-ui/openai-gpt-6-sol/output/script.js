const books = [
  { id: 'silent', title: 'The Silent Garden', coverLines: ['The Silent', 'Garden'], author: 'Elena Mercer', genre: 'Fiction', rating: '4.7', cover: 'silent', coverTop: 'A NOVEL', pages: 300, description: 'When an unexpected inheritance draws Mara back to the house she left behind, a forgotten garden gives her a new way to understand her family—and herself.' },
  { id: 'atlas', title: 'The Atlas of Small Things', coverLines: ['The Atlas of', 'Small Things'], author: 'Mira Solis', genre: 'Fiction', rating: '4.6', cover: 'atlas', coverTop: 'A NOVEL', description: 'A warm, observant story about the tiny moments that quietly change the course of a life.' },
  { id: 'pines', title: 'Where the Pines Remember', coverLines: ['Where the', 'Pines', 'Remember'], author: 'L. M. Wilder', genre: 'Fiction', rating: '4.8', cover: 'pines', coverTop: 'A NOVEL', description: 'Two sisters return to their mountain hometown and discover that some secrets have been waiting in the woods for years.' },
  { id: 'tomorrow', title: 'The Shape of Tomorrow', coverLines: ['The Shape', 'of Tomorrow'], author: 'Ada Park', genre: 'Sci-fi', rating: '4.4', cover: 'tomorrow', coverTop: 'A NOVEL', description: 'A thought-provoking journey through memory, possibility, and the future we build together.' },
  { id: 'coast', title: 'Notes from the Coast', coverLines: ['Notes from', 'the Coast'], author: 'Samuel Vale', genre: 'Non-fiction', rating: '4.7', cover: 'coast', coverTop: 'A MEMOIR', description: 'A gentle memoir about finding a slower rhythm beside the sea, one ordinary day at a time.' },
  { id: 'salt', title: 'A House of Salt & Stars', coverLines: ['A House of', 'Salt & Stars'], author: 'Emi Rowan', genre: 'Fantasy', rating: '4.5', cover: 'salt', coverTop: 'A NOVEL', description: 'Beyond the last lighthouse stands a house that appears only when the tide and stars align.' },
  { id: 'starting', title: 'The Art of Starting Over', coverLines: ['The Art of', 'Starting Over'], author: 'June Hart', genre: 'Non-fiction', rating: '4.3', cover: 'starting', coverTop: 'A FIELD GUIDE', description: 'Practical reflections on letting go, beginning again, and making room for what comes next.' },
  { id: 'hours', title: 'All the Golden Hours', coverLines: ['All the', 'Golden Hours'], author: 'Nora Bell', genre: 'Fiction', rating: '4.6', cover: 'hours', coverTop: 'A NOVEL', description: 'An intimate story of old friends, summer evenings, and the unexpected paths that bring us home.' },
  { id: 'orange', title: 'The Orange Season', coverLines: ['The Orange', 'Season'], author: 'Celia Moreno', genre: 'Fiction', rating: '4.2', cover: 'orange', coverTop: 'A NOVEL', description: 'In a sunlit valley, three generations learn that home can be both a place and a choice.' },
];

const byId = Object.fromEntries(books.map(book => [book.id, book]));
const defaultState = {
  shelves: { silent: 'reading', atlas: 'want', pines: 'want', coast: 'read', salt: 'want', hours: 'read' },
  pages: 186,
  goal: 30,
  readThisYear: 18,
  finishedSilent: false,
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem('margins-demo-state') || 'null');
    if (saved && typeof saved === 'object') return { ...defaultState, ...saved, shelves: saved.shelves && typeof saved.shelves === 'object' ? saved.shelves : { ...defaultState.shelves } };
  } catch (_) { /* The demo works without storage. */ }
  return structuredClone(defaultState);
}

const state = loadState();
function pageFromHash() { const value = location.hash.slice(1); return ['home', 'library', 'discover', 'goal'].includes(value) ? value : 'home'; }
let page = pageFromHash();
let previousPage = page;
let recommendationTab = 'For you';
let discoverFilter = 'All books';
let libraryFilter = 'all';
let toastTimer;

const pageContent = document.getElementById('pageContent');
const rightRail = document.getElementById('rightRail');
const workspace = document.getElementById('workspace');
const searchInput = document.getElementById('searchInput');
const bookDialog = document.getElementById('bookDialog');
const progressDialog = document.getElementById('progressDialog');
const goalDialog = document.getElementById('goalDialog');

function icon(name) { return `<svg class="icon" aria-hidden="true"><use href="#i-${name}"></use></svg>`; }
function escapeHTML(value) { return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]); }
function saveState() { try { localStorage.setItem('margins-demo-state', JSON.stringify(state)); } catch (_) { /* The demo works without storage. */ } }
function setShelf(id, status) {
  const previous = state.shelves[id] || 'none';
  if (previous === status) return;
  if (previous === 'read') state.readThisYear = Math.max(0, state.readThisYear - 1);
  if (status === 'read') state.readThisYear += 1;
  if (status === 'none') delete state.shelves[id]; else state.shelves[id] = status;
  if (id === 'silent') {
    state.finishedSilent = status === 'read';
    if (status === 'read') state.pages = 300;
    else if (previous === 'read') state.pages = Math.min(state.pages, 299);
  }
}
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3000);
}
function cover(book) {
  return `<div class="book-cover cover--${book.cover}" role="img" aria-label="Cover of ${escapeHTML(book.title)}"><span class="cover-art"></span><span class="cover-top">${escapeHTML(book.coverTop)}</span><span class="cover-title">${book.coverLines.map(escapeHTML).join('<br>')}</span><span class="cover-author">${escapeHTML(book.author.toUpperCase())}</span></div>`;
}
function bookCard(book) {
  const saved = Boolean(state.shelves[book.id]);
  return `<article class="book-card"><button class="book-cover-button" type="button" data-book="${book.id}" aria-label="View ${escapeHTML(book.title)}">${cover(book)}</button><div class="book-info"><div class="book-rating">${icon('star')}${book.rating}<span>· ${escapeHTML(book.genre)}</span></div><div class="book-info-row"><button class="book-title-button" type="button" data-book="${book.id}">${escapeHTML(book.title)}</button><button class="book-add ${saved ? 'is-saved' : ''}" type="button" data-add="${book.id}" aria-label="${saved ? 'Remove ' + escapeHTML(book.title) + ' from shelf' : 'Add ' + escapeHTML(book.title) + ' to want to read'}" aria-pressed="${saved}">${icon(saved ? 'check' : 'plus')}</button></div><p class="book-author">${escapeHTML(book.author)}</p></div></article>`;
}
function ring(percent, label) {
  return `<div class="ring" style="--value:${Math.min(100, Math.max(0, percent))}%"><div class="ring-inner"><strong>${percent}%</strong><small>${label}</small></div></div>`;
}
function formatDate() {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
}
function shelfCounts() {
  const values = Object.values(state.shelves);
  for (const status of ['want', 'reading', 'read']) document.getElementById(`${status}Count`).textContent = values.filter(value => value === status).length;
}
function pageHead(eyebrow, title, subtitle, withDate = false) {
  return `<div class="page-head"><div><span class="page-eyebrow">${eyebrow}</span><h1>${title}</h1><p>${subtitle}</p></div>${withDate ? `<div class="date-badge">${icon('clock')}${escapeHTML(formatDate())}</div>` : ''}</div>`;
}

function homeBooks() {
  const picks = {
    'For you': ['atlas', 'pines', 'tomorrow', 'coast'],
    Popular: ['pines', 'coast', 'atlas', 'hours'],
    Fiction: ['atlas', 'pines', 'hours', 'orange'],
    'Non-fiction': ['coast', 'starting'],
  };
  return picks[recommendationTab].map(id => bookCard(byId[id])).join('');
}
function home() {
  const finished = state.shelves.silent === 'read';
  const paused = !finished && state.shelves.silent !== 'reading';
  const progress = Math.round(state.pages / 300 * 100);
  const recent = Object.entries(state.shelves).filter(([id, status]) => status === 'want' && byId[id]).slice(0, 2).map(([id]) => {
    const book = byId[id];
    return `<button class="reading-list-item" type="button" data-book="${id}">${cover(book)}<span><strong>${escapeHTML(book.title)}</strong><small>On your want to read shelf</small></span>${icon('chevron')}</button>`;
  }).join('');
  return `${pageHead('WELCOME BACK, OLIVIA', 'A little more time for stories.', 'Pick up where you left off, or find something wonderful to read next.', true)}
    <section class="reading-feature" aria-label="${finished ? 'Recently finished book' : paused ? 'Book to resume' : 'Currently reading book'}"><div class="feature-copy"><div class="feature-eyebrow">${icon('book')}${finished ? 'RECENTLY FINISHED' : paused ? 'READY TO RESUME' : 'CURRENTLY READING'}</div><h2>The Silent Garden</h2><p>by Elena Mercer</p><div class="feature-progress"><div class="progress-meta"><strong>${finished ? 'Book completed' : `${progress}% complete`}</strong><span>${state.pages} of 300 pages</span></div><div class="progress-track"><span style="width:${progress}%"></span></div></div><button class="button button-light" type="button" ${finished ? 'data-page="discover"' : paused ? 'data-action="start"' : 'data-action="progress"'}>${finished ? 'Find your next read' : paused ? 'Resume reading' : 'Update progress'} ${icon('arrow')}</button></div><div class="feature-book">${cover(byId.silent)}</div></section>
    <section class="section" aria-labelledby="recommendationsTitle"><div class="section-header"><div><span class="section-kicker">CURATED FOR YOUR SHELF</span><h2 id="recommendationsTitle">Find your next favorite</h2></div><button class="text-link" type="button" data-page="discover">Browse all ${icon('arrow')}</button></div><div class="tabs" role="group" aria-label="Recommendation categories">${['For you', 'Popular', 'Fiction', 'Non-fiction'].map(tab => `<button class="tab ${recommendationTab === tab ? 'is-active' : ''}" type="button" data-recommendation="${tab}" aria-pressed="${recommendationTab === tab}">${tab}</button>`).join('')}</div><div class="book-grid">${homeBooks()}</div></section>
    <section class="section" aria-labelledby="shelfTitle"><div class="section-header"><div><span class="section-kicker">READY WHEN YOU ARE</span><h2 id="shelfTitle">Waiting on your shelf</h2></div><button class="text-link" type="button" data-shelf="want">View shelf ${icon('arrow')}</button></div><div class="reading-list">${recent || `<div class="empty-state"><h3>Room for a new story</h3><p>Add a book to your want to read shelf.</p></div>`}</div></section>`;
}
function rail() {
  const percent = Math.round(state.readThisYear / state.goal * 100);
  return `<span class="rail-eyebrow">AT A GLANCE</span><h2 class="rail-title">Your reading life</h2><div class="rail-card challenge-card"><div class="rail-card-top"><strong>2026 Reading Challenge</strong>${icon('target')}</div><div class="challenge-center">${ring(percent, 'complete')}<div class="challenge-numbers"><strong>${state.readThisYear} / ${state.goal}</strong><span>books read<br>this year</span></div></div><div class="challenge-note"><strong>${Math.max(0, state.goal - state.readThisYear)} books to go.</strong> Your next favorite is out there.</div><button class="text-link" type="button" data-page="goal">View challenge ${icon('arrow')}</button></div>
    <section class="rail-section"><h3>Reading rhythm</h3><div class="rail-card streak-card"><div class="streak-number"><strong>7</strong><span>day streak</span></div><p>A little reading, every day.</p><div class="mini-chart">${[35, 51, 72, 46, 82, 64, 91].map((height, index) => `<div><span style="height:${height}%"></span><small>${['M','T','W','T','F','S','S'][index]}</small></div>`).join('')}</div></div></section>
    <section class="rail-section"><h3>From your circle</h3><div class="activity-item"><span class="activity-avatar peach">AM</span><div><p><strong>Alex M.</strong> finished <strong>The Orange Season</strong></p><small>2 hours ago</small></div></div><div class="activity-item"><span class="activity-avatar lilac">SJ</span><div><p><strong>Sam J.</strong> added <strong>Where the Pines Remember</strong></p><small>Yesterday</small></div></div></section>`;
}
function library() {
  const savedBooks = books.filter(book => state.shelves[book.id]);
  const filtered = libraryFilter === 'all' ? savedBooks : savedBooks.filter(book => state.shelves[book.id] === libraryFilter);
  const labels = { all: 'All books', reading: 'Currently reading', want: 'Want to read', read: 'Read' };
  return `${pageHead('YOUR COLLECTION', 'Your library', 'Every story you are reading, have read, or hope to read.')}
    <div class="page-banner"><div><span class="section-kicker">A HOME FOR YOUR STORIES</span><h2>Keep your books close.</h2><p>Build shelves that grow with every chapter.</p></div><span class="banner-symbol">${icon('book')}</span></div>
    <div class="stat-grid"><div class="stat-card"><strong>${savedBooks.length}</strong><span>Books on shelves</span></div><div class="stat-card"><strong>${savedBooks.filter(book => state.shelves[book.id] === 'reading').length}</strong><span>Currently reading</span></div><div class="stat-card"><strong>${savedBooks.filter(book => state.shelves[book.id] === 'want').length}</strong><span>Want to read</span></div></div>
    <div class="library-heading"><h2>${labels[libraryFilter]}</h2><span class="page-eyebrow">${filtered.length} BOOK${filtered.length === 1 ? '' : 'S'}</span></div><div class="filter-chips" role="group" aria-label="Filter library">${Object.entries(labels).map(([key, label]) => `<button class="filter-chip ${libraryFilter === key ? 'is-active' : ''}" type="button" data-library-filter="${key}" aria-pressed="${libraryFilter === key}">${label}</button>`).join('')}</div><div class="book-grid library-grid">${filtered.length ? filtered.map(bookCard).join('') : `<div class="empty-state">${icon('book')}<h3>Nothing on this shelf yet</h3><p>Discover a book and make this shelf your own.</p><button class="button button-dark" type="button" data-page="discover">Explore books ${icon('arrow')}</button></div>`}</div>`;
}
function discover() {
  const filters = ['All books', 'Fiction', 'Fantasy', 'Sci-fi', 'Non-fiction'];
  const filtered = discoverFilter === 'All books' ? books.filter(book => book.id !== 'silent') : books.filter(book => book.genre === discoverFilter);
  return `${pageHead('BETWEEN THE COVERS', 'Discover new stories', 'Thoughtful picks for wherever your curiosity takes you.')}
    <div class="page-banner"><div><span class="section-kicker">EXPLORE MORE</span><h2>There is always another story.</h2><p>Follow a feeling, explore a genre, and see what stays with you.</p></div><span class="banner-symbol">${icon('compass')}</span></div>
    <div class="library-heading"><h2>Browse books</h2><span class="page-eyebrow">${filtered.length} PICKS</span></div><div class="filter-chips" role="group" aria-label="Filter books by genre">${filters.map(filter => `<button class="filter-chip ${discoverFilter === filter ? 'is-active' : ''}" type="button" data-discover-filter="${filter}" aria-pressed="${discoverFilter === filter}">${filter}</button>`).join('')}</div><div class="book-grid library-grid">${filtered.map(bookCard).join('')}</div>`;
}
function goal() {
  const percent = Math.round(state.readThisYear / state.goal * 100);
  const monthly = [2, 1, 3, 2, 1, 2, 3, 2, 2, 0, 0, 0];
  return `${pageHead('MAKE ROOM FOR READING', 'Your reading goal', 'A little progress adds up to a year of memorable stories.')}
    <div class="goal-hero">${ring(percent, 'complete')}<div><span class="feature-eyebrow">2026 READING CHALLENGE</span><h2>${state.readThisYear} books down. Keep going.</h2><p>You’re ${Math.max(0, state.goal - state.readThisYear)} books away from your ${state.goal}-book goal. Every page counts, at your own pace.</p><button class="button button-light" type="button" data-action="goal">Adjust your goal ${icon('arrow')}</button></div></div>
    <section class="section"><div class="stat-grid"><div class="stat-card"><strong>${state.readThisYear}</strong><span>Books finished</span></div><div class="stat-card"><strong>${state.goal}</strong><span>Yearly goal</span></div><div class="stat-card"><strong>${Math.max(0, state.goal - state.readThisYear)}</strong><span>Books to go</span></div></div><div class="monthly-card"><h2>Your year in books</h2><p>Books completed each month</p><div class="monthly-bars">${monthly.map((count, index) => `<div><span class="${index > 8 ? 'future' : ''}" style="height:${index > 8 ? 8 : 20 + count * 22}%" title="${count} books"></span><small>${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][index]}</small></div>`).join('')}</div></div></section>`;
}
function searchResults() {
  const query = searchInput.value.trim();
  const results = books.filter(book => `${book.title} ${book.author} ${book.genre}`.toLowerCase().includes(query.toLowerCase()));
  return `${pageHead('SEARCH YOUR STORIES', `Results for “${escapeHTML(query)}”`, 'Find a book to read, save, or share.')}
    <p class="search-summary">${results.length} book${results.length === 1 ? '' : 's'} found</p><div class="book-grid library-grid">${results.length ? results.map(bookCard).join('') : `<div class="empty-state">${icon('search')}<h3>No books found</h3><p>Try another title, author, or genre.</p></div>`}</div>`;
}
function render() {
  shelfCounts();
  const titles = { home: 'Home', library: 'My library', discover: 'Discover', goal: 'Reading goal', search: 'Search' };
  document.getElementById('breadcrumbCurrent').textContent = titles[page];
  document.title = `${titles[page]} — Margins`;
  document.querySelectorAll('.nav-item').forEach(item => {
    const active = item.dataset.page === page;
    item.classList.toggle('is-active', active);
    if (active) item.setAttribute('aria-current', 'page'); else item.removeAttribute('aria-current');
  });
  workspace.classList.toggle('single-column', page !== 'home');
  pageContent.innerHTML = ({ home, library, discover, goal, search: searchResults })[page]();
  rightRail.innerHTML = page === 'home' ? rail() : '';
  saveState();
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('is-open');
  document.getElementById('sidebarScrim').classList.remove('is-visible');
  document.getElementById('openSidebar').setAttribute('aria-expanded', 'false');
}
function setPage(nextPage) {
  page = nextPage;
  history.pushState(null, '', `#${nextPage}`);
  searchInput.value = '';
  document.getElementById('notificationPanel').hidden = true;
  document.getElementById('notificationButton').setAttribute('aria-expanded', 'false');
  closeSidebar();
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function openBook(id) {
  const book = byId[id];
  if (!book) return;
  document.getElementById('bookDialogContent').innerHTML = `<div class="book-modal-content"><button class="modal-close icon-button" type="button" data-close-dialog aria-label="Close">${icon('close')}</button>${cover(book)}<div><span class="modal-eyebrow">${escapeHTML(book.genre.toUpperCase())}</span><h2 id="bookDialogTitle">${escapeHTML(book.title)}</h2><p class="book-byline">by ${escapeHTML(book.author)}</p><div class="book-rating">${icon('star')}${book.rating}<span>reader rating</span></div><p class="book-description">${escapeHTML(book.description)}</p><label class="shelf-select-label" for="shelfSelect">ADD TO A SHELF</label><select class="shelf-select" id="shelfSelect" data-shelf-select="${book.id}"><option value="none" ${!state.shelves[id] ? 'selected' : ''}>Not on a shelf</option><option value="want" ${state.shelves[id] === 'want' ? 'selected' : ''}>Want to read</option><option value="reading" ${state.shelves[id] === 'reading' ? 'selected' : ''}>Currently reading</option><option value="read" ${state.shelves[id] === 'read' ? 'selected' : ''}>Read</option></select></div></div>`;
  bookDialog.showModal();
}

document.addEventListener('click', event => {
  const target = event.target.closest('button');
  if (!target) return;
  if (target.hasAttribute('data-close-dialog')) { target.closest('dialog')?.close(); return; }
  if (target.dataset.page) { setPage(target.dataset.page); return; }
  if (target.dataset.shelf) { libraryFilter = target.dataset.shelf; setPage('library'); return; }
  if (target.dataset.book) { openBook(target.dataset.book); return; }
  if (target.dataset.add) {
    const id = target.dataset.add;
    if (state.shelves[id]) { setShelf(id, 'none'); showToast('Removed from your shelf'); }
    else { setShelf(id, 'want'); showToast('Added to Want to read'); }
    render(); return;
  }
  if (target.dataset.recommendation) { recommendationTab = target.dataset.recommendation; render(); return; }
  if (target.dataset.libraryFilter) { libraryFilter = target.dataset.libraryFilter; render(); return; }
  if (target.dataset.discoverFilter) { discoverFilter = target.dataset.discoverFilter; render(); return; }
  if (target.dataset.action === 'progress') { document.getElementById('pagesInput').value = state.pages; progressDialog.showModal(); return; }
  if (target.dataset.action === 'start') { setShelf('silent', 'reading'); showToast('Back to The Silent Garden'); render(); return; }
  if (target.dataset.action === 'goal') { document.getElementById('goalInput').value = state.goal; goalDialog.showModal(); return; }
});

document.getElementById('progressForm').addEventListener('submit', event => {
  event.preventDefault();
  const input = document.getElementById('pagesInput');
  if (!input.reportValidity()) return;
  state.pages = Math.min(300, Math.max(0, Number(input.value)));
  if (state.pages === 300 && state.shelves.silent !== 'read') {
    setShelf('silent', 'read');
    showToast('Book finished! A lovely milestone.');
  } else showToast('Reading progress saved');
  progressDialog.close();
  render();
});
document.getElementById('goalForm').addEventListener('submit', event => {
  event.preventDefault();
  const input = document.getElementById('goalInput');
  if (!input.reportValidity()) return;
  state.goal = Math.min(200, Math.max(1, Number(input.value)));
  goalDialog.close();
  showToast('Reading goal updated');
  render();
});
document.getElementById('decreaseGoal').addEventListener('click', () => { const input = document.getElementById('goalInput'); input.value = Math.max(1, Number(input.value || 1) - 1); });
document.getElementById('increaseGoal').addEventListener('click', () => { const input = document.getElementById('goalInput'); input.value = Math.min(200, Number(input.value || 1) + 1); });
document.addEventListener('change', event => {
  const select = event.target.closest('[data-shelf-select]');
  if (!select) return;
  const id = select.dataset.shelfSelect;
  setShelf(id, select.value);
  showToast(select.value === 'none' ? 'Removed from your shelf' : `Moved to ${select.options[select.selectedIndex].text}`);
  render();
});
searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim();
  if (query) { if (page !== 'search') previousPage = page; page = 'search'; render(); }
  else if (page === 'search') { page = previousPage; render(); }
});
window.addEventListener('popstate', () => { page = pageFromHash(); searchInput.value = ''; closeSidebar(); render(); });
document.addEventListener('keydown', event => {
  if (event.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !document.querySelector('dialog[open]')) { event.preventDefault(); searchInput.focus(); }
  if (event.key === 'Escape') { closeSidebar(); document.getElementById('notificationPanel').hidden = true; document.getElementById('notificationButton').setAttribute('aria-expanded', 'false'); }
});
document.getElementById('openSidebar').addEventListener('click', () => {
  document.getElementById('sidebar').classList.add('is-open');
  document.getElementById('sidebarScrim').classList.add('is-visible');
  document.getElementById('openSidebar').setAttribute('aria-expanded', 'true');
});
document.getElementById('closeSidebar').addEventListener('click', closeSidebar);
document.getElementById('sidebarScrim').addEventListener('click', closeSidebar);
document.getElementById('notificationButton').addEventListener('click', () => {
  const panel = document.getElementById('notificationPanel');
  panel.hidden = !panel.hidden;
  document.getElementById('notificationButton').setAttribute('aria-expanded', String(!panel.hidden));
});
document.addEventListener('click', event => {
  if (!event.target.closest('.notification-wrap')) {
    document.getElementById('notificationPanel').hidden = true;
    document.getElementById('notificationButton').setAttribute('aria-expanded', 'false');
  }
});
for (const id of ['profileButton', 'topProfileButton']) document.getElementById(id).addEventListener('click', () => showToast('Your reading space is ready to make your own.'));
for (const dialog of [bookDialog, progressDialog, goalDialog]) dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

render();

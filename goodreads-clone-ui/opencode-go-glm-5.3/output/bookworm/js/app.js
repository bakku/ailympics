const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const todayISO = () => new Date().toISOString().slice(0, 10);
const fmtDate = iso => (iso ? new Date(`${iso}T00:00`).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '—');
const fmtCount = n => (n >= 10000 ? `${Math.round(n / 1000)}k` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));
const bookById = id => BOOKS.find(b => b.id === Number(id));

const svgOpen = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
const ICONS = {
  home: `${svgOpen}<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h5v-6h4v6h5V9.5"/></svg>`,
  shelf: `${svgOpen}<path d="M4 19V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14"/><path d="M4 19h16"/><path d="M10 8h9a2 2 0 0 1 2 2v9"/><path d="M10 8v11"/></svg>`,
  compass: `${svgOpen}<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/></svg>`,
  plus: `${svgOpen}<path d="M12 5v14M5 12h14"/></svg>`,
  x: `${svgOpen}<path d="M6 6l12 12M18 6L6 18"/></svg>`,
  search: `${svgOpen}<circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/></svg>`,
  sun: `${svgOpen}<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`,
  moon: `${svgOpen}<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`,
  book: `${svgOpen}<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/></svg>`,
  star: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>',
};

const state = {
  view: 'home',
  shelfFilter: 'all',
  myBooksQuery: '',
  myBooksSort: 'title',
  browseQuery: '',
  browseGenre: 'All',
  browseSort: 'added',
  goal: USER.goal,
};

let nextId = BOOKS.reduce((m, b) => Math.max(m, b.id), 0) + 1;
let modalCtx = null;
let toastHandler = null;

function counts() {
  const c = { all: 0, reading: 0, want: 0, read: 0 };
  for (const e of Object.values(library)) {
    c.all++;
    c[e.shelf]++;
  }
  return c;
}

function entriesOn(shelf) {
  return Object.entries(library).filter(([, e]) => e.shelf === shelf).map(([id, e]) => ({ bookId: Number(id), ...e }));
}

function coverHtml(b, sizeClass = '') {
  const h1 = (b.id * 137 + 21) % 360;
  const h2 = (h1 + 45) % 360;
  return `<div class="cover ${sizeClass}" style="background-image:linear-gradient(155deg,hsl(${h1} 46% 46%),hsl(${h2} 52% 26%))"><span class="cover-title">${esc(b.title)}</span><span class="cover-author">${esc(b.author)}</span></div>`;
}

function starsHtml(rating, sizeClass = '') {
  const value = Math.max(0, Math.min(5, Number(rating) || 0));
  const pct = value / 5 * 100;
  return `<span class="stars ${sizeClass}" role="img" aria-label="${value.toFixed(1)} out of 5 stars"><span class="stars-bg">${ICONS.star.repeat(5)}</span><span class="stars-fg" style="width:${pct}%">${ICONS.star.repeat(5)}</span></span>`;
}

function ratingStarsInput(bookId, current) {
  let out = '';
  for (let v = 1; v <= 5; v++) {
    out += `<button type="button" class="${v <= current ? 'filled' : ''}" data-action="rate" data-id="${bookId}" data-rate="${v}" aria-label="Rate ${v} star${v > 1 ? 's' : ''}">${ICONS.star}</button>`;
  }
  return out;
}

function avgLine(b) {
  if (!b.ratingsCount) return '<span class="muted">No ratings yet</span>';
  return `${starsHtml(b.avgRating, 'stars--sm')}<span class="muted">${b.avgRating.toFixed(1)} · ${fmtCount(b.ratingsCount)}</span>`;
}

function ringSvg(pct) {
  const r = 45;
  const c = 2 * Math.PI * r;
  return `<svg class="ring" viewBox="0 0 110 110" aria-hidden="true"><circle class="ring-bg" cx="55" cy="55" r="${r}"/><circle class="ring-fg" cx="55" cy="55" r="${r}" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - pct)).toFixed(1)}"/></svg>`;
}

function emptyHtml(msg) {
  return `<div class="empty">${ICONS.book}<p>${msg}</p></div>`;
}

function goalPct() {
  return Math.min(100, Math.round(counts().read / state.goal * 100));
}

function renderSidebar() {
  const c = counts();
  const shelfLink = (key, label) => `
    <a class="side-link" href="#/my-books?shelf=${key}"><span>${label}</span><span class="side-count">${c[key]}</span></a>`;
  $('#sidebar').innerHTML = `
    <nav class="side-nav">
      <a class="side-link" data-nav="home" href="#/home">${ICONS.home}<span>Home</span></a>
      <a class="side-link" data-nav="mybooks" href="#/my-books">${ICONS.shelf}<span>My Books</span></a>
      <a class="side-link" data-nav="browse" href="#/browse">${ICONS.compass}<span>Browse</span></a>
    </nav>
    <div>
      <div class="side-section">Shelves</div>
      <nav class="side-nav">
        ${shelfLink('want', 'Want to Read')}
        ${shelfLink('reading', 'Currently Reading')}
        ${shelfLink('read', 'Read')}
      </nav>
    </div>
    <button class="btn btn-primary side-add" data-action="open-add-book">${ICONS.plus}<span>Add a book</span></button>
    <div class="side-goal">
      <span class="side-goal-label">${USER.year} reading goal</span>
      <div class="progress"><span style="width:${goalPct()}%"></span></div>
      <span class="muted side-goal-text">${c.read} of ${state.goal} books · ${Math.max(0, state.goal - c.read)} to go</span>
    </div>`;
}

function render() {
  renderSidebar();
  const main = $('#main');
  if (state.view === 'home') main.innerHTML = homeHtml();
  else if (state.view === 'mybooks') main.innerHTML = myBooksHtml();
  else main.innerHTML = browseHtml();
  $$('.side-link').forEach(a => {
    const active = a.dataset.nav === state.view;
    a.classList.toggle('active', active);
    if (a.dataset.nav) {
      if (active) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    }
  });
}

function readingCardHtml(x) {
  const b = bookById(x.bookId);
  const pct = Math.round((x.progress || 0) / b.pages * 100);
  return `
    <article class="card reading-card">
      <button class="reading-cover" data-action="open-book" data-id="${b.id}" aria-label="View ${esc(b.title)}">${coverHtml(b)}</button>
      <div class="reading-info">
        <div class="reading-meta"><span class="chip chip-static">${esc(b.genre)}</span><span class="muted">${b.pages} pages</span></div>
        <h3><button class="link" data-action="open-book" data-id="${b.id}">${esc(b.title)}</button></h3>
        <span class="muted">by ${esc(b.author)}</span>
        <div class="rating-line">${starsHtml(b.avgRating)}<span class="muted">${b.avgRating.toFixed(1)} · ${fmtCount(b.ratingsCount)} ratings</span></div>
        <div class="progress-row">
          <div class="progress"><span style="width:${pct}%"></span></div>
          <span class="muted progress-label">Page ${x.progress || 0} of ${b.pages} · ${pct}%</span>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" data-action="open-progress" data-id="${b.id}">Update progress</button>
          <button class="btn" data-action="finish" data-id="${b.id}">I'm finished</button>
        </div>
      </div>
    </article>`;
}

function shelfCardHtml(x) {
  const b = bookById(x.bookId);
  return `
    <div class="shelf-card">
      <button class="shelf-card-cover" data-action="open-book" data-id="${b.id}" aria-label="View ${esc(b.title)}">${coverHtml(b)}</button>
      <button class="link shelf-card-title" data-action="open-book" data-id="${b.id}">${esc(b.title)}</button>
      <span class="muted shelf-card-author">${esc(b.author)}</span>
    </div>`;
}

function homeHtml() {
  const c = counts();
  const reading = entriesOn('reading');
  const want = entriesOn('want');
  const read = entriesOn('read');
  const pagesRead = read.reduce((s, x) => s + bookById(x.bookId).pages, 0);
  const rated = read.filter(x => x.rating);
  const avgGiven = rated.length ? (rated.reduce((s, x) => s + x.rating, 0) / rated.length).toFixed(1) : null;
  const pct = Math.min(1, c.read / state.goal);
  return `
    <div class="view-head">
      <h1>Welcome back, ${esc(USER.name.split(' ')[0])}</h1>
      <p class="view-sub">Here's what's happening on your shelves.</p>
    </div>
    <div class="home-grid">
      <div class="home-main">
        <section>
          <div class="section-head"><h2>Currently reading</h2><a class="see-all" href="#/my-books?shelf=reading">See all</a></div>
          ${reading.length ? reading.map(readingCardHtml).join('') : emptyHtml('Nothing in progress — pick something from your Want to Read shelf.')}
        </section>
        <section>
          <div class="section-head"><h2>Want to read</h2><a class="see-all" href="#/my-books?shelf=want">See all</a></div>
          ${want.length ? `<div class="shelf-row">${want.map(shelfCardHtml).join('')}</div>` : emptyHtml('Your Want to Read shelf is empty.')}
        </section>
      </div>
      <aside class="home-side">
        <div class="card side-card">
          <h2 class="card-title">${USER.year} Reading Challenge</h2>
          <div class="challenge">
            ${ringSvg(pct)}
            <div>
              <div class="challenge-count">${c.read} <span>of ${state.goal} books</span></div>
              <p class="muted">${c.read >= state.goal ? 'Goal complete — brilliant year!' : `${state.goal - c.read} books to go!`}</p>
            </div>
          </div>
          <button class="btn btn-block" data-action="open-goal">Edit goal</button>
        </div>
        <div class="card side-card">
          <h2 class="card-title">This year</h2>
          <div class="stats">
            <div class="stat"><span class="stat-num">${fmtCount(pagesRead)}</span><span class="muted">pages read</span></div>
            <div class="stat"><span class="stat-num">${avgGiven ?? '—'}</span><span class="muted">avg rating given</span></div>
            <div class="stat"><span class="stat-num">${c.read}</span><span class="muted">books finished</span></div>
          </div>
        </div>
        <div class="card side-card">
          <h2 class="card-title">Recent activity</h2>
          <ul class="activity">
            ${ACTIVITY.map(a => `<li><span class="dot"></span><div><p>${a.text}</p><span class="muted">${a.time}</span></div></li>`).join('')}
          </ul>
        </div>
      </aside>
    </div>`;
}

function filteredMyBooks() {
  let list = Object.entries(library).map(([id, e]) => ({ b: bookById(id), e })).filter(x => x.b);
  if (state.shelfFilter !== 'all') list = list.filter(x => x.e.shelf === state.shelfFilter);
  const q = state.myBooksQuery.trim().toLowerCase();
  if (q) list = list.filter(x => x.b.title.toLowerCase().includes(q) || x.b.author.toLowerCase().includes(q));
  const sorters = {
    title: (x, y) => x.b.title.localeCompare(y.b.title),
    author: (x, y) => x.b.author.localeCompare(y.b.author),
    myRating: (x, y) => (y.e.rating || 0) - (x.e.rating || 0),
    avg: (x, y) => y.b.avgRating - x.b.avgRating,
    pages: (x, y) => y.b.pages - x.b.pages,
    date: (x, y) => (Date.parse(y.e.finishedAt) || 0) - (Date.parse(x.e.finishedAt) || 0),
  };
  list.sort(sorters[state.myBooksSort] || sorters.title);
  return list;
}

function bookRowHtml({ b, e }) {
  let ratingBlock = '<span class="muted">Not started</span>';
  if (e.shelf === 'read') {
    ratingBlock = `<div class="rate-input">${ratingStarsInput(b.id, e.rating || 0)}</div><span class="muted row-date">Read ${fmtDate(e.finishedAt)}</span>`;
  } else if (e.shelf === 'reading') {
    const pct = Math.round((e.progress || 0) / b.pages * 100);
    ratingBlock = `<div class="progress"><span style="width:${pct}%"></span></div><span class="muted row-date">p. ${e.progress || 0} / ${b.pages}</span><button class="link" data-action="open-progress" data-id="${b.id}">Update</button>`;
  }
  return `
    <article class="book-row">
      <button class="row-cover" data-action="open-book" data-id="${b.id}" aria-label="View ${esc(b.title)}">${coverHtml(b, 'cover--sm')}</button>
      <div class="row-main">
        <button class="link row-title" data-action="open-book" data-id="${b.id}">${esc(b.title)}</button>
        <span class="muted row-author">by ${esc(b.author)}</span>
        <span class="row-avg">${starsHtml(b.avgRating, 'stars--sm')}<span class="muted">${b.avgRating.toFixed(1)}</span></span>
      </div>
      <div class="row-rating">${ratingBlock}</div>
      <div class="muted row-meta">${b.pages} pages · ${esc(b.genre)}</div>
      <button class="icon-btn-sm row-remove" data-action="remove-book" data-id="${b.id}" aria-label="Remove ${esc(b.title)}">${ICONS.x}</button>
    </article>`;
}

function myBooksListHtml() {
  const list = filteredMyBooks();
  if (!list.length) {
    return emptyHtml(state.myBooksQuery ? `No books match “${esc(state.myBooksQuery)}”.` : 'No books on this shelf yet.');
  }
  return list.map(bookRowHtml).join('');
}

function myBooksHtml() {
  const c = counts();
  const tabs = [
    ['all', 'All books', c.all],
    ['reading', 'Currently Reading', c.reading],
    ['want', 'Want to Read', c.want],
    ['read', 'Read', c.read],
  ];
  const sorts = [['title', 'Title A–Z'], ['author', 'Author A–Z'], ['myRating', 'My rating'], ['avg', 'Average rating'], ['pages', 'Pages'], ['date', 'Date read']];
  return `
    <div class="view-head">
      <h1>My Books</h1>
      <p class="view-sub">${c.all} books across your shelves</p>
    </div>
    <div class="toolbar">
      <div class="tabs">${tabs.map(([k, l, n]) => `<button class="tab ${state.shelfFilter === k ? 'active' : ''}" data-action="set-tab" data-tab="${k}">${l}<span class="tab-count">${n}</span></button>`).join('')}</div>
      <div class="toolbar-controls">
        <div class="input-wrap">${ICONS.search}<input id="mybooks-search" type="search" placeholder="Filter your books" value="${esc(state.myBooksQuery)}" autocomplete="off"></div>
        <label class="sort-wrap"><span class="muted">Sort</span>
          <select id="mybooks-sort">${sorts.map(([v, l]) => `<option value="${v}" ${state.myBooksSort === v ? 'selected' : ''}>${l}</option>`).join('')}</select>
        </label>
      </div>
    </div>
    <div id="mybooks-list">${myBooksListHtml()}</div>`;
}

function browseGridHtml() {
  const q = state.browseQuery.trim().toLowerCase();
  let list = BOOKS.slice();
  if (state.browseGenre !== 'All') list = list.filter(b => b.genre === state.browseGenre);
  if (q) list = list.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
  const sorters = {
    added: (a, b) => b.id - a.id,
    popular: (a, b) => b.avgRating * Math.log10(10 + b.ratingsCount) - a.avgRating * Math.log10(10 + a.ratingsCount),
    title: (a, b) => a.title.localeCompare(b.title),
    author: (a, b) => a.author.localeCompare(b.author),
  };
  list.sort(sorters[state.browseSort] || sorters.added);
  if (!list.length) return `<div class="empty" style="grid-column:1/-1">${ICONS.book}<p>No books match your search.</p></div>`;
  return list.map(browseCardHtml).join('');
}

function browseCardHtml(b) {
  const e = library[b.id];
  const sel = v => ((e ? e.shelf === v : v === '') ? 'selected' : '');
  const opts = `<option value="" ${sel('')}>Add to shelf…</option><option value="want" ${sel('want')}>Want to Read</option><option value="reading" ${sel('reading')}>Currently Reading</option><option value="read" ${sel('read')}>Read</option>`;
  return `
    <article class="browse-card">
      <button class="browse-cover" data-action="open-book" data-id="${b.id}" aria-label="View ${esc(b.title)}">${coverHtml(b)}</button>
      <button class="link browse-title" data-action="open-book" data-id="${b.id}">${esc(b.title)}</button>
      <span class="muted browse-author">${esc(b.author)}</span>
      <div class="browse-avg">${avgLine(b)}</div>
      <select class="shelf-select" data-id="${b.id}" aria-label="Shelf for ${esc(b.title)}">${opts}</select>
    </article>`;
}

function browseHtml() {
  const genres = ['All', ...GENRES];
  const sorts = [['added', 'Recently added'], ['popular', 'Popular'], ['title', 'Title A–Z'], ['author', 'Author A–Z']];
  return `
    <div class="view-head">
      <h1>Browse</h1>
      <p class="view-sub">Every book in your library · ${BOOKS.length} titles</p>
    </div>
    <p class="search-note" id="browse-note" ${state.browseQuery ? '' : 'hidden'}>Showing results for <strong class="q">${esc(state.browseQuery)}</strong> <button class="link" data-action="clear-search">Clear</button></p>
    <div class="toolbar browse-toolbar">
      <div class="chips">${genres.map(g => `<button class="chip ${state.browseGenre === g ? 'active' : ''}" data-action="set-genre" data-genre="${esc(g)}">${esc(g)}</button>`).join('')}</div>
      <label class="sort-wrap"><span class="muted">Sort</span>
        <select id="browse-sort">${sorts.map(([v, l]) => `<option value="${v}" ${state.browseSort === v ? 'selected' : ''}>${l}</option>`).join('')}</select>
      </label>
    </div>
    <div id="browse-grid" class="browse-grid">${browseGridHtml()}</div>`;
}

function updateBrowsePartial() {
  const note = $('#browse-note');
  if (note) {
    note.querySelector('.q').textContent = state.browseQuery;
    note.hidden = !state.browseQuery;
  }
  const grid = $('#browse-grid');
  if (grid) grid.innerHTML = browseGridHtml();
}

function openModal(inner, ctx) {
  modalCtx = ctx || null;
  const root = $('#modal-root');
  root.innerHTML = `<div class="modal-backdrop" data-action="close-modal">${inner}</div>`;
  document.body.classList.add('no-scroll');
  const af = root.querySelector('[autofocus]');
  if (af) af.focus();
}

function closeModal() {
  modalCtx = null;
  $('#modal-root').innerHTML = '';
  document.body.classList.remove('no-scroll');
}

function openBookModal(id) {
  const b = bookById(id);
  if (!b) return;
  const e = library[id];
  const progressBlock = e && e.shelf === 'reading'
    ? (() => {
        const pct = Math.round((e.progress || 0) / b.pages * 100);
        return `<div class="progress"><span style="width:${pct}%"></span></div><span class="muted" style="font-size:12px">Page ${e.progress || 0} of ${b.pages}</span>`;
      })()
    : '';
  openModal(`
    <div class="modal">
      <button class="icon-btn modal-close" data-action="close-modal" aria-label="Close">${ICONS.x}</button>
      <div class="book-modal-grid">
        <div class="bm-cover">${coverHtml(b, 'cover--lg')}${progressBlock}</div>
        <div class="bm-info">
          <span class="chip chip-static" style="align-self:flex-start">${esc(b.genre)}</span>
          <h2>${esc(b.title)}</h2>
          <span class="muted bm-author">by ${esc(b.author)} · ${b.year}</span>
          <div class="bm-rating">${b.ratingsCount ? `${starsHtml(b.avgRating)}<span class="muted">${b.avgRating.toFixed(1)} · ${fmtCount(b.ratingsCount)} ratings · ${b.pages} pages</span>` : '<span class="muted">No ratings yet</span>'}</div>
          <p class="bm-desc">${esc(b.description)}</p>
          <div class="bm-shelves">
            <span class="bm-label">My shelf</span>
            <div class="shelf-picker">
              ${Object.entries(SHELVES).map(([k, l]) => `<button class="pill ${e && e.shelf === k ? 'pill-active' : ''}" data-action="set-shelf" data-id="${b.id}" data-shelf="${k}">${l}</button>`).join('')}
            </div>
            ${e ? `<button class="link danger-link" data-action="remove-book" data-id="${b.id}">Remove from my books</button>` : ''}
          </div>
          <div class="bm-rating-you">
            <span class="bm-label">My rating</span>
            <div class="rating-inline">
              ${e ? ratingStarsInput(b.id, e.rating || 0) : '<span class="muted">Add to a shelf to rate this book.</span>'}
              ${e && e.rating ? `<span class="muted">${e.rating} / 5</span>` : ''}
            </div>
          </div>
          ${e && e.shelf === 'reading' ? `<button class="btn btn-primary" style="align-self:flex-start" data-action="open-progress" data-id="${b.id}">Update progress</button>` : ''}
        </div>
      </div>
    </div>`, { type: 'book', id });
}

function openProgressModal(id) {
  const b = bookById(id);
  if (!b) return;
  const e = library[id] || { progress: 0 };
  openModal(`
    <div class="modal modal-sm">
      <button class="icon-btn modal-close" data-action="close-modal" aria-label="Close">${ICONS.x}</button>
      <h2 class="modal-title">Update progress</h2>
      <p class="muted">“${esc(b.title)}” · ${b.pages} pages</p>
      <form class="form" data-form="progress" data-id="${b.id}" novalidate>
        <div class="field">
          <label for="progress-page">Current page</label>
          <input id="progress-page" type="number" min="0" max="${b.pages}" step="1" value="${e.progress || 0}" autofocus>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" type="submit">Save</button>
          <button class="btn" type="button" data-action="finish" data-id="${b.id}">I'm finished</button>
        </div>
      </form>
    </div>`, { type: 'progress', id });
}

function openAddModal() {
  openModal(`
    <div class="modal">
      <button class="icon-btn modal-close" data-action="close-modal" aria-label="Close">${ICONS.x}</button>
      <h2 class="modal-title">Add a book</h2>
      <p class="muted">It will land on your Want to Read shelf.</p>
      <form class="form form-grid" data-form="add" novalidate>
        <div class="field"><label for="add-title">Title *</label><input id="add-title" name="title" required maxlength="80" placeholder="The Clockmaker\u2019s Daughter"></div>
        <div class="field"><label for="add-author">Author *</label><input id="add-author" name="author" required maxlength="60" placeholder="Vera Calloway"></div>
        <div class="field"><label for="add-pages">Pages</label><input id="add-pages" name="pages" type="number" min="1" max="5000" placeholder="320"></div>
        <div class="field"><label for="add-genre">Genre</label><select id="add-genre" name="genre">${GENRES.map(g => `<option>${g}</option>`).join('')}</select></div>
        <div class="field field-wide"><label for="add-year">Published year</label><input id="add-year" name="year" type="number" min="0" max="2100" placeholder="2024"></div>
        <div class="field field-wide"><label for="add-desc">Description</label><textarea id="add-desc" name="description" rows="3" placeholder="A short blurb…"></textarea></div>
        <div class="field-wide btn-row"><button class="btn btn-primary" type="submit">Add book</button><button class="btn" type="button" data-action="close-modal">Cancel</button></div>
      </form>
    </div>`, { type: 'add' });
}

function openGoalModal() {
  openModal(`
    <div class="modal modal-sm">
      <button class="icon-btn modal-close" data-action="close-modal" aria-label="Close">${ICONS.x}</button>
      <h2 class="modal-title">Reading challenge</h2>
      <p class="muted">How many books do you want to read in ${USER.year}?</p>
      <form class="form" data-form="goal" novalidate>
        <div class="field"><label for="goal-input">Goal (books)</label><input id="goal-input" type="number" min="1" max="999" step="1" value="${state.goal}" autofocus></div>
        <div class="btn-row"><button class="btn btn-primary" type="submit">Save goal</button></div>
      </form>
    </div>`, { type: 'goal' });
}

function toast(msg, opts = {}) {
  const root = $('#toast-root');
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span>${msg}</span>`;
  if (opts.label) {
    el.innerHTML += `<button class="toast-action" data-action="toast-action">${esc(opts.label)}</button>`;
    toastHandler = opts.action;
  }
  root.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 250);
  }, 3600);
}

function syncAll() {
  render();
  if (modalCtx && modalCtx.type === 'book') openBookModal(modalCtx.id);
}

function setShelf(id, shelf) {
  const b = bookById(id);
  if (!b || !SHELVES[shelf]) return;
  const prev = library[id];
  if (prev && prev.shelf === shelf) {
    toast(`“${esc(b.title)}” is already on your ${SHELVES[shelf]} shelf.`);
    return;
  }
  library[id] = { ...(prev || {}), shelf, addedAt: (prev && prev.addedAt) || todayISO() };
  if (shelf !== 'reading') delete library[id].progress;
  if (shelf === 'read' && !library[id].finishedAt) library[id].finishedAt = todayISO();
  toast(`Moved “${esc(b.title)}” to ${SHELVES[shelf]}.`);
  syncAll();
}

function setRating(id, rate) {
  const e = library[id];
  const b = bookById(id);
  if (!e || !b) {
    toast('Add this book to a shelf first.');
    return;
  }
  if (e.rating === rate) {
    delete e.rating;
    toast(`Rating cleared for “${esc(b.title)}”.`);
  } else {
    e.rating = rate;
    toast(`Rated “${esc(b.title)}” ${rate} star${rate > 1 ? 's' : ''}.`);
  }
  syncAll();
}

function finishBook(id) {
  const e = library[id];
  const b = bookById(id);
  if (!e || !b) return;
  e.shelf = 'read';
  e.finishedAt = todayISO();
  delete e.progress;
  closeModal();
  toast(`Finished “${esc(b.title)}” — nice work!`);
  syncAll();
}

function removeBook(id) {
  const b = bookById(id);
  const entry = library[id];
  if (!b || !entry) return;
  const lastRemoved = { id, entry };
  delete library[id];
  closeModal();
  toast(`Removed “${esc(b.title)}” from your books.`, {
    label: 'Undo',
    action: () => {
      library[lastRemoved.id] = lastRemoved.entry;
      toast(`Restored “${esc(bookById(lastRemoved.id).title)}” to your shelves.`);
      syncAll();
    },
  });
  syncAll();
}

function setTab(tab) {
  state.shelfFilter = tab;
  history.replaceState(null, '', `#/my-books${tab !== 'all' ? `?shelf=${tab}` : ''}`);
  render();
}

function setGenre(genre) {
  state.browseGenre = genre;
  render();
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('bookworm-theme', theme); } catch (err) {}
  const btn = $('#theme-btn');
  btn.innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon;
  btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
}

function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, qs] = raw.split('?');
  return { path, params: new URLSearchParams(qs || '') };
}

function onRoute() {
  const { path, params } = parseRoute();
  state.view = path === 'my-books' ? 'mybooks' : path === 'browse' ? 'browse' : 'home';
  if (state.view === 'mybooks') {
    const s = params.get('shelf');
    state.shelfFilter = SHELVES[s] ? s : 'all';
  }
  if (state.view === 'home') {
    state.browseQuery = '';
    $('#global-search').value = '';
  }
  document.body.classList.remove('drawer-open');
  $('#avatar-menu').hidden = true;
  render();
  window.scrollTo(0, 0);
}

document.addEventListener('click', e => {
  if (!e.target.closest('.avatar-wrap')) $('#avatar-menu').hidden = true;
  const t = e.target.closest('[data-action]');
  if (!t) return;
  const id = () => Number(t.dataset.id);
  switch (t.dataset.action) {
    case 'open-book': openBookModal(id()); break;
    case 'open-progress': openProgressModal(id()); break;
    case 'open-add-book': openAddModal(); break;
    case 'open-goal': openGoalModal(); break;
    case 'finish': finishBook(id()); break;
    case 'rate': setRating(id(), Number(t.dataset.rate)); break;
    case 'set-shelf': setShelf(id(), t.dataset.shelf); break;
    case 'remove-book': removeBook(id()); break;
    case 'set-tab': setTab(t.dataset.tab); break;
    case 'set-genre': setGenre(t.dataset.genre); break;
    case 'clear-search': {
      state.browseQuery = '';
      $('#global-search').value = '';
      render();
      break;
    }
    case 'toggle-theme': applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); break;
    case 'toggle-drawer': document.body.classList.toggle('drawer-open'); break;
    case 'close-drawer': document.body.classList.remove('drawer-open'); break;
    case 'toggle-avatar': {
      const m = $('#avatar-menu');
      m.hidden = !m.hidden;
      break;
    }
    case 'mock': {
      $('#avatar-menu').hidden = true;
      toast('Just a mock — nothing wired up yet.');
      break;
    }
    case 'toast-action': {
      if (toastHandler) {
        const fn = toastHandler;
        toastHandler = null;
        fn();
      }
      break;
    }
    case 'close-modal': {
      if (t.classList.contains('modal-backdrop') && e.target !== t) return;
      closeModal();
      break;
    }
  }
});

document.addEventListener('change', e => {
  const el = e.target;
  if (el.classList.contains('shelf-select')) {
    const id = Number(el.dataset.id);
    if (!el.value) removeBook(id);
    else setShelf(id, el.value);
  } else if (el.id === 'browse-sort') {
    state.browseSort = el.value;
    const grid = $('#browse-grid');
    if (grid) grid.innerHTML = browseGridHtml();
  } else if (el.id === 'mybooks-sort') {
    state.myBooksSort = el.value;
    const list = $('#mybooks-list');
    if (list) list.innerHTML = myBooksListHtml();
  }
});

document.addEventListener('input', e => {
  if (e.target.id === 'global-search') {
    state.browseQuery = e.target.value;
    if (state.view !== 'browse') location.hash = '#/browse';
    else updateBrowsePartial();
  } else if (e.target.id === 'mybooks-search') {
    state.myBooksQuery = e.target.value;
    const list = $('#mybooks-list');
    if (list) list.innerHTML = myBooksListHtml();
  }
});

document.addEventListener('submit', e => {
  const f = e.target;
  if (!f.dataset || !f.dataset.form) return;
  e.preventDefault();
  if (f.dataset.form === 'progress') {
    const id = Number(f.dataset.id);
    const b = bookById(id);
    if (!b) return;
    const raw = Number(f.querySelector('input[type="number"]').value);
    const page = Math.max(0, Math.min(b.pages, Number.isFinite(raw) ? Math.round(raw) : 0));
    if (page >= b.pages) {
      finishBook(id);
      return;
    }
    if (library[id]) library[id].progress = page;
    closeModal();
    toast(`Progress saved — page ${page} of ${b.pages}.`);
    syncAll();
  } else if (f.dataset.form === 'add') {
    const el = f.elements;
    const title = el.title.value.trim();
    const author = el.author.value.trim();
    if (!title || !author) {
      toast('Title and author are required.');
      if (!title) el.title.focus();
      else el.author.focus();
      return;
    }
    const pages = Number(el.pages.value);
    const year = Number(el.year.value);
    const book = {
      id: nextId++,
      title,
      author,
      pages: Number.isFinite(pages) && pages >= 1 ? Math.min(5000, Math.round(pages)) : 250,
      avgRating: 0,
      ratingsCount: 0,
      genre: el.genre.value,
      year: Number.isFinite(year) && year > 0 ? Math.min(2100, Math.round(year)) : USER.year,
      description: el.description.value.trim() || 'No description yet — add one later.',
    };
    BOOKS.unshift(book);
    library[book.id] = { shelf: 'want', addedAt: todayISO() };
    closeModal();
    toast(`Added “${esc(title)}” to Want to Read.`);
    syncAll();
  } else if (f.dataset.form === 'goal') {
    const raw = Number(f.querySelector('input[type="number"]').value);
    const goal = Number.isFinite(raw) ? Math.max(1, Math.min(999, Math.round(raw))) : state.goal;
    state.goal = goal;
    USER.goal = goal;
    closeModal();
    toast(`Challenge goal updated — ${goal} books this year.`);
    syncAll();
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
    document.body.classList.remove('drawer-open');
    $('#avatar-menu').hidden = true;
  }
});

applyTheme(document.documentElement.dataset.theme || 'light');
if (!location.hash) history.replaceState(null, '', '#/home');
window.addEventListener('hashchange', onRoute);
onRoute();

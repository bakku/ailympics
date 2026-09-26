/* ==========================================================================
   Shelfie — app: router, navigation chrome, search, theme
   ========================================================================== */
(function (global) {
  'use strict';

  const { esc, icon, cover, stars, avatar, debounce, params } = UI;

  const main = document.getElementById('main');
  const sidebar = document.getElementById('sidebar');
  const scrim = document.getElementById('scrim');
  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');
  const suggestRoot = document.getElementById('suggestRoot');

  let current = { route: null, view: null };
  let lastPath = null;

  /* ------------------------------------------------------------- routes */
  const ROUTES = [
    { re: /^#\/?$/,                          view: () => Views.home(),                 nav: 'home' },
    { re: /^#\/discover(?:\?.*)?$/,          view: (p) => Views.discover(p),           nav: 'discover' },
    { re: /^#\/book\/([^/?]+)(?:\?.*)?$/,    view: (p, m) => Views.bookDetail(m[1]),   nav: 'discover' },
    { re: /^#\/my-books(?:\?.*)?$/,         view: (p) => Views.myBooks(p),            nav: 'my-books' },
    { re: /^#\/profile\/([^/?]+)(?:\?.*)?$/, view: (p, m) => Views.profile(m[1], p),   nav: 'profile' },
    { re: /^#\/goal(?:\?.*)?$/,             view: () => Views.goal(),                 nav: 'goal' }
  ];

  function matchRoute() {
    const hash = location.hash || '#/';
    const p = params();
    for (const route of ROUTES) {
      const m = hash.match(route.re);
      if (m) return { route, p, m, path: hash.split('?')[0] };
    }
    return { route: { view: () => Views.notFound(), nav: null }, p, m: [], path: '#/404' };
  }

  /* ------------------------------------------------------------ rendering */
  function render({ keepScroll = false } = {}) {
    const y = window.scrollY;
    const { route, p, m, path } = matchRoute();
    let view;
    try {
      view = route.view(p, m);
    } catch (err) {
      console.error('[shelfie] view failed to render', err);
      view = Views.notFound();
    }

    current = { route, view, path };
    main.innerHTML = view.html;
    document.title = view.title ? view.title + ' · Shelfie' : 'Shelfie';
    if (view.mount) view.mount(main);

    UI.mountStarPickers(main);

    paintChrome(route.nav, path);
    syncSearchField();

    const pathChanged = path !== lastPath;
    lastPath = path;
    closeDrawer();

    if (pathChanged && !keepScroll) {
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
      if (!restoreFocus) { /* keep focus in the search field when the user is typing */ }
    } else {
      window.scrollTo(0, y);
    }
  }

  let restoreFocus = false;

  /* --------------------------------------------------------------- chrome */
  const NAV_ITEMS = [
    { id: 'home',     href: '#/',            label: 'Home',           icon: 'home' },
    { id: 'discover', href: '#/discover',    label: 'Discover',       icon: 'search' },
    { id: 'my-books', href: '#/my-books',    label: 'My books',       icon: 'library' },
    { id: 'goal',     href: '#/goal',        label: 'Reading goal',   icon: 'target' }
  ];

  const BROWSE_ITEMS = [
    { href: '#/discover?sort=ratings', label: 'Most rated' },
    { href: '#/discover?sort=rating',  label: 'Highest rated' },
    { href: '#/discover?sort=newest',  label: 'New releases' },
    { href: '#/discover?genre=Memoir', label: 'Memoir' },
    { href: '#/discover?genre=Science Fiction', label: 'Science fiction' }
  ];

  function paintChrome(activeId, path) {
    const counts = Store.counts();

    document.getElementById('mainNav').innerHTML = NAV_ITEMS.map((item) => `
      <a class="nav__link" href="${item.href}" ${activeId === item.id ? 'aria-current="page"' : ''}>
        ${icon(item.icon)}<span>${item.label}</span>
        ${item.id === 'my-books' ? `<span class="nav__count">${counts.all}</span>` : ''}
      </a>`).join('');

    document.getElementById('browseNav').innerHTML = BROWSE_ITEMS.map((item) => `
      <a class="nav__link" href="${item.href}" ${path === item.href.split('?')[0] && location.hash === item.href ? 'aria-current="page"' : ''}>${item.label}</a>`).join('');

    document.getElementById('shelfNav').innerHTML = DB.SHELVES.map((s) => `
      <a class="shelf-nav__link" href="#/my-books?shelf=${s.id}" ${activeId === 'my-books' && params().get('shelf') === s.id ? 'aria-current="page"' : ''}>
        ${UI.shelfDot(s.id)}<span>${esc(s.name)}</span><span class="shelf-nav__count">${counts[s.id] || 0}</span>
      </a>`).join('');

    const g = Store.goalProgress();
    document.getElementById('goalCard').innerHTML = `
      <div class="goal-card__head">
        ${icon('target')}
        <span class="goal-card__title">Reading goal</span>
        <span class="goal-card__year">2026</span>
      </div>
      <div class="goal-card__bar"><div class="goal-card__fill" style="width:${g.pct}%"></div></div>
      <div class="goal-card__foot"><span><b>${g.read}</b> / ${g.goal} books</span><span>${g.pct}%</span></div>
      <a class="goal-card__link" href="#/goal">Goal details ${icon('chevron-right')}</a>`;

    // tabbar current state
    const tabHref = { home: '#/', discover: '#/discover', 'my-books': '#/my-books', profile: '#/profile/' + DB.ME }[activeId];
    document.querySelectorAll('.tabbar__item[href]').forEach((el) => {
      const href = el.getAttribute('href');
      const on = tabHref ? (href === tabHref || (activeId === 'discover' && href === '#/discover')) : false;
      if (on) el.setAttribute('aria-current', 'page');
      else el.removeAttribute('aria-current');
    });
  }

  /* --------------------------------------------------------------- drawer */
  function openDrawer() {
    document.body.classList.add('nav-open');
    scrim.hidden = false;
    document.getElementById('navToggle').setAttribute('aria-expanded', 'true');
  }
  function closeDrawer() {
    document.body.classList.remove('nav-open');
    scrim.hidden = true;
    document.getElementById('navToggle').setAttribute('aria-expanded', 'false');
  }
  const drawerOpen = () => document.body.classList.contains('nav-open');

  /* --------------------------------------------------------------- search */
  function syncSearchField() {
    const onDiscover = location.hash.startsWith('#/discover');
    const q = onDiscover ? (params().get('q') || '') : '';
    if (document.activeElement !== searchInput) searchInput.value = q;
    searchClear.hidden = !q;
  }

  function goSearch(value) {
    const v = value.trim();
    const base = v ? `#/discover?q=${encodeURIComponent(v)}` : '#/discover';
    if (location.hash === base) return;
    UI.setHash(base);
  }

  const debouncedSearch = debounce((v) => goSearch(v), 320);

  function initSearch() {
    searchInput.addEventListener('input', () => {
      searchClear.hidden = !searchInput.value;
      hideSuggest();
      debouncedSearch(searchInput.value);
    });
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (suggestItems.length && suggestCursor >= 0) {
          const book = suggestItems[suggestCursor];
          hideSuggest();
          searchInput.blur();
          UI.setHash(`#/book/${book.id}`);
          return;
        }
        hideSuggest();
        goSearch(searchInput.value);
        searchInput.blur();
      } else if (e.key === 'Escape') {
        hideSuggest();
        searchInput.blur();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        moveSuggestCursor(e.key === 'ArrowDown' ? 1 : -1);
      }
    });
    searchInput.addEventListener('focus', () => showSuggest(searchInput.value));
    document.getElementById('searchClear').addEventListener('click', () => {
      searchInput.value = '';
      searchClear.hidden = true;
      hideSuggest();
      goSearch('');
      searchInput.focus();
    });
    document.getElementById('globalSearch').addEventListener('submit', (e) => e.preventDefault());
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.searchbar') && !e.target.closest('.suggest')) hideSuggest();
    });
  }

  let suggestItems = [];
  let suggestCursor = -1;

  function showSuggest(value) {
    const q = value.trim();
    suggestItems = q ? DB.search(q).slice(0, 6) : DB.popular(5);
    if (!suggestItems.length) return hideSuggest();

    suggestRoot.innerHTML = `<div class="suggest" role="listbox" aria-label="Search suggestions">
      <p class="suggest__label">${q ? 'Matching books' : 'Popular right now'}</p>
      ${suggestItems.map((b, i) => `
        <a class="suggest__item" role="option" href="#/book/${b.id}" data-i="${i}">
          <span class="suggest__cover">${cover(b)}</span>
          <span class="grow">
            <span class="suggest__title">${esc(b.title)}</span>
            <span class="suggest__meta">${esc(b.author)} · ${b.year}</span>
          </span>
          ${stars(b.rating, { size: 'sm' })}
        </a>`).join('')}
      <button class="suggest__all" type="button" data-all>
        See all results ${q ? `for “${esc(q)}”` : ''} ${icon('chevron-right')}
      </button>
    </div>`;

    const rect = searchInput.getBoundingClientRect();
    // the panel is allowed to be wider than the field on narrow screens
    const width = Math.min(360, Math.max(rect.width, window.innerWidth - 16));
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
    suggestRoot.style.cssText = `position:fixed;z-index:55;top:${rect.bottom + 6}px;left:${left}px;width:${width}px;`;
    suggestCursor = -1;
    suggestRoot.querySelector('[data-all]').addEventListener('click', () => {
      hideSuggest();
      goSearch(searchInput.value);
      searchInput.blur();
    });
  }

  function moveSuggestCursor(dir) {
    const items = [...suggestRoot.querySelectorAll('.suggest__item')];
    if (!items.length) return;
    items[suggestCursor]?.removeAttribute('data-cursor');
    suggestCursor = (suggestCursor + dir + items.length) % items.length;
    items[suggestCursor].dataset.cursor = '1';
    items[suggestCursor].scrollIntoView?.({ block: 'nearest' });
  }

  function hideSuggest() {
    suggestRoot.innerHTML = '';
    suggestItems = [];
    suggestCursor = -1;
  }

  /* --------------------------------------------------------------- theme */
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const btn = document.getElementById('themeToggle');
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }

  /* -------------------------------------------------------- notifications */
  function toggleNotifications(btn) {
    const existing = document.querySelector('.popover');
    if (existing) { existing.remove(); return; }
    const unread = Store.unreadNotifs();
    const list = DB.NOTIFICATIONS.map((n) => {
      const user = DB.user(n.userId);
      const book = n.bookId ? DB.book(n.bookId) : null;
      const isUnread = !Store.state.notifSeen.includes(n.id);
      const verb = { like: 'liked your review of', comment: 'commented on your review of', follow: 'started following you', mention: 'mentioned you in a review of' }[n.type];
      return `<div class="notif${isUnread ? ' notif--unread' : ''}">
        ${avatar(user, 'sm')}
        <div class="grow">
          <p class="notif__text"><b>${esc(user.name)}</b> ${verb} ${book ? `<a href="#/book/${book.id}"><b>${esc(book.title)}</b></a>` : ''}</p>
          <p class="notif__time">${UI.timeAgo(n.date)}</p>
        </div>
      </div>`;
    }).join('');

    const pop = document.createElement('div');
    pop.className = 'popover';
    pop.innerHTML = `<div class="popover__head">
        <h3>Notifications ${unread ? `<span class="badge badge--clay" style="margin-left:6px">${unread} new</span>` : ''}</h3>
        <button class="btn btn--sm btn--ghost" type="button" data-read-all>Mark all read</button>
      </div>
      <div class="popover__list">${list}</div>`;
    btn.parentElement.appendChild(pop);

    pop.querySelector('[data-read-all]').addEventListener('click', () => {
      Store.markNotifsSeen();
      pop.remove();
      document.getElementById('notifBtn').classList.remove('has-dot');
      UI.toast('All caught up');
    });

    const dismiss = (e) => {
      if (pop.contains(e.target) || e.target.closest('#notifBtn')) return;
      pop.remove();
      document.removeEventListener('click', dismiss);
    };
    setTimeout(() => document.addEventListener('click', dismiss), 0);

    if (unread) Store.markNotifsSeen();
  }

  /* ------------------------------------------------------------ bootstrap */
  function init() {
    applyTheme(Store.theme() || 'light');
    if (!Store.unreadNotifs()) document.getElementById('notifBtn').classList.remove('has-dot');

    initSearch();

    document.getElementById('navToggle').addEventListener('click', () => {
      drawerOpen() ? closeDrawer() : openDrawer();
    });
    scrim.addEventListener('click', closeDrawer);
    sidebar.addEventListener('click', (e) => {
      if (e.target.closest('a') && window.matchMedia('(max-width: 980px)').matches) closeDrawer();
    });

    document.getElementById('themeToggle').addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      Store.setTheme(next);
      applyTheme(next);
    });
    document.getElementById('notifBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleNotifications(e.currentTarget);
    });
    document.getElementById('quickAdd').addEventListener('click', () => Views.openAddBookDialog());
    document.getElementById('tabbarAdd').addEventListener('click', () => Views.openAddBookDialog());

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (UI.closeTopModal()) return;
        UI.closeMenus();
        hideSuggest();
        document.querySelector('.popover')?.remove();
        if (drawerOpen()) closeDrawer();
      }
      if (e.key === '/' && document.activeElement !== searchInput && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
    });

    window.addEventListener('hashchange', () => render());
    if (!location.hash) history.replaceState(null, '', '#/');
    render();
  }

  global.App = {
    rerender: () => render({ keepScroll: true }),
    render,
    refreshChrome: () => paintChrome(current.route.nav, current.path),
    toast: UI.toast
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window);

/* ==========================================================================
   Shelfie — UI toolkit: escaping, icons, formatting, widgets
   ========================================================================== */
(function (global) {
  'use strict';

  /* ------------------------------------------------------------ escaping */
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ESC[c]);

  /* -------------------------------------------------------------- icons */
  const ICONS = {
    home: '<path d="M3 9.5 12 3l9 6.5V20a1.5 1.5 0 0 1-1.5 1.5h-4v-7h-7v7h-4A1.5 1.5 0 0 1 3 20z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v14H6.5A2.5 2.5 0 0 0 4 19.5z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v4H6.5A2.5 2.5 0 0 1 4 19.5z"/>',
    'book-open': '<path d="M2.5 4.5h5A3.5 3.5 0 0 1 12 7v13a3 3 0 0 0-3-2.5h-6.5z"/><path d="M21.5 4.5h-5A3.5 3.5 0 0 0 12 7v13a3 3 0 0 1 3-2.5h6.5z"/>',
    library: '<rect x="3" y="4" width="4" height="16" rx="1"/><rect x="10" y="4" width="4" height="16" rx="1"/><path d="M17.5 5.2l3.3 14.2a1 1 0 0 1-.8 1.2l-2.5.6-3.3-14.2z"/>',
    bookmark: '<path d="M19 21l-7-5-7 5V5.5A2.5 2.5 0 0 1 12.5 3h4A2.5 2.5 0 0 1 19 5.5z"/>',
    check: '<path d="M20 6.5 9.5 17 4 11.5"/>',
    'check-circle': '<circle cx="12" cy="12" r="9"/><path d="M8.5 12.2l2.4 2.4 4.6-4.8"/>',
    box: '<path d="M21 8.5V20H3V8.5"/><path d="M2 4h20v4.5H2z"/><path d="M10 12.5h4"/>',
    cart: '<circle cx="9.5" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/><path d="M2 3h2.6l2.7 12.4a1.5 1.5 0 0 0 1.5 1.1h9.4a1.5 1.5 0 0 0 1.5-1.1L21 7H6"/>',
    star: '<path d="M12 2.6l2.95 5.98 6.6.96-4.77 4.65 1.12 6.57L12 17.66l-5.9 3.1 1.12-6.57L2.45 9.54l6.6-.96z"/>',
    heart: '<path d="M20.3 5.1a4.7 4.7 0 0 0-6.65 0L12 6.75l-1.65-1.65a4.7 4.7 0 1 0-6.65 6.65l1.65 1.65L12 20.35l6.65-6.65 1.65-1.65a4.7 4.7 0 0 0 0-6.65z"/>',
    comment: '<path d="M21 11.6a8.4 8.4 0 0 1-8.5 8.4 9 9 0 0 1-3.6-.8L3 21l1.9-5.2a8.4 8.4 0 0 1-.9-3.7A8.5 8.5 0 0 1 12.5 3.2 8.4 8.4 0 0 1 21 11.6z"/>',
    share: '<circle cx="17.5" cy="5.5" r="2.5"/><circle cx="6.5" cy="12" r="2.5"/><circle cx="17.5" cy="18.5" r="2.5"/><path d="M8.8 10.8l6.4-3.9M8.8 13.2l6.4 3.9"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    'chevron-down': '<path d="M6 9.5l6 6 6-6"/>',
    'chevron-right': '<path d="M9.5 6l6 6-6 6"/>',
    'chevron-left': '<path d="M14.5 6l-6 6 6 6"/>',
    'arrow-left': '<path d="M20 12H4M10 6l-6 6 6 6"/>',
    more: '<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',
    bell: '<path d="M18 8.5a6 6 0 1 0-12 0c0 6.5-2.5 8.5-2.5 8.5h17S18 15 18 8.5"/><path d="M13.8 20.5a2.2 2.2 0 0 1-3.6 0"/>',
    user: '<path d="M20 21v-1.5A4.5 4.5 0 0 0 15.5 15h-7A4.5 4.5 0 0 0 4 19.5V21"/><circle cx="12" cy="8" r="3.8"/>',
    users: '<path d="M16.5 21v-1.5a4.5 4.5 0 0 0-4.5-4.5H7a4.5 4.5 0 0 0-4.5 4.5V21"/><circle cx="9.5" cy="8" r="3.6"/><path d="M21.5 21v-1.5a4.5 4.5 0 0 0-3.4-4.3M16 4.6a3.6 3.6 0 0 1 0 6.9"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 3.8 9 14 14 0 0 1-3.8 9 14 14 0 0 1-3.8-9A14 14 0 0 1 12 3z"/>',
    link: '<path d="M10.2 13.8a4.4 4.4 0 0 0 6.6.5l2.6-2.6a4.4 4.4 0 0 0-6.2-6.2l-1.4 1.4"/><path d="M13.8 10.2a4.4 4.4 0 0 0-6.6-.5l-2.6 2.6a4.4 4.4 0 0 0 6.2 6.2l1.4-1.4"/>',
    edit: '<path d="M11 4.5H5.5A2 2 0 0 0 3.5 6.5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V13"/><path d="M18.4 2.6a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z"/>',
    trash: '<path d="M3.5 6h17M9 6V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V6M18 6v13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19.5V6"/>',
    filter: '<path d="M21 4H3l7.2 8.5V19l3.6 2v-8.5z"/>',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/>',
    list: '<path d="M8.5 6H21M8.5 12H21M8.5 18H21M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
    trending: '<path d="M22 6.5 13.5 15l-4.5-4.5L2 17.5"/><path d="M16.5 6.5H22V12"/>',
    sparkle: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.8"/><circle cx="12" cy="12" r="1.2"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3.2 2"/>',
    eye: '<path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
    compass: '<circle cx="12" cy="12" r="8.5"/><path d="M15.8 8.2l-2.1 5.5-5.5 2.1 2.1-5.5z"/>',
    award: '<circle cx="12" cy="8.5" r="6"/><path d="M8.5 13.6 7 21.5l5-2.8 5 2.8-1.5-7.9"/>',
    chart: '<path d="M20.5 15.5A9 9 0 1 1 8.5 3.5"/><path d="M21 12a9 9 0 0 0-9-9v9z"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5M3 17l9 5 9-5"/>',
    tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7.2-7.2A2 2 0 0 1 2.8 12V4.8A2 2 0 0 1 4.8 2.8H12a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.8z"/><path d="M7.5 7.5h.01"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 9l5-5 5 5M12 4v12"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 11l5 5 5-5M12 16V4"/>',
    settings: '<path d="M4 21v-6.5M4 10.5V3M12 21v-9M12 8V3M20 21v-4.5M20 12.5V3"/><path d="M1.5 14.5h5M9.5 8h5M17.5 16.5h5"/>',
    flag: '<path d="M5 21V4M5 4h11l-1.5 4L16 12H5"/>',
    heart_plus: '<path d="M20.3 5.1a4.7 4.7 0 0 0-6.65 0L12 6.75l-1.65-1.65a4.7 4.7 0 1 0-6.65 6.65L12 20.35l6.65-6.65a4.7 4.7 0 0 0 1.65-3.3z"/><path d="M18.5 7v4M16.5 9h4"/>'
  };

  const FILL_ICONS = new Set(['star', 'heart', 'bookmark', 'book', 'box', 'cart']);

  function icon(name, extra = '') {
    const body = ICONS[name] || ICONS.book;
    const fill = FILL_ICONS.has(name) ? ' fill="currentColor" stroke="none"' : '';
    return `<svg viewBox="0 0 24 24" aria-hidden="true"${fill}${extra ? ' class="' + extra + '"' : ''}>${body}</svg>`;
  }

  /* --------------------------------------------------------- formatting */
  function num(n) {
    if (n == null) return '—';
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(n);
  }

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function timeAgo(iso) {
    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) return '';
    const diff = Math.max(0, Date.now() - then);
    const min = Math.floor(diff / 6e4);
    if (min < 1) return 'just now';
    if (min < 60) return min + 'm ago';
    const hr = Math.floor(min / 60);
    if (hr < 24) return hr + 'h ago';
    const day = Math.floor(hr / 24);
    if (day < 7) return day + 'd ago';
    const d = new Date(then);
    if (day < 35) return Math.floor(day / 7) + 'w ago';
    return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
  }

  function dayLabel(iso) {
    const d = new Date(iso);
    const today = new Date();
    const startOf = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
    const diffDays = Math.round((startOf(today) - startOf(d)) / 864e5);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return d.toLocaleDateString(undefined, { weekday: 'long' });
    return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
  }

  function longDate(iso) {
    return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function initials(name) {
    return String(name || '?')
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  }

  /* ------------------------------------------------------------ widgets */
  function cover(book, cls = '') {
    if (!book) return '';
    return `<div class="cover ${cls}" style="--h:${book.hue}" data-style="${book.style}">
      <span class="cover__deco"></span>
      <span class="cover__title">${esc(book.title)}</span>
      <span class="cover__author">${esc(book.author)}</span>
    </div>`;
  }

  function stars(value, opts = {}) {
    const v = Math.max(0, Math.min(5, Number(value) || 0));
    const pct = (v / 5) * 100;
    const size = opts.size ? ` stars--${opts.size}` : '';
    const label = opts.label || `${v.toFixed(1).replace(/\.0$/, '')} out of 5 stars`;
    return `<span class="stars${size}" role="img" aria-label="${esc(label)}">
      <span class="stars__base" aria-hidden="true">★★★★★</span>
      <span class="stars__fill" style="width:${pct}%" aria-hidden="true">★★★★★</span>
    </span>`;
  }

  function avatar(user, size = '') {
    if (!user) return '';
    const cls = size ? ` avatar--${size}` : '';
    return `<span class="avatar${cls}" style="--h:${user.hue}" title="${esc(user.name)}" aria-hidden="true">${esc(initials(user.name))}</span>`;
  }

  function userChip(user, sub, extra = '') {
    return `<a class="user-chip" href="#/profile/${user.id}">
      ${avatar(user, 'sm')}
      <span class="grow">
        <span class="user-chip__name">${esc(user.name)}</span>
        ${sub ? `<span class="user-chip__sub">${esc(sub)}</span>` : ''}
      </span>
      ${extra}
    </a>`;
  }

  function shelfDot(shelfId) {
    const sh = DB.shelf(shelfId);
    if (!sh) return '';
    return `<span class="shelf-nav__dot" style="background:${sh.color}" aria-hidden="true"></span>`;
  }

  function progressBar(pct, clay) {
    return `<div class="progress${clay ? ' progress--clay' : ''}" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
      <div class="progress__fill" style="width:${Math.max(2, Math.min(100, pct))}%"></div>
    </div>`;
  }

  function ring(pct, opts = {}) {
    const size = opts.size || 108;
    const r = 44;
    const c = 2 * Math.PI * r;
    const dash = (Math.max(0, Math.min(100, pct)) / 100) * c;
    return `<div class="ring" style="width:${size}px;height:${size}px">
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="var(--green-300)"/>
            <stop offset="100%" stop-color="var(--green-600)"/>
          </linearGradient>
        </defs>
        <circle class="ring__track" cx="50" cy="50" r="${r}" fill="none" stroke-width="9"/>
        <circle class="ring__bar" cx="50" cy="50" r="${r}" fill="none" stroke-width="9"
          stroke-dasharray="${dash.toFixed(1)} ${c.toFixed(1)}"/>
      </svg>
      <span class="ring__label"><b>${opts.value != null ? opts.value : pct + '%'}</b><span>${esc(opts.label || '')}</span></span>
    </div>`;
  }

  function emptyState({ icon: iconName = 'book', title, body, action }) {
    return `<div class="empty">
      <span class="empty__icon">${icon(iconName)}</span>
      <h3>${esc(title)}</h3>
      ${body ? `<p>${esc(body)}</p>` : ''}
      ${action || ''}
    </div>`;
  }

  /* --------------------------------------------------------------- toast */
  let toastRoot = null;
  function toast(message, opts = {}) {
    toastRoot = toastRoot || document.getElementById('toastRoot');
    if (!toastRoot) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.dataset.kind = opts.kind || 'ok';
    const glyph = opts.kind === 'warn' ? 'flag' : 'check-circle';
    el.innerHTML = `${icon(glyph)}<span>${esc(message)}</span>`;
    if (opts.actionLabel) {
      const btn = document.createElement('button');
      btn.className = 'toast__undo';
      btn.textContent = opts.actionLabel;
      btn.addEventListener('click', () => {
        opts.onAction && opts.onAction();
        dismiss();
      });
      el.appendChild(btn);
    }
    toastRoot.appendChild(el);
    const timer = setTimeout(dismiss, opts.timeout || 4000);
    function dismiss() {
      clearTimeout(timer);
      if (!el.isConnected) return;
      el.classList.add('toast--out');
      setTimeout(() => el.remove(), 200);
    }
    return dismiss;
  }

  /* --------------------------------------------------------------- modal */
  const modalStack = [];

  function closeTopLayer() {
    const layer = modalStack[modalStack.length - 1];
    if (!layer || !layer.close) return false;
    return layer.close();
  }

  function modal({ title, body = '', foot = '', wide = false, onMount, onClose, closeLabel = 'Close' }) {
    const root = document.getElementById('modalRoot');
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `<div class="modal${wide ? ' modal--wide' : ''}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
      <div class="modal__head">
        <h2>${esc(title)}</h2>
        <button class="icon-btn modal__close" type="button" data-close aria-label="${esc(closeLabel)}">${icon('x')}</button>
      </div>
      <div class="modal__body">${body}</div>
      ${foot ? `<div class="modal__foot">${foot}</div>` : ''}
    </div>`;

    const dialog = backdrop.querySelector('.modal');
    const previous = document.activeElement;
    document.body.appendChild(backdrop);
    document.body.style.overflow = 'hidden';

    function close() {
      const i = modalStack.findIndex((l) => l.el === backdrop);
      if (i >= 0) modalStack.splice(i, 1);
      backdrop.remove();
      if (!modalStack.length) document.body.style.overflow = '';
      if (onClose) onClose();
      if (previous && previous.focus) previous.focus();
    }

    modalStack.push({ el: backdrop, onClose, close });

    backdrop.addEventListener('mousedown', (e) => { if (e.target === backdrop) close(); });
    dialog.querySelector('[data-close]').addEventListener('click', close);
    dialog.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusables = dialog.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    onMount && onMount(dialog, close);
    const focusTarget = dialog.querySelector('[autofocus], input, textarea, button:not([data-close])');
    if (focusTarget) focusTarget.focus();
    return { close, dialog };
  }

  function confirmDialog({ title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false }) {
    return new Promise((resolve) => {
      let settled = false;
      const done = (v) => { if (!settled) { settled = true; resolve(v); } };
      const handle = modal({
        title,
        body: `<p style="color:var(--text-soft)">${esc(message)}</p>`,
        foot: `<button class="btn" type="button" data-cancel>${esc(cancelLabel)}</button>
               <button class="btn ${danger ? 'btn--danger' : 'btn--primary'}" type="button" data-ok>${esc(confirmLabel)}</button>`,
        onClose: () => done(false),
        onMount: (dialog, close) => {
          dialog.querySelector('[data-ok]').addEventListener('click', () => { done(true); close(); });
          dialog.querySelector('[data-cancel]').addEventListener('click', () => { done(false); close(); });
          setTimeout(() => dialog.querySelector('[data-ok]').focus(), 0);
        }
      });
      return handle;
    });
  }

  /* ------------------------------------------------------- floating menu */
  let openMenu = null;
  function closeMenus() {
    if (openMenu) { openMenu.remove(); openMenu = null; }
  }
  document.addEventListener('click', (e) => {
    if (openMenu && !openMenu.contains(e.target) && !e.target.closest('[data-menu-trigger]')) closeMenus();
  });

  function menu(anchor, itemsHTML, opts = {}) {
    closeMenus();
    const el = document.createElement('div');
    el.className = 'menu' + (opts.right ? ' menu--right' : '');
    el.innerHTML = itemsHTML;
    document.body.appendChild(el);
    const rect = anchor.getBoundingClientRect();
    const width = el.offsetWidth;
    let left = opts.right ? rect.right - width : rect.left;
    left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
    el.style.left = left + 'px';
    el.style.top = rect.bottom + 6 + 'px';
    if (rect.bottom + el.offsetHeight > window.innerHeight - 8) {
      el.style.top = Math.max(8, rect.top - el.offsetHeight - 6) + 'px';
    }
    openMenu = el;
    return el;
  }

  /* ------------------------------------------------- star picker binding */
  function mountStarPickers(root = document) {
    root.querySelectorAll('[data-starpick]').forEach((picker) => {
      if (picker.dataset.bound) return;
      picker.dataset.bound = '1';
      const buttons = [...picker.querySelectorAll('[data-star]')];
      const paint = (value) => {
        picker.dataset.value = value;
        buttons.forEach((b) => {
          const v = Number(b.dataset.star);
          const on = v <= value + 0.001;
          b.dataset.on = on ? '1' : '0';
          b.dataset.half = !on && Math.abs(value - (v - 0.5)) < 0.001 ? '1' : '0';
        });
      };
      buttons.forEach((btn) => {
        const v = Number(btn.dataset.star);
        const set = (half) => paint(half ? Math.max(0, v - 0.5) : v);
        btn.addEventListener('click', (e) => {
          const rect = btn.getBoundingClientRect();
          const half = e.clientX - rect.left < rect.width / 2;
          set(half);
          picker.dispatchEvent(new CustomEvent('starpick:change', { detail: { value: Number(picker.dataset.value) }, bubbles: true }));
        });
        btn.addEventListener('pointerenter', () => {
          const rect = btn.getBoundingClientRect();
          paint(v);
        });
        btn.addEventListener('pointerleave', () => paint(Number(picker.dataset.value || 0)));
      });
      paint(Number(picker.dataset.value || 0));
      picker.addEventListener('pointerleave', () => paint(Number(picker.dataset.value || 0)));
    });
  }

  function starPickerHTML(value, opts = {}) {
      const buttons = [1, 2, 3, 4, 5]
        .map((n) => {
          const on = value >= n ? '1' : '0';
          const half = value < n && Math.abs(value - (n - 0.5)) < 0.001 ? '1' : '0';
          return `<button class="starpick__btn" type="button" data-star="${n}" data-on="${on}" data-half="${half}" aria-label="Rate ${n} star${n > 1 ? 's' : ''}">${icon('star')}</button>`;
        })
        .join('');
    return `<div class="starpick${opts.lg ? ' starpick--lg' : ''}" data-starpick data-value="${value || 0}" role="group" aria-label="Your rating">${buttons}</div>`;
  }

  /* -------------------------------------------------------------- utils */
  function debounce(fn, wait = 220) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function params() {
    const raw = location.hash.split('?')[1] || '';
    return new URLSearchParams(raw);
  }

  function setHash(hash, { replace = false } = {}) {
    if (replace) location.replace(hash);
    else location.hash = hash;
  }

  global.UI = {
    esc, icon, num, timeAgo, dayLabel, longDate, initials,
    cover, stars, avatar, userChip, shelfDot, progressBar, ring, emptyState,
    toast, modal, confirm: confirmDialog, menu, closeMenus, closeTopModal: closeTopLayer,
    mountStarPickers, starPickerHTML, debounce, params, setHash
  };
})(window);

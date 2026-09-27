/* Shelfd — mocked Goodreads-style UI. All data fake, interactions client-side. */
(() => {
  "use strict";

  /* ================= Mock data ================= */
  const BOOKS = [
    { id: 1, title: "The Hyphenated Heart", author: "Amara Okafor-Schmitt", rating: 4.5, shelf: "read", grad: 1, want: false, favourite: true },
    { id: 2, title: "Copper Harbor Nights", author: "Jonas Reyes", rating: 4, shelf: "read", grad: 2, want: false, favourite: false },
    { id: 3, title: "A Field Guide to Letting Go", author: "Priya Venkataraman", rating: 5, shelf: "reading", grad: 3, want: false, favourite: true, progress: 68, pagesIn: 198, pagesTotal: 292 },
    { id: 4, title: "Harbourmaster Letters", author: "Mei-Lin Zhou", rating: 0, shelf: "read", grad: 4, want: false, favourite: false },
    { id: 5, title: "Glasswork", author: "Oliver Bergström", rating: 3.5, shelf: "reading", grad: 5, want: false, favourite: false, progress: 15, pagesIn: 44, pagesTotal: 288 },
    { id: 6, title: "The Orchard Ledger", author: "Serena Kowalczyk", rating: 4, shelf: "read", grad: 9, want: false, favourite: false },
    { id: 7, title: "Tides of the Bight", author: "Alastair Mou", rating: 0, shelf: "want", grad: 7, want: true, favourite: false },
    { id: 8, title: "Small Monsters", author: "Renée Dubois", rating: 0, shelf: "want", grad: 6, want: true, favourite: false },
    { id: 9, title: "The Cartographer's Widow", author: "Hana Sato", rating: 5, shelf: "read", grad: 12, want: false, favourite: true },
    { id: 10, title: "The Slow Hours", author: "Theo van der Meulen", rating: 0, shelf: "want", grad: 10, want: true, favourite: false },
    { id: 11, title: "Winter Arithmetic", author: "Ida Lindqvist", rating: 4, shelf: "read", grad: 4, want: false, favourite: false },
    { id: 12, title: "The Last Bookshop in Prishtinë", author: "Ardit Berisha", rating: 4.5, shelf: "read", grad: 11, want: false, favourite: false },
  ];

  const SHELFS = [
    { key: "all", label: "All books" },
    { key: "read", label: "Read" },
    { key: "reading", label: "Currently reading" },
    { key: "want", label: "Want to read" },
    { key: "favourites", label: "Favourites" },
  ];

  const ACTIVITY = [
    { icon: "✓", body: "<strong>You</strong> finished <em>The Hyphenated Heart</em>", time: "2h ago" },
    { icon: "★", body: "<strong>You</strong> rated <em>Copper Harbor Nights</em> 4/5", time: "2h ago" },
    { icon: "+", body: "<strong>You</strong> shelved <em>Small Monsters</em> as want to read", time: "Yesterday" },
    { icon: "❝", body: "<strong>You</strong> saved a quote from <em>The Cartographer's Widow</em>", time: "3d ago" },
    { icon: "✎", body: "<strong>You</strong> reviewed <em>Small Monsters</em>", time: "5d ago" },
  ];

  const MILESTONES = [
    { y: "2026", read: 31, goal: 40 },
    { y: "2025", read: 47, goal: 40 },
    { y: "2024", read: 28, goal: 24 },
    { y: "2023", read: 19, goal: 20 },
  ];

  const CHART = [
    { m: "Oct", v: 3 }, { m: "Nov", v: 5 }, { m: "Dec", v: 1 },
    { m: "Jan", v: 4 }, { m: "Feb", v: 3 }, { m: "Mar", v: 2 },
    { m: "Apr", v: 5 }, { m: "May", v: 6 }, { m: "Jun", v: 4 },
    { m: "Jul", v: 3 }, { m: "Aug", v: 4 }, { m: "Sep", v: 5 },
  ];

  const GENRES = [
    { n: "Literary fiction", c: 64, pct: 26 },
    { n: "Science fiction", c: 47, pct: 19 },
    { n: "Fantasy", c: 38, pct: 15 },
    { n: "History", c: 31, pct: 13 },
    { n: "Mystery", c: 24, pct: 10 },
    { n: "Poetry", c: 18, pct: 7 },
    { n: "Essays", c: 12, pct: 5 },
    { n: "Translated", c: 10, pct: 4 },
  ];

  /* ================= Helpers ================= */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const stars = (n) => {
    const full = Math.floor(n);
    const half = n - full > 0.25 && n - full < 0.75;
    const rnd = Math.round(n);
    let out = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= full) out += "★";
      else if (i === full + 1 && half) out += '<span class="half">★</span>';
      else out += '<span class="off">★</span>';
    }
    return `<span class="stars">${out}</span>`;
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&", "<": "<", ">": ">", '"': '&quot;', "'": '&#39;' }[c]));
  const MSGS = ["Opening book page…", "Another mock action", "Nothing published yet", "This is a demo, remember?"];
  let mi = 0;
  const toast = (msg) => {
    const region = $("#toasts");
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    region.appendChild(el);
    setTimeout(() => el.classList.add("out"), 2300);
    setTimeout(() => el.remove(), 2600);
  };
  const demoToast = () => toast(MSGS[mi++ % MSGS.length]);

  /* ================= Templates ================= */
  const bookCard = (b) => `
    <button class="book-card" data-open-book="${b.id}" aria-label="${esc(b.title)} by ${esc(b.author)}">
      <span class="book-cover bc-grad-${b.grad}">
        <span class="book-flags">${b.want ? '<span class="flag want">want</span>' : ""}${b.favourite ? '<span class="flag fav">fav</span>' : ""}</span>
        <span class="bc-title">${esc(b.title)}</span>
        <span class="bc-author">${esc(b.author)}</span>
      </span>
      <span class="book-meta">
        <span class="book-title">${esc(b.title)}</span>
        <span class="book-author">${esc(b.author)}</span>
        ${b.shelf === "want" ? '<span class="star-want">planned · no rating yet</span>' : stars(b.rating)}
      </span>
    </button>`;

  const activityItem = (a) => `
    <div class="activity-item">
      <span class="dot">${a.icon}</span>
      <div class="activity-body">
        <div>${a.body}</div>
        <div class="activity-time">${a.time}</div>
      </div>
    </div>`;

  const milestoneRow = (m) => `
    <div class="milestone-row">
      <span class="m-y">${m.y}</span>
      <span class="m-bar"><span class="m-fill" style="width:${Math.min(100, (m.read / m.goal) * 100)}%"></span></span>
      <span class="mival"><strong>${m.read}</strong>/${m.goal}</span>
    </div>`;

  const genreRow = (g) => `
    <div class="genre-row">
      <span class="genre-name">${esc(g.n)}</span>
      <span class="m-bar"><span class="m-fill" style="width:${g.pct * 2.4}%"></span></span>
      <span class="genre-count">${g.c}</span>
    </div>`;

  const reviewCard = (rv) => `
    <div class="review-top">
      <span class="review-cover bc-grad-${rv.grad}"></span>
      <div class="flex-1">
        ${stars(rv.rating)}
        <div class="review-q">${esc(rv.q)}</div>
        <div class="review-body">${esc(rv.body)}</div>
        <div class="review-meta">${esc(rv.meta)}</div>
      </div>
    </div>`;

  const REVIEWS = [
    { rating: 4, grad: 1, q: "Grief written like a field guide, and it worked on me.", body: "The middle section drags a little, but the final hundred pages repaid all of it. Ending hit harder than anything I've read this year.", meta: "Finished 26 Aug 2026 · marked as read" },
    { rating: 4, grad: 2, q: "Cozy mystery with real teeth under the wool.", body: "Read it in three sittings on a rainy weekend. Harbor-town cast is big but each character gets one perfect detail to carry them.", meta: "Finished 13 Sep 2026 · reviewed" },
    { rating: 5, grad: 12, q: "A love letter to marginalia.", body: "Part novel, part archive. If you've ever written in the margins of a book someone else owned, this will undo you.", meta: "Finished 02 Mar 2026 · marked as read" },
  ];

  const statCard = (label, value, sub, subCls) => `
    <div class="stat-card">
      <div class="stat-label">${label}</div>
      <div class="stat-num">${value}</div>
      <div class="stat-sub ${subCls || ""}">${sub}</div>
    </div>`;

  const chartCol = (d, max) => {
    const pct = (d.v / max) * 84;
    const dim = d.m === "Dec" ? "dim" : "";
    return `
      <div class="chart-col">
        <span class="chart-val">${d.v}</span>
        <span class="chart-bar ${dim}" style="height:${pct}%"></span>
      </div>`;
  };

  /* ================= Pages ================= */
  const PAGES = {
    home: () => `
      <div class="page is-active" data-pageview="home">
        <section class="hero">
          <div class="hero-grid">
            <div>
              <div class="hero-kicker">≈ your personal reading record</div>
              <h1>Good evening, Ada.</h1>
              <p class="hero-sub">47 books finished this year — you're 16 ahead of your goal pace. Library hosted locally at <code>syncbox.local</code>, synced across 3 devices.</p>
              <div class="hero-meta">
                <div><span class="stat-num">247</span><span class="stat-label">books owned</span></div>
                <div><span class="stat-num">47</span><span class="stat-label">finished this year</span></div>
                <div><span class="stat-num">689k</span><span class="stat-label">pages turned</span></div>
              </div>
              <button class="btn btn-accent" data-toast="Add-book flow not built yet">+ Add a book</button>
              <button class="btn btn-ghost" data-page="library" data-nav>View library →</button>
            </div>
            <div class="now-card">
              <div class="now-cover">The Hyphenated Heart</div>
              <div class="now-body">
                <div class="now-tag">● currently reading</div>
                <div class="now-title">A Field Guide to Letting Go</div>
                <div class="now-author">Priya Venkataraman · 292 pages</div>
                <div class="progress-row">
                  <div class="progress-track"><div class="progress-fill" style="width:68%"></div></div>
                  <span class="progress-pct">198/292</span>
                </div>
                <div class="now-foot">
                  <span>~24 pages · 41 min left</span>
                  <button class="mini-btn" data-toast="Progress updated to 72%">Update progress</button>
                    </div>
              </div>
            </div>
          </div>
        </section>

        <div class="section-head">
          <h2>Recent activity</h2>
          <a href="#" class="section-link" data-toast="Full history coming soon">View all →</a>
        </div>
        <div class="panel-grid">
          <div class="panel">
            <div class="panel-head"><h3>This week on your shelf</h3><span class="panel-tag accent">live</span></div>
            ${ACTIVITY.map(activityItem).join("")}
          </div>
          <div class="panel">
            <div class="panel-head"><h3>Reading by year</h3><span class="panel-tag">mock data</span></div>
            ${MILESTONES.map(milestoneRow).join("")}
          </div>
        </div>

        <div class="section-head">
          <h2>Recently added</h2>
          <a href="#" class="section-link" data-page="library" data-nav>See library →</a>
        </div>
        <div class="shelf-strip">${BOOKS.slice(0, 8).map(bookCard).join("")}</div>

        <div class="section-head">
          <h2>From the server</h2>
          <span class="panel-tag green" style="margin-bottom:2px">uptime 41d</span>
        </div>
        <div class="panel-grid">
          <div class="panel">
            <div class="panel-head"><h3>Backup activity</h3><span class="panel-tag green">Healthy</span></div>
            ${activityItem({ icon: "✓", body: "<strong>Nightly snapshot</strong> completed — 11.2 GB on disk", time: "today 03:12" })}
            ${activityItem({ icon: "✓", body: "<strong>Sync</strong> to 3 connected devices", time: "today 06:40" })}
            <div class="activity-item"><span class="dot">🛈</span><div class="activity-body"><div>Storage is <strong>62% full</strong> — covers take most of it</div><div class="activity-time">checked hourly</div></div></div>
          </div>
          <div class="panel">
            <div class="panel-head"><h3>Reading streak</h3><span class="panel-tag blue">DAY 12</span></div>
            ${activityItem({ icon: "🔥", body: "<strong>12-day streak</strong> — longest this year", time: "on pace" })}
            ${activityItem({ icon: "📖", body: "Most-read genre this month: <em>literary fiction</em>", time: "auto-tagged" })}
            <div class="activity-item"><span class="dot">⏱</span><div class="activity-body"><div><strong>4h 12m</strong> logged in the last week</div><div class="activity-time">manual timer + estimates</div></div></div>
          </div>
        </div>
        <p class="footnote">All data on this page is mock — the real app reads its own database.</p>
      </div>`,

    library: () => `
      <div class="page is-active">
        <div class="page-hero">
          <h1>My Library</h1>
          <p>247 books on the shelf · last import 12 Aug 2026 · cover art generated locally</p>
        </div>
        <div class="library-layout">
          <aside class="filters">
            <div class="filter-group">
              <h4>Shelves</h4>
              ${SHELFS.map((s) => `
                <button class="filter-chip ${s.key === "all" ? "is-active" : ""}" data-shelf-chip="${s.key}">
                  <span>${s.label}</span><span class="f-count">${s.key === "all" ? BOOKS.length : BOOKS.filter((b) => s.key === "favourites" ? b.favourite : b.shelf === s.key).length}</span>
                </button>`).join("")}
            </div>
            <div class="filter-group">
              <h4>Find</h4>
              <div class="search-cnt"><input type="search" id="libSearch" placeholder="Filter by title or author…" /></div>
            </div>
            <div class="filter-group">
              <h4>Server</h4>
              <button class="filter-chip" data-toast="Import wizard is mocked"><span>Import from CSV</span></button>
              <button class="filter-chip" data-toast="Dry-run export ready (fake)"><span>Export library</span></button>
            </div>
          </aside>
          <div>
            <div class="filter-shelfs">
              <button class="f-chip is-active" data-shelf-chip="all">All</button>
              <button class="f-chip" data-shelf-chip="read">Finished</button>
              <button class="f-chip" data-shelf-chip="reading">Reading</button>
              <button class="f-chip" data-shelf-chip="want">Wishlist</button>
              <button class="add-read" data-toast="Marking finished is mocked" aria-label="Mark shelf status">+</button>
            </div>
            <div id="libGrid" class="shelf-strip" style="flex-wrap:wrap; overflow:visible;">${BOOKS.map(bookCard).join("")}</div>
            <div id="libEmpty" class="empty-note" hidden>
              No books match. Clear the filter or <button class="mini-btn" id="clearFilters">clear search</button>.
            </div>
          </div>
          </div>
      </div>`,

    browse: () => `
      <div class="page is-active">
        <div class="page-hero">
          <h1>Browse</h1>
          <p>Community shelves and reviews from other people hosting Shelfd.</p>
        </div>
        <div class="browse-tabs" role="tablist">
          <button class="browse-tab is-active" data-btab="shelves" data-nobrowse>Friends' shelves</button>
          <button class="browse-tab" data-btab="reviews" data-nobrowse>Recent reviews</button>
          <button class="browse-tab" data-btab="selfhost" data-nobrowse>Self-hosting corner</button>
        </div>
        <div id="browseBody">${renderBrowseTab("shelves")}</div>
      </div>`,

    stats: () => {
      const max = Math.max(...CHART.map((c) => c.v));
      return `
      <div class="page is-active">
        <div class="page-hero">
          <h1>Stats</h1>
          <p>Numbers against your library, computed locally. Nothing leaves the server.</p>
        </div>
        <div class="stats-grid">
          ${statCard("Books finished", "47", "▲ 12 more than 2025", "up")}
          ${statCard("Pages read", "16,240", "≈ 2,706 this month")}
          ${statCard("Avg rating given", "3.9<span class='unit'>/5</span>", "across 138 ratings")}
          ${statCard("Longest streak", "19 <span class='unit'>days</span>", "set in late summer '25")}
        </div>
        <div class="chart-panel">
          <div class="chart-head">
            <h3>Books per month — last 12</h3>
            <span class="chart-values">total 45 · peak 6 (May)</span>
          </div>
          <div class="chart">${CHART.map((d) => chartCol(d, max)).join("")}</div>
          <div class="chart-lbls">${CHART.map((c) => `<span>${c.m}</span>`).join("")}</div>
        </div>
        <div class="panel">
          <div class="panel-head"><h3>Top genres</h3><span class="panel-tag">all-time</span></div>
          <div class="genre-rows">${GENRES.map(genreRow).join("")}</div>
        </div>
      </div>`;
    },
  };

  function renderBrowseTab(tab) {
    if (tab === "reviews") {
      return `<div class="panel-grid">${REVIEWS.map((rv) => `<div class="panel">${reviewCard(rv)}</div>`).join("")}</div>`;
    }
    if (tab === "selfhost") {
      return `
        <div class="empty-note" style="text-align:left; padding:26px;">
          <strong style="color:var(--text)">Self-hosting corner</strong>
          <p style="margin-top:8px; font-size:13.5px;">
            Swap notes on backups, metadata en masse, OPDS catalogs, and covers on a Raspberry Pi.
            Rediscover the joy of a <code>docker compose up</code> that just reads.
          </p>
          <button class="btn btn-ghost" style="margin-top:16px" data-toast="Guide is mocked">Read the guide →</button>
        </div>`;
    }
    return `
      <div class="panel-grid">
        <div class="panel">
          <div class="panel-head"><h3>Friends' recent shelves</h3><span class="panel-tag blue">4 online</span></div>
          ${activityItem({ icon: "📚", body: "<strong>Ibrahim</strong> shelved <em>Light Pirates</em> as read", time: "1h ago" })}
          ${activityItem({ icon: "📚", body: "<strong>Noor</strong> added 12 books from a CSV import", time: "6h ago" })}
          ${activityItem({ icon: "★", body: "<strong>Piet</strong> rated <em>The Slow Hours</em> 5/5", time: "2d ago" })}
        </div>
      </div>`;
  }

  /* ================= Rendering & events ================= */
  const main = $("#main");
  let currentPage = "home";

  function renderPage(name) {
    if (!PAGES[name]) name = "home";
    currentPage = name;
    main.innerHTML = `<div class="container">${PAGES[name]()}</div>`;
    window.scrollTo({ top: 0, behavior: "instant" });
    $$(".main-nav a, .mobile-nav a").forEach((a) => a.classList.toggle("is-active", a.dataset.page === name));
    bindPage();
  }

  function bindPage() {
    $$("[data-toast]", main).forEach((el) => el.addEventListener("click", (e) => {
      e.preventDefault();
      toast(el.dataset.toast);
    }));
    $$("[data-open-book]", main).forEach((el) => el.addEventListener("click", () => {
      const b = BOOKS.find((x) => x.id == el.dataset.openBook);
      toast(`Book page for "${b.title}" — not built yet`);
    }));
    $$("[data-shelf-chip], .f-chip[data-shelf-chip]", main).forEach((el) => el.addEventListener("click", () => onShelfChip(el)));
    const search = $("#libSearch");
    if (search) search.addEventListener("input", filterLibrary);
    const clearBtn = $("#clearFilters");
    if (clearBtn) clearBtn.addEventListener("click", () => {
      const s = $("#libSearch");
      if (s) s.value = "";
      setActiveChip("all");
      filterLibrary();
    });
    $$("[data-btab]", main).forEach((el) => el.addEventListener("click", () => {
      $$(".browse-tab").forEach((t) => t.classList.remove("is-active"));
      el.classList.add("is-active");
      $("#browseBody").innerHTML = renderBrowseTab(el.dataset.btab);
      $$("[data-toast]", $("#browseBody")).forEach((x) => x.addEventListener("click", (ev) => { ev.preventDefault(); toast(x.dataset.toast); }));
    }));
  }

  function onShelfChip(el) {
    setActiveChip(el.dataset.shelfChip);
    filterLibrary();
  }

  function setActiveChip(key) {
    $$("[data-shelf-chip]", main).forEach((c) => c.classList.toggle("is-active", c.dataset.shelfChip === key));
    $$(".f-chip", main).forEach((c) => c.classList.toggle("is-active", c.dataset.shelfChip === key));
  }

  function filterLibrary() {
    const grid = $("#libGrid");
    if (!grid) return;
    const active = $('[data-shelf-chip].is-active', main);
    const shelfKey = active ? active.dataset.shelfChip : "all";
    const q = ($("#libSearch")?.value || "").trim().toLowerCase();
    const list = BOOKS.filter((b) => {
      const onShelf = shelfKey === "all" ? true : (shelfKey === "favourites" ? b.favourite : b.shelf === shelfKey);
      const matchQ = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
      return onShelf && matchQ;
    });
    grid.innerHTML = list.map(bookCard).join("");
    bindPage();
    $("#libEmpty").hidden = list.length > 0;
  }

  /* Header nav, avatar menu, cmdk */
  function bindChrome() {
    document.addEventListener("click", (e) => {
      const nav = e.target.closest("[data-nav]");
      if (nav) { e.preventDefault(); renderPage(nav.dataset.page); closeMobileNav(); return; }
      const tEl = e.target.closest("[data-toast]");
      if (tEl) { e.preventDefault(); toast(tEl.dataset.toast); return; }
      if (!e.target.closest(".avatar-wrap")) closeAvatarMenu();
    });

    const avatarBtn = $("#avatarBtn");
    avatarBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      $("#avatarMenu").classList.toggle("open");
      avatarBtn.setAttribute("aria-expanded", $("#avatarMenu").classList.contains("open"));
    });

    const menuBtn = $("#menuBtn");
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const mob = $("#mobileNav");
      mob.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", mob.classList.contains("open"));
      menuBtn.classList.toggle("is-open");
    });

    function closeMobileNav() {
      $("#mobileNav").classList.remove("open");
      menuBtn.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
    }

    function closeAvatarMenu() {
      $("#avatarMenu").classList.remove("open");
      avatarBtn.setAttribute("aria-expanded", "false");
    }

    /* Command palette */
    const backdrop = $("#cmdk");
    const input = $("#cmdkInput");
    const results = $("#cmdkResults");
    let selIndex = 0;

    const open = () => { backdrop.hidden = false; requestAnimationFrame(() => backdrop.classList.add("open")); input.value = ""; render(""); setTimeout(() => input.focus(), 30); };
    const close = () => { backdrop.classList.remove("open"); setTimeout(() => { backdrop.hidden = true; }, 150); };

    function render(q) {
      const list = BOOKS.filter((b) => !q || (b.title + " " + b.author).toLowerCase().includes(q)).slice(0, 7);
      selIndex = 0;
      results.innerHTML = list.length
        ? list.map((b, i) => `
          <button class="cmdk-item ${i === 0 ? "sel" : ""}" data-i="${i}">
            <span class="cmdk-cover bc-grad-${b.grad}"></span>
            <span><span class="cmdk-book-title">${esc(b.title)}</span><br/><span class="cmdk-book-meta">${esc(b.author)} · ${b.shelf}</span></span>
            <span class="cmdk-badge">${b.shelf === "reading" ? "68%" : b.shelf === "want" ? "wish" : b.rating ? b.rating.toFixed(1) : "—"}</span>
          </button>`).join("")
        : `<div class="cmdk-empty">No books found for "${esc(q)}"</div>`;
      $$(".cmdk-item", results).forEach((el) => {
        el.addEventListener("click", () => pick(list[+el.dataset.i]));
      });
    }

    function move(dir) {
      const items = $$(".cmdk-item", results);
      if (!items.length) return;
      items[selIndex]?.classList.remove("sel");
      selIndex = (selIndex + dir + items.length) % items.length;
      items[selIndex]?.classList.add("sel");
      items[selIndex]?.scrollIntoView({ block: "nearest" });
    }

    function pick(b) { close(); toast(`Book page for "${b.title}" — not built yet`); }

    $$(".search-toggle").forEach((btn) => btn.addEventListener("click", open));
    $(`[data-open-cmdk]`)?.addEventListener("click", open);

    input.addEventListener("input", () => render(input.value.trim().toLowerCase()));
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
      else if (e.key === "Enter") {
        const list = BOOKS.filter((b) => !input.value.trim() || (b.title + " " + b.author).toLowerCase().includes(input.value.trim().toLowerCase())).slice(0, 7);
        if (list[selIndex]) pick(list[selIndex]);
      }
    });
    backdrop.addEventListener("mousedown", (e) => { if (e.target === backdrop) close(); });

    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); backdrop.hidden ? open() : close(); }
      else if (e.key === "Escape") { if (!backdrop.hidden) close(); closeAvatarMenu(); closeMobileNav(); }
    });
  }

  renderPage("home");
  bindChrome();
})();

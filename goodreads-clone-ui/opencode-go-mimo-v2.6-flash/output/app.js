/* ============ Shelfmark — app (mocked, client-side routing) ============ */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const state = {
  shelf: "all",
  view: "grid",
  query: "",
  genre: "All",
  ratings: JSON.parse(localStorage.getItem("sm_ratings") || "{}"),
};

/* ---------- helpers ---------- */
function stars(r) {
  const full = Math.round(r);
  return "★".repeat(full) + "☆".repeat(5 - full);
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function cover(book, cls = "", withProgress = false) {
  const prog = withProgress && book.progress ? `<span class="prog"><i style="width:${book.progress}%"></i></span>` : "";
  return `<div class="cover ${cls}" style="--c1:${book.color[0]};--c2:${book.color[1]}">
    <span class="cover-title">${esc(book.title)}</span>
    <span class="cover-author">${esc(book.author)}</span>${prog}
  </div>`;
}
function bookCard(b) {
  return `<a class="book-card" href="#/book/${b.id}">
    ${cover(b, "", b.shelf === "reading")}
    <span class="bc-title">${esc(b.title)}</span>
    <span class="bc-sub">${esc(b.author)}</span>
  </a>`;
}
function shelfLabel(key) {
  const s = SHELVES.find((x) => x.key === key);
  return s ? s.label : key;
}
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 2400);
}
function byId(id) {
  return BOOKS.find((b) => b.id === id);
}
function ratingOf(book) {
  return state.ratings[book.id] ?? book.userRating;
}
function setRating(id, val) {
  state.ratings[id] = val;
  localStorage.setItem("sm_ratings", JSON.stringify(state.ratings));
}

/* ---------- views ---------- */
function viewHome() {
  const reading = BOOKS.filter((b) => b.shelf === "reading");
  const want = BOOKS.filter((b) => b.shelf === "want");
  const read = BOOKS.filter((b) => b.shelf === "read");
  const pct = Math.round((CHALLENGE.done / CHALLENGE.goal) * 100);

  return `
  <div class="page-head">
    <div>
      <h1>Good evening, Ada</h1>
      <div class="sub">You have ${reading.length} books on the go and ${want.length} waiting in the queue.</div>
    </div>
    <div class="btn-row">
      <a class="btn btn-primary" href="#/discover">Find a book</a>
      <a class="btn" href="#/my-books?shelf=want">Update shelves</a>
    </div>
  </div>

  <div class="home-grid">
    <div class="col-main">
      <section class="section">
        <div class="section-head"><h2>Currently reading</h2><a href="#/my-books?shelf=reading">View all</a></div>
        <div class="shelf-row">${reading.map(bookCard).join("")}</div>
      </section>

      <section class="section">
        <div class="section-head"><h2>Want to read</h2><a href="#/my-books?shelf=want">View all</a></div>
        <div class="shelf-row">${want.map(bookCard).join("")}</div>
      </section>

      <section class="section">
        <div class="section-head"><h2>Recommended for you</h2><a href="#/discover">More like these</a></div>
        <div class="shelf-row">${read.slice(0, 5).map(bookCard).join("")}</div>
      </section>

      <section class="section">
        <div class="section-head"><h2>Friends' latest reviews</h2><a href="#/friends">See all activity</a></div>
        <div class="card card-pad">
          ${REVIEWS.map(reviewCard).join("")}
        </div>
      </section>
    </div>

    <aside class="col-side">
      <section class="section">
        <div class="section-head"><h2>2026 Reading Challenge</h2></div>
        <div class="card card-pad challenge-card">
          <div class="ring" style="--p:${pct}">
            <div class="ring-inner"><div><b>${CHALLENGE.done}</b><span>of ${CHALLENGE.goal}</span></div></div>
          </div>
          <div class="challenge-body">
            <h3>${pct}% complete</h3>
            <div class="meter"><i style="width:${pct}%"></i></div>
            <div class="stat-row">
              <span><b>${CHALLENGE.goal - CHALLENGE.done}</b> to go</span>
              <span><b>${CHALLENGE.pages.toLocaleString()}</b> pages</span>
              <span><b>${CHALLENGE.avgRating}</b> avg</span>
            </div>
            <p style="margin-top:12px"><a class="btn btn-ghost" href="#/challenge" style="font-size:.85rem">Open challenge</a></p>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-head"><h2>Friend activity</h2><a href="#/friends">All</a></div>
        <div class="card card-pad">
          <div class="feed">${ACTIVITY.map(feedItem).join("")}</div>
        </div>
      </section>

      <section class="section">
        <div class="section-head"><h2>Quote of the day</h2></div>
        <div class="card card-pad">
          <p style="font-family:Georgia,serif;font-size:1.05rem;font-style:italic;margin-bottom:8px">“${QUOTES[0].text}”</p>
          <div class="muted" style="font-size:.83rem">— ${QUOTES[0].book} · liked by ${QUOTES[0].likes} people</div>
        </div>
      </section>
    </aside>
  </div>`;
}

function feedItem(a) {
  const f = FRIENDS[a.friend];
  const b = BOOKS.find((x) => x.title === a.book) || BOOKS[0];
  return `<div class="feed-item">
    <span class="ava-sm" style="background:${f.color}">${f.initials}</span>
    <div style="min-width:0">
      <div class="feed-text"><b>${esc(f.name)}</b> ${esc(a.verb)} <b>${esc(a.book)}</b>${a.extra ? ` <span class="muted">· ${esc(a.extra)}</span>` : ""}</div>
      <a class="feed-mini" href="#/book/${b.id}">${cover(b, "sm")}<span class="feed-ago">${a.ago} ago</span></a>
    </div>
  </div>`;
}

function reviewCard(r) {
  const b = BOOKS.find((x) => x.title === r.book) || BOOKS[0];
  return `<article class="review">
    <div class="review-head">
      <span class="ava-sm" style="background:${r.user.color}">${r.user.initials}</span>
      <div class="rh-main">
        <div class="rh-name">${esc(r.user.name)}</div>
        <div class="rh-sub">reviewed <a href="#/book/${b.id}" style="color:var(--accent)">${esc(r.book)}</a> · ${r.ago}</div>
      </div>
      <span class="stars"><span class="glyphs">${stars(r.rating)}</span></span>
    </div>
    <p>${esc(r.body)}</p>
    <div class="review-actions">
      <button data-like>${r.likes} likes</button>
      <button>Comment</button>
      <button>Share</button>
    </div>
  </article>`;
}

function shelfBooks(key) {
  if (key === "favorites") return BOOKS.filter((b) => ratingOf(b) === 5);
  if (key === "all") return BOOKS;
  return BOOKS.filter((b) => b.shelf === key);
}

function viewMyBooks(query) {
  state.shelf = query.get("shelf") || "all";
  const counts = SHELVES.reduce((acc, s) => ((acc[s.key] = shelfBooks(s.key).length), acc), {});
  const list = shelfBooks(state.shelf).filter((b) => {
    const q = state.query.trim().toLowerCase();
    return !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
  });

  const tabs = [{ key: "all", label: "All books" }, ...SHELVES]
    .map(
      (s) => `<button class="shelf-tab ${state.shelf === s.key ? "active" : ""}" data-shelf="${s.key}">
        ${s.label}<span class="count">${s.key === "all" ? BOOKS.length : counts[s.key]}</span></button>`
    )
    .join("");

  return `
  <div class="page-head">
    <div><h1>My Books</h1><div class="sub">${BOOKS.length} books across ${SHELVES.length + 1} shelves</div></div>
    <div class="btn-row">
      <div class="view-toggle">
        <button data-view="grid" class="${state.view === "grid" ? "active" : ""}">Grid</button>
        <button data-view="list" class="${state.view === "list" ? "active" : ""}">List</button>
      </div>
      <button class="btn btn-primary" id="addBook">+ Add a book</button>
    </div>
  </div>

  <div class="shelf-tabs" role="tablist">${tabs}</div>

  <div class="toolbar">
    <div class="grow"><input class="input" id="shelfFilter" placeholder="Filter these books…" value="${esc(state.query)}" /></div>
    <select class="select" id="sortSel">
      <option>Title A–Z</option><option>Author</option><option>Rating</option><option>Recently added</option>
    </select>
    <span class="muted" style="font-size:.85rem">${list.length} shown</span>
  </div>

  ${
    list.length === 0
      ? `<div class="empty"><b>Nothing on this shelf yet.</b>Try a different shelf or clear the filter.</div>`
      : state.view === "grid"
      ? `<div class="book-grid">${list.map(bookCard).join("")}</div>`
      : `<div class="list-view">${list.map(bookRow).join("")}</div>`
  }`;
}

function bookRow(b) {
  const r = ratingOf(b);
  return `<div class="book-row">
    <a href="#/book/${b.id}">${cover(b)}</a>
    <div class="row-main">
      <a class="row-title" href="#/book/${b.id}">${esc(b.title)}</a>
      <div class="row-author">${esc(b.author)} · ${b.year} · ${b.pages} pages</div>
      <span class="stars"><span class="glyphs">${stars(b.rating)}</span><span class="num">${b.rating.toFixed(2)}</span></span>
      ${r ? `<span class="stars" style="margin-left:10px"><span class="num">You: ${"★".repeat(r)}</span></span>` : ""}
      ${b.shelf === "reading" ? `<div class="meter" style="max-width:180px"><i style="width:${b.progress}%"></i></div>` : ""}
    </div>
    <div class="row-side">
      <div class="chip">${shelfLabel(b.shelf)}</div>
    </div>
    <div class="row-actions">
      <button class="btn" data-shelf-cycle="${b.id}" title="Move to next shelf">⇄</button>
    </div>
  </div>`;
}

function reviewsFor(b) {
  const exact = REVIEWS.filter((r) => r.book === b.title);
  const pool = [
    `Exactly the kind of book I want to hand to someone and say “just trust me”. ${b.author} makes the ${b.genres[0].toLowerCase()} bits feel inevitable.`,
    `Took me a few chapters to settle in, then I read the last hundred pages in one sitting. ${b.pages} pages and none of them wasted.`,
    `Not perfect — the middle drags a little — but the ending earns it. ${b.rating.toFixed(2)} stars feels right for this one.`,
    `Read this in a single weekend with the phone face-down. The kind of book that quietly rearranges your shelf.`,
  ];
  const generated = FRIENDS.slice(0, 3).map((f, i) => ({
    user: { name: f.name, initials: f.initials, color: f.color },
    book: b.title,
    rating: [5, 4, 4][i],
    ago: `${i + 1} week${i ? "s" : ""} ago`,
    likes: [19, 7, 12][i],
    body: pool[i],
  }));
  return [...exact, ...generated].slice(0, 3);
}

function viewBook(id) {
  const b = byId(id);
  if (!b) return `<div class="empty"><b>Book not found.</b><a href="#/home">Back home</a></div>`;
  const mine = ratingOf(b);
  const similar = BOOKS.filter((x) => x.id !== b.id && x.genres.some((g) => b.genres.includes(g))).slice(0, 6);

  return `
  <a class="muted" href="#/my-books" style="font-size:.87rem">← Back to My Books</a>
  <div class="detail" style="margin-top:16px">
    <div>
      <div class="detail-hero">
        ${cover(b, "lg")}
        <div class="detail-info">
          <h1>${esc(b.title)}</h1>
          <div class="by">by <a href="#/discover">${esc(b.author)}</a> · ${b.year}</div>
          <div class="meta-chips">
            ${b.genres.map((g) => `<span class="chip">${esc(g)}</span>`).join("")}
            <span class="chip">${b.pages} pages</span>
            <span class="chip">${shelfLabel(b.shelf)}</span>
          </div>

          <div class="rating-strip">
            <div class="rs"><b>${b.rating.toFixed(2)}</b><span>${stars(b.rating)}</span></div>
            <div class="rs"><b>${b.ratings.toLocaleString()}</b><span>ratings</span></div>
            <div class="rs"><b>${b.reviews.toLocaleString()}</b><span>reviews</span></div>
            <div class="rs"><b>${b.friendsRating.toFixed(1)}</b><span>friends</span></div>
          </div>

          <div class="my-rating">
            <span class="panel-title" style="margin:0">Your rating</span>
            <span class="rate-stars" id="rateStars" data-book="${b.id}">
              ${[1, 2, 3, 4, 5].map((n) => `<button class="${n <= mine ? "on" : ""}" data-n="${n}" aria-label="${n} star${n > 1 ? "s" : ""}">★</button>`).join("")}
            </span>
            <span class="muted" style="font-size:.85rem" id="rateLabel">${mine ? `You rated it ${mine}/5` : "Not rated yet"}</span>
          </div>

          <div class="btn-row">
            <button class="btn btn-primary" data-shelf-cycle="${b.id}">Move to ${nextShelfLabel(b.shelf)}</button>
            <button class="btn" id="writeReview">Write a review</button>
            <button class="btn btn-ghost" id="quoteBtn">Share a quote</button>
          </div>
        </div>
      </div>

      <section class="section">
        <div class="section-head"><h2>About</h2></div>
        <p style="color:var(--ink-2)">${esc(b.description)}</p>
      </section>

      <section class="section">
        <div class="section-head"><h2>Ratings &amp; reviews</h2><a href="#/friends">All ${b.reviews.toLocaleString()}</a></div>
        <div class="card card-pad">${reviewsFor(b).map(reviewCard).join("")}</div>
      </section>

      <section class="section">
        <div class="section-head"><h2>Readers also enjoyed</h2></div>
        <div class="book-grid">${similar.map(bookCard).join("")}</div>
      </section>
    </div>

    <aside class="card card-pad">
      <div class="panel-title">Your shelf</div>
      <p style="margin-top:0"><b>${shelfLabel(b.shelf)}</b></p>
      ${b.shelf === "reading" ? `<div class="meter"><i style="width:${b.progress}%"></i></div><div class="muted" style="font-size:.83rem">${b.progress}% · ~${Math.round((b.pages * (100 - b.progress)) / 100 / 30)} days left at your pace</div>` : ""}

      <div class="panel-title" style="margin-top:20px">Book details</div>
      <ul style="list-style:none;padding:0;margin:0;font-size:.88rem;display:grid;gap:8px">
        <li><span class="muted">Title</span><br>${esc(b.title)}</li>
        <li><span class="muted">Author</span><br>${esc(b.author)}</li>
        <li><span class="muted">Published</span><br>${b.year}</li>
        <li><span class="muted">Pages</span><br>${b.pages}</li>
        <li><span class="muted">ISBN</span><br>978-1-${(1000000 + b.title.length * 9137)}</li>
      </ul>

      <div class="panel-title" style="margin-top:20px">Add tags</div>
      <input class="input" placeholder="e.g. bookclub, reread" id="tagInput" />
      <div class="genres" id="tagList" style="margin-top:8px"></div>
    </aside>
  </div>`;
}

function nextShelfLabel(key) {
  const order = ["want", "reading", "read"];
  const i = order.indexOf(key);
  return shelfLabel(order[(i + 1) % order.length]);
}

function viewDiscover() {
  const genres = ["All", ...new Set(BOOKS.flatMap((b) => b.genres))];
  const list =
    state.genre === "All" ? BOOKS : BOOKS.filter((b) => b.genres.includes(state.genre));
  const top = [...BOOKS].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const popular = [...BOOKS].sort((a, b) => b.ratings - a.ratings).slice(0, 5);

  return `
  <div class="page-head">
    <div><h1>Discover</h1><div class="sub">Browse the catalog, or let the recommender pick for you.</div></div>
    <button class="btn btn-primary" id="surprise">Surprise me</button>
  </div>

  <div class="discover-grid">
    <aside class="filters">
      <div class="card card-pad filter-card">
        <div class="panel-title">Genres</div>
        <div class="genres">
          ${genres.map((g) => `<button class="genre-pill ${state.genre === g ? "active" : ""}" data-genre="${esc(g)}">${esc(g)}</button>`).join("")}
        </div>
        <div class="panel-title" style="margin-top:6px">Average rating</div>
        <input type="range" min="3" max="5" step="0.1" value="3.5" class="input" style="padding:0" />
        <div class="panel-title">Release year</div>
        <select class="select" style="width:100%"><option>Any year</option><option>2020s</option><option>2010s</option><option>Before 2010</option></select>
        <div class="panel-title">Format</div>
        <div class="genres">
          <button class="genre-pill active">All</button><button class="genre-pill">eBook</button><button class="genre-pill">Print</button><button class="genre-pill">Audio</button>
        </div>
      </div>
    </aside>

    <div>
      <section class="section" style="margin-top:0">
        <div class="section-head"><h2>${state.genre === "All" ? "Browse all" : esc(state.genre)}</h2><span class="muted" style="font-size:.85rem">${list.length} books</span></div>
        ${
          list.length
            ? `<div class="book-list-grid">${list.map(bookCard).join("")}</div>`
            : `<div class="empty"><b>No books in this genre yet.</b>Import a catalog from Settings → Sources.</div>`
        }
      </section>

      <section class="section">
        <div class="section-head"><h2>Highest rated</h2></div>
        <div class="rank-list">${top.map((b, i) => rankCard(b, i + 1)).join("")}</div>
      </section>

      <section class="section">
        <div class="section-head"><h2>Most popular</h2></div>
        <div class="rank-list">${popular.map((b, i) => rankCard(b, i + 1)).join("")}</div>
      </section>
    </div>
  </div>`;
}

function rankCard(b, n) {
  return `<a class="rank-card" href="#/book/${b.id}">
    <span class="rank-num">${n}</span>
    ${cover(b, "sm")}
    <div class="rank-body">
      <div class="rt">${esc(b.title)}</div>
      <div class="ra">${esc(b.author)} · ${b.rating.toFixed(2)} ★ · ${b.ratings.toLocaleString()} ratings</div>
    </div>
  </a>`;
}

function viewFriends() {
  return `
  <div class="page-head">
    <div><h1>Friends</h1><div class="sub">What the people on your instance are reading.</div></div>
    <button class="btn btn-primary" id="inviteBtn">Invite a friend</button>
  </div>

  <section class="section" style="margin-top:0">
    <div class="friends-grid">
      ${FRIENDS.map(
        (f) => `<div class="card friend-card">
          <span class="ava-lg" style="background:${f.color}">${f.initials}</span>
          <div style="min-width:0">
            <div class="fc-name">${esc(f.name)}</div>
            <div class="fc-sub">${f.handle} · ${f.books} books read</div>
          </div>
          <button class="btn" data-follow>Follow</button>
        </div>`
      ).join("")}
    </div>
  </section>

  <section class="section">
    <div class="section-head"><h2>Recent activity</h2></div>
    <div class="card card-pad"><div class="feed">${ACTIVITY.map(feedItem).join("")}</div></div>
  </section>

  <section class="section">
    <div class="section-head"><h2>Latest reviews</h2></div>
    <div class="card card-pad">${REVIEWS.map(reviewCard).join("")}</div>
  </section>`;
}

function viewChallenge() {
  const pct = Math.round((CHALLENGE.done / CHALLENGE.goal) * 100);
  const max = Math.max(...CHALLENGE.monthly);
  return `
  <div class="page-head">
    <div><h1>2026 Reading Challenge</h1><div class="sub">Your goal, progress and stats for the year.</div></div>
    <button class="btn" id="editGoal">Edit goal</button>
  </div>

  <div class="card card-pad challenge-card">
    <div class="ring" style="--p:${pct};width:120px;height:120px">
      <div class="ring-inner" style="width:92px;height:92px"><div><b style="font-size:1.6rem">${pct}%</b><span>complete</span></div></div>
    </div>
    <div class="challenge-body">
      <h3>${CHALLENGE.done} of ${CHALLENGE.goal} books read</h3>
      <div class="meter" style="height:12px"><i style="width:${pct}%"></i></div>
      <div class="stat-row">
        <span><b>${CHALLENGE.goal - CHALLENGE.done}</b> books to go</span>
        <span>You're <b>3 ahead</b> of schedule</span>
        <span>Finish by <b>Dec 31</b></span>
      </div>
    </div>
  </div>

  <section class="section">
    <div class="section-head"><h2>Books per month</h2></div>
    <div class="card card-pad">
      <div class="bar-chart">
        ${CHALLENGE.monthly.map(
          (v, i) => `<div class="bar">
            <div class="bar-fill"><i class="${v === 0 ? "zero" : ""}" style="--h:${max ? (v / max) * 100 : 0}%" title="${v} books"></i></div>
            <span>${CHALLENGE.months[i]}</span>
          </div>`
        ).join("")}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="section-head"><h2>Year stats</h2></div>
    <div class="stat-cards">
      <div class="card stat-card"><b>${CHALLENGE.done}</b><span>Books finished</span></div>
      <div class="card stat-card"><b>${CHALLENGE.pages.toLocaleString()}</b><span>Pages read</span></div>
      <div class="card stat-card"><b>${CHALLENGE.avgRating}</b><span>Avg rating</span></div>
      <div class="card stat-card"><b>${READING_STATUS.reviews}</b><span>Reviews written</span></div>
      <div class="card stat-card"><b>${CHALLENGE.topGenre}</b><span>Top genre</span></div>
      <div class="card stat-card"><b>${CHALLENGE.fastest.days}d</b><span>Fastest read</span></div>
    </div>
  </section>

  <section class="section">
    <div class="section-head"><h2>Finished this year</h2><a href="#/my-books?shelf=read">View shelf</a></div>
    <div class="shelf-row">${BOOKS.filter((b) => b.shelf === "read").map(bookCard).join("")}</div>
  </section>`;
}

function viewProfile() {
  const read = BOOKS.filter((b) => b.shelf === "read");
  return `
  <div class="card profile-hero">
    <div class="ava-xl">AW</div>
    <div style="flex:1;min-width:220px">
      <h1>Ada Whitfield</h1>
      <div class="muted">@ada · joined 2024 · Helsinki, FI</div>
      <p style="margin-top:10px;margin-bottom:0;font-size:.95rem">Slow reader of speculative fiction, occasional re-reader of Miller. Currently somewhere in the middle of Kvothe.</p>
    </div>
    <div class="btn-row"><button class="btn">Edit profile</button><button class="btn btn-ghost" id="themeToggle2">Toggle theme</button></div>
  </div>

  <section class="section">
    <div class="stat-cards">
      <div class="card stat-card"><b>${read.length}</b><span>Books read</span></div>
      <div class="card stat-card"><b>${READING_STATUS.reviews}</b><span>Reviews</span></div>
      <div class="card stat-card"><b>${FRIENDS.length}</b><span>Friends</span></div>
      <div class="card stat-card"><b>${READING_STATUS.quoteShares}</b><span>Quotes shared</span></div>
    </div>
  </section>

  <div class="home-grid">
    <div class="col-main">
      <section class="section" style="margin-top:0">
        <div class="section-head"><h2>Favorites</h2></div>
        <div class="shelf-row">${read.filter((b) => ratingOf(b) === 5).map(bookCard).join("") || `<div class="empty" style="width:100%"><b>Rate some books 5 stars.</b>They'll show up here.</div>`}</div>
      </section>
      <section class="section">
        <div class="section-head"><h2>Your recent reviews</h2></div>
        <div class="card card-pad">${REVIEWS.slice(0, 2).map(reviewCard).join("")}</div>
      </section>
    </div>
    <aside class="col-side">
      <section class="section" style="margin-top:0">
        <div class="section-head"><h2>Favorite genres</h2></div>
        <div class="card card-pad genres">
          ${["Fantasy", "Science Fiction", "Literary", "Historical", "Memoir"].map((g) => `<span class="genre-pill active">${g}</span>`).join("")}
        </div>
      </section>
      <section class="section">
        <div class="section-head"><h2>Badges</h2></div>
        <div class="card card-pad">
          <div class="genres">
            <span class="chip">🏆 Challenge climber</span>
            <span class="chip">📚 100+ ratings</span>
            <span class="chip">🔥 12-week streak</span>
          </div>
        </div>
      </section>
    </aside>
  </div>`;
}

/* ---------- router ---------- */
const routes = {
  home: viewHome,
  "my-books": viewMyBooks,
  discover: viewDiscover,
  friends: viewFriends,
  challenge: viewChallenge,
  profile: viewProfile,
};

function render() {
  const hash = location.hash.replace(/^#\/?/, "") || "home";
  const [path, qs] = hash.split("?");
  const [head, param] = path.split("/");
  const main = $("#main");

  let html;
  if (head === "book" && param) html = viewBook(param);
  else if (head === "my-books") html = viewMyBooks(new URLSearchParams(qs || ""));
  else if (routes[head]) html = routes[head]();
  else html = viewHome();

  main.innerHTML = html;

  $$(".primary-nav a, .mobile-menu a").forEach((a) =>
    a.classList.toggle("active", a.dataset.nav === head || (head === "book" && a.dataset.nav === "my-books"))
  );

  closeMenu();
  window.scrollTo({ top: 0, behavior: "instant" });
  bindView();
}

/* ---------- per-view bindings ---------- */
function bindView() {
  $$(".shelf-tab").forEach((t) =>
    t.addEventListener("click", () => {
      state.shelf = t.dataset.shelf;
      location.hash = `#/my-books?shelf=${state.shelf}`;
      render();
    })
  );

  $$(".view-toggle button").forEach((b) =>
    b.addEventListener("click", () => {
      state.view = b.dataset.view;
      render();
    })
  );

  const filter = $("#shelfFilter");
  if (filter) {
    filter.addEventListener("input", () => {
      state.query = filter.value;
      const pos = filter.selectionStart;
      render();
      const f = $("#shelfFilter");
      if (f) {
        f.focus();
        f.setSelectionRange(pos, pos);
      }
    });
  }

  $$("[data-shelf-cycle]").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const book = byId(btn.dataset.shelfCycle);
      const order = ["want", "reading", "read"];
      const i = order.indexOf(book.shelf);
      book.shelf = order[(i + 1) % order.length];
      book.progress = book.shelf === "reading" ? 10 : book.shelf === "read" ? 100 : 0;
      toast(`“${book.title}” moved to ${shelfLabel(book.shelf)}`);
      render();
    })
  );

  $$(".genre-pill[data-genre]").forEach((p) =>
    p.addEventListener("click", () => {
      state.genre = p.dataset.genre;
      render();
    })
  );

  $$(".rate-stars button").forEach((btn) =>
    btn.addEventListener("click", () => {
      const n = +btn.dataset.n;
      const id = $("#rateStars").dataset.book;
      setRating(id, n);
      $$(".rate-stars button").forEach((b) => b.classList.toggle("on", +b.dataset.n <= n));
      $("#rateLabel").textContent = `You rated it ${n}/5`;
      toast(`Rated ${n} star${n > 1 ? "s" : ""} — synced to your profile`);
    })
  );

  $$(".rate-stars button").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      $$(".rate-stars button").forEach((b) => b.classList.toggle("hover", +b.dataset.n <= +btn.dataset.n));
    });
    btn.addEventListener("mouseleave", () => $$(".rate-stars button").forEach((b) => b.classList.remove("hover")));
  });

  $$("[data-like]").forEach((b) =>
    b.addEventListener("click", () => {
      b.textContent = `${parseInt(b.textContent) + (b.dataset.on ? -1 : 1)} likes`;
      b.dataset.on = b.dataset.on ? "" : "1";
      b.style.color = b.dataset.on ? "var(--accent)" : "";
    })
  );

  $$("[data-follow]").forEach((b) =>
    b.addEventListener("click", () => {
      const on = b.textContent.trim() === "Follow";
      b.textContent = on ? "Following" : "Follow";
      b.classList.toggle("btn-primary", on);
    })
  );

  const tagInput = $("#tagInput");
  if (tagInput) {
    tagInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && tagInput.value.trim()) {
        const s = document.createElement("span");
        s.className = "chip";
        s.textContent = tagInput.value.trim();
        $("#tagList").appendChild(s);
        tagInput.value = "";
      }
    });
  }

  const oneOff = {
    addBook: "Opening the add-book dialog (mocked)…",
    writeReview: "Review composer coming soon (mocked).",
    quoteBtn: "Quote picker coming soon (mocked).",
    surprise: null,
    inviteBtn: "Invite link copied (mocked).",
    editGoal: "Goal editor coming soon (mocked).",
  };
  Object.entries(oneOff).forEach(([id, msg]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("click", () => {
      if (id === "surprise") {
        const b = BOOKS[Math.floor(Math.random() * BOOKS.length)];
        location.hash = `#/book/${b.id}`;
        toast(`The recommender picked “${b.title}”`);
      } else toast(msg);
    });
  });
}

/* ---------- header behaviour ---------- */
function closeMenu() {
  $("#mobileMenu").hidden = true;
  $("#menuToggle").setAttribute("aria-expanded", "false");
}
function closeSearch() {
  $("#searchBar").hidden = true;
  $("#searchToggle").setAttribute("aria-expanded", "false");
  $("#searchResults").innerHTML = "";
}

$("#menuToggle").addEventListener("click", () => {
  const menu = $("#mobileMenu");
  menu.hidden = !menu.hidden;
  $("#menuToggle").setAttribute("aria-expanded", String(!menu.hidden));
  if (!menu.hidden) closeSearch();
});

$("#searchToggle").addEventListener("click", () => {
  const bar = $("#searchBar");
  bar.hidden = !bar.hidden;
  $("#searchToggle").setAttribute("aria-expanded", String(!bar.hidden));
  if (!bar.hidden) {
    closeMenu();
    $("#searchInput").focus();
  }
});
$("#searchClose").addEventListener("click", closeSearch);

$("#searchInput").addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  const box = $("#searchResults");
  if (!q) return (box.innerHTML = "");
  const hits = BOOKS.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.genres.some((g) => g.toLowerCase().includes(q))
  ).slice(0, 7);
  box.innerHTML = hits.length
    ? hits
        .map(
          (b) => `<a class="sr-item" href="#/book/${b.id}">
            ${cover(b, "sm")}
            <span class="sr-meta">
              <span class="sr-title">${esc(b.title)}</span>
              <span class="sr-sub">${esc(b.author)} · ${b.year} · ${b.rating.toFixed(2)} ★</span>
            </span>
          </a>`
        )
        .join("")
    : `<div class="sr-empty">No matches for “${esc(e.target.value)}”.</div>`;
});

$("#searchResults").addEventListener("click", (e) => {
  if (e.target.closest("a")) closeSearch();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "/" && !/input|textarea|select/i.test(document.activeElement.tagName)) {
    e.preventDefault();
    $("#searchBar").hidden = false;
    $("#searchToggle").setAttribute("aria-expanded", "true");
    $("#searchInput").focus();
  }
  if (e.key === "Escape") {
    closeSearch();
    closeMenu();
  }
});

/* theme */
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  localStorage.setItem("sm_theme", t);
}
function toggleTheme() {
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  toast(`Switched to ${document.documentElement.dataset.theme} mode`);
}
applyTheme(localStorage.getItem("sm_theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
$("#themeToggle").addEventListener("click", toggleTheme);
document.addEventListener("click", (e) => {
  if (e.target.id === "themeToggle2") toggleTheme();
});

$("#notifBtn").addEventListener("click", () => toast("3 new friend reviews (mocked)"));

window.addEventListener("hashchange", render);
render();

/* ==========================================================================
   Shelfie — views: one render function per route
   Each view returns { title, html, mount?(root) }
   ========================================================================== */
(function (global) {
  'use strict';

  const { esc, icon, cover, stars, avatar, timeAgo, dayLabel, longDate, num } = UI;
  const SHELF_SHORT = { want: 'Want to Read', reading: 'Reading', read: 'Read', owned: 'Owned', tobuy: 'To buy' };
  const SORTS = [
    { id: 'relevance', label: 'Best match' },
    { id: 'rating', label: 'Highest rated' },
    { id: 'ratings', label: 'Most rated' },
    { id: 'newest', label: 'Newest first' },
    { id: 'title', label: 'A–Z' }
  ];
  const LIB_SORTS = [
    { id: 'added', label: 'Recently added' },
    { id: 'title', label: 'Title A–Z' },
    { id: 'author', label: 'Author A–Z' },
    { id: 'rating', label: 'My rating' },
    { id: 'pages', label: 'Page count' }
  ];

  /* view-local UI state that should survive a re-render */
  let feedScope = 'friends';
  let reviewSort = 'recent';

  /* ------------------------------------------------------------ fragments */

  function bookCard(book) {
    const shelfId = Store.shelfOf(book.id);
    const shelf = shelfId ? DB.shelf(shelfId) : null;
    const mine = Store.rating(book.id);
    const shown = mine != null ? mine : book.rating;
    return `<a class="book-card" href="#/book/${book.id}">
      <span class="book-card__art">
        ${cover(book)}
        ${shelf ? `<span class="book-card__shelf">${icon(shelf.icon)}${esc(SHELF_SHORT[shelf.id] || shelf.name)}</span>` : ''}
      </span>
      <span class="book-card__meta">
        <span class="book-card__title">${esc(book.title)}</span>
        <span class="book-card__author">${esc(book.author)}</span>
        <span class="book-card__rating">${stars(shown, { size: 'sm', label: `${shown} stars` })}<b>${shown.toFixed(2).replace(/\.00$/, '')}</b></span>
      </span>
    </a>`;
  }

  function bookGrid(books) {
    return `<div class="grid-books">${books.map(bookCard).join('')}</div>`;
  }

  function rail(books, label) {
    return `<div class="rail"><div class="rail__track">${books.map(bookCard).join('')}</div></div>`;
  }

  function reviewCard(review, opts = {}) {
    const user = DB.user(review.userId);
    const book = DB.book(review.bookId);
    const liked = Store.isLiked(review.id);
    const likes = Store.likeCount(review);
    const comments = Store.commentsWithMine(review);
    const long = (review.text || '').length > 340;
    return `<article class="review${opts.inline ? ' review--inline' : ''}" data-review="${review.id}" data-book="${review.bookId}">
      ${avatar(user, opts.inline ? 'sm' : '')}
      <div class="grow">
        <header class="review__head">
          <a href="#/profile/${user.id}"><b>${esc(user.name)}</b></a>
          <span class="muted">rated</span>
          ${stars(review.rating, { size: 'sm' })}
          ${review.rating ? `<span class="muted" style="font-size:.8rem">${review.rating.toFixed(1).replace(/\.0$/, '')}</span>` : ''}
          <span class="review__time muted" style="font-size:.78rem">· ${timeAgo(review.date)}</span>
        </header>

        ${opts.hideBook ? '' : `<a class="review__book" href="#/book/${book.id}">
          <span class="cover-wrap">${cover(book)}</span>
          <span class="grow">
            <span class="review__book-title">${esc(book.title)}</span>
            <span class="review__book-author">${esc(book.author)}</span>
          </span>
        </a>`}

        ${review.quote ? `<blockquote class="review__quote">“${esc(review.quote)}”</blockquote>` : ''}

        ${review.spoiler && !opts.revealSpoiler
          ? `<div class="review__spoiler">This review contains spoilers.
               <button class="btn btn--sm" type="button" data-action="reveal-spoiler">Show anyway</button>
             </div>`
          : `<div class="review__text${long ? ' is-clamped' : ''}">${(review.text || '').split(/\n{2,}/).map((p) => `<p>${esc(p)}</p>`).join('')}</div>
             ${long ? `<button class="btn btn--sm btn--ghost" type="button" data-action="expand-review" style="margin-top:8px">Read more</button>` : ''}`}

        <div class="review__actions">
          <button class="review__action" type="button" data-action="like" data-on="${liked ? 1 : 0}">
            ${icon('heart')}<span data-like-count>${likes}</span>
          </button>
          <button class="review__action review__action--comment" type="button" data-action="comment" data-on="${comments.length ? 1 : 0}">
            ${icon('comment')}<span>${comments.length || 'Comment'}</span>
          </button>
          <button class="review__action" type="button" data-action="share">${icon('share')}<span>Share</span></button>
        </div>

        <div class="review__comments" data-comments ${comments.length ? '' : 'hidden'}>
          ${comments.map((c) => {
            const cu = DB.user(c.userId);
            return `<div class="comment">
              ${avatar(cu, 'sm')}
              <div>
                <span class="comment__name">${esc(cu.name)}</span>
                <span class="comment__text">${esc(c.text)}</span>
                <div class="comment__time">${timeAgo(c.date)}</div>
              </div>
            </div>`;
          }).join('')}
          <form class="comment-form" data-comment-form>
            ${avatar(DB.user(DB.ME), 'sm')}
            <input class="input" name="text" placeholder="Write a comment…" aria-label="Write a comment" autocomplete="off">
            <button class="btn btn--sm btn--primary" type="submit">Post</button>
          </form>
        </div>
      </div>
    </article>`;
  }

  function feedItem(item) {
    const user = DB.user(item.userId);
    const book = DB.book(item.bookId);
    const review = item.reviewId ? DB.review(item.reviewId) : null;
    const shelf = item.shelf ? DB.shelf(item.shelf) : null;
    const verbs = {
      review: 'reviewed', rate: 'rated', shelve: 'put on their <b>Want to Read</b> shelf',
      start: 'started reading', finish: 'finished'
    };
    const verbHtml = item.type === 'shelve' && shelf
      ? `added <b>${esc(book.title)}</b> to their <b>${esc(shelf.name)}</b> shelf`
      : `${verbs[item.type] || 'looked at'} <a href="#/book/${book.id}"><b>${esc(book.title)}</b></a>`;

    return `<div class="feed__item" data-feed="${item.id}" data-book="${book.id}">
      <a href="#/profile/${user.id}" aria-label="${esc(user.name)}">${avatar(user)}</a>
      <a class="feed__cover" href="#/book/${book.id}" aria-hidden="true" tabindex="-1">${cover(book)}</a>
      <div class="grow">
        <p class="feed__verb"><b><a href="#/profile/${user.id}">${esc(user.name)}</a></b> ${verbHtml} · <span class="feed__time">${timeAgo(item.date)}</span></p>
        ${review ? `<div class="row" style="gap:6px;margin-top:4px">${stars(review.rating, { size: 'sm' })}</div>
          ${review.text ? `<p class="feed__excerpt clamp-2">${esc(review.text.split(/\n{2,}/)[0])}</p>` : ''}` : ''}
        ${item.type === 'rate' ? `<div class="row" style="gap:6px;margin-top:4px">${stars(item.rating, { size: 'sm' })}</div>` : ''}
        <div class="feed__actions row" style="gap:6px">
          ${Store.shelfOf(book.id)
            ? `<span class="badge badge--green">${icon('check')}${esc(SHELF_SHORT[Store.shelfOf(book.id)] || '')}</span>`
            : `<button class="btn btn--sm" type="button" data-action="shelf-quick" data-book="${book.id}">${icon('plus')}Want to Read</button>`}
        </div>
      </div>
    </div>`;
  }

  function similarTo(bookId, n = 12) {
    const seed = DB.book(bookId);
    if (!seed) return [];
    return DB.BOOKS
      .filter((b) => b.id !== bookId)
      .map((b) => ({ b, s: b.genres.filter((g) => seed.genres.includes(g)).length }))
      .filter((x) => x.s > 0)
      .sort((x, y) => y.s - x.s || y.b.rating - x.b.rating)
      .slice(0, n)
      .map((x) => x.b);
  }

  function statCard(label, value, foot) {
    return `<div class="stat">
      <div class="stat__label">${esc(label)}</div>
      <div class="stat__value">${esc(value)}</div>
      ${foot ? `<div class="stat__foot">${esc(foot)}</div>` : ''}
    </div>`;
  }

  function sortReviews(list, mode) {
    const copy = list.slice();
    if (mode === 'helpful') copy.sort((a, b) => Store.likeCount(b) - Store.likeCount(a) || +new Date(b.date) - +new Date(a.date));
    else if (mode === 'rating') copy.sort((a, b) => (b.rating || 0) - (a.rating || 0) || +new Date(b.date) - +new Date(a.date));
    else copy.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    return copy;
  }

  function sectionHead(title, iconName, more) {
    return `<header class="section__head">
      <h2>${icon(iconName || 'book')}${esc(title)}</h2>
      ${more || ''}
    </header>`;
  }

  function shelvedByCard(book) {
    const n = Math.max(12, Math.round(book.ratings / 900));
    return `<a class="list-row" href="#/my-books?shelf=want">
      ${avatar({ name: DB.user(DB.ME).name, hue: DB.user(DB.ME).hue }, 'sm')}
      <span class="grow"><span class="user-chip__name">You</span><span class="user-chip__sub">want to read ${esc(book.title)}</span></span>
    </a>`;
  }

  /* =============================================================== HOME == */
  function home() {
    const me = DB.user(DB.ME);
    const reading = Store.sortedList('reading');
    const g = Store.goalProgress();
    const feed = DB.ACTIVITY.slice().sort((a, b) => +new Date(b.date) - +new Date(a.date));
    const following = new Set(Store.state.following);
    const fromFriends = feed.filter((a) => following.has(a.userId));
    const shown = feedScope === 'friends' ? (fromFriends.length ? fromFriends : feed) : feed;

    // group by day
    const groups = [];
    shown.forEach((item) => {
      const label = dayLabel(item.date);
      const last = groups[groups.length - 1];
      if (last && last.label === label) last.items.push(item);
      else groups.push({ label, items: [item] });
    });

    return {
      title: 'Home',
      html: `<div class="page">
        <header class="page__head">
          <div class="page__title">
            <h1>Good to see you, ${esc(me.name.split(' ')[0])}.</h1>
            <span class="badge badge--gold">${icon('target')}${g.read} of ${g.goal} books</span>
          </div>
          <p class="page__lede">Here's what your friends are reading this week, and what's next on your own shelf.</p>
        </header>

        <div class="split">
          <div class="grow">
            <section class="section" style="margin-top:0">
              ${sectionHead('Continue reading', 'book-open', `<a class="section__more" href="#/my-books?shelf=reading">All ${reading.length} books</a>`)}
              ${reading.length
                ? `<div class="grid-reading">${reading.map(({ book, entry }) => `
                    <div class="reading-card">
                      <a class="reading-card__art" href="#/book/${book.id}">${cover(book)}</a>
                      <div class="reading-card__body">
                        <a class="reading-card__title" href="#/book/${book.id}">${esc(book.title)}</a>
                        <span class="reading-card__author">${esc(book.author)}</span>
                        ${UI.progressBar(entry.progress || 0, true)}
                        <span class="reading-card__meta">
                          <span>${Math.round(((entry.progress || 0) / 100) * book.pages)} of ${book.pages} pages</span>
                          <button class="btn btn--sm" type="button" data-action="update-progress" data-book="${book.id}">Update</button>
                        </span>
                      </div>
                    </div>`).join('')}</div>`
                : UI.emptyState({ icon: 'book-open', title: 'No books in progress', body: 'Pick something from your want-to-read shelf to get started.', action: '<a class="btn btn--primary" href="#/my-books?shelf=want">Browse shelf</a>' })}
            </section>

            <section class="section">
              ${sectionHead('From your friends', 'users', `<div class="segmented" role="group" aria-label="Feed scope">
                <button class="segmented__btn" type="button" data-action="feed-scope" data-scope="friends" aria-pressed="${feedScope === 'friends'}">Friends</button>
                <button class="segmented__btn" type="button" data-action="feed-scope" data-scope="everyone" aria-pressed="${feedScope === 'everyone'}">Everyone</button>
              </div>`)}
              <div class="panel"><div class="panel__body" style="padding-block:6px">
                ${groups.map((grp) => `
                  <p class="feed__date-sep">${esc(grp.label)}</p>
                  <div class="feed">${grp.items.map(feedItem).join('')}</div>`).join('')}
              </div></div>
            </section>

            <section class="section">
              ${sectionHead('Popular right now', 'trending', `<a class="section__more" href="#/discover?sort=ratings">See all</a>`)}
              ${bookGrid(DB.popular(10))}
            </section>
          </div>

          <aside class="side-col">
            <div class="panel">
              <div class="panel__head"><h3>${icon('target')}Reading goal</h3><span class="badge" style="margin-left:auto">2026</span></div>
              <div class="panel__body" style="text-align:center">
                ${UI.ring(g.pct, { value: g.read, label: 'of ' + g.goal })}
                <p class="muted" style="margin-top:12px;font-size:.86rem">${g.goal - g.read > 0
                  ? `${g.goal - g.read} book${g.goal - g.read === 1 ? '' : 's'} to go — about ${Math.ceil((g.goal - g.read) * 2.5)} weeks at your pace.`
                  : 'Goal smashed. Anything else this year is a bonus.'}</p>
              </div>
              <div class="panel__foot">
                <a class="btn btn--sm btn--block" href="#/goal">${icon('chart')}Goal details</a>
              </div>
            </div>

            <div class="panel">
              <div class="panel__head"><h3>${icon('user')}Your year in books</h3></div>
              <div class="panel__body stack" style="--gap:12px">
                ${statCard('Books read', String(g.read), 'so far this year')}
                ${statCard('Pages read', num(Store.idsFor('read').reduce((sum, id) => sum + (DB.book(id).pages || 0), 0)), 'across finished books')}
                ${statCard('Reviews written', String(Store.countFor ? DB.reviewsByUser(DB.ME).length + Store.state.myReviews.length : 0), 'and counting')}
              </div>
            </div>

            <div class="panel">
              <div class="panel__head"><h3>${icon('users')}People to follow</h3></div>
              <div class="panel__body stack" style="--gap:2px">
                ${DB.friends().filter((u) => !Store.isFollowing(u.id)).slice(0, 3).map((u) => `
                  <div class="list-row">
                    ${avatar(u, 'sm')}
                    <span class="grow"><span class="user-chip__name">${esc(u.name)}</span><span class="user-chip__sub">@${esc(u.handle)}</span></span>
                    <button class="btn btn--sm" type="button" data-action="follow" data-user="${u.id}">Follow</button>
                  </div>`).join('') || '<p class="muted" style="font-size:.86rem">You follow everyone already.</p>'}
              </div>
            </div>
          </aside>
        </div>
      </div>`,

      mount(root) {
        wireShelfQuick(root);
        root.querySelectorAll('[data-action="feed-scope"]').forEach((btn) => {
          btn.addEventListener('click', () => {
            feedScope = btn.dataset.scope;
            App.rerender();
          });
        });
        root.querySelectorAll('[data-action="follow"]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const on = Store.toggleFollow(btn.dataset.user);
            btn.textContent = on ? 'Following' : 'Follow';
            btn.classList.toggle('btn--soft', on);
            UI.toast(on ? `Following ${DB.user(btn.dataset.user).name}` : `Unfollowed ${DB.user(btn.dataset.user).name}`, { kind: on ? 'ok' : 'warn' });
          });
        });
        root.querySelectorAll('[data-action="update-progress"]').forEach((btn) => {
          btn.addEventListener('click', () => openProgressDialog(btn.dataset.book, () => App.rerender()));
        });
      }
    };
  }

  /* =========================================================== DISCOVER == */
  function discover(p) {
    const q = p.get('q') || '';
    const genre = p.get('genre') || '';
    const sort = p.get('sort') || (q ? 'relevance' : 'ratings');
    const onShelf = p.get('shelf') === '1';

    let results = q ? DB.search(q) : DB.BOOKS.slice();
    if (genre) results = results.filter((b) => b.genres.includes(genre));
    if (onShelf) results = results.filter((b) => Store.shelfOf(b.id));

    const sorted = results.slice().sort({
      relevance: (a, b) => b.rating - a.rating,
      rating: (a, b) => b.rating - a.rating,
      ratings: (a, b) => b.ratings - a.ratings,
      newest: (a, b) => b.year - a.year,
      title: (a, b) => a.title.localeCompare(b.title)
    }[sort] || ((a, b) => 0));

    const heading = q ? `Results for “${esc(q)}”` : genre ? esc(genre) : 'Everything in the catalogue';

    return {
      title: 'Discover',
      html: `<div class="page">
        <section class="page-hero">
          <h1>Find your next book</h1>
          <p>${DB.BOOKS.length} titles in this demo library, searchable by title, author, genre, publisher or year.</p>
          <div class="page-hero__actions">
            <form class="hero-search" data-hero-search role="search">
              <input class="input" name="q" value="${esc(q)}" placeholder="Try “Le Guin”, “fantasy” or “1998”…" aria-label="Search the library" autocomplete="off">
              <button class="btn btn--primary" type="submit">${icon('search')}Search</button>
            </form>
            <button class="btn" type="button" data-action="surprise">${icon('sparkle')}Surprise me</button>
          </div>
        </section>

        <section class="section" style="margin-top:24px">
          <div class="toolbar">
            <div class="chip-row chip-row--scroll grow" role="group" aria-label="Filter by genre">
              <a class="chip" href="#/discover${q ? `?q=${encodeURIComponent(q)}` : ''}" aria-pressed="${!genre}">All</a>
              ${DB.GENRES.map((g) => `<a class="chip" href="#/discover?genre=${encodeURIComponent(g)}${q ? `&q=${encodeURIComponent(q)}` : ''}" aria-pressed="${genre === g}">${esc(g)}</a>`).join('')}
            </div>
          </div>

          <div class="toolbar">
            <h2 style="margin-right:auto">${heading} <span class="section__sub" style="font-weight:500">${sorted.length} book${sorted.length === 1 ? '' : 's'}</span></h2>
            <button class="chip" type="button" data-action="toggle-shelf-filter" aria-pressed="${onShelf}">${icon('layers')}On my shelves</button>
            <label class="sr-only" for="discoverSort">Sort results</label>
            <select class="select" id="discoverSort" data-action="discover-sort">
              ${SORTS.map((s) => `<option value="${s.id}" ${s.id === sort ? 'selected' : ''}>${s.label}</option>`).join('')}
            </select>
          </div>

          ${sorted.length
            ? bookGrid(sorted)
            : UI.emptyState({
                icon: 'search',
                title: 'Nothing matched that',
                body: 'Try a different spelling, or clear the filters to see the whole shelf.',
                action: '<a class="btn btn--primary" href="#/discover">Clear filters</a>'
              })}
        </section>

        <section class="section">
          ${sectionHead('Because you read Piranesi', 'sparkle', '<a class="section__more" href="#/book/b1">That book</a>')}
          ${rail(similarTo('b1', 10))}
        </section>

        <section class="section">
          ${sectionHead('Highest rated of all time', 'award')}
          ${rail(DB.topRated(10))}
        </section>
      </div>`,

      mount(root) {
        const form = root.querySelector('[data-hero-search]');
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const value = form.q.value.trim();
          UI.setHash(`#/discover${value ? `?q=${encodeURIComponent(value)}` : ''}`);
        });
        const sortSel = root.querySelector('[data-action="discover-sort"]');
        sortSel.addEventListener('change', () => {
          const next = new URLSearchParams(p);
          next.set('sort', sortSel.value);
          UI.setHash(`#/discover?${next.toString()}`);
        });
        root.querySelector('[data-action="toggle-shelf-filter"]').addEventListener('click', () => {
          const next = new URLSearchParams(p);
          next.set('shelf', onShelf ? '' : '1');
          next.delete('shelf');
          if (!onShelf) next.set('shelf', '1');
          UI.setHash(`#/discover?${next.toString()}`);
        });
        root.querySelector('[data-action="surprise"]').addEventListener('click', () => {
          const unseen = DB.BOOKS.filter((b) => !Store.shelfOf(b.id));
          const pick = unseen[Math.floor(Math.random() * unseen.length)] || DB.BOOKS[0];
          UI.setHash(`#/book/${pick.id}`);
          UI.toast('Here is a random book from the catalogue', { kind: 'ok' });
        });
      }
    };
  }

  /* ======================================================== BOOK DETAIL == */
  function bookDetail(id) {
    const book = DB.book(id);
    if (!book) return notFound();

    const shelfId = Store.shelfOf(id);
    const shelf = shelfId ? DB.shelf(shelfId) : null;
    const mine = Store.rating(id);
    const avg = Store.averageWithMine(id);
    const reviews = sortReviews(Store.reviewsFor(id), reviewSort);
    const dist = DB.distribution(id);
    const shelvedBy = Math.max(9, Math.round(book.ratings / 900));
    const alsoOn = DB.BOOKS.filter((b) => b.id !== id && b.genres.some((g) => book.genres.includes(g)))
      .sort((a, b) => b.rating - a.rating).slice(0, 10);

    return {
      title: `${book.title} — Shelfie`,
      html: `<div class="page">
        <a class="btn btn--sm btn--ghost" href="javascript:history.back()" style="margin-bottom:14px">${icon('arrow-left')}Back</a>

        <section class="book-hero">
          <div class="book-hero__art">${cover(book)}</div>
          <div>
            <p class="book-hero__kicker">
              <span>${esc(book.genres[0])}</span> ·
              <span>${book.year}</span> ·
              <span>${book.pages} pages</span>
            </p>
            <h1 class="book-hero__title">${esc(book.title)}</h1>
            <p class="book-hero__byline">by <a href="#/discover?q=${encodeURIComponent(book.author)}">${esc(book.author)}</a></p>

            <div class="book-hero__rating-row">
              <div class="book-hero__score">
                <b>${avg.toFixed(2).replace(/\.0$/, '')}</b>
                <span>${stars(avg, { label: `${avg} average` })}</span>
                <span>${num(book.ratings)} ratings</span>
              </div>
              <div class="grow">
                <p class="muted" style="font-size:.85rem;margin-bottom:6px">${mine != null
                  ? `Your rating: <b>${mine.toFixed(1).replace(/\.0$/, '')}</b>`
                  : 'Have you read it? Rate it below.'}</p>
                ${UI.starPickerHTML(mine || 0)}
                ${mine != null ? `<button class="btn btn--sm btn--ghost" type="button" data-action="clear-rating" style="margin-top:4px">Remove my rating</button>` : ''}
              </div>
            </div>

            <div class="book-hero__actions">
              <div class="shelf-picker">
                <button class="btn ${shelf ? 'btn--soft' : 'btn--primary'}" type="button" data-menu-trigger data-book="${book.id}">
                  ${icon(shelf ? shelf.icon : 'plus')}
                  ${shelf ? esc(shelf.name) : 'Add to shelf'}
                  ${icon('chevron-down')}
                </button>
              </div>
              <button class="btn" type="button" data-action="review" data-book="${book.id}">${icon('edit')}Write a review</button>
              <button class="btn" type="button" data-action="mark-read" data-book="${book.id}">${icon('check-circle')}Mark as read</button>
              <button class="btn" type="button" data-action="share-book" data-book="${book.id}" aria-label="Share this book">${icon('share')}</button>
            </div>

            <p class="book-hero__desc book-hero__desc--clamped" data-blurb>${esc(book.blurb)}</p>
            <button class="btn btn--sm btn--ghost" type="button" data-action="toggle-blurb" style="margin-top:6px">Show more</button>
          </div>
        </section>

        <div class="split" style="margin-top:clamp(26px,4vw,44px)">
          <div class="grow">
            <section class="section" style="margin-top:0">
              ${sectionHead(`Reviews (${reviews.length})`, 'comment')}
              <div class="toolbar" style="margin-bottom:14px">
                <div class="tabs" role="tablist" aria-label="Sort reviews">
                  ${[['recent', 'Most recent'], ['helpful', 'Most helpful'], ['rating', 'Highest rated']].map(([id, label]) => `
                    <button class="tab" role="tab" type="button" data-action="review-sort" data-sort="${id}" aria-selected="${reviewSort === id}">${label}</button>`).join('')}
                </div>
              </div>
              <div class="grid-reviews">
                ${reviews.length
                  ? reviews.map((r) => reviewCard(r)).join('')
                  : UI.emptyState({ icon: 'edit', title: 'No reviews yet', body: 'Be the first to tell other readers what you thought.', action: `<button class="btn btn--primary" type="button" data-action="review" data-book="${book.id}">Write a review</button>` })}
              </div>
            </section>
          </div>

          <aside class="side-col">
            <div class="panel">
              <div class="panel__head"><h3>${icon('chart')}Rating breakdown</h3></div>
              <div class="panel__body">
                <div class="dist">
                  ${[5, 4, 3, 2, 1].map((stars_, i) => `
                    <div class="dist__row">
                      <span class="muted">${stars_} star</span>
                      <span class="dist__bar"><span class="dist__fill" style="width:${(dist[stars_ - 1] * 100).toFixed(1)}%"></span></span>
                      <span class="dist__pct">${(dist[stars_ - 1] * 100).toFixed(0)}%</span>
                    </div>`).join('')}
                </div>
              </div>
            </div>

            <div class="panel">
              <div class="panel__head"><h3>${icon('book')}Book details</h3></div>
              <div class="panel__body">
                <dl class="facts">
                  <div class="facts__row"><dt>Original title</dt><dd>${esc(book.title)}</dd></div>
                  <div class="facts__row"><dt>Published</dt><dd>${book.year}</dd></div>
                  <div class="facts__row"><dt>Pages</dt><dd>${book.pages}</dd></div>
                  <div class="facts__row"><dt>Publisher</dt><dd>${esc(book.publisher)}</dd></div>
                  <div class="facts__row"><dt>Language</dt><dd>${esc(book.language)}</dd></div>
                  <div class="facts__row"><dt>ISBN</dt><dd>${esc(book.isbn)}</dd></div>
                  <div class="facts__row"><dt>Genres</dt><dd>${book.genres.map((g) => `<a href="#/discover?genre=${encodeURIComponent(g)}">${esc(g)}</a>`).join(', ')}</dd></div>
                  <div class="facts__row"><dt>Your shelf</dt><dd>${shelf ? esc(shelf.name) : '<span class="muted">Not shelved</span>'}</dd></div>
                </dl>
              </div>
            </div>

            <div class="panel">
              <div class="panel__head"><h3>${icon('users')}Shelved by</h3></div>
              <div class="panel__body stack" style="--gap:2px">
                ${shelvedByCard(book)}
                ${DB.friends().slice(0, 2).map((u) => `
                  <a class="list-row" href="#/profile/${u.id}">
                    ${avatar(u, 'sm')}
                    <span class="grow"><span class="user-chip__name">${esc(u.name)}</span><span class="user-chip__sub">read this</span></span>
                  </a>`).join('')}
              </div>
              <div class="panel__foot muted" style="font-size:.8rem">and ${Math.max(0, shelvedBy - 3).toLocaleString()} more readers</div>
            </div>
          </aside>
        </div>

        <section class="section">
          ${sectionHead('Readers also enjoyed', 'sparkle')}
          ${rail(alsoOn)}
        </section>
      </div>`,

      mount(root) {
        const trigger = root.querySelector('[data-menu-trigger]');
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          const current = Store.shelfOf(book.id);
          const el = UI.menu(trigger, `
            <p class="menu__label">Choose a shelf</p>
            ${DB.SHELVES.map((s) => `<button class="menu__item" type="button" data-shelf="${s.id}" data-on="${current === s.id ? 1 : 0}">
              ${icon(s.icon)}<span>${esc(s.name)}</span>${current === s.id ? icon('check') : ''}
            </button>`).join('')}
            <div class="menu__sep"></div>
            <button class="menu__item" type="button" data-shelf="none" data-on="0">${icon('trash')}<span>Remove from shelves</span></button>
          `);
          el.querySelectorAll('[data-shelf]').forEach((item) => {
            item.addEventListener('click', () => {
              const value = item.dataset.shelf;
              const prev = Store.shelfOf(book.id);
              if (value === 'none') {
                Store.remove(book.id);
                UI.toast(`Removed from ${prev ? DB.shelf(prev).name : 'shelf'}`);
              } else {
                Store.move(book.id, value);
                UI.toast(`Added to ${DB.shelf(value).name}`);
              }
              UI.closeMenus();
              App.rerender();
            });
          });
        });

        root.querySelectorAll('[data-action="review-sort"]').forEach((btn) => {
          btn.addEventListener('click', () => {
            reviewSort = btn.dataset.sort;
            App.rerender();
          });
        });

        const picker = root.querySelector('[data-starpick]');
        picker.addEventListener('starpick:change', (e) => {
          const value = e.detail.value;
          Store.setRating(book.id, value || null);
          UI.toast(value ? `Rated ${value} star${value === 1 ? '' : 's'}` : 'Rating removed', { kind: value ? 'ok' : 'warn' });
          App.rerender();
        });

        root.querySelector('[data-action="clear-rating"]')?.addEventListener('click', () => {
          Store.setRating(book.id, null);
          UI.toast('Your rating was removed', { kind: 'warn' });
          App.rerender();
        });

        root.querySelector('[data-action="toggle-blurb"]').addEventListener('click', (e) => {
          const blurb = root.querySelector('[data-blurb]');
          const clamped = blurb.classList.toggle('book-hero__desc--clamped');
          e.target.textContent = clamped ? 'Show more' : 'Show less';
        });

        root.querySelector('[data-action="mark-read"]').addEventListener('click', () => {
          const was = Store.shelfOf(book.id);
          if (was === 'read') {
            Store.remove(book.id);
            UI.toast('Removed from your Read shelf', { kind: 'warn' });
          } else {
            Store.move(book.id, 'read');
            const g = Store.goalProgress();
            UI.toast(`Marked as read — ${g.read} of ${g.goal} books this year`);
          }
          App.rerender();
        });

        root.querySelector('[data-action="share-book"]').addEventListener('click', () => shareBook(book));

        root.querySelectorAll('[data-action="review"]').forEach((btn) => {
          btn.addEventListener('click', () => openReviewDialog(book, () => App.rerender()));
        });

        wireReviews(root, () => App.rerender());
        wireShelfQuick(root);
      }
    };
  }

  /* =========================================================== MY BOOKS == */
  function myBooks(p) {
    const shelf = p.get('shelf') || 'all';
    const sort = p.get('sort') || Store.state.listSort;
    const view = p.get('view') || 'grid';
    const counts = Store.counts();
    const items = Store.sortedList(shelf === 'all' ? null : shelf, sort);
    const pagesShown = items.reduce((sum, x) => sum + x.book.pages, 0);
    const readPages = Store.idsFor('read').reduce((sum, id) => sum + ((DB.book(id) || {}).pages || 0), 0);

    const tabs = [{ id: 'all', name: 'All books' }, ...DB.SHELVES.map((s) => ({ id: s.id, name: s.name }))];

    return {
      title: 'My books',
      html: `<div class="page">
        <header class="page__head">
          <div class="page__title"><h1>My books</h1><span class="badge">${counts.all} shelved</span></div>
          <p class="page__lede">Everything you have shelved, sorted however you like. Progress and ratings are saved in this browser only.</p>
        </header>

        <div class="stat-row" style="margin-bottom:22px">
          ${statCard('On shelves', String(counts.all), `${counts.read} finished`)}
          ${statCard('Reading now', String(counts.reading), 'in progress')}
          ${statCard('Pages shelved', num(pagesShown), shelf === 'all' ? 'in this library' : 'in this view')}
          ${statCard('Pages finished', num(readPages), 'in finished books')}
          ${statCard('Average rating', (() => {
            const mine = Object.entries(Store.state.ratings).map(([bid]) => Store.rating(bid));
            const avg = mine.length ? mine.reduce((a, b) => a + b, 0) / mine.length : 0;
            return avg.toFixed(2);
          })(), `across ${Object.keys(Store.state.ratings).length} rated books`)}
        </div>

        <div class="toolbar">
          <div class="tabs" role="tablist" aria-label="Shelves">
            ${tabs.map((t) => `<a class="tab" role="tab" href="#/my-books?shelf=${t.id}&sort=${sort}&view=${view}" aria-selected="${shelf === t.id}">${esc(t.name)}<span class="tab__count">${t.id === 'all' ? counts.all : counts[t.id] || 0}</span></a>`).join('')}
          </div>
          <div class="row" style="margin-left:auto;gap:8px">
            <label class="sr-only" for="libSort">Sort books</label>
            <select class="select" id="libSort" data-action="lib-sort">
              ${LIB_SORTS.map((s) => `<option value="${s.id}" ${s.id === sort ? 'selected' : ''}>${s.label}</option>`).join('')}
            </select>
            <div class="segmented" role="group" aria-label="View">
              <button class="segmented__btn" type="button" data-action="view" data-view="grid" aria-pressed="${view === 'grid'}" aria-label="Grid view">${icon('grid')}</button>
              <button class="segmented__btn" type="button" data-action="view" data-view="list" aria-pressed="${view === 'list'}" aria-label="List view">${icon('list')}</button>
            </div>
          </div>
        </div>

        ${items.length === 0
          ? UI.emptyState({
              icon: 'library',
              title: shelf === 'all' ? 'Your shelves are empty' : `Nothing on ${esc(DB.shelf(shelf) ? DB.shelf(shelf).name : 'this shelf')}`,
              body: 'Search the catalogue and add a few titles to get started.',
              action: '<a class="btn btn--primary" href="#/discover">Browse books</a>'
            })
          : view === 'list'
            ? `<div class="panel"><div class="panel__body" style="padding-block:4px">
                ${items.map(({ book, entry }) => `
                  <div class="book-row">
                    <a href="#/book/${book.id}">${cover(book)}</a>
                    <div class="grow">
                      <a class="book-row__title" href="#/book/${book.id}">${esc(book.title)}</a>
                      <div class="book-row__author">${esc(book.author)} · ${book.year} · ${book.pages} pages</div>
                      <div class="book-row__desc clamp-2">${esc(book.blurb)}</div>
                      <div class="row" style="margin-top:8px;gap:10px;flex-wrap:wrap">
                        <span class="badge" style="background:${(DB.shelf(entry.shelf) || {}).color}22;color:${(DB.shelf(entry.shelf) || {}).color}">${esc((DB.shelf(entry.shelf) || {}).name || '')}</span>
                        ${Store.rating(book.id) != null ? stars(Store.rating(book.id), { size: 'sm' }) : `<span class="muted" style="font-size:.8rem">Not rated</span>`}
                        ${entry.shelf === 'reading' ? `<span class="muted" style="font-size:.8rem">${entry.progress || 0}% done</span>` : ''}
                      </div>
                    </div>
                    <div class="book-row__side">
                      <button class="btn btn--sm" type="button" data-action="quick-review" data-book="${book.id}">${icon('edit')}Review</button>
                      <button class="icon-btn" type="button" data-action="remove" data-book="${book.id}" aria-label="Remove ${esc(book.title)} from shelves">${icon('trash')}</button>
                    </div>
                  </div>`).join('')}
              </div></div>`
            : `<div class="grid-books">${items.map(({ book }) => bookCard(book)).join('')}</div>`}
      </div>`,

      mount(root) {
        root.querySelector('[data-action="lib-sort"]').addEventListener('change', (e) => {
          Store.setSort(e.target.value);
          const next = new URLSearchParams(p);
          next.set('sort', e.target.value);
          UI.setHash(`#/my-books?${next.toString()}`);
        });
        root.querySelectorAll('[data-action="view"]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const next = new URLSearchParams(p);
            next.set('view', btn.dataset.view);
            UI.setHash(`#/my-books?${next.toString()}`);
          });
        });
        root.querySelectorAll('[data-action="remove"]').forEach((btn) => {
          btn.addEventListener('click', async () => {
            const book = DB.book(btn.dataset.book);
            const ok = await UI.confirm({
              title: 'Remove from shelves?',
              message: `“${book.title}” will be taken off all your shelves. Your rating and review stay put.`,
              confirmLabel: 'Remove',
              danger: true
            });
            if (!ok) return;
            Store.remove(book.id);
            UI.toast(`Removed “${book.title}”`, {
              kind: 'warn',
              actionLabel: 'Undo',
              onAction: () => { Store.move(book.id, shelf === 'all' ? 'want' : shelf); App.rerender(); UI.toast('Restored'); }
            });
            App.rerender();
          });
        });
        root.querySelectorAll('[data-action="quick-review"]').forEach((btn) => {
          btn.addEventListener('click', () => openReviewDialog(DB.book(btn.dataset.book), () => App.rerender()));
        });
        wireShelfQuick(root);
      }
    };
  }

  /* ============================================================ PROFILE == */

  /** Deterministic pseudo-number so mock follower counts stay stable. */
  function mockStat(uid, salt, min, span) {
    let h = salt;
    for (const ch of String(uid)) h = (h * 31 + ch.charCodeAt(0)) % 100003;
    return min + (h % span);
  }

  function profile(id, p) {
    const user = DB.user(id);
    if (!user) return notFound();
    const isMe = id === DB.ME;
    const tab = p.get('tab') || 'reviews';
    const reviews = Store.reviewsByUser(id);
    const shelves = isMe ? Store.counts() : null;
    const booksRead = isMe ? Store.idsFor('read').length : DB.reviewsByUser(id).length + 3;

    // genre tags come from whatever this reader has actually rated or reviewed
    const genreTally = (isMe
      ? Object.keys(Store.state.ratings).map((bid) => DB.book(bid))
      : DB.reviewsByUser(id).map((r) => DB.book(r.bookId)))
      .filter(Boolean)
      .flatMap((b) => b.genres)
      .reduce((acc, g) => ((acc[g] = (acc[g] || 0) + 1), acc), {});
    const topGenres = Object.entries(genreTally).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const genreTags = (topGenres.length ? topGenres : [['Science Fiction', 0], ['Literary Fiction', 0]]);

    const tabBtn = (t, label) => `<a class="tab" role="tab" href="#/profile/${id}?tab=${t}" aria-selected="${tab === t}">${label}</a>`;

    return {
      title: `${user.name} — Shelfie`,
      html: `<div class="page">
        <section class="profile-hero">
          ${avatar(user, 'xl')}
          <div class="profile-hero__id grow">
            <div class="profile-hero__name">
              <h1>${esc(user.name)}</h1>
              ${isMe ? '<span class="badge badge--green">That is you</span>' : ''}
            </div>
            <p class="profile-hero__handle">@${esc(user.handle)} · joined ${longDate(user.joined)}</p>
            <p class="profile-hero__bio">${esc(user.bio)}</p>
            <div class="profile-hero__meta">
              ${user.location ? `<span>${icon('target')}${esc(user.location)}</span>` : ''}
              ${user.website ? `<span>${icon('link')}${esc(user.website)}</span>` : ''}
            </div>
            <div class="tag-row">
              ${genreTags.map(([g, n]) => `<a class="chip" href="#/discover?genre=${encodeURIComponent(g)}">${esc(g)}${n ? `<span class="muted">${n}</span>` : ''}</a>`).join('')}
            </div>
          </div>
          <div class="profile-hero__side">
            ${isMe
              ? `<a class="btn" href="#/goal">${icon('target')}Reading goal</a>
                 <button class="btn btn--primary" type="button" data-action="edit-profile">${icon('edit')}Edit profile</button>`
              : `<button class="btn ${Store.isFollowing(id) ? 'btn--soft' : 'btn--primary'}" type="button" data-action="follow-me" data-user="${id}">
                   ${icon(Store.isFollowing(id) ? 'check' : 'plus')}${Store.isFollowing(id) ? 'Following' : 'Follow'}
                 </button>
                 <button class="icon-btn" type="button" data-action="share-user" aria-label="Share profile">${icon('share')}</button>`}
          </div>
        </section>

        <div class="stat-row" style="margin-top:18px">
          ${statCard(isMe ? 'Books shelved' : 'Books read', String(booksRead), isMe ? `${shelves.read} finished` : 'lifetime')}
          ${statCard('Reviews', String(reviews.length), 'written')}
          ${statCard('Followers', String(isMe ? 128 + Object.keys(Store.state.ratings).length : mockStat(id, 7, 40, 460)), 'people')}
          ${statCard('Following', String(isMe ? Store.state.following.length : mockStat(id, 91, 60, 400)), 'people')}
        </div>

        <div class="toolbar" style="margin-top:24px">
          <div class="tabs" role="tablist">
            ${tabBtn('reviews', `Reviews (${reviews.length})`)}
            ${tabBtn('shelves', 'Shelves')}
            ${tabBtn('activity', 'Activity')}
          </div>
        </div>

        <div id="profileTab"></div>
      </div>`,

      mount(root) {
        const host = root.querySelector('#profileTab');

        const renderTab = () => {
          if (tab === 'shelves') {
            const list = isMe
              ? DB.SHELVES.map((s) => ({ s, count: Store.counts()[s.id] || 0, books: Store.sortedList(s.id).map((x) => x.book) }))
              : DB.SHELVES.map((s) => ({ s, count: DB.booksByShelf(s.id).length, books: DB.booksByShelf(s.id) }));
            host.innerHTML = list.some((l) => l.count) ? list.map((l) => `
              <section class="section" style="margin-top:0">
                ${sectionHead(`${l.s.name} (${l.count})`, l.s.icon, isMe ? `<a class="section__more" href="#/my-books?shelf=${l.s.id}">Open shelf</a>` : '')}
                ${bookGrid(l.books.slice(0, 10))}
              </section>`).join('') : UI.emptyState({ icon: 'library', title: 'No shelves yet' });
          } else if (tab === 'activity') {
            const items = DB.ACTIVITY.filter((a) => a.userId === id).sort((a, b) => +new Date(b.date) - +new Date(a.date));
            host.innerHTML = items.length
              ? `<div class="panel"><div class="panel__body" style="padding-block:6px"><div class="feed">${items.map(feedItem).join('')}</div></div></div>`
              : UI.emptyState({ icon: 'clock', title: 'No recent activity' });
          } else {
            host.innerHTML = reviews.length
              ? `<div class="grid-reviews">${reviews.map((r) => reviewCard(r)).join('')}</div>`
              : UI.emptyState({
                  icon: 'edit',
                  title: isMe ? 'You have not written a review yet' : `${user.name} has not reviewed anything yet`,
                  body: isMe ? 'Open a book from your shelves and tell other readers what you thought.' : '',
                  action: isMe ? '<a class="btn btn--primary" href="#/my-books">Browse my books</a>' : ''
                });
          }
          wireReviews(host, () => App.rerender());
          wireShelfQuick(host);
        };
        renderTab();

        root.querySelector('[data-action="follow-me"]')?.addEventListener('click', (e) => {
          const on = Store.toggleFollow(id);
          const btn = e.currentTarget;
          btn.classList.toggle('btn--soft', on);
          btn.classList.toggle('btn--primary', !on);
          btn.innerHTML = `${UI.icon(on ? 'check' : 'plus')}${on ? 'Following' : 'Follow'}`;
          UI.toast(on ? `Following ${user.name}` : `Unfollowed ${user.name}`, { kind: on ? 'ok' : 'warn' });
        });

        root.querySelector('[data-action="share-user"]')?.addEventListener('click', () => {
          copyLink(`${location.origin}${location.pathname}#/profile/${id}`);
        });

        root.querySelector('[data-action="edit-profile"]')?.addEventListener('click', () => openProfileDialog(user));
      }
    };
  }

  /* ================================================================ GOAL == */
  function goal() {
    const g = Store.goalProgress();
    const read = Store.sortedList('read');
    const totalPages = read.reduce((s, x) => s + x.book.pages, 0);
    const avgRating = (() => {
      const r = Object.values(Store.state.ratings);
      return r.length ? r.reduce((a, b) => a + b, 0) / r.length : 0;
    })();
    const perMonth = Array.from({ length: 12 }, () => 0);
    read.forEach(({ entry }) => {
      const m = new Date(entry.addedAt).getMonth();
      perMonth[m] += 1;
    });
    const maxMonth = Math.max(1, ...perMonth);

    return {
      title: 'Reading goal',
      html: `<div class="page">
        <header class="page__head">
          <div class="page__title"><h1>Your 2026 reading goal</h1></div>
          <p class="page__lede">Set a number, watch it move. The demo keeps it in this browser, so you can play with different targets.</p>
        </header>

        <div class="split">
          <div class="grow">
            <div class="panel">
              <div class="panel__body" style="display:grid;place-items:center;gap:18px;padding:28px 20px">
                ${UI.ring(g.pct, { value: `${g.pct}%`, label: 'complete' })}
                <p class="muted" style="max-width:44ch;text-align:center">You have read <b>${g.read}</b> of <b>${g.goal}</b> books. At your current pace that lands on about
                  <b>${Math.max(g.goal, Math.round(g.read / Math.max(0.12, (new Date().getMonth() + 1) / 12)))}</b> books by December.</p>
                <div class="row" style="gap:10px;flex-wrap:wrap;justify-content:center">
                  <button class="btn btn--primary" type="button" data-action="edit-goal">${icon('edit')}Change goal</button>
                  <button class="btn" type="button" data-action="goal-preset" data-preset="12">12 books</button>
                  <button class="btn" type="button" data-action="goal-preset" data-preset="24">24 books</button>
                  <button class="btn" type="button" data-action="goal-preset" data-preset="52">52 books</button>
                </div>
              </div>
            </div>

            <section class="section">
              ${sectionHead('Books per month', 'chart')}
              <div class="panel"><div class="panel__body">
                <div class="bars">
                  ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => `
                    <div class="bars__col" title="${m}: ${perMonth[i]} book${perMonth[i] === 1 ? '' : 's'}">
                      <span class="bars__value">${perMonth[i] || ''}</span>
                      <span class="bars__bar" style="height:${Math.max(4, (perMonth[i] / maxMonth) * 100)}%"></span>
                      <span class="bars__label">${m}</span>
                    </div>`).join('')}
                </div>
              </div></div>
            </section>
          </div>

          <aside class="side-col">
            ${statCard('Books finished', String(g.read), 'marked as read')}
            ${statCard('Pages read', num(totalPages), 'in finished books')}
            ${statCard('Average rating', avgRating.toFixed(2), 'of the books you rated')}
            ${statCard('Goal pace', `${Math.max(0, g.goal - g.read)} left`, g.pct >= 100 ? 'Complete' : `${g.pct}% there`)}
          </aside>
        </div>

        <section class="section">
          ${sectionHead('Books you finished', 'check-circle', '<a class="section__more" href="#/my-books?shelf=read">Open shelf</a>')}
          ${read.length ? bookGrid(read.map((x) => x.book)) : UI.emptyState({ icon: 'check-circle', title: 'Nothing finished yet', body: 'Mark a book as read and it will show up here.', action: '<a class="btn btn--primary" href="#/my-books">Browse my books</a>' })}
        </section>
      </div>`,

      mount(root) {
        root.querySelector('[data-action="edit-goal"]').addEventListener('click', () => openGoalDialog(() => App.rerender()));
        root.querySelectorAll('[data-action="goal-preset"]').forEach((btn) => {
          btn.addEventListener('click', () => {
            Store.setGoal(Number(btn.dataset.preset));
            UI.toast(`Goal set to ${btn.dataset.preset} books`);
            App.rerender();
          });
        });
      }
    };
  }

  /* ======================================================== SHARED MODALS = */

  function openProgressDialog(bookId, done) {
    const entry = Store.entryOf(bookId) || { progress: 0 };
    const book = DB.book(bookId);
    UI.modal({
      title: `Update progress — ${book.title}`,
      body: `<div class="field">
          <label class="field__label" for="progRange">How far are you? <b data-prog-out>${entry.progress || 0}%</b></label>
          <input class="range" type="range" id="progRange" min="0" max="100" step="1" value="${entry.progress || 0}">
          <p class="field__hint"><span data-prog-pages>${Math.round(((entry.progress || 0) / 100) * book.pages)}</span> of ${book.pages} pages</p>
        </div>`,
      foot: `<button class="btn" type="button" data-close-x>Cancel</button>
             <button class="btn btn--primary" type="button" data-save>Save progress</button>`,
      onMount(dialog, close) {
        const range = dialog.querySelector('#progRange');
        const out = dialog.querySelector('[data-prog-out]');
        const pages = dialog.querySelector('[data-prog-pages]');
        range.addEventListener('input', () => {
          out.textContent = range.value + '%';
          pages.textContent = Math.round((range.value / 100) * book.pages);
        });
        dialog.querySelector('[data-close-x]').addEventListener('click', close);
        dialog.querySelector('[data-save]').addEventListener('click', () => {
          Store.setProgress(bookId, Number(range.value));
          UI.toast(`Progress saved for “${book.title}”`);
          close();
          done && done();
        });
      }
    });
  }

  function openReviewDialog(book, done) {
    const existing = Store.reviewsFor(book.id).find((r) => r.userId === DB.ME);
    const current = existing || { rating: Store.rating(book.id) || 0, text: '', quote: '', spoiler: false };
    const shelfId = Store.shelfOf(book.id);

    UI.modal({
      title: existing ? 'Edit your review' : `Review “${book.title}”`,
      wide: true,
      body: `
        <div class="row" style="gap:14px;align-items:flex-start">
          <span class="cover-xs">${cover(book)}</span>
          <div class="grow">
            <h3 style="font-family:var(--font-serif);font-size:1.1rem">${esc(book.title)}</h3>
            <p class="muted" style="font-size:.85rem">${esc(book.author)}</p>
            <div class="rate-box" style="margin-top:10px">
              ${UI.starPickerHTML(current.rating || 0, { lg: true })}
              <span class="rate-box__value" data-rating-out>${current.rating ? `You rated this ${current.rating}` : '<span class="muted">Tap a star — left half gives you .5</span>'}</span>
            </div>
          </div>
        </div>

        <div class="field">
          <label class="field__label" for="revText">Your review</label>
          <textarea class="textarea" id="revText" name="text" placeholder="What stayed with you? Specifics beat superlatives.">${esc(current.text || '')}</textarea>
          <p class="field__hint">${(current.text || '').length} characters · this is a demo, so nothing is published anywhere.</p>
        </div>

        <div class="field">
          <label class="field__label" for="revQuote">Quote <span class="muted" style="font-weight:400">(optional)</span></label>
          <input class="input" id="revQuote" name="quote" value="${esc(current.quote || '')}" placeholder="A line worth passing on">
        </div>

        <div class="switch-row">
          <button class="switch" type="button" role="switch" aria-checked="${current.spoiler ? 'true' : 'false'}" data-spoiler aria-label="Contains spoilers"></button>
          <div class="grow">
            <p style="font-weight:600;font-size:.9rem">This review contains spoilers</p>
            <p class="field__hint">Readers will have to click to reveal the text.</p>
          </div>
        </div>

        <div class="field">
          <label class="field__label" for="revShelf">Update my shelf</label>
          <select class="select" id="revShelf" name="shelf" style="width:100%;height:40px">
            <option value="">Leave unchanged</option>
            ${DB.SHELVES.map((s) => `<option value="${s.id}" ${s.id === shelfId ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}
          </select>
        </div>`,
      foot: `<button class="btn" type="button" data-cancel>Cancel</button>
             <button class="btn btn--primary" type="button" data-submit>${existing ? 'Save changes' : 'Publish review'}</button>`,
      onMount(dialog, close) {
        UI.mountStarPickers(dialog);
        const picker = dialog.querySelector('[data-starpick]');
        const out = dialog.querySelector('[data-rating-out]');
        picker.addEventListener('starpick:change', (e) => {
          const v = e.detail.value;
          out.textContent = v ? `You rated this ${v}` : 'Tap a star — left half gives you .5';
        });
        const spoiler = dialog.querySelector('[data-spoiler]');
        spoiler.addEventListener('click', () => {
          spoiler.setAttribute('aria-checked', spoiler.getAttribute('aria-checked') === 'true' ? 'false' : 'true');
        });
        dialog.querySelector('[data-cancel]').addEventListener('click', close);
        dialog.querySelector('[data-submit]').addEventListener('click', () => {
          const text = dialog.querySelector('#revText').value.trim();
          const rating = Number(picker.dataset.value) || 0;
          if (!text && !rating) {
            UI.toast('Add a rating or some text first', { kind: 'warn' });
            return;
          }
          const payload = {
            bookId: book.id,
            rating,
            text,
            quote: dialog.querySelector('#revQuote').value.trim(),
            spoiler: spoiler.getAttribute('aria-checked') === 'true',
            shelf: dialog.querySelector('#revShelf').value || null
          };
          if (existing) {
            // replace the local copy of my own review
            Store.state.myReviews = Store.state.myReviews.map((r) => (r.id === existing.id ? Object.assign(r, payload) : r));
            UI.toast('Review updated');
          } else {
            Store.addReview(payload);
            UI.toast('Review published to your profile');
          }
          if (rating) Store.setRating(book.id, rating);
          close();
          done && done();
        });
      }
    });
  }

  function openGoalDialog(done) {
    UI.modal({
      title: 'Set your reading goal',
      body: `<div class="field">
          <label class="field__label" for="goalInput">Books this year</label>
          <input class="input" id="goalInput" type="number" min="1" max="999" value="${Store.goal()}" style="font-size:1.3rem;font-weight:700">
          <p class="field__hint">A common pace is 24–36 books. You can change it whenever.</p>
        </div>
        <div class="row row--wrap" style="gap:8px">
          ${[12, 24, 36, 52].map((n) => `<button class="chip" type="button" data-preset="${n}">${n}</button>`).join('')}
        </div>`,
      foot: `<button class="btn" type="button" data-cancel>Cancel</button>
             <button class="btn btn--primary" type="button" data-save>Save goal</button>`,
      onMount(dialog, close) {
        const input = dialog.querySelector('#goalInput');
        dialog.querySelectorAll('[data-preset]').forEach((b) => b.addEventListener('click', () => { input.value = b.dataset.preset; }));
        dialog.querySelector('[data-cancel]').addEventListener('click', close);
        dialog.querySelector('[data-save]').addEventListener('click', () => {
          Store.setGoal(input.value);
          UI.toast(`Goal set to ${Store.goal()} books`);
          close();
          done && done();
        });
        setTimeout(() => { input.focus(); input.select(); }, 0);
      }
    });
  }

  function openProfileDialog(user) {
    UI.modal({
      title: 'Edit profile',
      body: `<div class="field"><label class="field__label" for="pfName">Display name</label><input class="input" id="pfName" value="${esc(user.name)}"></div>
        <div class="field"><label class="field__label" for="pfLoc">Location</label><input class="input" id="pfLoc" value="${esc(user.location)}"></div>
        <div class="field"><label class="field__label" for="pfBio">Bio</label><textarea class="textarea" id="pfBio" style="min-height:90px">${esc(user.bio)}</textarea></div>
        <p class="field__hint">Mock only — changes apply to this session and are not persisted.</p>`,
      foot: `<button class="btn" type="button" data-cancel>Cancel</button>
             <button class="btn btn--primary" type="button" data-save>Save</button>`,
      onMount(dialog, close) {
        dialog.querySelector('[data-cancel]').addEventListener('click', close);
        dialog.querySelector('[data-save]').addEventListener('click', () => {
          user.name = dialog.querySelector('#pfName').value.trim() || user.name;
          user.location = dialog.querySelector('#pfLoc').value.trim();
          user.bio = dialog.querySelector('#pfBio').value.trim();
          UI.toast('Profile updated (for this session)');
          close();
          App.rerender();
        });
      }
    });
  }

  function openAddBookDialog() {
    UI.modal({
      title: 'Add a book',
      body: `<p class="field__hint">Search the demo catalogue, then choose a shelf. Real deployments would hit an ISBN/Open Library lookup here.</p>
        <form data-add-form>
          <div class="field">
            <label class="field__label" for="addQ">Title, author or ISBN</label>
            <input class="input" id="addQ" name="q" placeholder="e.g. Piranesi" autocomplete="off">
          </div>
        </form>
        <div class="results-list" data-results></div>`,
      foot: '',
      onMount(dialog, close) {
        const input = dialog.querySelector('#addQ');
        const results = dialog.querySelector('[data-results]');
        let cursor = -1;
        let current = [];

        const paint = () => {
          const value = input.value.trim();
          current = value ? DB.search(value).slice(0, 6) : DB.BOOKS.slice(0, 6);
          results.innerHTML = current.length
            ? current.map((b, i) => `<button class="result-row" type="button" data-pick="${b.id}" data-cursor="${i === 0 ? 1 : 0}">
                <span class="result-row__cover">${cover(b)}</span>
                <span class="grow">
                  <span class="result-row__title">${esc(b.title)}</span>
                  <span class="result-row__meta">${esc(b.author)} · ${b.year}${Store.shelfOf(b.id) ? ' · already shelved' : ''}</span>
                </span>
                ${stars(b.rating, { size: 'sm' })}
              </button>`).join('')
            : '<p class="field__hint">No matches in the demo catalogue.</p>';
          cursor = -1;
          results.querySelectorAll('[data-pick]').forEach((btn) => {
            btn.addEventListener('click', () => pick(btn.dataset.pick));
          });
        };

        const pick = (id) => {
          const book = DB.book(id);
          dialog.querySelector('.pick-menu-holder')?.remove();
          const menu = document.createElement('div');
          menu.className = 'menu pick-menu-holder';
          const prevShelf = Store.shelfOf(id);
          menu.innerHTML = `<p class="menu__label">Add “${esc(book.title)}” to</p>
            ${DB.SHELVES.map((s) => `<button class="menu__item" type="button" data-shelf="${s.id}" data-on="${prevShelf === s.id ? 1 : 0}">${icon(s.icon)}${esc(s.name)}${prevShelf === s.id ? icon('check') : ''}</button>`).join('')}`;
          dialog.querySelector('.modal__body').appendChild(menu);
          menu.querySelectorAll('[data-shelf]').forEach((item) => {
            item.addEventListener('click', () => {
              Store.move(id, item.dataset.shelf);
              UI.toast(`“${book.title}” added to ${DB.shelf(item.dataset.shelf).name}`);
              close();
              App.rerender();
            });
          });
        };

        input.addEventListener('input', paint);
        dialog.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (cursor >= 0 && current[cursor]) pick(current[cursor].id);
            else if (current[0]) pick(current[0].id);
          }
        });
        paint();
        setTimeout(() => input.focus(), 0);
      }
    });
  }

  /* ------------------------------------------------------------- wiring */
  function wireReviews(root, refresh) {
    root.querySelectorAll('[data-review]').forEach((card) => {
      const review = findReview(card.dataset.review);

      card.querySelector('[data-action="like"]')?.addEventListener('click', (e) => {
        const btn = e.currentTarget;
        const on = Store.toggleLike(card.dataset.review);
        btn.dataset.on = on ? '1' : '0';
        btn.querySelector('[data-like-count]').textContent = Store.likeCount(review);
        if (on) UI.toast('Added to your favourites');
      });

      card.querySelector('[data-action="share"]')?.addEventListener('click', () => shareBook(DB.book(card.dataset.book)));

      const commentBox = card.querySelector('[data-comments]');
      card.querySelector('[data-action="comment"]')?.addEventListener('click', () => {
        const open = commentBox.hasAttribute('hidden');
        if (open) commentBox.removeAttribute('hidden');
        else commentBox.setAttribute('hidden', '');
        if (open) commentBox.querySelector('input').focus();
      });

      commentBox?.querySelector('[data-comment-form]')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const input = form.querySelector('[name="text"]');
        const text = input ? input.value.trim() : '';
        if (!text) return;
        Store.addComment(review, text);
        form.reset();
        UI.toast('Comment added');
        refresh && refresh();
      });

      card.querySelector('[data-action="reveal-spoiler"]')?.addEventListener('click', (e) => {
        e.currentTarget.closest('.review__spoiler').outerHTML = `<div class="review__text">${esc(review.text || '').split(/\n{2,}/).map((p) => `<p>${esc(p)}</p>`).join('')}</div>`;
      });

      card.querySelector('[data-action="expand-review"]')?.addEventListener('click', (e) => {
        const text = card.querySelector('.review__text');
        text.classList.toggle('is-clamped');
        e.currentTarget.textContent = text.classList.contains('is-clamped') ? 'Read more' : 'Show less';
      });
    });
  }

  function wireShelfQuick(root) {
    root.querySelectorAll('[data-action="shelf-quick"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const book = DB.book(btn.dataset.book);
        Store.move(book.id, 'want');
        UI.toast(`“${book.title}” added to Want to Read`);
        const badge = document.createElement('span');
        badge.className = 'badge badge--green';
        badge.innerHTML = `${icon('check')}Want to Read`;
        btn.replaceWith(badge);
        const counts = Store.counts();
        App.refreshChrome({ counts });
      });
    });
  }

  function findReview(id) {
    return Store.state.myReviews.find((r) => r.id === id) || DB.review(id) || { id, likes: 0, comments: [] };
  }

  function shareBook(book) {
    if (!book) return;
    copyLink(`${location.origin}${location.pathname}#/book/${book.id}`);
  }

  function copyLink(url) {
    const done = () => UI.toast('Link copied to your clipboard');
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(done, () => UI.toast(url, { kind: 'warn', timeout: 6000 }));
    } else {
      UI.toast(url, { kind: 'warn', timeout: 6000 });
    }
  }

  function notFound() {
    return {
      title: 'Not found',
      html: `<div class="page">${UI.emptyState({
        icon: 'compass',
        title: 'That page is not on any shelf',
        body: 'The link may be broken, or the book may have been removed from the demo catalogue.',
        action: '<a class="btn btn--primary" href="#/">Back to home</a>'
      })}</div>`
    };
  }

  global.Views = {
    home, discover, bookDetail, myBooks, profile, goal, notFound,
    openAddBookDialog, openReviewDialog, openGoalDialog, shareBook, refreshChrome: null
  };
})(window);

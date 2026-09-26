/* ==========================================================================
   Shelfie — client state
   A tiny store persisted to localStorage. All mutations are local/mock.
   ========================================================================== */
(function (global) {
  'use strict';

  const KEY = 'shelfie.v1';
  const ME = DB.ME;

  const defaults = () => ({
    shelves: JSON.parse(JSON.stringify(DB.seedShelves)),
    ratings: { ...DB.seedRatings },
    myReviews: [],
    likedReviews: [],
    readComments: {},     // reviewId -> comments added by the current user
    following: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6'],
    goal: 24,
    theme: 'light',
    notifSeen: [],
    listSort: 'added',
    lastRoute: '#/'
  });

  let state = load();
  let seq = 0;

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaults();
      const parsed = JSON.parse(raw);
      return Object.assign(defaults(), parsed);
    } catch (err) {
      console.warn('[shelfie] could not read saved state, starting fresh', err);
      return defaults();
    }
  }

  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (err) {
      /* private mode / quota — the app still works in-memory */
    }
  }

  function commit(mutator) {
    mutator(state);
    persist();
  }

  const Store = {
    get state() { return state; },

    reset() {
      state = defaults();
      persist();
    },

    /* ---------------------------------------------------------- shelves */
    shelfOf(bookId) {
      const entry = state.shelves[bookId];
      return entry ? entry.shelf : null;
    },
    entryOf(bookId) {
      return state.shelves[bookId] || null;
    },
    isOn(bookId, shelfId) {
      return this.shelfOf(bookId) === shelfId;
    },
    setShelf(bookId, shelfId) {
      commit((s) => {
        if (!shelfId) delete s.shelves[bookId];
        else s.shelves[bookId] = Object.assign({ shelf: shelfId, addedAt: new Date().toISOString() }, s.shelves[bookId], { shelf: shelfId });
      });
    },
    move(bookId, shelfId) {
      this.setShelf(bookId, shelfId);
    },
    remove(bookId) {
      commit((s) => { delete s.shelves[bookId]; });
    },
    setProgress(bookId, pct) {
      commit((s) => {
        if (s.shelves[bookId]) s.shelves[bookId].progress = Math.max(0, Math.min(100, Math.round(pct)));
      });
    },
    idsFor(shelfId) {
      return Object.keys(state.shelves).filter((id) => state.shelves[id].shelf === shelfId);
    },
    counts() {
      const out = {};
      for (const sh of DB.SHELVES) out[sh.id] = this.idsFor(sh.id).length;
      out.all = Object.keys(state.shelves).length;
      return out;
    },
    sortedList(shelfId, sort = state.listSort) {
      const entries = Object.entries(state.shelves)
        .filter(([, v]) => !shelfId || v.shelf === shelfId)
        .map(([id, v]) => ({ book: DB.book(id), entry: v }))
        .filter((x) => x.book);

      const cmp = {
        added: (a, b) => +new Date(b.entry.addedAt) - +new Date(a.entry.addedAt),
        title: (a, b) => a.book.title.localeCompare(b.book.title),
        author: (a, b) => a.book.author.localeCompare(b.book.author),
        rating: (a, b) => this.rating(b.book.id) - this.rating(a.book.id) || b.book.rating - a.book.rating,
        pages: (a, b) => a.book.pages - b.book.pages
      }[sort] || (() => 0);

      return entries.sort(cmp);
    },

    /* ---------------------------------------------------------- ratings */
    rating(bookId) {
      return state.ratings[bookId] != null ? state.ratings[bookId] : null;
    },
    setRating(bookId, value) {
      commit((s) => {
        if (value == null) delete s.ratings[bookId];
        else s.ratings[bookId] = value;
      });
    },
    /** Book average including the current user's rating, if any. */
    averageWithMine(bookId) {
      const b = DB.book(bookId);
      if (!b) return 0;
      const mine = state.ratings[bookId];
      if (mine == null) return b.rating;
      return Math.round(((b.rating * b.ratings + mine) / (b.ratings + 1)) * 100) / 100;
    },

    /* ---------------------------------------------------------- reviews */
    myReviews() {
      return [...state.myReviews].sort((a, b) => +new Date(b.date) - +new Date(a.date));
    },
    reviewsFor(bookId) {
      const base = DB.reviewsFor(bookId);
      const mine = state.myReviews.filter((r) => r.bookId === bookId);
      return [...mine, ...base].sort((a, b) => +new Date(b.date) - +new Date(a.date));
    },
    reviewsByUser(userId) {
      if (userId === ME) return this.myReviews();
      return DB.reviewsByUser(userId);
    },
    addReview({ bookId, rating, text, quote, spoiler, shelf, finished }) {
      const review = {
        id: `mine-${++seq}-${bookId}`,
        bookId,
        userId: ME,
        rating: rating || 0,
        text: text || '',
        quote: quote || '',
        spoiler: !!spoiler,
        date: new Date().toISOString(),
        likes: 0,
        comments: []
      };
      commit((s) => { s.myReviews.push(review); });
      if (shelf) this.setShelf(bookId, shelf);
      if (finished) this.setShelf(bookId, 'read');
      return review;
    },
    countFor(bookId) {
      return DB.reviewCount(bookId) + state.myReviews.filter((r) => r.bookId === bookId).length;
    },
    readCountFor(bookId) {
      return Math.round(DB.book(bookId).ratings / 900);
    },

    /* ------------------------------------------------------------ likes */
    isLiked(reviewId) {
      return state.likedReviews.includes(reviewId);
    },
    toggleLike(reviewId) {
      commit((s) => {
        const i = s.likedReviews.indexOf(reviewId);
        if (i >= 0) s.likedReviews.splice(i, 1);
        else s.likedReviews.push(reviewId);
      });
      return this.isLiked(reviewId);
    },
    likeCount(review) {
      return review.likes + (this.isLiked(review.id) ? 1 : 0);
    },

    /* --------------------------------------------------------- comments */
    commentsOf(review) {
      if (review.userId === ME) return review.comments || [];
      return review.comments || [];
    },
    addComment(review, text) {
      const comment = { userId: ME, text, date: new Date().toISOString() };
      if (review.userId === ME) {
        commit((s) => {
          const target = s.myReviews.find((r) => r.id === review.id);
          if (target) (target.comments = target.comments || []).push(comment);
        });
      } else {
        commit((s) => {
          const target = s.readComments[review.id] || (s.readComments[review.id] = []);
          target.push(comment);
        });
      }
      return comment;
    },
    commentsWithMine(review) {
      const base = review.comments || [];
      const extra = (state.readComments || {})[review.id] || [];
      return [...extra, ...base];
    },

    /* ------------------------------------------------------------- goal */
    goal: () => state.goal,
    setGoal(n) {
      commit((s) => { s.goal = Math.max(1, Math.min(999, Number(n) || 1)); });
    },
    readThisYear() {
      return this.idsFor('read').length;
    },
    goalProgress() {
      const read = this.readThisYear();
      return { read, goal: state.goal, pct: Math.min(100, Math.round((read / state.goal) * 100)) };
    },

    /* -------------------------------------------------------- following */
    isFollowing(id) {
      return state.following.includes(id);
    },
    toggleFollow(id) {
      commit((s) => {
        const i = s.following.indexOf(id);
        if (i >= 0) s.following.splice(i, 1);
        else s.following.push(id);
      });
      return this.isFollowing(id);
    },

    /* ------------------------------------------------------------ theme */
    theme: () => state.theme,
    setTheme(theme) {
      commit((s) => { s.theme = theme; });
    },

    /* ------------------------------------------------------------ misc */
    setSort(sort) {
      commit((s) => { s.listSort = sort; });
    },
    markNotifsSeen() {
      commit((s) => { s.notifSeen = DB.NOTIFICATIONS.map((n) => n.id); });
    },
    unreadNotifs() {
      return DB.NOTIFICATIONS.filter((n) => !state.notifSeen.includes(n.id)).length;
    }
  };

  global.Store = Store;
})(window);

const BOOKS = [
  { id: 1, title: "The Midnight Library", author: "Matt Haig", genre: "fiction", rating: 4.2, ratingsCount: 2847563, pages: 288, year: 2020, publisher: "Viking", isbn: "978-0525559474", description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.", c1: "#667eea", c2: "#764ba2", shelf: "currently-reading", progress: 65 },
  { id: 2, title: "Atomic Habits", author: "James Clear", genre: "self-help", rating: 4.4, ratingsCount: 1983642, pages: 320, year: 2018, publisher: "Avery", isbn: "978-0735211292", description: "An easy and proven way to build good habits and break bad ones. Tiny changes, remarkable results.", c1: "#f093fb", c2: "#f5576c", shelf: "read", dateRead: "2026-08-15" },
  { id: 3, title: "Project Hail Mary", author: "Andy Weir", genre: "sci-fi", rating: 4.6, ratingsCount: 1456789, pages: 476, year: 2021, publisher: "Ballantine Books", isbn: "978-0593135204", description: "A lone astronaut must save the earth from disaster in this propulsive interstellar adventure.", c1: "#4facfe", c2: "#00f2fe", shelf: "read", dateRead: "2026-09-01" },
  { id: 4, title: "The Song of Achilles", author: "Madeline Miller", genre: "fiction", rating: 4.3, ratingsCount: 2134567, pages: 378, year: 2012, publisher: "Ecco", isbn: "978-0062060624", description: "A tale of gods, kings, immortal fame and the human heart. A reimagining of Homer's Iliad.", c1: "#fa709a", c2: "#fee140", shelf: "read", dateRead: "2026-07-20" },
  { id: 5, title: "Dune", author: "Frank Herbert", genre: "sci-fi", rating: 4.5, ratingsCount: 3456789, pages: 688, year: 1965, publisher: "Ace", isbn: "978-0441172719", description: "Set on the desert planet Arrakis, Dune is the story of Paul Atreides, who would become known as Muad'Dib.", c1: "#a18cd1", c2: "#fbc2eb", shelf: "want-to-read" },
  { id: 6, title: "The Silent Patient", author: "Alex Michaelides", genre: "mystery", rating: 4.1, ratingsCount: 1876543, pages: 325, year: 2019, publisher: "Celadon Books", isbn: "978-1250301697", description: "Alicia Berenson's life is seemingly perfect until she shoots her husband five times and never speaks another word.", c1: "#e0c3fc", c2: "#8ec5fc", shelf: "read", dateRead: "2026-06-10" },
  { id: 7, title: "Educated", author: "Tara Westover", genre: "biography", rating: 4.4, ratingsCount: 1654321, pages: 334, year: 2018, publisher: "Random House", isbn: "978-0399590504", description: "A memoir about a young girl who leaves her survivalist family and goes on to earn a PhD from Cambridge.", c1: "#89f7fe", c2: "#66a6ff", shelf: "read", dateRead: "2026-05-28" },
  { id: 8, title: "The Seven Husbands of Evelyn Hugo", author: "Taylor Jenkins Reid", genre: "fiction", rating: 4.5, ratingsCount: 2345678, pages: 400, year: 2017, publisher: "Atria Books", isbn: "978-1501161933", description: "Aging Hollywood icon Evelyn Hugo finally tells the truth about her glamorous and scandalous life.", c1: "#f6d365", c2: "#fda085", shelf: "currently-reading", progress: 30 },
  { id: 9, title: "Sapiens", author: "Yuval Noah Harari", genre: "non-fiction", rating: 4.3, ratingsCount: 2876543, pages: 443, year: 2011, publisher: "Harvill Secker", isbn: "978-0099590088", description: "A brief history of humankind, exploring how Homo sapiens came to dominate the world.", c1: "#a1c4fd", c2: "#c2e9fb", shelf: "want-to-read" },
  { id: 10, title: "The Name of the Wind", author: "Patrick Rothfuss", genre: "fantasy", rating: 4.5, ratingsCount: 1987654, pages: 662, year: 2007, publisher: "DAW Books", isbn: "978-0756404741", description: "The riveting first-person narrative of Kvothe, a legendary figure living in hiding.", c1: "#d4fc79", c2: "#96e6a1", shelf: "read", dateRead: "2026-04-12" },
  { id: 11, title: "Normal People", author: "Sally Rooney", genre: "romance", rating: 3.9, ratingsCount: 1234567, pages: 273, year: 2018, publisher: "Hogarth", isbn: "978-1984822178", description: "The story of mutual fascination, friendship and love between two young people who keep finding their way back to each other.", c1: "#fbc2eb", c2: "#a6c1ee", shelf: "read", dateRead: "2026-03-05" },
  { id: 12, title: "The House in the Cerulean Sea", author: "TJ Klune", genre: "fantasy", rating: 4.4, ratingsCount: 987654, pages: 398, year: 2020, publisher: "Tor Books", isbn: "978-1250217288", description: "A magical story about what makes a family, the importance of being yourself, and the dangers of conformity.", c1: "#ffecd2", c2: "#fcb69f", shelf: "want-to-read" },
  { id: 13, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", genre: "non-fiction", rating: 4.2, ratingsCount: 1543210, pages: 499, year: 2011, publisher: "FSG", isbn: "978-0374533557", description: "An exploration of the two systems that drive the way we think and make choices.", c1: "#84fab0", c2: "#8fd3f4", shelf: "read", dateRead: "2026-02-18" },
  { id: 14, title: "The Invisible Life of Addie LaRue", author: "V.E. Schwab", genre: "fantasy", rating: 4.1, ratingsCount: 1345678, pages: 442, year: 2020, publisher: "Tor Books", isbn: "978-0765387561", description: "A woman makes a Faustian bargain to live forever but is cursed to be forgotten by everyone she meets.", c1: "#e0c3fc", c2: "#8ec5fc", shelf: "currently-reading", progress: 45 },
  { id: 15, title: "Where the Crawdads Sing", author: "Delia Owens", genre: "mystery", rating: 4.4, ratingsCount: 3210987, pages: 368, year: 2018, publisher: "G.P. Putnam's Sons", isbn: "978-0735219090", description: "A novel about a young woman who raised herself in the marshes of the deep South becomes a suspect in the murder of a man she was once involved with.", c1: "#fddb92", c2: "#d1fdff", shelf: "read", dateRead: "2026-01-22" },
  { id: 16, title: "The Psychology of Money", author: "Morgan Housel", genre: "self-help", rating: 4.3, ratingsCount: 876543, pages: 256, year: 2020, publisher: "Harriman House", isbn: "978-0857197689", description: "Timeless lessons on wealth, greed, and happiness. Doing well with money has little to do with how smart you are.", c1: "#667eea", c2: "#764ba2", shelf: "want-to-read" },
  { id: 17, title: "Klara and the Sun", author: "Kazuo Ishiguro", genre: "sci-fi", rating: 3.8, ratingsCount: 654321, pages: 303, year: 2021, publisher: "Knopf", isbn: "978-0593318171", description: "A thrilling novel that tells the story of Klara, an Artificial Friend with outstanding observational qualities.", c1: "#89f7fe", c2: "#66a6ff", shelf: "want-to-read" },
  { id: 18, title: "The Priory of the Orange Tree", author: "Samantha Shannon", genre: "fantasy", rating: 4.2, ratingsCount: 543210, pages: 848, year: 2019, publisher: "Bloomsbury", isbn: "978-1635570298", description: "A world divided. A queendom without an heir. An ancient enemy awakens.", c1: "#f093fb", c2: "#f5576c", shelf: "want-to-read" },
  { id: 19, title: "Beach Read", author: "Emily Henry", genre: "romance", rating: 4.0, ratingsCount: 765432, pages: 361, year: 2020, publisher: "Berkley", isbn: "978-1984806734", description: "Two writers with opposite genres swap styles for the summer. What could go wrong?", c1: "#f6d365", c2: "#fda085", shelf: "read", dateRead: "2026-08-30" },
  { id: 20, title: "The Vanishing Half", author: "Brit Bennett", genre: "fiction", rating: 4.1, ratingsCount: 1098765, pages: 343, year: 2020, publisher: "Riverhead Books", isbn: "978-0525536291", description: "The Vignes twin sisters will always be identical. But after growing up together in a small southern community, their lives diverge.", c1: "#a18cd1", c2: "#fbc2eb", shelf: "read", dateRead: "2026-09-10" },
  { id: 21, title: "Circe", author: "Madeline Miller", genre: "fantasy", rating: 4.3, ratingsCount: 1876543, pages: 393, year: 2018, publisher: "Little, Brown", isbn: "978-0316556347", description: "In the house of Helios, god of the sun, a daughter is born. But Circe is a strange child and she possesses the power of witchcraft.", c1: "#d4fc79", c2: "#96e6a1", shelf: "read", dateRead: "2026-07-05" },
  { id: 22, title: "The Guest List", author: "Lucy Foley", genre: "mystery", rating: 3.9, ratingsCount: 876543, pages: 320, year: 2020, publisher: "William Morrow", isbn: "978-0062868930", description: "A wedding celebration turns dark and deadly in this deliciously suspenseful and twisty novel.", c1: "#e0c3fc", c2: "#8ec5fc", shelf: "want-to-read" },
  { id: 23, title: "A Gentleman in Moscow", author: "Amor Towles", genre: "fiction", rating: 4.4, ratingsCount: 1234567, pages: 462, year: 2016, publisher: "Viking", isbn: "978-0143110439", description: "A novel about a man who is ordered to spend the rest of his life inside a luxury hotel.", c1: "#89f7fe", c2: "#66a6ff", shelf: "read", dateRead: "2026-03-28" },
  { id: 24, title: "The Alchemist", author: "Paulo Coelho", genre: "fiction", rating: 3.9, ratingsCount: 4567890, pages: 208, year: 1988, publisher: "HarperOne", isbn: "978-0062315007", description: "A fable about following your dream, combining magic, mysticism, wisdom and wonder.", c1: "#fddb92", c2: "#d1fdff", shelf: "read", dateRead: "2025-12-15" },
];

const COMMUNITY_POSTS = [
  { id: 1, user: "Sarah Kim", avatar: "SK", avatarBg: "#6c5ce7", time: "2 hours ago", content: "Just finished Project Hail Mary and I'm absolutely blown away. Andy Weir did it again! The science is fascinating and the humor is perfect. 10/10 would recommend to any sci-fi lover.", bookId: 3, likes: 42, comments: 12 },
  { id: 2, user: "Mike Rodriguez", avatar: "MR", avatarBg: "#e84393", time: "5 hours ago", content: "Currently reading The Midnight Library and it's hitting different. The concept of exploring alternate lives is so thought-provoking. Has anyone else read it?", bookId: 1, likes: 28, comments: 8 },
  { id: 3, user: "Anna Lee", avatar: "AL", avatarBg: "#00b894", time: "1 day ago", content: "My 2026 reading challenge is going strong! 12 books done so far. Just started The Seven Husbands of Evelyn Hugo and I can already tell it's going to be a favorite.", bookId: 8, likes: 56, comments: 15 },
  { id: 4, user: "James Chen", avatar: "JC", avatarBg: "#f5a623", time: "2 days ago", content: "Dune is a masterpiece. The world-building is unmatched and the political intrigue keeps you on the edge of your seat. Finally understand why it's considered the greatest sci-fi novel.", bookId: 5, likes: 89, comments: 23 },
  { id: 5, user: "Emma Watson", avatar: "EW", avatarBg: "#0984e3", time: "3 days ago", content: "Looking for recommendations! I love fantasy with strong female leads. Already read and loved Circe and The Priory of the Orange Tree. What should I read next?", bookId: null, likes: 34, comments: 45 },
];

const ACTIVITIES = [
  { type: "read", text: "Finished reading <strong>Project Hail Mary</strong> by Andy Weir", time: "2 days ago", icon: "📖" },
  { type: "review", text: "Reviewed <strong>The Midnight Library</strong> — ★★★★☆", time: "3 days ago", icon: "⭐" },
  { type: "shelf", text: "Added <strong>Dune</strong> to Want to Read shelf", time: "5 days ago", icon: "📚" },
  { type: "read", text: "Finished reading <strong>The Seven Husbands of Evelyn Hugo</strong>", time: "1 week ago", icon: "📖" },
  { type: "review", text: "Reviewed <strong>Atomic Habits</strong> — ★★★★★", time: "2 weeks ago", icon: "⭐" },
  { type: "shelf", text: "Added <strong>The House in the Cerulean Sea</strong> to Want to Read shelf", time: "2 weeks ago", icon: "📚" },
];

const app = {
  currentPage: "home",
  currentShelf: "all",
  currentGenre: "all",
  currentSort: "popular",
  searchQuery: "",

  init() {
    this.loadTheme();
    this.renderHome();
    this.renderMyBooks();
    this.renderBrowse();
    this.renderCommunity();
    this.renderProfile();
    this.updateShelfCounts();
  },

  navigate(page) {
    this.currentPage = page;
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
    const pageEl = document.getElementById("page-" + page);
    if (pageEl) pageEl.classList.add("active");
    document.querySelectorAll(`.nav-link[data-page="${page}"]`).forEach(l => l.classList.add("active"));
    document.getElementById("mobileMenu").classList.remove("open");
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("booknest-theme", next);
  },

  loadTheme() {
    const saved = localStorage.getItem("booknest-theme");
    if (saved) document.documentElement.setAttribute("data-theme", saved);
  },

  toggleMobileMenu() {
    document.getElementById("mobileMenu").classList.toggle("open");
  },

  handleSearch(query) {
    this.searchQuery = query.toLowerCase().trim();
    if (this.searchQuery.length > 0) {
      this.navigate("search");
      this.renderSearch();
    } else if (this.currentPage === "search") {
      this.navigate("home");
    }
  },

  renderSearch() {
    const container = document.getElementById("searchResults");
    const queryEl = document.getElementById("searchQuery");
    queryEl.textContent = this.searchQuery ? `Showing results for "${this.searchQuery}"` : "";
    const results = BOOKS.filter(b =>
      b.title.toLowerCase().includes(this.searchQuery) ||
      b.author.toLowerCase().includes(this.searchQuery) ||
      b.genre.toLowerCase().includes(this.searchQuery)
    );
    if (results.length === 0) {
      container.innerHTML = `<div class="empty-state"><h3>No books found</h3><p>Try a different search term</p></div>`;
      return;
    }
    container.innerHTML = results.map(b => this.bookCardHTML(b)).join("");
  },

  renderHome() {
    const currentlyReading = BOOKS.filter(b => b.shelf === "currently-reading");
    const popular = [...BOOKS].sort((a, b) => b.ratingsCount - a.ratingsCount).slice(0, 8);
    const newReleases = [...BOOKS].sort((a, b) => b.year - a.year).slice(0, 6);

    document.getElementById("currentlyReading").innerHTML = currentlyReading.map(b => this.bookCardHTML(b)).join("");
    document.getElementById("popularBooks").innerHTML = popular.map(b => this.bookCardHTML(b)).join("");
    document.getElementById("newReleases").innerHTML = newReleases.map(b => this.bookCardHTML(b)).join("");
  },

  renderMyBooks() {
    this.updateShelfCounts();
    const grid = document.getElementById("myBooksGrid");
    let books = BOOKS.filter(b => b.shelf);
    if (this.currentShelf !== "all") {
      books = books.filter(b => b.shelf === this.currentShelf);
    }
    if (books.length === 0) {
      grid.innerHTML = `<div class="empty-state"><h3>No books on this shelf</h3><p>Browse books to add them to your shelves</p></div>`;
      return;
    }
    grid.innerHTML = books.map(b => this.bookCardHTML(b)).join("");
  },

  renderBrowse() {
    let books = [...BOOKS];
    if (this.currentGenre !== "all") {
      books = books.filter(b => b.genre === this.currentGenre);
    }
    books = this.sortBookList(books);
    document.getElementById("browseGrid").innerHTML = books.map(b => this.bookCardHTML(b)).join("");
  },

  renderCommunity() {
    const feed = document.getElementById("communityFeed");
    feed.innerHTML = COMMUNITY_POSTS.map(post => {
      const book = post.bookId ? BOOKS.find(b => b.id === post.bookId) : null;
      return `
        <div class="feed-post">
          <div class="feed-header">
            <div class="feed-avatar" style="background:${post.avatarBg}">${post.avatar}</div>
            <div>
              <div class="feed-user">${post.user}</div>
              <div class="feed-time">${post.time}</div>
            </div>
          </div>
          <div class="feed-content">${post.content}</div>
          ${book ? `
            <div class="feed-book" onclick="app.openBookModal(${book.id})">
              <div class="feed-book-cover" style="background:linear-gradient(135deg, ${book.c1}, ${book.c2})">${book.title}</div>
              <div class="feed-book-info">
                <div class="feed-book-title">${book.title}</div>
                <div class="feed-book-author">${book.author}</div>
              </div>
            </div>
          ` : ""}
          <div class="feed-actions">
            <button class="feed-action" onclick="app.handleLike(this)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              ${post.likes}
            </button>
            <button class="feed-action">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              ${post.comments}
            </button>
          </div>
        </div>
      `;
    }).join("");
  },

  renderProfile() {
    const list = document.getElementById("activityList");
    list.innerHTML = ACTIVITIES.map(a => `
      <div class="activity-item">
        <div class="activity-icon ${a.type}">${a.icon}</div>
        <div>
          <div class="activity-text">${a.text}</div>
          <div class="activity-time">${a.time}</div>
        </div>
      </div>
    `).join("");
  },

  updateShelfCounts() {
    const shelves = { read: 0, "currently-reading": 0, "want-to-read": 0 };
    BOOKS.forEach(b => { if (b.shelf && shelves[b.shelf] !== undefined) shelves[b.shelf]++; });
    const list = document.getElementById("shelfList");
    list.innerHTML = `
      <li><button class="${this.currentShelf === 'all' ? 'active' : ''}" onclick="app.filterShelf('all')">All Books <span class="shelf-count">${BOOKS.filter(b => b.shelf).length}</span></button></li>
      <li><button class="${this.currentShelf === 'read' ? 'active' : ''}" onclick="app.filterShelf('read')">Read <span class="shelf-count">${shelves.read}</span></button></li>
      <li><button class="${this.currentShelf === 'currently-reading' ? 'active' : ''}" onclick="app.filterShelf('currently-reading')">Currently Reading <span class="shelf-count">${shelves['currently-reading']}</span></button></li>
      <li><button class="${this.currentShelf === 'want-to-read' ? 'active' : ''}" onclick="app.filterShelf('want-to-read')">Want to Read <span class="shelf-count">${shelves['want-to-read']}</span></button></li>
    `;
  },

  filterShelf(shelf) {
    this.currentShelf = shelf;
    document.querySelectorAll(".shelf-tab").forEach(t => t.classList.remove("active"));
    document.querySelector(`.shelf-tab[data-shelf="${shelf}"]`)?.classList.add("active");
    this.renderMyBooks();
  },

  filterByGenre(genre) {
    this.currentGenre = genre;
    this.renderBrowse();
  },

  sortBooks(sort) {
    this.currentSort = sort;
    this.renderBrowse();
  },

  sortBookList(books) {
    switch (this.currentSort) {
      case "rating": return books.sort((a, b) => b.rating - a.rating);
      case "newest": return books.sort((a, b) => b.year - a.year);
      case "title": return books.sort((a, b) => a.title.localeCompare(b.title));
      default: return books.sort((a, b) => b.ratingsCount - a.ratingsCount);
    }
  },

  bookCardHTML(book) {
    const badge = book.shelf === "currently-reading" ? '<span class="book-badge badge-reading">Reading</span>' :
                  book.shelf === "want-to-read" ? '<span class="book-badge badge-want">Want</span>' :
                  book.shelf === "read" ? '<span class="book-badge badge-read">Read</span>' : '';
    const stars = this.renderStars(book.rating);
    return `
      <div class="book-card" onclick="app.openBookModal(${book.id})">
        <div class="book-card-cover" style="background:linear-gradient(135deg, ${book.c1}, ${book.c2})">
          ${badge}
          ${book.title}
        </div>
        <div class="book-card-title">${book.title}</div>
        <div class="book-card-author">${book.author}</div>
        <div class="book-card-rating"><span class="stars">${stars}</span> ${book.rating}</div>
      </div>
    `;
  },

  renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let s = "";
    for (let i = 0; i < full; i++) s += "★";
    if (half) s += "½";
    for (let i = s.length; i < 5; i++) s += "☆";
    return s;
  },

  openBookModal(bookId) {
    const book = BOOKS.find(b => b.id === bookId);
    if (!book) return;
    const modal = document.getElementById("bookModal");
    const body = document.getElementById("modalBody");
    const shelfOptions = ["read", "currently-reading", "want-to-read"];
    const shelfLabels = { "read": "Read", "currently-reading": "Currently Reading", "want-to-read": "Want to Read" };
    body.innerHTML = `
      <div class="modal-book">
        <div class="modal-book-cover" style="background:linear-gradient(135deg, ${book.c1}, ${book.c2})">${book.title}</div>
        <div class="modal-book-info">
          <h2>${book.title}</h2>
          <div class="modal-book-author">by ${book.author}</div>
          <div class="modal-rating">
            <span class="stars">${this.renderStars(book.rating)}</span>
            <span class="modal-rating-num">${book.rating}</span>
            <span class="modal-rating-count">(${book.ratingsCount.toLocaleString()} ratings)</span>
          </div>
          <p class="modal-description">${book.description}</p>
          <div class="modal-actions">
            <select class="modal-shelf-select" onchange="app.changeShelf(${book.id}, this.value)">
              <option value="">Add to shelf...</option>
              ${shelfOptions.map(s => `<option value="${s}" ${book.shelf === s ? "selected" : ""}>${shelfLabels[s]}</option>`).join("")}
            </select>
            <button class="btn btn-primary btn-sm" onclick="app.writeReview(${book.id})">Write a Review</button>
          </div>
          <div class="modal-meta">
            <div class="meta-item"><div class="meta-label">Pages</div><div class="meta-value">${book.pages}</div></div>
            <div class="meta-item"><div class="meta-label">Published</div><div class="meta-value">${book.year}</div></div>
            <div class="meta-item"><div class="meta-label">Genre</div><div class="meta-value">${book.genre.charAt(0).toUpperCase() + book.genre.slice(1)}</div></div>
            <div class="meta-item"><div class="meta-label">Publisher</div><div class="meta-value">${book.publisher}</div></div>
          </div>
        </div>
      </div>
    `;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  },

  closeModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById("bookModal").classList.remove("open");
    document.body.style.overflow = "";
  },

  changeShelf(bookId, newShelf) {
    const book = BOOKS.find(b => b.id === bookId);
    if (!book || !newShelf) return;
    book.shelf = newShelf;
    this.showToast(`"${book.title}" added to ${newShelf === "currently-reading" ? "Currently Reading" : newShelf === "want-to-read" ? "Want to Read" : "Read"}`);
    this.updateShelfCounts();
    this.renderHome();
    this.renderMyBooks();
    this.renderBrowse();
    this.openBookModal(bookId);
  },

  writeReview(bookId) {
    this.showToast("Review feature coming soon!");
  },

  handleLike(btn) {
    const text = btn.textContent.trim();
    const num = parseInt(text) || 0;
    btn.innerHTML = btn.innerHTML.replace(num, num + 1);
  },

  showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  },
};

document.addEventListener("DOMContentLoaded", () => app.init());
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") app.closeModal();
});

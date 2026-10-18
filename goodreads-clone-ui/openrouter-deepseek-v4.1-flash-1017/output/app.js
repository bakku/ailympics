/* ============================================================
   Marginalia — mocked reading room
   A self-hosted Goodreads-style UI. All data lives in the browser.
   ============================================================ */

'use strict';

/* ---------- Data ---------- */
const A = {
  maya: 'assets/avatars/maya.svg',
  jonah: 'assets/avatars/jonah.svg',
  samira: 'assets/avatars/samira.svg',
  theo: 'assets/avatars/theo.svg',
  iris: 'assets/avatars/iris.svg',
  noah: 'assets/avatars/noah.svg',
};

const people = {
  maya: { name: 'Maya Chen', handle: '@maya', avatar: A.maya, bio: 'Reader, note-taker, keeper of too many bookmarks.' },
  jonah: { name: 'Jonah Reed', handle: '@jonah', avatar: A.jonah, bio: 'Slow reader. Fast talker.' },
  samira: { name: 'Samira Haddad', handle: '@samira', avatar: A.samira, bio: 'Mysteries, margins, and very strong tea.' },
  theo: { name: 'Theo Mercer', handle: '@theo', avatar: A.theo, bio: 'Weather watcher. Novelist-ish.' },
  iris: { name: 'Iris Bell', handle: '@iris', avatar: A.iris, bio: 'Reading my way through the garden.' },
  noah: { name: 'Noah Park', handle: '@noah', avatar: A.noah, bio: 'Speculative fiction and late-night walks.' },
};

const seedBooks = [
  {
    id: 'orchard',
    title: 'The Orchard at Midnight',
    author: 'Elena Voss',
    year: 2025,
    pages: 384,
    rating: 4.3,
    ratingsCount: 12840,
    reviewsCount: 2416,
    genre: 'Literary fiction',
    filter: 'fiction',
    shelf: 'reading',
    progress: 168,
    added: '2026-10-06',
    finishedDate: null,
    myRating: 0,
    cover: 'assets/covers/orchard.svg',
    format: 'Hardcover',
    publisher: 'Alder House',
    quote: 'Some houses keep their people. This one kept their secrets.',
    description: [
      'On the last night of September, three sisters return to the orchard their family has kept for a century. The gates are unlocked, the harvest is untouched, and their mother’s handwriting is fresh in the margins of a book she never wrote.',
      'As the days shorten, the orchard begins to give up its strange harvest of memories. A luminous novel about inheritance, forgiveness, and the stories we plant for the people who come after us.'
    ],
    badge: 'Currently reading',
  },
  {
    id: 'salt',
    title: 'Salt & Smoke',
    author: 'Niamh Calloway',
    year: 2024,
    pages: 288,
    rating: 4.6,
    ratingsCount: 8240,
    reviewsCount: 1204,
    genre: 'Memoir',
    filter: 'memoir',
    shelf: 'read',
    progress: 288,
    added: '2026-08-24',
    finishedDate: '2026-10-12',
    myRating: 5,
    cover: 'assets/covers/salt.svg',
    format: 'Paperback',
    publisher: 'Tidewater Press',
    quote: 'The sea does not return what it takes. It returns something else.',
    description: [
      'After twenty years away, Niamh Calloway returns to the small Irish harbour town she grew up in to empty her childhood home. What begins as a practical reckoning with boxes and belongings becomes an unflinching portrait of a family shaped by salt air, silences, and the rituals of the shore.',
      'Tender, wry, and salted with grief, Salt & Smoke is a memoir about the stories families tell to survive — and the ones they finally learn to tell out loud.'
    ],
    badge: 'Just finished',
  },
  {
    id: 'storms',
    title: 'A Field Guide to Storms',
    author: 'Theo Mercer',
    year: 2026,
    pages: 336,
    rating: 4.1,
    ratingsCount: 3120,
    reviewsCount: 421,
    genre: 'Literary fiction',
    filter: 'fiction',
    shelf: 'want',
    progress: 0,
    added: '2026-10-14',
    finishedDate: null,
    myRating: 0,
    cover: 'assets/covers/storms.svg',
    format: 'Hardcover',
    publisher: 'Northline',
    quote: 'Every storm is a kind of letter. You only learn to read it afterwards.',
    description: [
      'A weather-obsessed schoolteacher begins cataloguing the storms of a small coastal town and uncovers a pattern that links them to the people who disappeared there. Part family mystery, part love letter to a changing landscape, this is a novel of quiet weather and enormous feeling.',
      'Told over one turbulent year, A Field Guide to Storms asks what we owe to the places that raised us — and to the people we failed to understand.'
    ],
    badge: 'On your list',
  },
  {
    id: 'archive',
    title: 'The Last Archive',
    author: 'June Okafor',
    year: 2025,
    pages: 412,
    rating: 4.4,
    ratingsCount: 21450,
    reviewsCount: 3120,
    genre: 'Mystery',
    filter: 'mystery',
    shelf: 'read',
    progress: 412,
    added: '2026-08-18',
    finishedDate: '2026-09-03',
    myRating: 4,
    cover: 'assets/covers/archive.svg',
    format: 'Hardcover',
    publisher: 'Lantern & Loom',
    quote: 'The past is not lost. It is only waiting to be catalogued.',
    description: [
      'When a university archivist finds a misfiled letter that should not exist, she is drawn into the century-old disappearance of a pioneering librarian — and a secret the city has spent generations curating.',
      'Okafor’s intricate, atmospheric mystery is a love letter to libraries and the people who guard their ghosts. For readers of The Shadow of the Wind and Possession.'
    ],
  },
  {
    id: 'small-hours',
    title: 'Small Hours',
    author: 'Priya Nair',
    year: 2024,
    pages: 288,
    rating: 4.0,
    ratingsCount: 9180,
    reviewsCount: 1102,
    genre: 'Contemporary fiction',
    filter: 'fiction',
    shelf: 'reading',
    progress: 92,
    added: '2026-09-28',
    finishedDate: null,
    myRating: 0,
    cover: 'assets/covers/small-hours.svg',
    format: 'Paperback',
    publisher: 'Kindling',
    quote: 'At 3 a.m., every window in the city is a small confession.',
    description: [
      'Between midnight and dawn, five neighbours in a Mumbai apartment block find their lives quietly intersecting through a shared courtyard, a stray cat, and a power cut that lasts all night.',
      'Warm, precise, and full of noticing, Small Hours is a novel about the people we pass every day and the enormous lives they carry just out of sight.'
    ],
  },
  {
    id: 'falcon',
    title: "Under the Falcon's Wing",
    author: 'Adrien Blackwood',
    year: 2026,
    pages: 528,
    rating: 4.2,
    ratingsCount: 14700,
    reviewsCount: 1834,
    genre: 'Fantasy',
    filter: 'fantasy',
    shelf: 'want',
    progress: 0,
    added: '2026-10-08',
    finishedDate: null,
    myRating: 0,
    cover: 'assets/covers/falcon.svg',
    format: 'Hardcover',
    publisher: 'The Ninth Door',
    quote: 'The sky remembers every wing that has ever crossed it.',
    description: [
      'The first book in the Halcyon Cycle. In a kingdom where birds carry the memories of the dead, a young falconer is chosen to guide the last messenger between the living and the lost.',
      'A sweeping, lyrical fantasy about loyalty, empire, and the price of remembering. Begin the series everyone in your reading circle is talking about.'
    ],
    badge: 'New this month',
  },
  {
    id: 'glass',
    title: 'The Glass Orchard',
    author: 'Mireille Laurent',
    year: 2023,
    pages: 368,
    rating: 3.9,
    ratingsCount: 6100,
    reviewsCount: 760,
    genre: 'Historical fiction',
    filter: 'fiction',
    shelf: 'read',
    progress: 368,
    added: '2026-06-30',
    finishedDate: '2026-07-12',
    myRating: 4,
    cover: 'assets/covers/glass.svg',
    format: 'Paperback',
    publisher: 'Vellum',
    quote: 'Nothing in the orchard was ever truly lost. It was only changed.',
    description: [
      'In 1890s Provence, two sisters inherit a failing orchard and a greenhouse full of impossible glass fruit. One wants to sell. The other wants to remember.',
      'A shimmering historical novel about sisters, inheritance, and the fragile things we choose to preserve.'
    ],
  },
  {
    id: 'moons',
    title: 'Paper Moons',
    author: 'Kenji Sato',
    year: 2025,
    pages: 304,
    rating: 4.5,
    ratingsCount: 11230,
    reviewsCount: 1520,
    genre: 'Science fiction',
    filter: 'scifi',
    shelf: 'want',
    progress: 0,
    added: '2026-09-12',
    finishedDate: null,
    myRating: 0,
    cover: 'assets/covers/moons.svg',
    format: 'Paperback',
    publisher: 'Vector',
    quote: 'Every world we made was a rehearsal for coming home.',
    description: [
      'A cartographer aboard a failing generation ship spends her nights mapping the false moons her ancestors painted on the ceiling. When one of them begins to move, she must decide which version of home is real.',
      'Quiet, inventive science fiction with the emotional pull of Station Eleven and the intimate scale of a memory.'
    ],
  },
  {
    id: 'wildwood',
    title: 'Wildwood Almanac',
    author: 'Rowan Ellis',
    year: 2024,
    pages: 240,
    rating: 4.7,
    ratingsCount: 4860,
    reviewsCount: 680,
    genre: 'Nature writing',
    filter: 'nonfiction',
    shelf: 'read',
    progress: 240,
    added: '2026-05-02',
    finishedDate: '2026-05-30',
    myRating: 5,
    cover: 'assets/covers/wildwood.svg',
    format: 'Hardcover',
    publisher: 'Common Ground',
    quote: 'The woods do not ask you to be anything but awake.',
    description: [
      'One year, one patch of ancient woodland, and a notebook full of small astonishments. Rowan Ellis traces the life of the forest through lichen, owl calls, flooded paths, and the slow work of paying attention.',
      'A companion for country walks and city windowsills alike, Wildwood Almanac is a reminder that the wild is always closer than we think.'
    ],
  },
  {
    id: 'engine',
    title: 'The Quiet Engine',
    author: 'Felix Adler',
    year: 2022,
    pages: 272,
    rating: 3.7,
    ratingsCount: 5730,
    reviewsCount: 410,
    genre: 'Nonfiction',
    filter: 'nonfiction',
    shelf: 'read',
    progress: 272,
    added: '2026-03-12',
    finishedDate: '2026-04-15',
    myRating: 3,
    cover: 'assets/covers/engine.svg',
    format: 'Hardcover',
    publisher: 'Praxis',
    quote: 'Attention is the rarest form of generosity.',
    description: [
      'An essayist and former engineer asks what gets lost when we mistake productivity for purpose. Drawing on workshops, monasteries, and a year of deliberate noticing, Adler offers a gentle case for doing less, better.',
      'Part cultural criticism, part field guide to a quieter life — best read slowly, with a pencil.'
    ],
  },
  {
    id: 'nightingale',
    title: "The Nightingale's Atlas",
    author: 'A. S. Vale',
    year: 2026,
    pages: 496,
    rating: 4.6,
    ratingsCount: 18920,
    reviewsCount: 2810,
    genre: 'Fantasy',
    filter: 'fantasy',
    shelf: 'want',
    progress: 0,
    added: '2026-09-30',
    finishedDate: null,
    myRating: 0,
    cover: 'assets/covers/nightingale.svg',
    format: 'Hardcover',
    publisher: 'The Ninth Door',
    quote: 'The world is not a map. It is a song you learn by walking.',
    description: [
      'Every seven years, the Nightingale returns to rewrite the maps of the known world. This year, a young mapmaker discovers the bird has gone missing — and that the borders of her country are beginning to move.',
      'A lush, golden fantasy of songs, wandering, and the stories that hold a world together. October’s reading circle pick.'
    ],
    badge: 'Circle pick',
  },
  {
    id: 'hollow',
    title: 'Hollow Tide',
    author: 'Maren Hale',
    year: 2023,
    pages: 320,
    rating: 4.0,
    ratingsCount: 7650,
    reviewsCount: 890,
    genre: 'Horror',
    filter: 'horror',
    shelf: 'want',
    progress: 0,
    added: '2026-10-09',
    finishedDate: null,
    myRating: 0,
    cover: 'assets/covers/hollow.svg',
    format: 'Paperback',
    publisher: 'Blackwater',
    quote: 'At low tide, the village looks like it is holding its breath.',
    description: [
      'A marine biologist returns to the island where her brother vanished and finds the shoreline has moved closer to the houses each night. The villagers insist nothing is wrong.',
      'A slow-burning gothic horror about grief, the sea, and the things that wait just below the tideline.'
    ],
  },
  {
    id: 'honey',
    title: 'Honey from Stone',
    author: 'Lila Moreno',
    year: 2025,
    pages: 112,
    rating: 4.3,
    ratingsCount: 1240,
    reviewsCount: 260,
    genre: 'Poetry',
    filter: 'poetry',
    shelf: 'read',
    progress: 112,
    added: '2026-02-20',
    finishedDate: '2026-03-22',
    myRating: 4,
    cover: 'assets/covers/honey.svg',
    format: 'Paperback',
    publisher: 'Small Hours Press',
    quote: 'There is a way to be sweet without becoming soft.',
    description: [
      'Poems about small stubborn things: a grandmother’s hands, limestone, late-summer figs, the sweetness that survives pressure. Lila Moreno’s second collection is spare, bright, and quietly devastating.',
      'Best accompanied by a window, a cup of tea, and no particular hurry.'
    ],
  },
  {
    id: 'memory',
    title: 'The Memory Thief',
    author: 'Daniel Okonkwo',
    year: 2024,
    pages: 352,
    rating: 4.2,
    ratingsCount: 10460,
    reviewsCount: 1300,
    genre: 'Mystery',
    filter: 'mystery',
    shelf: 'read',
    progress: 352,
    added: '2026-01-04',
    finishedDate: '2026-02-11',
    myRating: 4,
    cover: 'assets/covers/memory.svg',
    format: 'Hardcover',
    publisher: 'Lantern & Loom',
    quote: 'A memory is a room you can never quite leave.',
    description: [
      'A photographer who can no longer remember her own past begins finding strangers’ memories tucked inside her negatives. To reclaim her life, she must first solve the mystery of a woman who never existed.',
      'A smart, disorienting literary mystery about identity, image-making, and the stories we let develop in the dark.'
    ],
  },
  {
    id: 'cartographer',
    title: "The Cartographer's Wife",
    author: 'Isabelle Roux',
    year: 2021,
    pages: 448,
    rating: 4.1,
    ratingsCount: 9310,
    reviewsCount: 1100,
    genre: 'Historical fiction',
    filter: 'fiction',
    shelf: 'want',
    progress: 0,
    added: '2026-08-22',
    finishedDate: null,
    myRating: 0,
    cover: 'assets/covers/cartographer.svg',
    format: 'Paperback',
    publisher: 'Vellum',
    quote: 'He mapped every coast but the one between us.',
    description: [
      'In 1760s Marseille, the wife of a celebrated cartographer discovers that his most beautiful maps are deliberately wrong. Her search for the truth leads to a hidden island — and a life she was not meant to find.',
      'A rich historical mystery of marriage, empire, and the secret geographies we draw around ourselves.'
    ],
  },
  {
    id: 'rain',
    title: 'A Season of Rain',
    author: 'Clara Bellamy',
    year: 2026,
    pages: 384,
    rating: 4.4,
    ratingsCount: 16800,
    reviewsCount: 2140,
    genre: 'Literary fiction',
    filter: 'fiction',
    shelf: 'read',
    progress: 384,
    added: '2025-12-28',
    finishedDate: '2026-01-18',
    myRating: 5,
    cover: 'assets/covers/rain.svg',
    format: 'Hardcover',
    publisher: 'Alder House',
    quote: 'The rain did not wash anything away. It made everything already there more visible.',
    description: [
      'A house, four generations, and a hundred winters of weather. When the Bellamy family gathers to decide what to do with the old house on the hill, they discover their memories have been keeping different records.',
      'A luminous, big-hearted novel about the stories that bind a family and the weather that quietly changes them.'
    ],
    badge: 'Staff pick',
  },
];

const seedReviews = {
  archive: [
    { id: 'r1', user: 'samira', rating: 5, date: 'Yesterday', text: 'I don’t think I breathed during the last forty pages. Okafor writes like a historian with a flashlight — every dusty corner suddenly has a pulse. The ending recontextualises the whole first half in a way that made me want to start again immediately.', likes: 34 },
    { id: 'r2', user: 'jonah', rating: 4, date: '4 days ago', text: 'A gorgeous, patient mystery. It asks you to sit with the not-knowing for longer than most thrillers would dare. The middle sags a little, but that final chapter is worth everything.', likes: 18 },
    { id: 'r3', user: 'iris', rating: 5, date: '1 week ago', text: 'The rare book about books that trusts readers to keep up. I underlined a sentence every few pages and still feel like I missed something wonderful.', likes: 12 },
  ],
  orchard: [
    { id: 'r4', user: 'theo', rating: 5, date: '3 days ago', text: 'The prose does that thing where it feels simple until you realise how precisely it has been tuned. I’ve been thinking about the greenhouse scene for days.', likes: 21 },
    { id: 'r5', user: 'iris', rating: 4, date: '2 weeks ago', text: 'Unsettling in exactly the right way. Read it with the windows open.', likes: 9 },
  ],
  wildwood: [
    { id: 'r6', user: 'iris', rating: 5, date: '3 months ago', text: 'I read this a chapter at a time and it changed the way I walk home. No other book this year has made me look so closely at the ordinary world.', likes: 27 },
    { id: 'r7', user: 'samira', rating: 4, date: '4 months ago', text: 'Less a book than a long, exhaled breath. The chapter on owls alone is worth the price of admission.', likes: 11 },
  ],
  salt: [
    { id: 'r8', user: 'jonah', rating: 5, date: '2 months ago', text: 'Calloway can make a kitchen table feel like the whole Atlantic. I cried over a paragraph about a kettle.', likes: 41 },
  ],
  moons: [
    { id: 'r9', user: 'noah', rating: 4, date: '5 days ago', text: 'The most tender generation-ship novel I’ve read. It’s really about inheritance and the small lies that keep a place alive.', likes: 16 },
  ],
  nightingale: [
    { id: 'r10', user: 'samira', rating: 5, date: '1 week ago', text: 'A fantasy that feels like a folk tale you were told once and have been trying to remember ever since. The map-writing sequences are extraordinary.', likes: 52 },
  ],
  rain: [
    { id: 'r11', user: 'theo', rating: 5, date: '1 month ago', text: 'Bellamy writes weather the way other people write love scenes. I closed the last page and immediately missed the house.', likes: 30 },
  ],
  glass: [
    { id: 'r12', user: 'iris', rating: 4, date: '3 months ago', text: 'A beautiful, restrained story about women building something of their own. The greenhouse descriptions are pure pleasure.', likes: 8 },
  ],
};

const seedPosts = [
  {
    id: 'p1', type: 'review', user: 'samira', bookId: 'archive', rating: 5, date: '2 hours ago',
    text: 'Finished this at 1 a.m. and had to sit in the dark for a minute. The Last Archive is a mystery about who gets to decide what the past means — and Okafor makes every old letter feel dangerous. If you liked Possession but wanted more ghosts, this is your book.',
    likes: 42, comments: 12, liked: false, saved: false,
  },
  {
    id: 'p2', type: 'discussion', user: 'jonah', date: '4 hours ago',
    title: 'What’s a book you wish you could experience for the first time again?',
    text: 'I keep chasing the feeling of reading Piranesi with absolutely no idea what was coming. What book would you erase from your memory just to meet it again?',
    tags: ['Discussion', 'Reading life'], likes: 87, comments: 36, liked: false, saved: false,
    participants: ['samira', 'theo', 'iris', 'noah'],
  },
  {
    id: 'p3', type: 'review', user: 'iris', bookId: 'wildwood', rating: 5, date: '6 hours ago',
    text: 'A gentle reminder that attention is a form of love. I started keeping a tiny nature notebook because of this book and have already filled six pages with things I would normally walk past.',
    likes: 28, comments: 5, liked: false, saved: false,
  },
  {
    id: 'p4', type: 'note', user: 'theo', bookId: 'orchard', date: 'Yesterday',
    text: 'Three chapters in and I have already stopped to re-read this sentence twice. Reading slowly on purpose this week.',
    quote: 'Some houses keep their people. This one kept their secrets.',
    likes: 19, comments: 3, liked: false, saved: false,
  },
  {
    id: 'p5', type: 'review', user: 'noah', bookId: 'moons', rating: 4, date: 'Yesterday',
    text: 'A quiet, devastating little book about the maps we make to avoid going home. The moon imagery gets a bit repetitive in the middle, but the last fifty pages are perfect.',
    likes: 23, comments: 8, liked: false, saved: false,
  },
  {
    id: 'p6', type: 'discussion', user: 'samira', date: '2 days ago',
    title: 'The October reading circle: first impressions of The Nightingale’s Atlas',
    text: 'We’re one week into the readalong and I want to know: whose map would you steal if you could? No spoilers past chapter nine, please.',
    tags: ['Readalong', 'Fantasy'], likes: 64, comments: 41, liked: false, saved: false,
    participants: ['jonah', 'theo', 'noah'],
  },
];

const seedNotifications = [
  { id: 'n1', icon: 'bookmark', accent: true, user: 'samira', text: 'finished <strong>The Last Archive</strong> and rated it 5 stars', time: '12 min ago', unread: true, action: { book: 'archive' } },
  { id: 'n2', icon: 'message', accent: false, user: 'jonah', text: 'replied to your note in <strong>What are you reading this weekend?</strong>', time: '1 hour ago', unread: true, action: { route: 'community' } },
  { id: 'n3', icon: 'target', accent: false, user: '', text: 'You’re halfway to your <strong>2026 reading goal</strong>. Eight books to go.', time: '3 hours ago', unread: true, action: { route: 'stats' } },
  { id: 'n4', icon: 'sparkles', accent: false, user: '', text: 'New books from authors you follow are waiting in <strong>Browse</strong>.', time: 'Yesterday', unread: false, action: { route: 'browse' } },
];

const seedNotes = {
  text: 'I keep a stack by the bed like an emergency exit.',
  author: 'maya',
  context: 'A note from your commonplace book',
};

const friendsReading = [
  { user: 'samira', action: 'Finished', bookId: 'archive', meta: '2h ago', online: false },
  { user: 'jonah', action: 'Reading', bookId: 'nightingale', meta: 'p. 188', online: true },
  { user: 'iris', action: 'Wants to read', bookId: 'cartographer', meta: 'yesterday', online: false },
];

const STORAGE_KEY = 'marginalia-theme-v1';
const SHELF_META = {
  want: { label: 'Want to read', short: 'Want to read', icon: 'bookmark' },
  reading: { label: 'Currently reading', short: 'Reading', icon: 'clock' },
  read: { label: 'Read', short: 'Read', icon: 'check' },
};
const FILTERS = [
  ['all', 'All books'], ['fiction', 'Fiction'], ['mystery', 'Mystery'], ['fantasy', 'Fantasy'],
  ['scifi', 'Sci-fi'], ['memoir', 'Memoir'], ['nonfiction', 'Nonfiction'], ['poetry', 'Poetry'], ['horror', 'Horror'],
];

const state = {
  books: seedBooks.map(book => ({ ...book })),
  reviews: Object.fromEntries(Object.entries(seedReviews).map(([bookId, list]) => [bookId, list.map(review => ({ ...review }))])),
  posts: seedPosts.map(post => ({ ...post, participants: post.participants ? [...post.participants] : undefined })),
  notifications: seedNotifications.map(item => ({ ...item })),
  followed: new Set(),
  myBooks: { shelf: 'all', sort: 'recent', layout: 'grid' },
  browse: { filter: 'all', sort: 'trending' },
  community: { filter: 'all' },
  route: 'home',
  activeBook: null,
  searchQuery: '',
  searchHighlight: 0,
  theme: 'light',
  openingLayer: null,
};

const appRoot = document.querySelector('#app-root');

/* ---------- Utilities ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const icon = (name, extra = '') => `<svg class="icon ${extra}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const esc = (value = '') => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

function fmtCount(n) {
  if (!n) return '0';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace('.0', '')}m`;
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.0', '')}k`;
  return String(n);
}
function fmtNumber(n) { return new Intl.NumberFormat('en-US').format(n); }
function bookById(id) { return state.books.find(book => book.id === id); }
function readBooks() { return state.books.filter(book => book.shelf === 'read'); }
function readingBooks() { return state.books.filter(book => book.shelf === 'reading'); }
function totalPagesRead() { return readBooks().reduce((sum, book) => sum + book.pages, 0); }
function shelfCounts() {
  return state.books.reduce((counts, book) => {
    counts[book.shelf] = (counts[book.shelf] || 0) + 1;
    return counts;
  }, { want: 0, reading: 0, read: 0 });
}
function formatDate(iso, opts = { month: 'short', day: 'numeric' }) {
  if (!iso) return '';
  const date = new Date(`${iso}T12:00:00`);
  return new Intl.DateTimeFormat('en-US', opts).format(date);
}
function timeGreeting() {
  const hour = new Date().getHours();
  return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
}
function todayLong() {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
}
function stars(rating, extra = '') {
  const pct = clamp((Number(rating) || 0) / 5 * 100, 0, 100);
  return `<span class="stars ${extra}" role="img" style="--rating-pct:${pct}%" aria-label="${Number(rating) ? `${rating.toFixed(1)} out of 5 stars` : 'No rating'}"><span aria-hidden="true">★★★★★</span><span class="stars-fill" aria-hidden="true">★★★★★</span></span>`;
}
function ratingLine(book, showCount = true) {
  return `<div class="rating-line">${stars(book.rating)}<strong>${book.rating ? book.rating.toFixed(1) : '—'}</strong>${showCount ? `<span class="rating-count">(${fmtCount(book.ratingsCount)})</span>` : ''}</div>`;
}
function coverMarkup(book, options = {}) {
  const attrs = options.clickable ? ` data-open-book="${esc(book.id)}"` : '';
  const element = options.clickable ? 'button' : 'div';
  const buttonAttrs = options.clickable ? ` type="button" class="book-cover-button" aria-label="Quick view: ${esc(book.title)} by ${esc(book.author)}"` : ` class="book-cover-button"`;
  return `<${element}${buttonAttrs}${attrs}>
    <span class="cover"><img src="${esc(book.cover)}" alt="" loading="lazy"></span>
    ${options.badge ? `<span class="book-badge">${esc(options.badge)}</span>` : ''}
    ${options.clickable ? `<span class="cover-quick">${icon('arrow-up-right')} Quick view</span>` : ''}
  </${element}>`;
}
function bookCard(book, options = {}) {
  const badge = options.badge || '';
  return `<article class="book-card" data-card="${esc(book.id)}">
    <button type="button" class="book-cover-button" data-open-book="${esc(book.id)}" aria-label="Quick view: ${esc(book.title)} by ${esc(book.author)}${badge ? ` — ${esc(badge)}` : ''}">
      <span class="cover"><img src="${esc(book.cover)}" alt="" loading="lazy"></span>
      ${badge ? `<span class="book-badge">${esc(badge)}</span>` : ''}
      <span class="cover-quick">${icon('arrow-up-right')} Quick view</span>
    </button>
    <div class="book-info">
      <h3><button type="button" class="book-title-btn" data-open-book="${esc(book.id)}">${esc(book.title)}</button></h3>
      <p class="book-author">${esc(book.author)}</p>
      ${ratingLine(book)}
    </div>
  </article>`;
}
function avatar(user, size = 'sm') {
  const person = people[user];
  return `<img src="${person.avatar}" alt="" class="avatar avatar--${size}">`;
}
function pageFooter() {
  return `<footer class="page-footnote">
    <span><span class="status-dot" aria-hidden="true"></span> Marginalia is running on your server. Your reading life stays yours.</span>
    <span>Mock data · Self-hosted edition v0.9.2</span>
  </footer>`;
}
function navigate(route, { replace = false } = {}) {
  const target = `#${route}`;
  if (location.hash === target) {
    renderRoute();
    return;
  }
  if (replace) location.replace(target);
  else location.hash = route;
}

/* ---------- Theme ---------- */
function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === 'dark' ? '#151914' : '#f4efe4';
  try { localStorage.setItem(STORAGE_KEY, theme); } catch (_) { /* local file privacy mode */ }
}
function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (_) {}
  applyTheme(saved === 'dark' ? 'dark' : 'light');
}

/* ---------- Counts / chrome ---------- */
function updateChrome() {
  const counts = shelfCounts();
  document.querySelectorAll('[data-shelf-count]').forEach(el => { el.textContent = counts[el.dataset.shelfCount] || 0; });
  document.querySelectorAll('[data-nav-total]').forEach(el => { el.textContent = state.books.length; });
  document.querySelectorAll('.nav-link, .bottom-nav-link').forEach(link => {
    link.classList.toggle('is-active', link.dataset.route === state.route);
    if (link.dataset.route === state.route) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  const unread = state.notifications.filter(n => n.unread).length;
  document.querySelectorAll('[data-notifications]').forEach(bell => {
    bell.classList.toggle('is-read', unread === 0);
    bell.setAttribute('aria-label', unread ? `Notifications, ${unread} unread` : 'Notifications');
  });
  const footerScope = $('.search-scope');
  if (footerScope) footerScope.textContent = `${state.books.length} books in your library`;
  const topAdd = $('.topbar-add');
  if (topAdd) topAdd.hidden = false;
}

function updateNotificationUI() {
  const unread = state.notifications.filter(n => n.unread).length;
  document.querySelectorAll('[data-notifications]').forEach(bell => {
    bell.classList.toggle('is-read', unread === 0);
    bell.setAttribute('aria-label', unread ? `Notifications, ${unread} unread` : 'Notifications');
  });
  if ($('#notification-popover')?.hidden === false) renderNotificationPopover();
}

/* ---------- Router ---------- */
function currentRoute() {
  const hash = location.hash.replace(/^#/, '');
  return ['home', 'shelves', 'browse', 'community', 'stats'].includes(hash) ? hash : 'home';
}
function renderRoute({ scroll = false } = {}) {
  const previous = state.route;
  const route = currentRoute();
  state.route = route;
  const renderers = { home: renderHome, shelves: renderMyBooks, browse: renderBrowse, community: renderCommunity, stats: renderStats };
  appRoot.innerHTML = renderers[route]();
  updateChrome();
  document.title = route === 'home' ? 'Marginalia — The reading room' : `${route === 'shelves' ? 'My books' : route === 'stats' ? 'Reading stats' : route === 'browse' ? 'Browse' : 'The reading room'} — Marginalia`;
  if (scroll || previous !== route) {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}
function refreshView({ scroll = false } = {}) {
  renderRoute({ scroll });
}
window.addEventListener('hashchange', () => {
  closePopovers();
  renderRoute({ scroll: true });
});

/* ---------- Home ---------- */
function renderHome() {
  const current = readingBooks()[0];
  const secondary = readingBooks()[1];
  const finished = readBooks().slice().sort((a, b) => (b.finishedDate || '').localeCompare(a.finishedDate || ''))[0];
  const recBooks = ['rain', 'nightingale', 'moons', 'storms'].map(bookById).filter(Boolean).filter(book => book.id !== current?.id);
  const progressPct = current ? Math.round(current.progress / current.pages * 100) : 0;
  const counts = shelfCounts();
  const featuredReview = state.posts.find(post => post.type === 'review');
  const featuredDiscussion = state.posts.find(post => post.type === 'discussion');

  return `<div class="view">
    <header class="home-heading">
      <div class="home-heading__copy">
        <p class="eyebrow">${esc(todayLong())}<span class="mini-dot"></span>Your reading room</p>
        <h1 class="page-title">${timeGreeting()}, <em>Maya</em>.</h1>
        <p class="page-subtitle">Two books open and a whole autumn ahead. Pick up where you left off — or find something new for the nightstand.</p>
      </div>
      <div class="reading-summary" aria-label="Your reading summary">
        <div class="summary-stat"><strong>${readBooks().length}</strong><span>Books this year</span></div>
        <div class="summary-stat"><strong>${fmtNumber(totalPagesRead())}</strong><span>Pages read</span></div>
        <div class="summary-stat"><strong>18</strong><span>Day streak</span></div>
        <span class="streak-pill">${icon('flame')} Keep it going</span>
      </div>
    </header>

    <div class="page-layout with-rail">
      <div class="page-main">
        <section class="section" aria-labelledby="currently-reading-title">
          <div class="section-heading">
            <div>
              <h2 id="currently-reading-title">Currently reading</h2>
              <p>Your place is saved. No rush.</p>
            </div>
            <a href="#shelves" class="text-link" data-shelf-jump="reading">View shelf ${icon('arrow-right')}</a>
          </div>

          ${current ? `<article class="reading-hero">
            <button type="button" class="hero-cover" data-open-book="${esc(current.id)}" aria-label="Open ${esc(current.title)}">
              <span class="cover"><img src="${esc(current.cover)}" alt=""></span>
            </button>
            <div class="hero-content">
              <div class="hero-kicker"><span>Currently reading</span><span class="kicker-divider"></span><span class="hero-streak">${icon('flame')} Day 5</span></div>
              <h2 class="hero-title">${esc(current.title)}</h2>
              <p class="hero-author">by ${esc(current.author)}</p>
              ${current.quote ? `<p class="hero-quote">“${esc(current.quote)}”</p>` : ''}
              <div class="hero-progress">
                <div class="progress-labels"><span>Page ${fmtNumber(current.progress)} of ${fmtNumber(current.pages)}</span><span>${progressPct}%</span></div>
                <div class="progress-track" role="progressbar" aria-label="Reading progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progressPct}"><span style="width:${progressPct}%"></span></div>
              </div>
              <div class="hero-actions">
                <button type="button" class="btn btn--paper" data-progress-book="${esc(current.id)}">${icon('edit')} Update progress</button>
                <button type="button" class="hero-detail-link" data-open-book="${esc(current.id)}">Book details ${icon('arrow-right')}</button>
              </div>
            </div>
          </article>` : emptyCurrentCard()}

          <div class="home-mosaic">
            ${secondary ? `<article class="mini-shelf-card">
              <button type="button" class="mini-cover cover" data-open-book="${esc(secondary.id)}" aria-label="Open ${esc(secondary.title)}"><img src="${esc(secondary.cover)}" alt="" loading="lazy"></button>
              <div class="mini-card-copy">
                <p class="eyebrow">Also on the go</p>
                <h3>${esc(secondary.title)}</h3>
                <p>${esc(secondary.author)}</p>
                <div class="mini-card-progress">${icon('clock')}<div class="progress-track"><span style="width:${Math.round(secondary.progress / secondary.pages * 100)}%"></span></div><small>${Math.round(secondary.progress / secondary.pages * 100)}%</small></div>
              </div>
              <button type="button" class="mini-card-action" data-progress-book="${esc(secondary.id)}" aria-label="Update progress for ${esc(secondary.title)}">${icon('arrow-right')}</button>
            </article>` : ''}
            ${finished ? `<article class="mini-shelf-card recent-read-card">
              <button type="button" class="mini-cover cover" data-open-book="${esc(finished.id)}" aria-label="Open ${esc(finished.title)}"><img src="${esc(finished.cover)}" alt="" loading="lazy"></button>
              <div class="mini-card-copy">
                <p class="eyebrow">Just finished</p>
                <h3>${esc(finished.title)}</h3>
                <div class="recent-stars" data-quick-rating="${esc(finished.id)}" aria-label="Rate ${esc(finished.title)}">
                  ${[1, 2, 3, 4, 5].map(n => `<button type="button" data-quick-rate="${n}" class="${n <= (finished.myRating || 0) ? 'is-filled' : ''}" aria-label="Rate ${n} star${n > 1 ? 's' : ''}">${icon('star')}</button>`).join('')}
                  <span>${finished.myRating ? `You rated it ${finished.myRating}/5` : 'Give it a rating'}</span>
                </div>
              </div>
              <button type="button" class="mini-card-action" data-open-book="${esc(finished.id)}" aria-label="Open ${esc(finished.title)}">${icon('arrow-up-right')}</button>
            </article>` : ''}
          </div>
        </section>

        <section class="section" aria-labelledby="recommendations-title">
          <div class="section-heading">
            <div>
              <h2 id="recommendations-title">Because you loved Wildwood Almanac</h2>
              <p>Quiet, wild stories with a little weather in them.</p>
            </div>
            <a href="#browse" class="text-link">Explore all books ${icon('arrow-right')}</a>
          </div>
          <div class="book-grid">
            ${recBooks.map((book, index) => bookCard(book, { badge: index === 1 ? 'Circle pick' : index === 0 ? 'Staff pick' : '' })).join('')}
          </div>
        </section>

        <section class="section" aria-labelledby="reading-room-title">
          <div class="section-heading">
            <div>
              <h2 id="reading-room-title">From the reading room</h2>
              <p>Notes, questions, and good sentences from your circle.</p>
            </div>
            <a href="#community" class="text-link">Visit community ${icon('arrow-right')}</a>
          </div>
          <div class="social-grid">
            ${featuredReview ? socialReviewCard(featuredReview) : ''}
            ${featuredDiscussion ? socialDiscussionCard(featuredDiscussion) : ''}
          </div>
        </section>
      </div>

      <aside class="rail" aria-label="More from your reading room">
        ${challengeCard()}
        ${friendsCard()}
        ${quoteCard()}
      </aside>
    </div>
    ${pageFooter()}
  </div>`;
}

function emptyCurrentCard() {
  return `<article class="empty-state">
    <span>${icon('bookmark')}</span>
    <h3>Your nightstand is empty</h3>
    <p>Add a book to your “Currently reading” shelf and it will appear here.</p>
    <button type="button" class="btn btn--primary btn--sm" data-add-book>${icon('plus')} Log a book</button>
  </article>`;
}

function socialReviewCard(post) {
  const book = bookById(post.bookId);
  if (!book) return '';
  return `<article class="social-card">
    <div class="feed-head">
      ${avatar(post.user, 'sm')}
      <div class="feed-head-copy">
        <div class="feed-head-line"><strong>${esc(people[post.user].name)}</strong><span>reviewed</span></div>
        <div class="feed-head-line"><button type="button" class="text-link" data-open-book="${esc(book.id)}" style="font-size:10px">${esc(book.title)}</button><time>${esc(post.date)}</time></div>
      </div>
    </div>
    <div style="margin-top:9px">${stars(post.rating, 'stars--sm')}</div>
    <p>${esc(post.text)}</p>
    <div class="social-card-footer">
      <span>${icon('heart')} ${post.likes} readers found this helpful</span>
      <a href="#community" class="text-link">Read more ${icon('arrow-right')}</a>
    </div>
  </article>`;
}

function socialDiscussionCard(post) {
  return `<article class="social-card social-card--discussion">
    <p class="feed-type">Discussion · ${post.comments} replies</p>
    <h3>${esc(post.title)}</h3>
    <p>${esc(post.text)}</p>
    <div class="social-discussion-meta">
      ${icon('message')}<span>${esc(post.tags.join(' · '))}</span>
    </div>
    <div class="social-card-footer">
      <div class="avatar-stack">${post.participants.slice(0, 3).map(person => avatar(person, 'xs')).join('')}</div>
      <span>${post.participants.length + 4} readers talking</span>
      <a href="#community" class="text-link">Join in ${icon('arrow-right')}</a>
    </div>
  </article>`;
}

function challengeCard() {
  const completed = readBooks().length;
  const goal = 16;
  const pct = clamp(completed / goal * 100, 0, 100);
  const circ = 2 * Math.PI * 40;
  return `<section class="rail-card challenge-card" aria-labelledby="challenge-title">
    <div class="rail-head">
      <p class="eyebrow">2026 reading challenge</p>
      <a href="#stats" class="rail-more" aria-label="View reading challenge">${icon('more')}</a>
    </div>
    <div class="challenge-row">
      <div class="challenge-ring">
        <svg viewBox="0 0 92 92" aria-hidden="true">
          <circle class="ring-track" cx="46" cy="46" r="40"/>
          <circle class="ring-value" cx="46" cy="46" r="40" stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="${(circ - circ * pct / 100).toFixed(1)}"/>
        </svg>
        <div class="ring-center"><strong>${completed}</strong><span>of ${goal}</span></div>
      </div>
      <div class="challenge-copy">
        <strong id="challenge-title">${pct >= 100 ? 'Challenge complete' : pct >= 75 ? 'Almost there' : pct >= 40 ? 'A good rhythm' : 'A fresh start'}</strong>
        <p>${Math.max(goal - completed, 0)} books to go. ${pct >= 75 ? 'Nearly there.' : 'Plenty of year left.'}</p>
        <span class="challenge-progress-note">${icon('trending')} Steady progress</span>
      </div>
    </div>
    <div class="rail-footer"><span>${completed} of ${goal} books</span><a href="#stats" class="rail-link">View stats ${icon('arrow-right')}</a></div>
  </section>`;
}

function friendsCard() {
  return `<section class="rail-card" aria-labelledby="friends-reading-title">
    <div class="rail-head">
      <p class="eyebrow" id="friends-reading-title">Your circle</p>
      <a href="#community" class="rail-link">Reading room ${icon('arrow-right')}</a>
    </div>
    ${friendsReading.map(friend => {
      const book = bookById(friend.bookId);
      if (!book) return '';
      return `<button type="button" class="friend-row" data-open-book="${esc(book.id)}">
        <span class="friend-avatar-wrap">${avatar(friend.user, 'sm')}${friend.online ? '<span class="online-dot"></span>' : ''}</span>
        <span class="friend-copy">
          <span class="friend-name">${esc(people[friend.user].name.split(' ')[0])}</span>
          <span class="friend-action">${esc(friend.action)} <em>${esc(book.title)}</em></span>
        </span>
        <img class="friend-mini-cover" src="${esc(book.cover)}" alt="" loading="lazy">
      </button>`;
    }).join('')}
    <div class="rail-footer"><span>${friendsReading.length} friends reading now</span><button type="button" class="rail-link" data-open-composer="post">Share an update ${icon('arrow-right')}</button></div>
  </section>`;
}

function quoteCard() {
  return `<section class="rail-card quote-card" aria-label="A note from your commonplace book">
    <p class="eyebrow">${esc(seedNotes.context)}</p>
    <blockquote>“${esc(seedNotes.text)}”</blockquote>
    <div class="quote-meta">${avatar(seedNotes.author, 'xs')}<span>${esc(people[seedNotes.author].name)} · private note</span></div>
  </section>`;
}

/* ---------- My books ---------- */
function sortedShelfBooks(books) {
  const list = books.slice();
  const sort = state.myBooks.sort;
  if (sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title));
  else if (sort === 'author') list.sort((a, b) => a.author.localeCompare(b.author));
  else if (sort === 'rating') list.sort((a, b) => (b.myRating || 0) - (a.myRating || 0) || b.rating - a.rating);
  else list.sort((a, b) => (b.added || '').localeCompare(a.added || ''));
  return list;
}

function shelfStatusBadge(book) {
  const meta = SHELF_META[book.shelf];
  return `<span class="shelf-status shelf-status--${esc(book.shelf)}"><span class="dot"></span>${esc(meta.short)}</span>`;
}

function shelfCard(book) {
  const isReading = book.shelf === 'reading';
  const progressPct = clamp(book.progress / book.pages * 100, 0, 100);
  return `<article class="shelf-card">
    <button type="button" class="book-cover-button" data-open-book="${esc(book.id)}" aria-label="Quick view: ${esc(book.title)} by ${esc(book.author)} — ${esc(SHELF_META[book.shelf].short)}">
      <span class="cover"><img src="${esc(book.cover)}" alt="" loading="lazy"></span>
      ${shelfStatusBadge(book)}
      <span class="cover-quick">${icon('arrow-up-right')} Quick view</span>
    </button>
    <div class="shelf-info">
      <h3><button type="button" class="book-title-btn" data-open-book="${esc(book.id)}">${esc(book.title)}</button></h3>
      <p class="book-author">${esc(book.author)}</p>
      ${book.shelf === 'read'
        ? `<div class="shelf-meta">${stars(book.myRating || book.rating, 'stars--sm')}<span class="shelf-date">${book.finishedDate ? `Finished ${formatDate(book.finishedDate)}` : 'Finished'}</span></div>`
        : isReading
          ? `<div class="shelf-progress"><div class="progress-labels"><span>Page ${fmtNumber(book.progress)}</span><span>${Math.round(progressPct)}%</span></div><div class="progress-track"><span style="width:${progressPct}%"></span></div></div>`
          : `<div class="shelf-meta">${ratingLine(book, false)}<span class="shelf-date">Added ${formatDate(book.added)}</span></div>`}
    </div>
  </article>`;
}

function shelfRow(book) {
  const progressPct = clamp(book.progress / book.pages * 100, 0, 100);
  return `<button type="button" class="book-row" data-open-book="${esc(book.id)}" aria-label="View ${esc(book.title)}">
    <span class="cover"><img src="${esc(book.cover)}" alt="" loading="lazy"></span>
    <span class="row-book">
      <h3>${esc(book.title)}</h3>
      <p>${esc(book.author)}</p>
      ${book.shelf === 'reading'
        ? `<span class="row-progress-inline"><span class="progress-track"><span style="width:${progressPct}%"></span></span><span>${Math.round(progressPct)}%</span></span>`
        : `<span class="row-genre">${esc(book.genre)}</span>`}
    </span>
    <span class="row-note"><strong>${esc(SHELF_META[book.shelf].short)}</strong>${book.shelf === 'read' ? (book.finishedDate ? formatDate(book.finishedDate, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Finished') : book.shelf === 'reading' ? `${book.pages - book.progress} pages left` : `Added ${formatDate(book.added)}`}</span>
    <span class="row-rating">${book.shelf === 'read' ? `${stars(book.myRating || book.rating, 'stars--sm')}<span class="rating-line"><span class="rating-count">${book.myRating ? 'Your rating' : `${book.rating.toFixed(1)} avg`}</span></span>` : ratingLine(book, false)}</span>
    <span class="row-chevron">${icon('chevron-right')}</span>
  </button>`;
}

function renderMyBooks() {
  const counts = shelfCounts();
  const all = state.myBooks.shelf === 'all' ? state.books.slice() : state.books.filter(book => book.shelf === state.myBooks.shelf);
  const books = sortedShelfBooks(all);
  const reading = counts.reading || 0;
  const read = counts.read || 0;
  const want = counts.want || 0;
  const pages = totalPagesRead();
  const titleMap = { all: 'All books', want: 'Want to read', reading: 'Currently reading', read: 'Read' };

  const content = state.myBooks.layout === 'list'
    ? `<div class="library-list">${books.map(shelfRow).join('')}</div>
       ${books.length === 0 ? '<div class="empty-state"><span>' + icon('books') + '</span><h3>This shelf is quiet</h3><p>Add a book here and it will have company.</p></div>' : ''}
       <div style="margin-top:14px"><button type="button" class="btn btn--secondary btn--sm" data-add-book>${icon('plus')} Add another book</button></div>`
    : `<div class="shelf-grid">
        ${books.map(shelfCard).join('')}
        <button type="button" class="add-book-tile" data-add-book>
          <span class="add-circle">${icon('plus')}</span>
          <strong>Add a book</strong>
          <span>Bring something new to the shelf</span>
        </button>
      </div>
      ${books.length === 0 ? '<div class="empty-state" style="margin-top:16px"><span>' + icon('books') + '</span><h3>This shelf is quiet</h3><p>Add a book here and it will have company.</p></div>' : ''}`;

  return `<div class="view">
    <header class="page-heading">
      <div class="page-heading__text">
        <p class="eyebrow">Your library<span class="mini-dot"></span>${books.length} of ${state.books.length} books</p>
        <h1 class="page-title">My <em>books</em>.</h1>
        <p class="page-subtitle">Everything you’ve read, everything you’re reading, and everything you’re saving for a rainy afternoon.</p>
      </div>
      <div class="page-heading__aside">
        <button type="button" class="btn btn--primary btn--sm" data-add-book>${icon('plus')} Log a book</button>
      </div>
    </header>

    <div class="library-stats">
      <div class="stat-tile"><span class="stat-icon">${icon('check')}</span><div class="stat-tile-copy"><strong>${read}</strong><span>Books finished</span></div></div>
      <div class="stat-tile"><span class="stat-icon">${icon('clock')}</span><div class="stat-tile-copy"><strong>${reading}</strong><span>In progress</span></div></div>
      <div class="stat-tile"><span class="stat-icon">${icon('bookmark')}</span><div class="stat-tile-copy"><strong>${want}</strong><span>Want to read</span></div></div>
      <div class="stat-tile"><span class="stat-icon">${icon('chart')}</span><div class="stat-tile-copy"><strong>${fmtNumber(pages)}</strong><span>Pages this year</span></div></div>
    </div>

    <div class="library-toolbar">
      <div class="shelf-tabs" role="tablist" aria-label="Filter by shelf">
        ${[['all', 'All books'], ['reading', 'Reading'], ['want', 'Want to read'], ['read', 'Read']].map(([key, label]) => {
          const count = key === 'all' ? state.books.length : counts[key] || 0;
          return `<button type="button" role="tab" class="shelf-tab ${state.myBooks.shelf === key ? 'is-active' : ''}" aria-selected="${state.myBooks.shelf === key}" data-shelf-filter="${key}">${label}<span class="tab-count">${count}</span></button>`;
        }).join('')}
      </div>
      <div class="toolbar-right">
        <span class="select-wrap">${icon('chevron-down')}<select class="select-clean" data-library-sort aria-label="Sort library">
          <option value="recent" ${state.myBooks.sort === 'recent' ? 'selected' : ''}>Recently added</option>
          <option value="title" ${state.myBooks.sort === 'title' ? 'selected' : ''}>Title A–Z</option>
          <option value="author" ${state.myBooks.sort === 'author' ? 'selected' : ''}>Author A–Z</option>
          <option value="rating" ${state.myBooks.sort === 'rating' ? 'selected' : ''}>My rating</option>
        </select></span>
        <div class="view-toggle" role="group" aria-label="Library view">
          <button type="button" class="${state.myBooks.layout === 'grid' ? 'is-active' : ''}" aria-label="Grid view" aria-pressed="${state.myBooks.layout === 'grid'}" data-library-layout="grid">${icon('grid')}</button>
          <button type="button" class="${state.myBooks.layout === 'list' ? 'is-active' : ''}" aria-label="List view" aria-pressed="${state.myBooks.layout === 'list'}" data-library-layout="list">${icon('list')}</button>
        </div>
      </div>
    </div>

    ${content}
    ${pageFooter()}
  </div>`;
}

/* ---------- Browse ---------- */
function browseBooks() {
  let books = state.books.slice();
  if (state.browse.filter !== 'all') books = books.filter(book => book.filter === state.browse.filter);
  if (state.browse.sort === 'rating') books.sort((a, b) => b.rating - a.rating);
  else if (state.browse.sort === 'newest') books.sort((a, b) => b.year - a.year || b.rating - a.rating);
  else if (state.browse.sort === 'title') books.sort((a, b) => a.title.localeCompare(b.title));
  else books.sort((a, b) => b.ratingsCount - a.ratingsCount);
  return books;
}

function renderBrowse() {
  const featured = bookById('nightingale');
  const books = browseBooks();
  return `<div class="view">
    <header class="page-heading">
      <div class="page-heading__text">
        <p class="eyebrow">The stacks<span class="mini-dot"></span>${state.books.length} books and counting</p>
        <h1 class="page-title">Find your next <em>chapter</em>.</h1>
        <p class="page-subtitle">Wander a little. Follow a cover, a title, or a hunch. The best books are usually found sideways.</p>
      </div>
    </header>

    ${featured ? `<section class="featured-banner" aria-labelledby="featured-title">
      <button type="button" class="featured-cover" data-open-book="${esc(featured.id)}" aria-label="Open ${esc(featured.title)}">
        <span class="cover"><img src="${esc(featured.cover)}" alt=""></span>
      </button>
      <div class="featured-copy">
        <p class="eyebrow">${icon('sparkles')} October reading circle pick</p>
        <h2 id="featured-title">${esc(featured.title)}</h2>
        <p class="featured-author">by ${esc(featured.author)} · 496 pages</p>
        <p>Every seven years, the Nightingale returns to rewrite the maps of the known world. This year, it has gone missing. A lush, golden fantasy about songs, wandering, and the stories that hold a world together.</p>
      </div>
      <div class="featured-actions">
        ${ratingLine(featured)}
        <button type="button" class="btn btn--paper btn--sm" data-open-book="${esc(featured.id)}">Explore the pick ${icon('arrow-right')}</button>
      </div>
    </section>` : ''}

    <section aria-labelledby="stacks-title">
      <div class="explore-intro">
        <h2 id="stacks-title">Browse the stacks</h2>
        <span>${books.length} ${books.length === 1 ? 'book' : 'books'}</span>
      </div>
      <div class="filter-bar">
        <div class="filter-chips" role="group" aria-label="Filter by genre">
          ${FILTERS.map(([key, label]) => `<button type="button" class="chip ${state.browse.filter === key ? 'is-active' : ''}" aria-pressed="${state.browse.filter === key}" data-browse-filter="${key}">${label}</button>`).join('')}
        </div>
        <div class="filter-bar__right">
          <span class="results-note">Sorted by ${state.browse.sort === 'trending' ? 'what’s popular' : state.browse.sort === 'rating' ? 'reader rating' : state.browse.sort === 'newest' ? 'newest first' : 'title'}</span>
          <span class="select-wrap">${icon('chevron-down')}<select class="select-clean" data-browse-sort aria-label="Sort books">
            <option value="trending" ${state.browse.sort === 'trending' ? 'selected' : ''}>Trending now</option>
            <option value="rating" ${state.browse.sort === 'rating' ? 'selected' : ''}>Highest rated</option>
            <option value="newest" ${state.browse.sort === 'newest' ? 'selected' : ''}>Newest</option>
            <option value="title" ${state.browse.sort === 'title' ? 'selected' : ''}>Title A–Z</option>
          </select></span>
        </div>
      </div>

      ${books.length ? `<div class="explore-grid">${books.map(book => bookCard(book, { badge: book.badge || '' })).join('')}</div>` : `<div class="empty-state"><span>${icon('compass')}</span><h3>Nothing on this shelf yet</h3><p>Try another genre and see what turns up.</p></div>`}
    </section>
    ${pageFooter()}
  </div>`;
}

/* ---------- Community ---------- */
function communityPosts() {
  if (state.community.filter === 'all') return state.posts;
  if (state.community.filter === 'review') return state.posts.filter(post => post.type === 'review' || post.type === 'note');
  return state.posts.filter(post => post.type === 'discussion');
}

function postBookChip(book) {
  if (!book) return '';
  return `<div class="feed-book-chip">
    <span class="cover"><img src="${esc(book.cover)}" alt="" loading="lazy"></span>
    <span class="feed-book-chip-copy"><strong>${esc(book.title)}</strong><span>${esc(book.author)} · ${esc(book.genre)}</span></span>
    <button type="button" data-open-book="${esc(book.id)}">View book</button>
  </div>`;
}

function feedActions(post) {
  return `<footer class="feed-actions">
    <button type="button" class="feed-action ${post.liked ? 'is-liked' : ''}" data-like-post="${esc(post.id)}" aria-pressed="${post.liked}" aria-label="${post.liked ? 'Unlike' : 'Like'} this post, ${post.likes} likes">${icon('heart')}<span data-like-count>${post.likes}</span></button>
    <button type="button" class="feed-action" data-comment-post="${esc(post.id)}" aria-label="${post.comments} comments">${icon('message')} ${post.comments}</button>
    <button type="button" class="feed-action feed-action--save ${post.saved ? 'is-saved' : ''}" data-save-post="${esc(post.id)}" aria-pressed="${post.saved}">${icon('bookmark')}<span class="save-label">${post.saved ? 'Saved' : 'Save'}</span></button>
  </footer>`;
}

function postCard(post) {
  const person = people[post.user];
  const book = post.bookId ? bookById(post.bookId) : null;
  if (!person) return '';
  const typeCopy = post.type === 'review' ? 'reviewed a book' : post.type === 'note' ? 'shared a reading note' : 'started a discussion';

  if (post.type === 'discussion') {
    return `<article class="feed-card" id="post-${esc(post.id)}">
      <header class="feed-head">
        ${avatar(post.user, 'md')}
        <div class="feed-head-copy">
          <div class="feed-head-line"><strong>${esc(person.name)}</strong><span>${typeCopy}</span></div>
          <div class="feed-head-line"><time>${esc(post.date)}</time><span class="feed-badge">${icon('message')} Discussion</span></div>
        </div>
      </header>
      <div class="feed-card-body">
        <h3 class="feed-discussion-title">${esc(post.title)}</h3>
        <div class="feed-text"><p>${esc(post.text)}</p></div>
        <div class="feed-tags">${post.tags.map(tag => `<span class="feed-tag">${esc(tag)}</span>`).join('')}</div>
        <div class="feed-discussion-foot">
          <div class="avatar-stack">${post.participants.slice(0, 4).map(user => avatar(user, 'xs')).join('')}</div>
          <span>${post.participants.length + 4} readers joined</span><span class="dot-sep"></span><span>${post.comments} replies</span>
        </div>
      </div>
      ${feedActions(post)}
    </article>`;
  }

  return `<article class="feed-card" id="post-${esc(post.id)}">
    <header class="feed-head">
      ${avatar(post.user, 'md')}
      <div class="feed-head-copy">
        <div class="feed-head-line"><strong>${esc(person.name)}</strong><span>${typeCopy}</span>${book ? `<button type="button" class="feed-book-link" data-open-book="${esc(book.id)}">${esc(book.title)}</button>` : ''}</div>
        <div class="feed-head-line"><time>${esc(post.date)}</time>${post.type === 'review' ? `<span class="feed-badge">Review</span>` : ''}</div>
      </div>
    </header>
    <div class="feed-card-body">
      ${post.rating ? `<div class="feed-stars">${stars(post.rating)}<span>${post.rating.toFixed(1)} / 5</span></div>` : ''}
      <div class="feed-text"><p>${esc(post.text)}</p>${post.quote ? `<blockquote class="feed-quote">“${esc(post.quote)}”</blockquote>` : ''}</div>
      ${postBookChip(book)}
    </div>
    ${feedActions(post)}
  </article>`;
}

function renderCommunity() {
  const posts = communityPosts();
  const discussions = state.posts.filter(post => post.type === 'discussion');
  const reviewCount = state.posts.filter(post => post.type === 'review' || post.type === 'note').length;
  const followedPeople = ['jonah', 'samira', 'iris'];
  const readalong = bookById('nightingale');

  return `<div class="view">
    <header class="page-heading">
      <div class="page-heading__text">
        <p class="eyebrow">The reading room<span class="mini-dot"></span>${state.posts.length} notes this week</p>
        <h1 class="page-title">Stories are better <em>shared</em>.</h1>
        <p class="page-subtitle">A quiet corner of the internet for good sentences, honest reviews, and the books that stay with us.</p>
      </div>
      <div class="page-heading__aside">
        <button type="button" class="btn btn--primary btn--sm" data-open-composer="discussion">${icon('edit')} Start a discussion</button>
      </div>
    </header>

    <div class="page-layout with-rail">
      <div class="page-main">
        <div class="community-toolbar">
          <div class="feed-tabs" role="tablist" aria-label="Filter community posts">
            <button type="button" role="tab" class="feed-tab ${state.community.filter === 'all' ? 'is-active' : ''}" aria-selected="${state.community.filter === 'all'}" data-feed-filter="all">All activity</button>
            <button type="button" role="tab" class="feed-tab ${state.community.filter === 'review' ? 'is-active' : ''}" aria-selected="${state.community.filter === 'review'}" data-feed-filter="review">Reviews</button>
            <button type="button" role="tab" class="feed-tab ${state.community.filter === 'discussion' ? 'is-active' : ''}" aria-selected="${state.community.filter === 'discussion'}" data-feed-filter="discussion">Discussions</button>
          </div>
          <span class="results-note">${posts.length} ${posts.length === 1 ? 'update' : 'updates'} · ${reviewCount} review${reviewCount === 1 ? '' : 's'}</span>
        </div>

        <button type="button" class="composer-prompt" data-open-composer="post">
          ${avatar('maya', 'sm')}
          <span>Share a reading update with your circle…</span>
          <span class="composer-prompt-icons"><span class="composer-icon">${icon('books')}</span><span class="composer-icon">${icon('edit')}</span></span>
        </button>

        <div class="feed">
          ${posts.length ? posts.map(postCard).join('') : `<div class="empty-state"><span>${icon('message')}</span><h3>Nothing here yet</h3><p>Be the first to leave a note in the reading room.</p><button type="button" class="btn btn--primary btn--sm" data-open-composer="post">${icon('plus')} Share an update</button></div>`}
        </div>
      </div>

      <aside class="rail" aria-label="Reading room sidebar">
        ${readalong ? `<section class="rail-card readalong-card" aria-labelledby="readalong-title">
          <div class="readalong-cover-wrap">
            <span class="cover"><img src="${esc(readalong.cover)}" alt="" loading="lazy"></span>
          </div>
          <div class="readalong-copy">
            <p class="eyebrow">October readalong</p>
            <h3 id="readalong-title">${esc(readalong.title)}</h3>
            <p>Six chapters a week. Spoilers stay behind the fold.</p>
            <div class="readalong-meta"><div class="avatar-stack">${['samira', 'jonah', 'theo'].map(user => avatar(user, 'xs')).join('')}</div><span>12 readers · 6 days left</span></div>
            <button type="button" class="btn btn--paper btn--sm" data-open-book="${esc(readalong.id)}">Open the circle ${icon('arrow-right')}</button>
          </div>
        </section>` : ''}

        <section class="rail-card" aria-labelledby="trending-title">
          <div class="rail-head"><p class="eyebrow" id="trending-title">Trending discussions</p></div>
          <div class="trending-list">
            ${discussions.slice(0, 3).map((post, i) => `<button type="button" class="trending-item" data-scroll-post="${esc(post.id)}">
              <span class="trend-index">${String(i + 1).padStart(2, '0')}</span>
              <span><span style="display:block;color:var(--ink);font-size:10.5px;font-weight:600;line-height:1.4">${esc(post.title)}</span><span>${post.comments} replies · ${esc(post.date)}</span></span>
            </button>`).join('')}
          </div>
        </section>

        <section class="rail-card" aria-labelledby="people-title">
          <div class="rail-head"><p class="eyebrow" id="people-title">Readers to know</p><span class="rail-link">Your circle</span></div>
          <div class="people-list">
            ${followedPeople.map(user => {
              const person = people[user];
              const isFollowed = state.followed.has(user);
              return `<div class="person-row">
                ${avatar(user, 'sm')}
                <div class="person-row-copy"><strong>${esc(person.name)}</strong><span>${esc(person.bio)}</span></div>
                <button type="button" class="follow-btn ${isFollowed ? 'is-following' : ''}" data-follow-user="${user}">${isFollowed ? 'Following' : 'Follow'}</button>
              </div>`;
            }).join('')}
          </div>
        </section>
      </aside>
    </div>
    ${pageFooter()}
  </div>`;
}

/* ---------- Stats ---------- */
const GENRE_META = {
  fiction: { label: 'Fiction', color: '#72856a' },
  mystery: { label: 'Mystery', color: '#ba6243' },
  memoir: { label: 'Memoir', color: '#d0a04e' },
  nonfiction: { label: 'Nonfiction', color: '#6f8e77' },
  poetry: { label: 'Poetry', color: '#b4838b' },
  fantasy: { label: 'Fantasy', color: '#8f7aa6' },
  scifi: { label: 'Sci-fi', color: '#708897' },
  horror: { label: 'Horror', color: '#8a5757' },
};

function statsData() {
  const read = readBooks();
  const pages = read.reduce((sum, book) => sum + book.pages, 0);
  const months = Array.from({ length: 12 }, (_, i) => ({ pages: 0, books: 0, index: i }));
  read.forEach(book => {
    if (!book.finishedDate) return;
    const month = new Date(`${book.finishedDate}T12:00:00`).getMonth();
    months[month].pages += book.pages;
    months[month].books += 1;
  });
  const maxMonth = months.reduce((best, month) => month.pages > best.pages ? month : best, months[0]);
  const rated = read.filter(book => book.myRating > 0);
  const avgRating = rated.length ? rated.reduce((sum, book) => sum + book.myRating, 0) / rated.length : 0;
  const genreCounts = {};
  read.forEach(book => {
    const key = book.filter === 'nonfiction' || book.filter === 'memoir' || book.filter === 'poetry' ? book.filter : book.filter;
    genreCounts[key] = (genreCounts[key] || 0) + 1;
  });
  const genreList = Object.entries(genreCounts)
    .map(([key, count]) => ({ key, count, ...(GENRE_META[key] || { label: key, color: '#999' }) }))
    .sort((a, b) => b.count - a.count);
  const ratingDistribution = [5, 4, 3, 2, 1].map(value => ({
    value,
    count: rated.filter(book => book.myRating === value).length,
  }));
  const favorites = read.slice().sort((a, b) => (b.myRating || 0) - (a.myRating || 0) || b.rating - a.rating).slice(0, 4);
  return { read, pages, months, maxMonth, avgRating, genreList, ratingDistribution, favorites, rated };
}

function renderStats() {
  const data = statsData();
  const { read, pages, months, maxMonth, avgRating, genreList, ratingDistribution, favorites } = data;
  const maxPages = Math.max(...months.map(month => month.pages), 1);
  const avgPages = read.length ? Math.round(pages / read.length) : 0;
  const currentMonthIndex = new Date().getMonth();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const bestMonthLabel = monthNames[maxMonth.index];
  const goal = 16;
  const pct = clamp(read.length / goal * 100, 0, 100);
  const totalGenre = genreList.reduce((sum, genre) => sum + genre.count, 0) || 1;
  let cursor = 0;
  const conicSegments = genreList.map(genre => {
    const start = cursor;
    cursor += genre.count / totalGenre * 100;
    return `${genre.color} ${start.toFixed(2)}% ${cursor.toFixed(2)}%`;
  }).join(', ');
  const maxRating = Math.max(...ratingDistribution.map(rating => rating.count), 1);

  return `<div class="view">
    <header class="page-heading">
      <div class="page-heading__text">
        <p class="eyebrow">Reading stats<span class="mini-dot"></span>January — December 2026</p>
        <h1 class="page-title">A year in <em>pages</em>.</h1>
        <p class="page-subtitle">Every book leaves a little mark. Here’s the shape your reading year has taken so far.</p>
      </div>
      <div class="page-heading__aside">
        <span class="select-wrap">${icon('chevron-down')}<select class="select-clean" aria-label="Reading year"><option>2026</option></select></span>
      </div>
    </header>

    <section class="year-hero" aria-label="Reading year summary">
      <div class="year-hero-head">
        <p class="eyebrow"><span class="spark">${icon('sparkles')}</span> Your 2026 so far</p>
        <a href="#shelves" class="rail-link" style="color:#c8d0c0">See the books ${icon('arrow-right')}</a>
      </div>
      <div class="year-stats">
        <div class="year-stat"><strong>${read.length}</strong><span>Books finished</span></div>
        <div class="year-stat"><strong>${fmtNumber(pages)}</strong><span>Pages turned</span></div>
        <div class="year-stat"><strong>${avgPages || '—'}</strong><span>Pages per book</span></div>
        <div class="year-stat"><strong>18 <em>days</em></strong><span>Longest streak</span></div>
      </div>
      <p class="year-note">${icon('trending')} ${pct >= 100 ? 'Goal reached.' : pct >= 50 ? 'You’re over halfway' : 'You’re building momentum'} toward your goal of ${goal} books this year.</p>
    </section>

    <div class="stats-grid">
      <section class="panel chart-panel" aria-labelledby="pages-chart-title">
        <div class="panel-head">
          <div><h2 id="pages-chart-title">Pages by month</h2><p>A quiet record of time spent between covers</p></div>
          <span class="panel-chip">${icon('chart')} ${fmtNumber(pages)} pages</span>
        </div>
        <div class="chart">
          <div class="chart-grid" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
          <div class="chart-bars" role="img" aria-label="Monthly pages read: ${months.map((month, i) => `${monthNames[i]} ${month.pages} pages`).join(', ')}">
            ${months.map((month, index) => {
              const isCurrent = index === currentMonthIndex;
              const height = month.pages ? Math.max(month.pages / maxPages * 78, 7) : 0;
              return `<div class="chart-col ${isCurrent ? 'is-current' : ''}" tabindex="0" aria-label="${monthNames[index]}: ${month.pages} pages, ${month.books} books" style="--bar-height:${height}%">
                <span class="chart-tooltip">${month.pages ? `${fmtNumber(month.pages)} pages` : 'No books finished'}</span>
                <div class="chart-bar ${month.pages ? '' : 'chart-zero'}"></div>
                <span class="chart-label">${monthNames[index].slice(0, 3)}</span>
              </div>`;
            }).join('')}
          </div>
        </div>
        <div class="chart-legend"><span><i class="legend-swatch"></i> Pages read</span><span><i class="legend-swatch legend-swatch--current"></i> This month</span><span style="margin-left:auto">Best month · ${bestMonthLabel} (${fmtNumber(maxMonth.pages)} pages)</span></div>
      </section>

      <div class="stats-side">
        <section class="panel genre-panel" aria-labelledby="genre-title">
          <div class="panel-head"><div><h3 id="genre-title">What you read</h3><p>Genres across your finished books</p></div></div>
          <div class="genre-content">
            <div class="donut" style="background:conic-gradient(${conicSegments || 'var(--surface-muted) 0 100%'})" role="img" aria-label="Genre breakdown: ${genreList.map(genre => `${genre.label} ${genre.count}`).join(', ')}"><div class="donut-center"><strong>${read.length}</strong><span>books</span></div></div>
            <div class="genre-legend">
              ${genreList.length ? genreList.map(genre => `<div class="genre-key"><i class="swatch" style="background:${genre.color}"></i><span>${esc(genre.label)}</span></div>`).join('') : '<span class="genre-key" style="color:var(--faint)">Finish a book to start your genre map.</span>'}
            </div>
          </div>
        </section>

        <section class="panel" aria-labelledby="rating-title">
          <div class="panel-head"><div><h3 id="rating-title">Your ratings</h3><p>How the books have measured up</p></div></div>
          <div class="ratings-list">
            ${ratingDistribution.map(rating => `<div class="rating-bar-row"><span>${rating.value} star</span><span class="rating-bar-track"><span style="width:${rating.count ? Math.max(rating.count / maxRating * 100, 4) : 0}%"></span></span><span>${rating.count}</span></div>`).join('')}
          </div>
          <div class="rating-summary"><strong>${avgRating ? avgRating.toFixed(1) : '—'}</strong>${stars(avgRating)}<span>average across ${data.rated.length} rated books</span></div>
        </section>
      </div>
    </div>

    <section class="favorites-section" aria-labelledby="favorites-title">
      <div class="section-heading">
        <div><h2 id="favorites-title">The books that stayed</h2><p>Your highest-rated reads of the year.</p></div>
        <a href="#shelves" class="text-link">Back to my books ${icon('arrow-right')}</a>
      </div>
      ${favorites.length ? `<div class="favorites-grid">${favorites.map(book => bookCard(book)).join('')}</div>` : `<div class="empty-state"><span>${icon('star')}</span><h3>Your favourites will gather here</h3><p>Rate the books you finish to build your shelf of keepers.</p></div>`}
    </section>
    ${pageFooter()}
  </div>`;
}

/* ============================================================
   Layers, popovers, and feedback
   ============================================================ */
const layerStack = [];
const layerFocusReturn = new Map();
let profileContext = null;
let searchResultsCache = [];

function openLayer(id, { focus = true } = {}) {
  const layer = document.getElementById(id);
  if (!layer) return;
  closePopovers();
  const wasOpen = layer.classList.contains('is-open');
  if (!wasOpen) {
    layerFocusReturn.set(layer, document.activeElement instanceof HTMLElement ? document.activeElement : null);
    layerStack.push(id);
  }
  layer.style.zIndex = String(120 + layerStack.length);
  layer.classList.add('is-open');
  layer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  document.querySelector('.app-shell')?.setAttribute('inert', '');
  if (focus) {
    requestAnimationFrame(() => {
      const target = layer.querySelector('[data-autofocus]') || layer.querySelector('.dialog-close') || layer.querySelector('button, input, select, textarea, a[href]');
      if (target && typeof target.focus === 'function') target.focus({ preventScroll: true });
    });
  }
}
function closeLayer(id) {
  const layer = document.getElementById(id);
  if (!layer || !layer.classList.contains('is-open')) return;
  layer.classList.remove('is-open');
  layer.setAttribute('aria-hidden', 'true');
  const index = layerStack.indexOf(id);
  if (index > -1) layerStack.splice(index, 1);
  if (!layerStack.length) {
    document.body.classList.remove('modal-open');
    document.querySelector('.app-shell')?.removeAttribute('inert');
  }
  const returnTo = layerFocusReturn.get(layer);
  layerFocusReturn.delete(layer);
  requestAnimationFrame(() => {
    if (returnTo && returnTo.isConnected && (!layerStack.length || mostRecentLayer()?.contains(returnTo))) {
      returnTo.focus({ preventScroll: true });
      return;
    }
    const nextLayer = mostRecentLayer();
    whereFocusGoes(nextLayer);
  });
}
function whereFocusGoes(layer) {
  if (!layer) return;
  const preferred = layer.querySelector('[data-autofocus]') || layer.querySelector('.dialog-close') || layer.querySelector('button, input, select, textarea, a[href]');
  preferred?.focus({ preventScroll: true });
}
function closeAllLayers() {
  [...layerStack].reverse().forEach(closeLayer);
}
function closeAllPopovers() {
  document.querySelectorAll('.popover').forEach(popover => { popover.hidden = true; });
  document.querySelectorAll('[data-profile-trigger]').forEach(button => button.setAttribute('aria-expanded', 'false'));
  const bell = document.querySelector('[data-notifications]');
  if (bell) bell.setAttribute('aria-expanded', 'false');
  profileContext = null;
}
const closePopovers = closeAllPopovers;

function mostRecentLayer() {
  if (!layerStack.length) return null;
  return document.getElementById(layerStack[layerStack.length - 1]);
}

function trapFocus(event) {
  const layer = mostRecentLayer();
  if (!layer) return;
  const focusable = [...layer.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    .filter(element => element.getClientRects().length > 0);
  if (!focusable.length) {
    event.preventDefault();
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!layer.contains(document.activeElement)) {
    event.preventDefault();
    first.focus();
    return;
  }
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function showToast(message, type = 'default') {
  const region = document.getElementById('toast-region');
  if (!region) return;
  while (region.children.length >= 3) region.firstElementChild?.remove();
  const toast = document.createElement('div');
  toast.className = `toast${type === 'accent' ? ' toast--accent' : ''}`;
  toast.innerHTML = `<span class="toast-icon">${icon(type === 'accent' ? 'sparkles' : 'check')}</span><span>${esc(message)}</span>`;
  region.append(toast);
  setTimeout(() => {
    toast.classList.add('is-leaving');
    setTimeout(() => toast.remove(), 260);
  }, 4200);
}

/* ============================================================
   Search
   ============================================================ */
function searchMatches(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return state.books
    .map(book => {
      const title = book.title.toLowerCase();
      const author = book.author.toLowerCase();
      const genre = book.genre.toLowerCase();
      const description = book.description.join(' ').toLowerCase();
      let score = 0;
      if (title.startsWith(q)) score = 0;
      else if (title.includes(q)) score = 1;
      else if (author.includes(q)) score = 2;
      else if (genre.includes(q)) score = 3;
      else if (description.includes(q)) score = 4;
      else return { book, score: 99 };
      return { book, score };
    })
    .filter(match => match.score < 99)
    .sort((a, b) => a.score - b.score || b.book.ratingsCount - a.book.ratingsCount)
    .map(match => match.book);
}

function searchBookResult(book, index) {
  return `<button type="button" class="search-result ${index === state.searchHighlight ? 'is-highlighted' : ''}" data-search-book="${esc(book.id)}">
    <span class="cover"><img src="${esc(book.cover)}" alt="" loading="lazy"></span>
    <span class="search-result-copy"><strong>${esc(book.title)}</strong><span>${esc(book.author)} · ${esc(book.genre)}</span></span>
    <span class="search-result-meta">${ratingLine(book, false)}<span class="search-shelf">${esc(SHELF_META[book.shelf].short)}</span></span>
    <span class="search-enter-icon">${icon('arrow-up-right')}</span>
  </button>`;
}

function renderSearchResults(query = state.searchQuery) {
  state.searchQuery = query;
  const container = document.getElementById('search-results');
  if (!container) return;
  const q = query.trim();
  if (!q) {
    searchResultsCache = [];
    const recent = [...readingBooks(), ...readBooks().slice(0, 1), ...state.books.filter(book => book.shelf === 'want').slice(0, 1)]
      .filter((book, index, array) => book && array.findIndex(item => item.id === book.id) === index)
      .slice(0, 4);
    container.innerHTML = `<div class="search-section-label">Recently on your shelf</div>
      ${recent.map((book, index) => searchBookResult(book, index)).join('')}
      <div class="search-section-label">Browse by mood</div>
      <div class="search-suggestions">
        ${[['Atmospheric mysteries', 'mystery'], ['A little fantasy', 'fantasy'], ['Poetry for slow mornings', 'poetry'], ['Nature & attention', 'nature'], ['Quiet fiction', 'quiet']].map(([label, term]) => `<button type="button" class="search-suggestion" data-search-term="${esc(term)}">${label}</button>`).join('')}
      </div>
      <div class="search-quick-actions">
        <button type="button" class="search-action" data-search-route="browse">${icon('compass')} Browse every book <kbd>↵</kbd></button>
        <button type="button" class="search-action" data-add-book>${icon('plus')} Log a book to your shelves</button>
      </div>`;
    return;
  }
  const matches = searchMatches(q);
  searchResultsCache = matches;
  state.searchHighlight = clamp(state.searchHighlight, 0, Math.max(matches.length - 1, 0));
  if (!matches.length) {
    container.innerHTML = `<div class="search-empty">${icon('search')}<strong>No books found</strong><p>Try a title, an author, or a feeling like “storms”.</p></div>
      <div class="search-quick-actions"><button type="button" class="search-action" data-search-route="browse">${icon('compass')} Browse all ${state.books.length} books</button><button type="button" class="search-action" data-add-book>${icon('plus')} Log this book manually</button></div>`;
    return;
  }
  container.innerHTML = `<div class="search-section-label">${matches.length} ${matches.length === 1 ? 'book' : 'books'} found</div>
    ${matches.slice(0, 8).map((book, index) => searchBookResult(book, index)).join('')}`;
}

function updateSearchHighlight(delta) {
  if (!searchResultsCache.length) return;
  state.searchHighlight = (state.searchHighlight + delta + searchResultsCache.length) % searchResultsCache.length;
  const rows = [...document.querySelectorAll('#search-results .search-result')];
  rows.forEach((row, index) => row.classList.toggle('is-highlighted', index === state.searchHighlight));
  rows[state.searchHighlight]?.scrollIntoView({ block: 'nearest' });
}

function openSearch() {
  const layer = document.getElementById('search-layer');
  if (!layer) return;
  const input = document.getElementById('search-input');
  if (input) input.value = '';
  state.searchQuery = '';
  state.searchHighlight = 0;
  renderSearchResults('');
  openLayer('search-layer');
  requestAnimationFrame(() => input?.focus({ preventScroll: true }));
}

function openSearchBook(id) {
  closeLayer('search-layer');
  openBook(id);
}

/* ============================================================
   Book detail
   ============================================================ */
function starPicker(book) {
  return `<div class="star-picker" role="group" aria-label="Rate ${esc(book.title)}">
    ${[1, 2, 3, 4, 5].map(value => `<button type="button" class="${value <= (book.myRating || 0) ? 'is-filled' : ''}" data-rate-book="${esc(book.id)}" data-rating="${value}" aria-label="Rate ${value} star${value > 1 ? 's' : ''}" aria-pressed="${value <= (book.myRating || 0)}">${icon('star')}</button>`).join('')}
    <span class="star-picker__caption">${book.myRating ? `${book.myRating} / 5` : 'Not rated yet'}</span>
  </div>`;
}

function reviewCard(review) {
  const person = people[review.user];
  return `<article class="review-card">
    <div class="review-head">
      ${person ? avatar(review.user, 'sm') : avatar('maya', 'sm')}
      <div class="review-head-copy">
        <strong>${esc(person ? person.name : 'Reader')}</strong>
        <span>${stars(review.rating, 'stars--sm')} ${esc(review.date || 'Recently')}</span>
      </div>
    </div>
    <div class="review-body">
      <p>${esc(review.text)}</p>
      <div class="review-actions"><span>${icon('heart')} ${review.likes || 0} found this helpful</span></div>
    </div>
  </article>`;
}

function bookReviews(book) {
  const reviews = state.reviews[book.id] || [];
  return reviews.map(reviewCard).join('');
}

function bookDialogMarkup(book) {
  const reviews = state.reviews[book.id] || [];
  const progressPct = clamp(book.progress / book.pages * 100, 0, 100);
  const shelves = ['want', 'reading', 'read'];
  return `<div class="modal-scrim" data-close-layer="book-layer"></div>
    <article class="dialog book-dialog" role="dialog" aria-modal="true" aria-labelledby="book-dialog-title">
      <button type="button" class="dialog-close" data-close-layer="book-layer" aria-label="Close book details">${icon('close')}</button>
      <div class="book-detail-grid">
        <div class="book-detail-cover">
          <div class="cover"><img src="${esc(book.cover)}" alt="Cover of ${esc(book.title)}"></div>
          <p class="book-cover-meta">${esc(book.format)} · ${fmtNumber(book.pages)} pages<br>${esc(book.publisher)} · ${book.year}</p>
        </div>
        <div class="book-detail-content">
          <p class="book-genre-label">${esc(book.genre)}</p>
          <h2 class="book-detail-title" id="book-dialog-title">${esc(book.title)}</h2>
          <p class="book-detail-author">by <strong>${esc(book.author)}</strong></p>
          <div class="book-rating-row">${stars(book.rating)}<strong>${book.rating ? book.rating.toFixed(1) : '—'}</strong><span>${book.ratingsCount ? `${fmtCount(book.ratingsCount)} ratings` : 'No ratings yet'}</span></div>
          <div class="book-detail-meta">
            <span>${icon('calendar')} ${book.year}</span>
            <span>${icon('books')} ${fmtNumber(book.pages)} pages</span>
            <span>${icon('bookmark')} ${esc(book.format)}</span>
            ${book.shelf === 'read' && book.finishedDate ? `<span>${icon('check')} Finished ${formatDate(book.finishedDate)}</span>` : ''}
          </div>
          <div class="book-description">${book.description.map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}</div>
          <div class="book-detail-actions">
            <div class="book-shelf-selector" role="group" aria-label="Shelve this book">
              ${shelves.map(key => `<button type="button" class="shelf-choice ${book.shelf === key ? 'is-selected' : ''}" data-set-shelf="${key}" data-book-id="${esc(book.id)}" aria-pressed="${book.shelf === key}">${icon(book.shelf === key ? 'check' : SHELF_META[key].icon)} ${SHELF_META[key].short}</button>`).join('')}
            </div>
            ${book.shelf === 'reading' ? `<button type="button" class="btn btn--primary btn--sm" data-progress-book="${esc(book.id)}">${icon('edit')} Update progress</button>` : ''}
          </div>
          ${book.shelf === 'reading' ? `<div class="shelf-progress" style="margin-top:13px;max-width:330px"><div class="progress-labels"><span>Page ${fmtNumber(book.progress)} of ${fmtNumber(book.pages)}</span><span>${Math.round(progressPct)}%</span></div><div class="progress-track"><span style="width:${progressPct}%"></span></div></div>` : ''}
          <div class="my-rating-box">
            <div class="my-rating-label"><strong>Your rating</strong>${book.myRating ? 'A note for your future self.' : 'How did it make you feel?'}</div>
            ${starPicker(book)}
          </div>
        </div>
      </div>
      <section class="book-reviews-section" aria-labelledby="reviews-title">
        <div class="reviews-head">
          <div><h3 id="reviews-title">From the reading room</h3><p>${fmtCount(book.reviewsCount)} reviews · ${reviews.length} from readers you follow</p></div>
        </div>
        <div class="review-list">${reviews.length ? reviews.map(reviewCard).join('') : '<p class="no-reviews">No reviews yet. Leave the first note in the margin.</p>'}</div>
        <div class="write-review">
          <button type="button" class="write-review-toggle" data-toggle-review>${icon('edit')} Write a review</button>
          <form class="review-form" id="review-form" data-book-id="${esc(book.id)}">
            <textarea name="review" required maxlength="1200" placeholder="What will you remember about this book?" aria-label="Your review"></textarea>
            <div class="review-form-actions"><span>Your review will be shared with your circle.</span><div style="display:flex;gap:6px"><button type="button" class="btn btn--quiet btn--sm" data-toggle-review>Cancel</button><button type="submit" class="btn btn--primary btn--sm">Post review</button></div></div>
          </form>
        </div>
      </section>
    </article>`;
}

function refreshOpenBook(bookId, { preserveScroll = false } = {}) {
  const book = bookById(bookId);
  if (!book) return;
  const layer = document.getElementById('book-layer');
  if (!layer) return;
  const oldScroll = preserveScroll ? layer.querySelector('.book-dialog')?.scrollTop || 0 : 0;
  layer.innerHTML = bookDialogMarkup(book);
  if (layer.classList.contains('is-open')) {
    const dialog = layer.querySelector('.book-dialog');
    if (dialog && preserveScroll) dialog.scrollTop = oldScroll;
  }
}

function openBook(id) {
  const book = bookById(id);
  if (!book) return;
  state.activeBook = id;
  const layer = document.getElementById('book-layer');
  layer.innerHTML = bookDialogMarkup(book);
  openLayer('book-layer');
}

function setBookShelf(id, shelf) {
  const book = bookById(id);
  if (!book) return;
  const previous = book.shelf;
  if (previous === shelf) return;
  book.shelf = shelf;
  if (shelf === 'read') {
    book.progress = book.pages;
    book.finishedDate = new Date().toISOString().slice(0, 10);
  } else if (shelf === 'reading') {
    if (!book.progress || book.progress >= book.pages) book.progress = Math.max(1, Math.round(book.pages * .1));
    book.finishedDate = null;
  } else if (shelf === 'want') {
    book.progress = 0;
    book.finishedDate = null;
  }
  if (document.getElementById('book-layer')?.classList.contains('is-open')) {
    refreshOpenBook(id, { preserveScroll: true });
  }
  renderRoute();
  updateNotificationUI();
  const messages = {
    want: `Saved “${book.title}” for later.`,
    reading: `“${book.title}” is now on your bedside stack.`,
    read: previous === 'read' ? `Updated “${book.title}”.` : `Finished “${book.title}”. One more for the year.`,
  };
  showToast(messages[shelf]);
}

function rateBook(id, rating) {
  const book = bookById(id);
  if (!book) return;
  book.myRating = rating;
  const picker = document.querySelector(`#book-layer .star-picker`);
  if (picker) {
    picker.querySelectorAll('button[data-rating]').forEach(button => {
      const filled = Number(button.dataset.rating) <= rating;
      button.classList.toggle('is-filled', filled);
      button.setAttribute('aria-pressed', String(filled));
    });
    const caption = picker.querySelector('.star-picker__caption');
    if (caption) caption.textContent = `${rating} / 5`;
  }
  const ratingLabel = document.querySelector('#book-layer .my-rating-label');
  if (ratingLabel) ratingLabel.childNodes[ratingLabel.childNodes.length - 1].textContent = ' A note for your future self.';
  const quick = document.querySelector(`[data-quick-rating="${id}"]`);
  if (quick) {
    quick.querySelectorAll('[data-quick-rate]').forEach(button => {
      button.classList.toggle('is-filled', Number(button.dataset.quickRate) <= rating);
    });
    const label = quick.querySelector('span');
    if (label) label.textContent = `You rated it ${rating}/5`;
  }
  showToast(`Rated “${book.title}” ${rating} star${rating > 1 ? 's' : ''}.`, 'accent');
}

/* ============================================================
   Progress dialog
   ============================================================ */
function progressDialogMarkup(book) {
  const progress = clamp(book.progress || 0, 0, book.pages);
  const pct = Math.round(progress / book.pages * 100);
  return `<div class="modal-scrim" data-close-layer="progress-layer"></div>
    <form class="dialog progress-dialog" id="progress-form" data-book-id="${esc(book.id)}" role="dialog" aria-modal="true" aria-labelledby="progress-title">
      <button type="button" class="dialog-close" data-close-layer="progress-layer" aria-label="Close progress editor">${icon('close')}</button>
      <div class="dialog-head">
        <p class="eyebrow">Update progress</p>
        <h2 id="progress-title">Where are you now?</h2>
        <p>A page at a time is perfect.</p>
      </div>
      <div class="dialog-body">
        <div class="progress-book-row">
          <span class="cover"><img src="${esc(book.cover)}" alt="" loading="lazy"></span>
          <div class="progress-book-copy"><h3>${esc(book.title)}</h3><p>${esc(book.author)} · ${fmtNumber(book.pages)} pages</p></div>
        </div>
        <div class="progress-editor">
          <div class="progress-editor-label"><label for="progress-range">Reading progress</label><output id="progress-percent" for="progress-range">${pct}%</output></div>
          <input class="range" id="progress-range" name="progress" type="range" min="0" max="${book.pages}" value="${progress}" style="--range-pct:${pct}%" aria-label="Current page">
          <div class="range-ends"><span>Page 0</span><span>Page ${fmtNumber(book.pages)}</span></div>
          <div class="progress-page-input">On page <input id="progress-page" type="number" min="0" max="${book.pages}" value="${progress}" inputmode="numeric" aria-label="Current page number"> of ${fmtNumber(book.pages)}</div>
        </div>
        <p class="progress-finish-note">${icon('sparkles')} Finish the last page? We’ll move it to your Read shelf automatically.</p>
        <div class="dialog-actions" style="padding-left:0;padding-right:0;padding-bottom:0;border-bottom:0">
          <button type="button" class="btn btn--quiet btn--sm" data-mark-finished="${esc(book.id)}">Mark finished</button>
          <button type="button" class="btn btn--secondary btn--sm" data-close-layer="progress-layer">Cancel</button>
          <button type="submit" class="btn btn--primary btn--sm">Save progress</button>
        </div>
      </div>
    </form>`;
}
function openProgress(id) {
  const book = bookById(id);
  if (!book) return;
  const layer = document.getElementById('progress-layer');
  layer.innerHTML = progressDialogMarkup(book);
  openLayer('progress-layer');
}

function updateProgressEditor(value) {
  const range = document.getElementById('progress-range');
  const number = document.getElementById('progress-page');
  const output = document.getElementById('progress-percent');
  if (!range || !number || !output) return;
  const max = Number(range.max) || 1;
  const page = clamp(Number(value) || 0, 0, max);
  const pct = Math.round(page / max * 100);
  range.value = page;
  number.value = page;
  range.style.setProperty('--range-pct', `${pct}%`);
  output.textContent = `${pct}%`;
}

/* ============================================================
   Add book
   ============================================================ */
function makeCustomCover(title, author) {
  const palettes = [
    ['#243a31', '#d6ae74', '#f2e7d2'],
    ['#283848', '#c98962', '#eedfca'],
    ['#542b2c', '#d8b479', '#f4e7d2'],
    ['#4b3b55', '#d3a55f', '#f2e3cc'],
    ['#a54f36', '#ead7b3', '#302b22'],
    ['#d9c364', '#29352d', '#263027'],
  ];
  let hash = 0;
  for (const char of title + author) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  const [bg, accent, ink] = palettes[hash % palettes.length];
  const words = title.trim().split(/\s+/);
  const lines = [];
  let current = '';
  words.forEach(word => {
    if ((current + ' ' + word).trim().length > 13 && current) {
      lines.push(current);
      current = word;
    } else {
      current = (current + ' ' + word).trim();
    }
  });
  if (current) lines.push(current);
  const shown = lines.slice(0, 4);
  if (lines.length > 4) shown[3] = `${shown[3].slice(0, 11)}…`;
  const titleSvg = shown.map((line, index) => `<tspan x="42" y="${416 + index * 47}">${esc(line)}</tspan>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
    <rect width="400" height="600" fill="${bg}"/>
    <circle cx="318" cy="141" r="71" fill="${accent}" opacity=".9"/>
    <circle cx="200" cy="300" r="116" fill="none" stroke="${accent}" stroke-width="1" opacity=".4"/>
    <path d="M40 342c78-46 155-28 206 18s96 45 134 19" fill="none" stroke="${accent}" stroke-width="2" opacity=".6"/>
    <text x="41" y="66" fill="${accent}" font-family="Arial, sans-serif" font-size="10" letter-spacing="3">A NEW ADDITION</text>
    <text x="40" y="${416 - 52}" fill="${ink}" font-family="Georgia, serif" font-size="9" opacity=".7" letter-spacing="2">FROM YOUR SHELF</text>
    <text fill="${ink}" font-family="Georgia, 'Times New Roman', serif" font-size="39" letter-spacing="-.5">${titleSvg}</text>
    <text x="42" y="574" fill="${accent}" font-family="Arial, sans-serif" font-size="11" letter-spacing="2.2">${esc((author || 'Unknown author').toUpperCase())}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function openAddBook() {
  const layer = document.getElementById('add-book-layer');
  layer.innerHTML = `<div class="modal-scrim" data-close-layer="add-book-layer"></div>
    <form class="dialog add-dialog" id="add-book-form" role="dialog" aria-modal="true" aria-labelledby="add-book-title">
      <button type="button" class="dialog-close" data-close-layer="add-book-layer" aria-label="Close add book form">${icon('close')}</button>
      <div class="dialog-head">
        <p class="eyebrow">A new arrival</p>
        <h2 id="add-book-title">Log a book.</h2>
        <p>Add something to your shelves. We’ll make it a cover.</p>
      </div>
      <div class="dialog-body">
        <div class="form-grid">
          <div class="field"><label for="add-title">Title</label><input id="add-title" name="title" type="text" required maxlength="120" placeholder="The book you can’t stop thinking about" data-autofocus></div>
          <div class="field"><label for="add-author">Author</label><input id="add-author" name="author" type="text" required maxlength="90" placeholder="Who wrote it?"></div>
          <div class="form-row">
            <div class="field"><label for="add-status">Put it on</label><select id="add-status" name="status"><option value="want">Want to read</option><option value="reading">Currently reading</option><option value="read">Read</option></select></div>
            <div class="field"><label for="add-pages">Pages <span>optional</span></label><input id="add-pages" name="pages" type="number" min="1" max="5000" placeholder="e.g. 320" inputmode="numeric"></div>
          </div>
          <p class="add-dialog-cover-note">${icon('sparkles')} Every book gets a one-of-a-kind cover on this instance. You can always change it later.</p>
        </div>
      </div>
      <div class="dialog-actions">
        <button type="button" class="btn btn--quiet btn--sm" data-close-layer="add-book-layer">Cancel</button>
        <button type="submit" class="btn btn--primary btn--sm">${icon('plus')} Add to shelf</button>
      </div>
    </form>`;
  openLayer('add-book-layer');
}

/* ============================================================
   Composer
   ============================================================ */
function openComposer(mode = 'post') {
  const isDiscussion = mode === 'discussion';
  const layer = document.getElementById('composer-layer');
  const bookOptions = state.books.slice().sort((a, b) => a.title.localeCompare(b.title)).map(book => `<option value="${esc(book.id)}">${esc(book.title)}</option>`).join('');
  layer.innerHTML = `<div class="modal-scrim" data-close-layer="composer-layer"></div>
    <form class="dialog composer-dialog" id="composer-form" data-mode="${isDiscussion ? 'discussion' : 'post'}" role="dialog" aria-modal="true" aria-labelledby="composer-title">
      <button type="button" class="dialog-close" data-close-layer="composer-layer" aria-label="Close composer">${icon('close')}</button>
      <div class="dialog-head">
        <p class="eyebrow">${isDiscussion ? 'Start a discussion' : 'Share an update'}</p>
        <h2 id="composer-title">${isDiscussion ? 'What’s on your mind?' : 'A note for the reading room.'}</h2>
        <p>${isDiscussion ? 'Ask a question, start a readalong, or think out loud.' : 'Tell your circle what you’re reading, noticing, or carrying with you.'}</p>
      </div>
      <div class="dialog-body">
        <div class="composer-user">${avatar('maya', 'sm')}<div><strong>Maya Chen</strong><span>Sharing with your circle</span></div></div>
        <div class="form-grid">
          ${isDiscussion ? '<div class="field"><label for="composer-topic">Topic</label><input id="composer-topic" name="topic" type="text" maxlength="160" required placeholder="What should we talk about?" data-autofocus></div>' : ''}
          <div class="field"><label for="composer-body">${isDiscussion ? 'Your thoughts' : 'Update'}</label><textarea id="composer-body" name="body" required maxlength="1600" placeholder="${isDiscussion ? 'Give us a little context…' : 'I just read…'}" ${isDiscussion ? '' : 'data-autofocus'}></textarea></div>
          <div class="composer-tools">
            <div class="field"><label for="composer-book">Attach a book <span>optional</span></label><select id="composer-book" name="book"><option value="">No book attached</option>${bookOptions}</select></div>
            <span class="composer-tools-note">${icon('users')} Shared with your circle</span>
          </div>
        </div>
      </div>
      <div class="dialog-actions">
        <button type="button" class="btn btn--quiet btn--sm" data-close-layer="composer-layer">Cancel</button>
        <button type="submit" class="btn btn--primary btn--sm">${icon('send')} ${isDiscussion ? 'Start discussion' : 'Share update'}</button>
      </div>
    </form>`;
  openLayer('composer-layer');
}

/* ============================================================
   Notifications / profile
   ============================================================ */
function renderNotificationPopover() {
  const popover = document.getElementById('notification-popover');
  if (!popover) return;
  const unread = state.notifications.filter(item => item.unread).length;
  popover.innerHTML = `<div class="popover-head"><h2>Notifications</h2>${unread ? '<button type="button" data-mark-all-read>Mark all read</button>' : '<span style="color:var(--faint);font-size:8.5px">All caught up</span>'}</div>
    <div class="notification-list">
      ${state.notifications.map(item => `<button type="button" class="notification-item ${item.unread ? 'is-unread' : ''}" data-notification="${esc(item.id)}">
        <span class="notification-icon ${item.accent ? 'notification-icon--accent' : item.icon === 'target' || item.icon === 'sparkles' ? 'notification-icon--gold' : ''}">${icon(item.icon)}</span>
        <span class="notification-copy">${item.user ? `<strong>${esc(people[item.user].name)}</strong> ` : ''}${item.text}<time>${esc(item.time)}</time></span>
        ${item.unread ? '<span class="unread-pip" aria-label="Unread"></span>' : ''}
      </button>`).join('')}
    </div>
    <div class="notification-foot">A quiet inbox, just for your reading life</div>`;
}

function toggleNotifications(trigger) {
  const popover = document.getElementById('notification-popover');
  if (!popover) return;
  const isOpening = popover.hidden;
  closePopovers();
  if (!isOpening) return;
  renderNotificationPopover();
  popover.hidden = false;
  trigger?.setAttribute('aria-expanded', 'true');
}

function profileMenuMarkup() {
  const unread = state.notifications.filter(item => item.unread).length;
  return `<div class="profile-popover-head">${avatar('maya', 'md')}<div><strong>Maya Chen</strong><span>@maya · your reading room</span></div></div>
    <div class="profile-menu">
      <button type="button" class="profile-menu-item" data-profile-route="stats">${icon('chart')} Reading stats</button>
      <button type="button" class="profile-menu-item" data-profile-route="shelves">${icon('books')} My books</button>
      <button type="button" class="profile-menu-item" data-add-book>${icon('plus')} Log a book</button>
      <button type="button" class="profile-menu-item" data-profile-notifications>${icon('bell')} Notifications <span class="menu-trailing">${unread ? `${unread} new` : 'All read'}</span></button>
      <div class="profile-menu-sep"></div>
      <button type="button" class="profile-menu-item" data-theme-toggle>${icon(state.theme === 'dark' ? 'sun' : 'moon')} Appearance <span class="menu-trailing"><span data-theme-label>${state.theme === 'dark' ? 'Day mode' : 'Night mode'}</span><span class="theme-switch" aria-hidden="true"></span></span></button>
      <button type="button" class="profile-menu-item" data-demo-action="settings">${icon('settings')} Account settings</button>
      <div class="profile-menu-sep"></div>
      <button type="button" class="profile-menu-item" data-demo-action="signout">${icon('log-out')} Sign out</button>
    </div>`;
}

function toggleProfile(trigger) {
  const popover = document.getElementById('profile-popover');
  if (!popover) return;
  const isOpening = popover.hidden;
  closePopovers();
  document.querySelectorAll('[data-profile-trigger]').forEach(button => button.setAttribute('aria-expanded', 'false'));
  if (!isOpening) return;
  profileContext = trigger;
  popover.innerHTML = profileMenuMarkup();
  popover.classList.toggle('profile-popover--sidebar', Boolean(trigger?.closest('.sidebar')));
  popover.hidden = false;
  trigger?.setAttribute('aria-expanded', 'true');
}

function closeProfilePopover() {
  const popover = document.getElementById('profile-popover');
  if (popover) popover.hidden = true;
  document.querySelectorAll('[data-profile-trigger]').forEach(button => button.setAttribute('aria-expanded', 'false'));
}

function updateThemeMenu() {
  const newTheme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  const label = document.querySelector('[data-theme-label]');
  if (label) label.textContent = newTheme === 'dark' ? 'Day mode' : 'Night mode';
  const menuIcon = document.querySelector('[data-theme-toggle] .icon use');
  if (menuIcon) menuIcon.setAttribute('href', newTheme === 'dark' ? '#i-sun' : '#i-moon');
  showToast(newTheme === 'dark' ? 'Night mode on. Easier on the eyes.' : 'Back to day mode.', 'accent');
}

/* ============================================================
   Actions
   ============================================================ */
function toggleLike(postId) {
  const post = state.posts.find(item => item.id === postId);
  if (!post) return;
  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
  const button = document.querySelector(`[data-like-post="${postId}"]`);
  if (button) {
    button.classList.toggle('is-liked', post.liked);
    button.setAttribute('aria-pressed', String(post.liked));
    button.setAttribute('aria-label', `${post.liked ? 'Unlike' : 'Like'} this post, ${post.likes} likes`);
    const count = button.querySelector('[data-like-count]');
    if (count) count.textContent = post.likes;
  }
}
function toggleSave(postId) {
  const post = state.posts.find(item => item.id === postId);
  if (!post) return;
  post.saved = !post.saved;
  const button = document.querySelector(`[data-save-post="${postId}"]`);
  if (button) {
    button.classList.toggle('is-saved', post.saved);
    button.setAttribute('aria-pressed', String(post.saved));
    const label = button.querySelector('.save-label');
    if (label) label.textContent = post.saved ? 'Saved' : 'Save';
  }
  showToast(post.saved ? 'Post saved to your commonplace book.' : 'Removed from saved posts.');
}
function scrollToPost(postId) {
  state.community.filter = 'all';
  showCommunityAndScroll(postId);
}
function showCommunityAndScroll(postId) {
  if (state.route !== 'community') {
    navigate('community');
    setTimeout(() => flashPost(postId), 240);
  } else if (!document.getElementById(`post-${postId}`)) {
    renderRoute();
    setTimeout(() => flashPost(postId), 30);
  } else {
    flashPost(postId);
  }
}
function flashPost(postId) {
  const post = document.getElementById(`post-${postId}`);
  if (!post) return;
  post.scrollIntoView({ behavior: 'smooth', block: 'center' });
  post.classList.add('feed-card--flash');
  setTimeout(() => post.classList.remove('feed-card--flash'), 1500);
}

function openNotification(id) {
  const item = state.notifications.find(notification => notification.id === id);
  if (!item) return;
  item.unread = false;
  closeLayer('notification-popover');
  document.getElementById('notification-popover').hidden = true;
  updateNotificationUI();
  if (item.action?.book) {
    openBook(item.action.book);
  } else if (item.action?.route) {
    navigate(item.action.route);
  }
}

/* ---------- Form submissions ---------- */
function handleKeydown(event) {
  const active = document.activeElement;
  const typing = active && (active.matches('input, textarea, select, [contenteditable="true"]'));
  const meta = event.metaKey || event.ctrlKey;

  if (meta && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    openSearch();
    return;
  }

  if (event.key === 'Escape') {
    if (layerStack.length) {
      event.preventDefault();
      closeLayer(layerStack[layerStack.length - 1]);
      return;
    }
    if (!document.getElementById('profile-popover')?.hidden || !document.getElementById('notification-popover')?.hidden) {
      closePopovers();
      return;
    }
  }

  const searchLayerOpen = document.getElementById('search-layer')?.classList.contains('is-open');
  const searchActive = active?.id === 'search-input';
  if (searchLayerOpen && (!typing || searchActive)) {
    if (event.key === 'ArrowDown') { event.preventDefault(); updateSearchHighlight(1); return; }
    if (event.key === 'ArrowUp') { event.preventDefault(); updateSearchHighlight(-1); return; }
    if (event.key === 'Enter' && searchResultsCache.length) {
      event.preventDefault();
      openSearchBook(searchResultsCache[state.searchHighlight].id);
      return;
    }
  }

  if (event.key === 'Tab' && layerStack.length) {
    trapFocus(event);
    return;
  }

  if (!typing && !layerStack.length && event.key.toLowerCase() === 'n' && !meta) {
    event.preventDefault();
    openAddBook();
    return;
  }
  if (!typing && !layerStack.length && event.key === '/' && !meta) {
    event.preventDefault();
    openSearch();
  }
}

function submitAddBook(form) {
  const data = new FormData(form);
  const title = String(data.get('title') || '').trim();
  const author = String(data.get('author') || '').trim();
  const status = String(data.get('status') || 'want');
  const pages = clamp(Number(data.get('pages')) || 320, 1, 5000);
  if (!title || !author) return;
  const id = `custom-${Date.now()}`;
  const book = {
    id, title, author, year: new Date().getFullYear(), pages,
    rating: 0, ratingsCount: 0, reviewsCount: 0,
    genre: 'Added by you', filter: 'fiction', shelf: status,
    progress: status === 'read' ? pages : 0,
    added: new Date().toISOString().slice(0, 10),
    finishedDate: status === 'read' ? new Date().toISOString().slice(0, 10) : null,
    myRating: 0,
    cover: makeCustomCover(title, author),
    format: 'Personal copy', publisher: 'Your library',
    quote: '',
    description: [`“${title}” is waiting on your shelf. Add your thoughts once you’ve spent some time with it.`],
  };
  state.books.unshift(book);
  state.reviews[id] = [];
  closeLayer('add-book-layer');
  state.myBooks.shelf = status;
  showToast(`Added “${title}” to ${SHELF_META[status].short.toLowerCase()}.`);
  if (state.route === 'shelves') renderRoute();
  else navigate('shelves');
  updateChrome();
}

function submitReview(form) {
  const bookId = form.dataset.bookId;
  const book = bookById(bookId);
  const data = new FormData(form);
  const text = String(data.get('review') || '').trim();
  if (!book || !text) return;
  if (!book.myRating) {
    showToast('Choose a star rating before posting your review.', 'accent');
    document.querySelector('#book-layer .star-picker button')?.focus();
    return;
  }
  const review = { id: `review-${Date.now()}`, user: 'maya', rating: book.myRating, date: 'Just now', text, likes: 0 };
  if (!state.reviews[bookId]) state.reviews[bookId] = [];
  state.reviews[bookId].unshift(review);
  book.reviewsCount = (book.reviewsCount || 0) + 1;
  refreshOpenBook(bookId, { preserveScroll: true });
  showToast('Your review is in the reading room.');
}

function submitProgress(form) {
  const bookId = form.dataset.bookId;
  const book = bookById(bookId);
  const input = form.querySelector('#progress-page');
  if (!book || !input) return;
  const value = clamp(Number(input.value) || 0, 0, book.pages);
  book.progress = value;
  let newlyFinished = false;
  if (value >= book.pages) {
    newlyFinished = book.shelf !== 'read';
    book.shelf = 'read';
    book.finishedDate = book.finishedDate || new Date().toISOString().slice(0, 10);
  } else if (book.shelf !== 'read') {
    book.shelf = 'reading';
  }
  closeLayer('progress-layer');
  if (document.getElementById('book-layer')?.classList.contains('is-open')) {
    refreshOpenBook(book.id, { preserveScroll: false });
  }
  renderRoute();
  if (newlyFinished) {
    showToast(`Finished “${book.title}.” Beautiful work.`, 'accent');
  } else {
    showToast(`Progress saved at page ${fmtNumber(value)}.`);
  }
}

function submitComposer(form) {
  const mode = form.dataset.mode;
  const data = new FormData(form);
  const body = String(data.get('body') || '').trim();
  const topic = String(data.get('topic') || '').trim();
  const bookId = String(data.get('book') || '');
  if (!body || (mode === 'discussion' && !topic)) return;
  const post = {
    id: `post-${Date.now()}`,
    type: mode === 'discussion' ? 'discussion' : (bookId ? 'review' : 'note'),
    user: 'maya',
    date: 'Just now',
    text: body,
    likes: 0,
    comments: 0,
    liked: false,
    saved: false,
  };
  if (mode === 'discussion') {
    post.title = topic;
    post.tags = ['Discussion'];
    post.participants = ['maya'];
  }
  if (bookId) {
    post.bookId = bookId;
    if (mode !== 'discussion') post.rating = bookById(bookId)?.myRating || 0;
  }
  state.posts.unshift(post);
  closeLayer('composer-layer');
  state.community.filter = 'all';
  if (state.route === 'community') renderRoute();
  else navigate('community');
  showToast(mode === 'discussion' ? 'Your discussion is live in the reading room.' : 'Update shared with your reading circle.', 'accent');
}

function handleSubmit(event) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  if (form.id === 'add-book-form') { event.preventDefault(); submitAddBook(form); }
  else if (form.id === 'review-form') { event.preventDefault(); submitReview(form); }
  else if (form.id === 'progress-form') { event.preventDefault(); submitProgress(form); }
  else if (form.id === 'composer-form') { event.preventDefault(); submitComposer(form); }
}

/* ---------- Clicks ---------- */
function handleClick(event) {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  const close = target.closest('[data-close-layer]');
  if (close) {
    event.preventDefault();
    closeLayer(close.dataset.closeLayer);
    return;
  }

  const searchBook = target.closest('[data-search-book]');
  if (searchBook) {
    openSearchBook(searchBook.dataset.searchBook);
    return;
  }
  const searchTerm = target.closest('[data-search-term]');
  if (searchTerm) {
    const input = document.getElementById('search-input');
    const term = searchTerm.dataset.searchTerm;
    if (input) { input.value = term; input.focus(); }
    state.searchHighlight = 0;
    renderSearchResults(term);
    return;
  }
  const searchRoute = target.closest('[data-search-route]');
  if (searchRoute) {
    closeLayer('search-layer');
    navigate(searchRoute.dataset.searchRoute);
    return;
  }

  const openSearchTrigger = target.closest('[data-open-search]');
  if (openSearchTrigger) { openSearch(); return; }

  const openBookTrigger = target.closest('[data-open-book]');
  if (openBookTrigger) {
    openBook(openBookTrigger.dataset.openBook);
    return;
  }

  const addTrigger = target.closest('[data-add-book]');
  if (addTrigger) {
    if (document.getElementById('search-layer')?.classList.contains('is-open')) closeLayer('search-layer');
    closePopovers();
    openAddBook();
    return;
  }

  const progressTrigger = target.closest('[data-progress-book]');
  if (progressTrigger) {
    openProgress(progressTrigger.dataset.progressBook);
    return;
  }

  const shelfChoice = target.closest('[data-set-shelf]');
  if (shelfChoice) {
    const book = bookById(shelfChoice.dataset.bookId) || (state.activeBook ? bookById(state.activeBook) : null);
    if (book) setBookShelf(book.id, shelfChoice.dataset.setShelf);
    return;
  }

  const rateButton = target.closest('[data-rate-book]');
  if (rateButton) {
    rateBook(rateButton.dataset.rateBook, Number(rateButton.dataset.rating));
    return;
  }
  const quickRate = target.closest('[data-quick-rate]');
  if (quickRate) {
    const wrap = quickRate.closest('[data-quick-rating]');
    if (wrap) rateBook(wrap.dataset.quickRating, Number(quickRate.dataset.quickRate));
    return;
  }

  const toggleReview = target.closest('[data-toggle-review]');
  if (toggleReview) {
    const form = document.getElementById('review-form');
    form?.classList.toggle('is-open');
    if (form?.classList.contains('is-open')) form.querySelector('textarea')?.focus();
    return;
  }

  if (target.closest('[data-mark-finished]')) {
    const range = document.getElementById('progress-range');
    if (range) updateProgressEditor(range.max);
    return;
  }

  const composerTrigger = target.closest('[data-open-composer]');
  if (composerTrigger) { openComposer(composerTrigger.dataset.openComposer); return; }

  const shelfFilter = target.closest('[data-shelf-filter]');
  if (shelfFilter) {
    state.myBooks.shelf = shelfFilter.dataset.shelfFilter;
    renderRoute();
    return;
  }
  const layoutButton = target.closest('[data-library-layout]');
  if (layoutButton) {
    state.myBooks.layout = layoutButton.dataset.libraryLayout;
    renderRoute();
    return;
  }
  const browseFilter = target.closest('[data-browse-filter]');
  if (browseFilter) {
    state.browse.filter = browseFilter.dataset.browseFilter;
    renderRoute();
    return;
  }
  const feedFilter = target.closest('[data-feed-filter]');
  if (feedFilter) {
    state.community.filter = feedFilter.dataset.feedFilter;
    renderRoute();
    return;
  }
  const shelfJump = target.closest('[data-shelf-jump]');
  if (shelfJump) {
    event.preventDefault();
    state.myBooks.shelf = shelfJump.dataset.shelfJump;
    if (state.route === 'shelves') renderRoute();
    else navigate('shelves');
    return;
  }

  const like = target.closest('[data-like-post]');
  if (like) { toggleLike(like.dataset.likePost); return; }
  const save = target.closest('[data-save-post]');
  if (save) { toggleSave(save.dataset.savePost); return; }
  const comment = target.closest('[data-comment-post]');
  if (comment) {
    const post = state.posts.find(item => item.id === comment.dataset.commentPost);
    showToast(`Thread replies are mocked in this preview${post ? ` — ${post.comments} readers are already talking.` : '.'}`, 'accent');
    return;
  }
  const scrollPost = target.closest('[data-scroll-post]');
  if (scrollPost) { scrollToPost(scrollPost.dataset.scrollPost); return; }

  const follow = target.closest('[data-follow-user]');
  if (follow) {
    const user = follow.dataset.followUser;
    if (state.followed.has(user)) {
      state.followed.delete(user);
      follow.classList.remove('is-following');
      follow.textContent = 'Follow';
      showToast(`Unfollowed ${people[user].name}.`);
    } else {
      state.followed.add(user);
      follow.classList.add('is-following');
      follow.textContent = 'Following';
      showToast(`Following ${people[user].name}. Their reviews will appear in your feed.`, 'accent');
    }
    return;
  }

  const notifications = target.closest('[data-notifications]');
  if (notifications) {
    toggleNotifications(notifications);
    return;
  }
  const markAllRead = target.closest('[data-mark-all-read]');
  if (markAllRead) {
    state.notifications.forEach(item => { item.unread = false; });
    renderNotificationPopover();
    updateNotificationUI();
    showToast('Inbox cleared. Happy reading.');
    return;
  }
  const notification = target.closest('[data-notification]');
  if (notification) {
    openNotification(notification.dataset.notification);
    return;
  }
  const profileTrigger = target.closest('[data-profile-trigger]');
  if (profileTrigger) {
    toggleProfile(profileTrigger);
    return;
  }
  const profileRoute = target.closest('[data-profile-route]');
  if (profileRoute) {
    closeProfilePopover();
    navigate(profileRoute.dataset.profileRoute);
    return;
  }
  if (target.closest('[data-profile-notifications]')) {
    closeProfilePopover();
    renderNotificationPopover();
    const popover = document.getElementById('notification-popover');
    if (popover) popover.hidden = false;
    return;
  }
  if (target.closest('[data-theme-toggle]')) {
    updateThemeMenu();
    return;
  }
  const demoAction = target.closest('[data-demo-action]');
  if (demoAction) {
    closeProfilePopover();
    if (demoAction.dataset.demoAction === 'settings') showToast('Account settings are mocked in this prototype.');
    if (demoAction.dataset.demoAction === 'signout') showToast('No account to sign out of — this reading room is yours.', 'accent');
    return;
  }

  const routeLink = target.closest('[data-route]');
  if (routeLink) {
    closePopovers();
    // Anchor navigation is handled by hashchange.
    return;
  }

  // Clicking the improvement-free background just dismisses menus.
  if (!target.closest('.popover') && !target.closest('[data-profile-trigger]')) closePopovers();
}

/* ---------- Inputs / selects ---------- */
function handleInput(event) {
  const target = event.target;
  if (target.id === 'search-input') {
    state.searchHighlight = 0;
    renderSearchResults(target.value);
    return;
  }
  if (target.id === 'progress-range') {
    updateProgressEditor(target.value);
    return;
  }
  if (target.id === 'progress-page') {
    updateProgressEditor(target.value);
  }
}
function handleChange(event) {
  const target = event.target;
  if (target.matches('[data-library-sort]')) {
    state.myBooks.sort = target.value;
    renderRoute();
  } else if (target.matches('[data-browse-sort]')) {
    state.browse.sort = target.value;
    renderRoute();
  }
}

/* ---------- Outside clicks ---------- */
function handleOutsideClick(event) {
  const path = event.composedPath ? event.composedPath() : [];
  const insidePopover = path.some(node => node instanceof Element && (node.matches('.popover') || node.matches('[data-profile-trigger]') || node.matches('[data-notifications]')));
  if (insidePopover) return;
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;
  if (target.closest('.popover') || target.closest('[data-profile-trigger]') || target.closest('[data-notifications]')) return;
  closePopovers();
}

function handleResize() {
  if (!document.getElementById('profile-popover')?.hidden || !document.getElementById('notification-popover')?.hidden) closePopovers();
}

/* ---------- Boot ---------- */
function init() {
  initTheme();
  renderRoute();
  updateChrome();

  document.addEventListener('click', handleClick);
  document.addEventListener('click', handleOutsideClick);
  document.addEventListener('submit', handleSubmit);
  document.addEventListener('input', handleInput);
  document.addEventListener('change', handleChange);
  document.addEventListener('keydown', handleKeydown);
  window.addEventListener('resize', handleResize);

  const searchInput = document.getElementById('search-input');
  searchInput?.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (searchResultsCache[state.searchHighlight]) openSearchBook(searchResultsCache[state.searchHighlight].id);
    }
  });
}

init();

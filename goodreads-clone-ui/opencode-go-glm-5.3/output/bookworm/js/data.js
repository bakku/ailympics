const USER = {
  name: 'Avery Cole',
  handle: 'avery',
  initials: 'AC',
  goal: 24,
  year: 2026,
};

const BOOKS = [
  { id: 1, title: 'A Field Guide to Vanishing Things', author: 'Ines Moreau', pages: 312, avgRating: 4.1, ratingsCount: 12480, genre: 'Fiction', year: 2019, description: 'A meditation on loss disguised as a naturalist\u2019s handbook, cataloguing everything from extinct birds to fading memories.' },
  { id: 2, title: 'The Ledger of Small Debts', author: 'H. T. Whitmore', pages: 288, avgRating: 3.9, ratingsCount: 4102, genre: 'Fiction', year: 2017, description: 'In a coastal town where everyone owes someone something, a young clerk discovers how love is repaid.' },
  { id: 3, title: 'Ordinary Beasts', author: 'Dorothea Finch', pages: 344, avgRating: 3.7, ratingsCount: 2285, genre: 'Fiction', year: 2020, description: 'Twelve linked stories about the quiet animals we become when no one is watching.' },
  { id: 4, title: 'The Long Way Through Winter', author: 'Mikko Aalto', pages: 376, avgRating: 4.3, ratingsCount: 9350, genre: 'Fiction', year: 2022, description: 'Two estranged siblings walk the length of a frozen river and settle forty years of silence.' },
  { id: 5, title: 'The Cartographer\u2019s Daughter', author: 'Elif Tanyeli', pages: 512, avgRating: 4.4, ratingsCount: 21730, genre: 'Fantasy', year: 2021, description: 'When her father\u2019s final map leads somewhere that cannot exist, Mirren follows it anyway.' },
  { id: 6, title: 'Nine Gates of Amber', author: 'R. J. Halloway', pages: 624, avgRating: 4.2, ratingsCount: 15406, genre: 'Fantasy', year: 2018, description: 'The empire\u2019s nine gates are failing one by one, and only a disgraced gatekeeper knows why.' },
  { id: 7, title: 'The Lantern Bearer', author: 'Saoirse Quinn', pages: 448, avgRating: 4.0, ratingsCount: 6890, genre: 'Fantasy', year: 2016, description: 'A lighthouse keeper\u2019s apprentice learns that the light keeps out more than the sea.' },
  { id: 8, title: 'A Crown of Quiet Hours', author: 'Nadia Serrano', pages: 508, avgRating: 4.1, ratingsCount: 5312, genre: 'Fantasy', year: 2023, description: 'The heir to a tired dynasty decides that the most radical act is rest.' },
  { id: 9, title: 'The Quiet Tenant', author: 'Vera Calloway', pages: 368, avgRating: 4.5, ratingsCount: 28940, genre: 'Mystery', year: 2024, description: 'The flat above the bakery has been empty for years. So who is leaving bread at the door?' },
  { id: 10, title: 'Ash Wednesday', author: 'Frank Moreno', pages: 336, avgRating: 3.8, ratingsCount: 3170, genre: 'Mystery', year: 2022, description: 'A detective returns to the church of her childhood to investigate a fire the records say never happened.' },
  { id: 11, title: 'Salt and Storm', author: 'Amara Osei', pages: 402, avgRating: 4.2, ratingsCount: 11864, genre: 'Sci-Fi', year: 2023, description: 'On a flooded future coast, a salvager finds a machine that remembers the drowned city.' },
  { id: 12, title: 'The Glass Observatory', author: 'Jonas Reyes', pages: 448, avgRating: 4.0, ratingsCount: 7645, genre: 'Sci-Fi', year: 2021, description: 'An observatory sealed for a century reopens with one instruction: do not look up.' },
  { id: 13, title: 'Signal to Noise', author: 'Yuki Tanabe', pages: 320, avgRating: 3.9, ratingsCount: 4890, genre: 'Sci-Fi', year: 2019, description: 'A radio astronomer spends her career listening to silence \u2014 until it answers.' },
  { id: 14, title: 'How to Read a River', author: 'Peter Lindqvist', pages: 264, avgRating: 4.6, ratingsCount: 8204, genre: 'Non-fiction', year: 2020, description: 'A paddler\u2019s memoir of currents, locks, and the slow education of moving water.' },
  { id: 15, title: 'The Hidden Life of Cities', author: 'Marta Kova\u010d', pages: 368, avgRating: 4.3, ratingsCount: 10250, genre: 'Non-fiction', year: 2022, description: 'An urbanist traces the invisible systems \u2014 steam, mail, rumor \u2014 that quietly keep a city alive.' },
  { id: 16, title: 'Notes on a Slow Year', author: 'Clara Bianchi', pages: 208, avgRating: 3.8, ratingsCount: 1640, genre: 'Non-fiction', year: 2018, description: 'A diary of one writer\u2019s attempt to do almost nothing, beautifully.' },
  { id: 17, title: 'Empire of Paper', author: 'Edmund Hartley', pages: 496, avgRating: 4.4, ratingsCount: 6320, genre: 'History', year: 2015, description: 'How a small stationery company quietly governed half the world\u2019s correspondence.' },
  { id: 18, title: 'The Spice Roads', author: 'Leila Farouk', pages: 432, avgRating: 4.2, ratingsCount: 7418, genre: 'History', year: 2016, description: 'A journey along the old caravan routes, told through the goods that traveled them.' },
  { id: 19, title: 'Second Summer', author: 'Georgia Wren', pages: 292, avgRating: 3.6, ratingsCount: 9120, genre: 'Romance', year: 2021, description: 'Ten years after the one that mattered, they get another chance at the lake.' },
  { id: 20, title: 'Letters to the Lighthouse', author: 'Isla Murray', pages: 276, avgRating: 4.5, ratingsCount: 13580, genre: 'Romance', year: 2024, description: 'A bereaved woman begins writing letters to a decommissioned lighthouse \u2014 and someone answers.' },
  { id: 21, title: 'Wolves of the Northern Line', author: 'Catriona Bell', pages: 288, avgRating: 4.0, ratingsCount: 5526, genre: 'Horror', year: 2023, description: 'Night shift on the last sleeper train, and something boards at a station that isn\u2019t on the map.' },
  { id: 22, title: 'The Hollow Choir', author: 'Ambrose Crane', pages: 312, avgRating: 3.9, ratingsCount: 4370, genre: 'Horror', year: 2020, description: 'A choir rehearses in an abandoned cathedral for a congregation that never arrives.' },
  { id: 23, title: 'The Midnight Library Murders', author: 'Vera Calloway', pages: 384, avgRating: 4.3, ratingsCount: 24610, genre: 'Mystery', year: 2020, description: 'After closing time, the city\u2019s grand library keeps exactly one impossible patron.' },
  { id: 24, title: 'Small Hours', author: 'Priya Nair', pages: 264, avgRating: 4.0, ratingsCount: 2015, genre: 'Fiction', year: 2017, description: 'A night-shift novel that takes place entirely between two and four in the morning.' },
];

const GENRES = [...new Set(BOOKS.map(b => b.genre))].sort();

const library = {
  5: { shelf: 'reading', progress: 217, addedAt: '2026-08-30' },
  15: { shelf: 'reading', progress: 90, addedAt: '2026-09-10' },
  1: { shelf: 'want', addedAt: '2026-08-20' },
  6: { shelf: 'want', addedAt: '2026-07-14' },
  10: { shelf: 'want', addedAt: '2026-06-02' },
  13: { shelf: 'want', addedAt: '2026-05-28' },
  17: { shelf: 'want', addedAt: '2026-04-19' },
  21: { shelf: 'want', addedAt: '2026-03-08' },
  2: { shelf: 'read', rating: 4, finishedAt: '2026-01-12', addedAt: '2025-12-30' },
  3: { shelf: 'read', rating: 3, finishedAt: '2026-02-03', addedAt: '2026-01-20' },
  9: { shelf: 'read', rating: 5, finishedAt: '2026-02-28', addedAt: '2026-02-01' },
  11: { shelf: 'read', rating: 4, finishedAt: '2026-03-15', addedAt: '2026-02-27' },
  19: { shelf: 'read', rating: 3, finishedAt: '2026-05-02', addedAt: '2026-04-24' },
  14: { shelf: 'read', rating: 5, finishedAt: '2026-06-11', addedAt: '2026-05-30' },
  22: { shelf: 'read', rating: 4, finishedAt: '2026-07-19', addedAt: '2026-07-01' },
  4: { shelf: 'read', rating: 4, finishedAt: '2026-08-24', addedAt: '2026-08-02' },
  20: { shelf: 'read', rating: 5, finishedAt: '2026-09-05', addedAt: '2026-08-21' },
};

const ACTIVITY = [
  { text: 'Started reading The Hidden Life of Cities', time: '2 weeks ago' },
  { text: 'Finished Letters to the Lighthouse and rated it 5 stars', time: '3 weeks ago' },
  { text: 'Added Wolves of the Northern Line to Want to Read', time: 'Last month' },
  { text: 'Finished The Hollow Choir and rated it 4 stars', time: '2 months ago' },
  { text: 'Set the 2026 reading goal to 24 books', time: 'In January' },
];

const SHELVES = { reading: 'Currently Reading', want: 'Want to Read', read: 'Read' };

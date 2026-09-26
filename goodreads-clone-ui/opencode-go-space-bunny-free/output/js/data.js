/* ==========================================================================
   Shelfie — mock data + data access helpers
   Everything here is fabricated. Replace `DB` with real API calls later.
   ========================================================================== */
(function (global) {
  'use strict';

  const NOW = Date.now();
  const hoursAgo = (h) => new Date(NOW - h * 3600e3).toISOString();
  const daysAgo = (d) => hoursAgo(d * 24);

  /* ---------------------------------------------------------------- shelves */
  const SHELVES = [
    { id: 'want',   name: 'Want to Read',     color: '#3f9a70', icon: 'bookmark' },
    { id: 'reading',name: 'Currently Reading', color: '#c8763c', icon: 'book-open' },
    { id: 'read',   name: 'Read',             color: '#4a7fd4', icon: 'check' },
    { id: 'owned',  name: 'Owned',            color: '#8a6bd4', icon: 'box' },
    { id: 'tobuy',  name: 'To Buy',           color: '#d4a12a', icon: 'cart' }
  ];

  const GENRES = [
    'Literary Fiction', 'Science Fiction', 'Fantasy', 'Memoir', 'Mystery',
    'Historical Fiction', 'Non-fiction', 'Horror', 'Romance', 'Poetry', 'Essays'
  ];

  /* ------------------------------------------------------------------ users */
  const USERS = [
    {
      id: 'u-me', name: 'Wren Alvarez', handle: 'wrenreads', hue: 152,
      location: 'Lisbon, Portugal', joined: '2019-04-11',
      bio: 'Reading my way through the shelf one slow afternoon at a time. Mostly speculative fiction, mostly at night.',
      website: 'wren.example.com'
    },
    {
      id: 'u1', name: 'Priya Raman', handle: 'priyareads', hue: 330,
      location: 'Bengaluru, India', joined: '2017-08-02',
      bio: 'Translator. Will read anything with a good first sentence.', website: ''
    },
    {
      id: 'u2', name: 'Tomás Ferreira', handle: 'tomasf', hue: 24,
      location: 'Porto, Portugal', joined: '2020-01-23',
      bio: 'Ceramics, coastal walks, and 700-page doorstoppers.', website: ''
    },
    {
      id: 'u3', name: 'Ada Lindqvist', handle: 'ada_l', hue: 268,
      location: 'Gothenburg, Sweden', joined: '2016-11-19',
      bio: 'Sci-fi devotee. Currently in a very long series arc.', website: 'ada.example.org'
    },
    {
      id: 'u4', name: 'Marcus Bell', handle: 'mbell', hue: 205,
      location: 'Chicago, USA', joined: '2018-06-30',
      bio: 'History grad, amateur gardener, footnote enthusiast.', website: ''
    },
    {
      id: 'u5', name: 'Yuki Tanaka', handle: 'yukit', hue: 48,
      location: 'Kyoto, Japan', joined: '2021-03-14',
      bio: 'Manga in the morning, novels at night.', website: ''
    },
    {
      id: 'u6', name: 'Noor Haddad', handle: 'noorh', hue: 96,
      location: 'Amman, Jordan', joined: '2019-12-05',
      bio: 'Poetry, essays, and books about cities.', website: ''
    },
    {
      id: 'u7', name: 'Ethan Ruiz', handle: 'erbooks', hue: 12,
      location: 'Austin, USA', joined: '2022-02-08',
      bio: 'Debut-novelist in progress. Query letters: always open.', website: 'ethan.example.net'
    }
  ];

  const ME = 'u-me';

  /* ------------------------------------------------------------------ books */
  const BOOKS = [
    {
      id: 'b1', title: 'Piranesi', author: 'Susanna Clarke', year: 2020, pages: 272,
      hue: 205, style: 'type', rating: 4.28, ratings: 214_883, language: 'English',
      publisher: 'Bloomsbury', isbn: '978-1-6326-6038-1', genres: ['Fantasy', 'Literary Fiction'],
      blurb: 'A man lives alone in a house of endless halls, keeping careful notes on the tides. Then someone new arrives, and the whole architecture of his world has to be re-read.',
      quote: 'The Beauty of the House is immeasurable; its Kindness infinite.'
    },
    {
      id: 'b2', title: 'The Overstory', author: 'Richard Powers', year: 2018, pages: 502,
      hue: 128, style: 'band', rating: 4.24, ratings: 318_442, language: 'English',
      publisher: 'W. W. Norton', isbn: '978-0-393-35097-0', genres: ['Literary Fiction', 'Non-fiction'],
      blurb: 'Nine strangers are summoned by trees, in a novel that argues with itself about attention and quietly changes what you notice on your next walk.'
    },
    {
      id: 'b3', title: 'Klara and the Sun', author: 'Kazuo Ishiguro', year: 2021, pages: 303,
      hue: 28, style: 'circle', rating: 3.79, ratings: 189_310, language: 'English',
      publisher: 'Faber & Faber', isbn: '978-0-571-34458-6', genres: ['Literary Fiction', 'Science Fiction'],
      blurb: 'An artificial friend watches the street from a shop window, and draws her own conclusions about what the sun is for.'
    },
    {
      id: 'b4', title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', year: 1969, pages: 304,
      hue: 262, style: 'split', rating: 4.21, ratings: 121_775, language: 'English',
      publisher: 'Ace Books', isbn: '978-0-441-47812-5', genres: ['Science Fiction', 'Fantasy'],
      blurb: 'A lone envoy arrives on a world whose inhabitants have no fixed sex, and finds that the hardest thing to learn is not their culture but his own assumptions.'
    },
    {
      id: 'b5', title: 'Educated', author: 'Tara Westover', year: 2018, pages: 334,
      hue: 12, style: 'rule', rating: 4.45, ratings: 402_118, language: 'English',
      publisher: 'Random House', isbn: '978-0-399-59050-4', genres: ['Memoir', 'Non-fiction'],
      blurb: 'Raised by survivalists who kept her out of school, a young woman teaches herself enough to walk into a lecture hall — and finds the family that follows is harder to leave.'
    },
    {
      id: 'b6', title: 'Project Hail Mary', author: 'Andy Weir', year: 2021, pages: 496,
      hue: 190, style: 'plain', rating: 4.51, ratings: 522_640, language: 'English',
      publisher: 'Ballantine Books', isbn: '978-0-593-13520-9', genres: ['Science Fiction'],
      blurb: 'A man wakes up alone on a spacecraft with amnesia and two dead crewmates, and must work out what the universe would like from him before it runs out of energy.'
    },
    {
      id: 'b7', title: 'Pachinko', author: 'Min Jin Lee', year: 2017, pages: 496,
      hue: 340, style: 'band', rating: 4.41, ratings: 287_902, language: 'English',
      publisher: 'Grand Central', isbn: '978-1-4516-6792-4', genres: ['Historical Fiction', 'Literary Fiction'],
      blurb: 'Four generations of a Korean family in Japan, told across a century, about the price of belonging to a place that was never quite yours.'
    },
    {
      id: 'b8', title: 'The Name of the Wind', author: 'Patrick Rothfuss', year: 2007, pages: 662,
      hue: 218, style: 'type', rating: 4.38, ratings: 391_556, language: 'English',
      publisher: 'DAW Books', isbn: '978-0-75-1548-08-4', genres: ['Fantasy'],
      blurb: 'A legendary magician hides as a country innkeeper and tells his own story backwards, out of fear, for as long as it takes.'
    },
    {
      id: 'b9', title: 'Circe', author: 'Madeline Miller', year: 2018, pages: 393,
      hue: 45, style: 'circle', rating: 4.31, ratings: 441_209, language: 'English',
      publisher: 'Little, Brown', isbn: '978-0-316-55525-5', genres: ['Fantasy', 'Historical Fiction'],
      blurb: 'The witch of Aiaia gets her own chapter: exile, immortality, and the slow work of learning that being turned into a monster is not the same as being one.'
    },
    {
      id: 'b10', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', year: 2011, pages: 499,
      hue: 250, style: 'plain', rating: 4.13, ratings: 178_430, language: 'English',
      publisher: 'Farrar, Straus and Giroux', isbn: '978-0-374-53355-7', genres: ['Non-fiction', 'Essays'],
      blurb: 'Two systems for thinking, and a lifetime of experiments showing how reliably the fast one wins.'
    },
    {
      id: 'b11', title: 'The Secret History', author: 'Donna Tartt', year: 1992, pages: 559,
      hue: 300, style: 'dots', rating: 4.17, ratings: 356_774, language: 'English',
      publisher: 'Alfred A. Knopf', isbn: '978-0-394-53522-2', genres: ['Mystery', 'Literary Fiction'],
      blurb: 'A close-knit classics seminar at a Vermont college, and a narrator who confesses everything slightly too late.'
    },
    {
      id: 'b12', title: 'A Gentleman in Moscow', author: 'Amor Towles', year: 2016, pages: 462,
      hue: 8, style: 'band', rating: 4.33, ratings: 271_845, language: 'English',
      publisher: 'Viking', isbn: '978-0-670-02619-8', genres: ['Historical Fiction'],
      blurb: 'Sentenced to house arrest in a grand hotel across from the Kremlin, a count spends thirty years discovering how large a life can be made from a single building.'
    },
    {
      id: 'b13', title: 'Never Let Me Go', author: 'Kazuo Ishiguro', year: 2005, pages: 288,
      hue: 160, style: 'rule', rating: 4.11, ratings: 233_960, language: 'English',
      publisher: 'Faber & Faber', isbn: '978-0-571-21327-5', genres: ['Literary Fiction', 'Science Fiction'],
      blurb: 'Three friends look back on an English boarding school, gently declining to name the thing that is slowly being done to them.'
    },
    {
      id: 'b14', title: 'The Song of Achilles', author: 'Madeline Miller', year: 2011, pages: 378,
      hue: 20, style: 'plain', rating: 4.26, ratings: 398_120, language: 'English',
      publisher: 'Bloomsbury', isbn: '978-1-4088-1134-3', genres: ['Fantasy', 'Historical Fiction'],
      blurb: 'Patroclus narrates the Iliad from the other end of the spear, where the only thing at stake is how one person is remembered.'
    },
    {
      id: 'b15', title: 'Braiding Sweetgrass', author: 'Robin Wall Kimmerer', year: 2013, pages: 408,
      hue: 100, style: 'circle', rating: 4.49, ratings: 265_338, language: 'English',
      publisher: 'Milkweed Editions', isbn: '978-1-619-140-07-6', genres: ['Non-fiction', 'Essays'],
      blurb: 'A botanist braids Indigenous knowledge, plant science and the idea of a gift, in essays that make you want to give something back.'
    },
    {
      id: 'b16', title: 'Station Eleven', author: 'Emily St. John Mandel', year: 2014, pages: 333,
      hue: 178, style: 'split', rating: 4.16, ratings: 219_004, language: 'English',
      publisher: 'Knopf', isbn: '978-0-399-55211-0', genres: ['Science Fiction', 'Literary Fiction'],
      blurb: 'A travelling symphony crosses a collapsed continent, because twenty people decided that art was the point of surviving.'
    },
    {
      id: 'b17', title: 'The House in the Cerulean Sea', author: 'TJ Klune', year: 2020, pages: 394,
      hue: 200, style: 'dots', rating: 4.44, ratings: 187_553, language: 'English',
      publisher: 'Tor Books', isbn: '978-1-25-031-316-0', genres: ['Fantasy'],
      blurb: 'A caseworker inspects the most magical orphanage in the world and starts quietly rearranging his own life around it.'
    },
    {
      id: 'b18', title: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin', year: 2022, pages: 416,
      hue: 320, style: 'type', rating: 4.14, ratings: 296_778, language: 'English',
      publisher: 'Knopf', isbn: '978-0-593-321-88-3', genres: ['Literary Fiction'],
      blurb: 'Thirty years of friendship, video games, and a collaboration that outlasts every attempt the two of them make to be adults about it.'
    },
    {
      id: 'b19', title: 'Atomic Habits', author: 'James Clear', year: 2018, pages: 320,
      hue: 30, style: 'rule', rating: 4.19, ratings: 501_226, language: 'English',
      publisher: 'Avery', isbn: '978-0-7352-1129-2', genres: ['Non-fiction'],
      blurb: 'A case for building systems instead of chasing goals, and for shrinking a habit until it is embarrassingly easy.'
    },
    {
      id: 'b20', title: 'The Design of Everyday Things', author: 'Don Norman', year: 1988, pages: 368,
      hue: 355, style: 'plain', rating: 4.06, ratings: 143_902, language: 'English',
      publisher: 'Basic Books', isbn: '978-0-465-06765-9', genres: ['Non-fiction'],
      blurb: 'Why doors fight you, affordances are everywhere, and good design starts with a person in a hurry.'
    },
    {
      id: 'b21', title: 'Sapiens', author: 'Yuval Noah Harari', year: 2011, pages: 443,
      hue: 48, style: 'band', rating: 4.32, ratings: 611_450, language: 'English',
      publisher: 'Harper', isbn: '978-0-06-231-609-7', genres: ['Non-fiction', 'History'],
      blurb: 'A sweeping history of our species that argues the most important invention was the ability to believe in things that do not exist.'
    },
    {
      id: 'b22', title: 'Dune', author: 'Frank Herbert', year: 1965, pages: 688,
      hue: 32, style: 'split', rating: 4.29, ratings: 723_118, language: 'English',
      publisher: 'Chilton Books', isbn: '978-0-441-01359-3', genres: ['Science Fiction'],
      blurb: 'A noble family is handed the most dangerous planet in the empire, and the planet starts making decisions of its own.'
    },
    {
      id: 'b23', title: 'The Hobbit', author: 'J.R.R. Tolkien', year: 1937, pages: 304,
      hue: 105, style: 'dots', rating: 4.34, ratings: 842_006, language: 'English',
      publisher: 'Allen & Unwin', isbn: '978-0-26-110-221-7', genres: ['Fantasy'],
      blurb: 'A comfortable hobbit is recruited for a long walk, and the walking turns out to be the least of it.'
    },
    {
      id: 'b24', title: 'The Fifth Season', author: 'N.K. Jemisin', year: 2015, pages: 468,
      hue: 285, style: 'circle', rating: 4.36, ratings: 198_740, language: 'English',
      publisher: 'Orbit', isbn: '978-0-316-31019-0', genres: ['Science Fiction', 'Fantasy'],
      blurb: 'On a continent that tears itself apart on schedule, three women of very different power try to hold things together anyway.'
    },
    {
      id: 'b25', title: 'Beloved', author: 'Toni Morrison', year: 1987, pages: 324,
      hue: 350, style: 'plain', rating: 4.43, ratings: 174_320, language: 'English',
      publisher: 'Alfred A. Knopf', isbn: '978-1-4000-0341-6', genres: ['Historical Fiction', 'Literary Fiction'],
      blurb: 'A house haunted by the past and a woman haunted by what she did to escape it; told in sentences that refuse to be comfortable.'
    },
    {
      id: 'b26', title: 'A Psalm for the Wild-Built', author: 'Becky Chambers', year: 2021, pages: 160,
      hue: 150, style: 'rule', rating: 4.28, ratings: 132_566, language: 'English',
      publisher: 'Tordotcom Publishing', isbn: '978-1-250-87572-4', genres: ['Science Fiction'],
      blurb: 'A tea monk and a robot with a very new purpose go on a gentle walk through the wilderness and ask what people are for.'
    },
    {
      id: 'b27', title: 'The Bear and the Nightingale', author: 'Katherine Arden', year: 2017, pages: 336,
      hue: 55, style: 'dots', rating: 4.09, ratings: 156_214, language: 'English',
      publisher: 'Del Rey', isbn: '978-1-101-97456-4', genres: ['Fantasy', 'Historical Fiction'],
      blurb: 'A girl in a village on the edge of the forest negotiates with the old powers that live there, while the north wind gathers.'
    },
    {
      id: 'b28', title: 'Exhalation', author: 'Ted Chiang', year: 2019, pages: 350,
      hue: 210, style: 'type', rating: 4.37, ratings: 98_455, language: 'English',
      publisher: 'Knopf', isbn: '978-1-524-759-70-9', genres: ['Science Fiction', 'Essays'],
      blurb: 'Nine perfect short stories, including the one about the digger turtles, that quietly dismantle what you assume about consciousness.'
    }
  ];

  /* ---------------------------------------------------------------- reviews */
  const REVIEWS = [
    {
      id: 'r1', bookId: 'b1', userId: 'u3', rating: 5, date: hoursAgo(5), likes: 214,
      quote: 'The Beauty of the House is immeasurable; its Kindness infinite.',
      text: 'I finished this at 2am and then sat in the dark for twenty minutes doing nothing. The trick is that the narrator is describing his world as if it were normal, and you only realise halfway through that it absolutely is not — and that he has already worked out what you, the reader, will do with the information.\n\nA small book that trusts you completely. Rare.',
      comments: [
        { userId: 'u-me', text: 'The "statues" chapter. I had to stop and walk around the room.', date: hoursAgo(4) },
        { userId: 'u1', text: 'Same! Reread it in March and it landed completely differently.', date: hoursAgo(2) }
      ]
    },
    {
      id: 'r2', bookId: 'b4', userId: 'u3', rating: 4.5, date: daysAgo(2), likes: 132,
      text: 'Still the benchmark. The ice crossing is one of the great sequences in the genre, and Genly is such a frustrating narrator you keep wanting to shake.\n\nDocking a point because the middle third wanders once the envoy business is settled. Worth it anyway.'
    },
    {
      id: 'r3', bookId: 'b6', userId: 'u4', rating: 4, date: daysAgo(1), likes: 88,
      text: 'Funnier than it has any right to be. I bought it expecting to take notes and ended up just grinning at the problems he was solving.',
      comments: [{ userId: 'u2', text: 'The "friendship" chapter did not make me laugh, it made me emotional.', date: hoursAgo(20) }]
    },
    {
      id: 'r4', bookId: 'b15', userId: 'u6', rating: 5, date: daysAgo(3), likes: 176,
      quote: 'All flourishing is mutual.',
      text: 'I read one essay a night, out loud, which is a strange way to read a book about reciprocity but it seemed appropriate. Kimmerer is very good at making you notice that you already knew the answer.'
    },
    {
      id: 'r5', bookId: 'b7', userId: 'u1', rating: 4.5, date: daysAgo(4), likes: 143,
      text: 'A novel with the patience of a dynasty. Sunja’s chapters in particular — she keeps accepting the smallest available kindness and it is unbearable and heroic at once.'
    },
    {
      id: 'r6', bookId: 'b12', userId: 'u2', rating: 4.5, date: daysAgo(1), likes: 61,
      text: 'Bought this for the hotel setting, stayed for the beekeeper. A novel about confinement that never once feels like it is straining to make a point.'
    },
    {
      id: 'r7', bookId: 'b24', userId: 'u4', rating: 4, date: daysAgo(5), likes: 97,
      text: 'The second-person POV is a gimmick that should not work and does. Structurally the most ambitious thing in fantasy right now.',
      spoiler: 'The ending reframes the whole first book and I am not exaggerating.'
    },
    {
      id: 'r8', bookId: 'b26', userId: 'u5', rating: 5, date: daysAgo(6), likes: 205,
      text: 'A palate cleanser. Exactly the right length for a Sunday afternoon, and much kinder than it has any right to be about the future.'
    },
    {
      id: 'r9', bookId: 'b18', userId: 'u7', rating: 4, date: daysAgo(3), likes: 118,
      text: 'Yes it is a book about video games. No it is not really. Sam and Sadie are two of the most believable people in contemporary fiction and the last act is brutal.'
    },
    {
      id: 'r10', bookId: 'b2', userId: 'u3', rating: 4.5, date: daysAgo(8), likes: 156,
      text: 'The first 150 pages are a very slow nine-strand introduction and then the book does something irreversible. Hoover and Patricia are worth the patience.',
      comments: [{ userId: 'u-me', text: 'The chestnut chapter. I think about it weekly.', date: daysAgo(7) }]
    },
    {
      id: 'r11', bookId: 'b25', userId: 'u1', rating: 5, date: daysAgo(11), likes: 203,
      text: 'Every sentence is load-bearing. The grammar of the book changes when the timeline changes and nobody ever mentions it, which is the highest compliment I can pay a structure.'
    },
    {
      id: 'r12', bookId: 'b28', userId: 'u4', rating: 4.5, date: daysAgo(2), likes: 74,
      text: 'Read "Exhalation" first as a palate cleanser and then accidentally reread "Understand" twice. Short stories can do things novels structurally cannot.'
    },
    {
      id: 'r13', bookId: 'b17', userId: 'u5', rating: 4, date: daysAgo(9), likes: 65,
      text: 'Warm without being sugary, which is a narrow line. The casework is the real magic — it reads as though someone had done the reading.',
      comments: [{ userId: 'u6', text: 'Lucy as a character deserves her own book.', date: daysAgo(8) }]
    },
    {
      id: 'r14', bookId: 'b5', userId: 'u6', rating: 4.5, date: daysAgo(13), likes: 92,
      text: 'The education sections are drier than the memoir sections and also the point. This is a book about what it costs to be the person in your family who changed their mind.'
    },
    {
      id: 'r15', bookId: 'b22', userId: 'u4', rating: 4, date: daysAgo(4), likes: 58,
      text: 'Reread for the fourth time. The interiority of the first hundred pages is unmatched; the pacing in the middle is a genuine problem and the last two hundred pages are so good you forgive it.'
    },
    {
      id: 'r16', bookId: 'b9', userId: 'u1', rating: 4, date: daysAgo(7), likes: 71,
      text: 'Beautiful prose, slightly indifferent to everyone but its own protagonist — which, given the subject, is arguably the correct choice.'
    },
    {
      id: 'r17', bookId: 'b19', userId: 'u-me', rating: 4.5, date: daysAgo(3), likes: 12,
      text: 'Read this twice: once for the ideas, once because the second time I could actually find the systems in my own week. The two-minute rule is the only chapter I have handed to a friend.',
      comments: [{ userId: 'u6', text: 'Which chapter converted you? Mine was the one on environment design.', date: daysAgo(2) }]
    },
    {
      id: 'r18', bookId: 'b20', userId: 'u-me', rating: 4, date: daysAgo(9), likes: 7,
      text: 'Older than it looks, and still the book I hand to anyone who complains about a product. The chapter on the kettle was worth the cover price on its own.',
      comments: []
    }
  ];

  /* --------------------------------------------------------------- activity */
  const ACTIVITY = [
    { id: 'a1', userId: 'u3', type: 'review',  bookId: 'b1',  reviewId: 'r1', date: hoursAgo(5) },
    { id: 'a2', userId: 'u4', type: 'review',  bookId: 'b6',  reviewId: 'r3', date: daysAgo(1) },
    { id: 'a3', userId: 'u2', type: 'review',  bookId: 'b12', reviewId: 'r6', date: daysAgo(1) },
    { id: 'a4', userId: 'u6', type: 'review',  bookId: 'b15', reviewId: 'r4', date: daysAgo(3) },
    { id: 'a5', userId: 'u7', type: 'review',  bookId: 'b18', reviewId: 'r9', date: daysAgo(3) },
    { id: 'a6', userId: 'u5', type: 'finish',  bookId: 'b26', date: daysAgo(2) },
    { id: 'a7', userId: 'u1', type: 'review',  bookId: 'b7',  reviewId: 'r5', date: daysAgo(4) },
    { id: 'a8', userId: 'u4', type: 'start',   bookId: 'b22', date: daysAgo(1) },
    { id: 'a9', userId: 'u6', type: 'rate',    bookId: 'b20', rating: 4,   date: hoursAgo(9) },
    { id: 'a10', userId: 'u2', type: 'shelve',  bookId: 'b23', shelf: 'want', date: hoursAgo(20) },
    { id: 'a11', userId: 'u5', type: 'shelve',  bookId: 'b28', shelf: 'want', date: hoursAgo(30) },
    { id: 'a12', userId: 'u3', type: 'finish',  bookId: 'b24', date: daysAgo(2) },
    { id: 'a13', userId: 'u7', type: 'rate',    bookId: 'b18', rating: 4.5, date: daysAgo(2) },
    { id: 'a14', userId: 'u1', type: 'review',  bookId: 'b16', date: daysAgo(5) },
    { id: 'a15', userId: 'u4', type: 'review',  bookId: 'b25', reviewId: 'r11', date: daysAgo(11) },
    { id: 'a16', userId: 'u-me', type: 'review', bookId: 'b19', reviewId: 'r17', date: daysAgo(3) },
    { id: 'a17', userId: 'u-me', type: 'review', bookId: 'b20', reviewId: 'r18', date: daysAgo(9) },
    { id: 'a18', userId: 'u-me', type: 'start',  bookId: 'b28', date: daysAgo(3) }
  ];

  /* ---------------------------------------------------------- notifications */
  const NOTIFICATIONS = [
    { id: 'n1', userId: 'u3', type: 'like',    bookId: 'b1',  date: hoursAgo(3) },
    { id: 'n2', userId: 'u1', type: 'comment', bookId: 'b1',  date: hoursAgo(4) },
    { id: 'n3', userId: 'u2', type: 'follow',  date: daysAgo(1) },
    { id: 'n4', userId: 'u6', type: 'mention', bookId: 'b15', date: daysAgo(2) },
    { id: 'n5', userId: 'u4', type: 'like',    bookId: 'b15', date: daysAgo(3) }
  ];

  /* ------------------------------------------------ seeded personal library */
  // shelf membership for the logged-in user: id -> { shelf, addedAt, progress }
  const SEED_SHELVES = {
    b1:  { shelf: 'read',    addedAt: daysAgo(41) },
    b2:  { shelf: 'read',    addedAt: daysAgo(38) },
    b15: { shelf: 'read',    addedAt: daysAgo(30) },
    b5:  { shelf: 'read',    addedAt: daysAgo(24) },
    b7:  { shelf: 'read',    addedAt: daysAgo(19) },
    b26: { shelf: 'read',    addedAt: daysAgo(12) },
    b24: { shelf: 'read',    addedAt: daysAgo(6) },
    b17: { shelf: 'reading', addedAt: daysAgo(9),  progress: 62 },
    b28: { shelf: 'reading', addedAt: daysAgo(3),  progress: 18 },
    b6:  { shelf: 'reading', addedAt: daysAgo(2),  progress: 34 },
    b22: { shelf: 'want',    addedAt: daysAgo(60) },
    b12: { shelf: 'want',    addedAt: daysAgo(45) },
    b25: { shelf: 'want',    addedAt: daysAgo(33) },
    b10: { shelf: 'want',    addedAt: daysAgo(21) },
    b21: { shelf: 'want',    addedAt: daysAgo(15) },
    b4:  { shelf: 'want',    addedAt: daysAgo(10) },
    b18: { shelf: 'want',    addedAt: daysAgo(8) },
    b9:  { shelf: 'want',    addedAt: daysAgo(5) },
    b19: { shelf: 'want',    addedAt: daysAgo(4) },
    b20: { shelf: 'tobuy',   addedAt: daysAgo(14) },
    b13: { shelf: 'tobuy',   addedAt: daysAgo(7) },
    b23: { shelf: 'owned',   addedAt: daysAgo(90) }
  };

  const SEED_RATINGS = { b1: 4.5, b2: 4, b15: 5, b5: 4.5, b7: 5, b26: 4.5, b24: 4, b28: 4.5, b6: 4, b17: 4, b10: 4.5 };

  /* ============================== helpers / accessors ===================== */

  const byId = (list, id) => list.find((x) => x.id === id) || null;

  const DB = {
    NOW, SHELVES, GENRES, USERS, BOOKS, REVIEWS, ACTIVITY, NOTIFICATIONS, ME,
    seedShelves: SEED_SHELVES,
    seedRatings: SEED_RATINGS,

    book: (id) => byId(BOOKS, id),
    user: (id) => byId(USERS, id),
    shelf: (id) => byId(SHELVES, id),
    review: (id) => byId(REVIEWS, id),

    authors() {
      return [...new Set(BOOKS.map((b) => b.author))].sort();
    },

    booksByShelf(shelfId) {
      return BOOKS.filter((b) => (SEED_SHELVES[b.id] || {}).shelf === shelfId);
    },

    reviewsFor(bookId) {
      return REVIEWS.filter((r) => r.bookId === bookId).sort((a, b) => +new Date(b.date) - +new Date(a.date));
    },

    reviewsByUser(userId) {
      return REVIEWS.filter((r) => r.userId === userId).sort((a, b) => +new Date(b.date) - +new Date(a.date));
    },

    reviewCount(bookId) {
      return REVIEWS.filter((r) => r.bookId === bookId).length;
    },

    likedBy(bookId, userId) {
      return REVIEWS.filter((r) => r.bookId === bookId && r.likes > 0 && r.userId !== userId).length;
    },

    /** Average of the mock 1–5 star distribution, shaped around the stored rating. */
    distribution(bookId) {
      const base = (this.book(bookId) || { rating: 4 }).rating;
      const counts = [0.02, 0.02, 0.07, 0.22, 0.67].map((share, i) => {
        const stars = i + 1;
        const centre = 5 - (base - 1) * 1.15;             // nudge mass toward the average
        const w = Math.exp(-((stars - centre) ** 2) / 3.4) + share * 4;
        return w;
      });
      const total = counts.reduce((a, b) => a + b, 0);
      return counts.map((n) => n / total);
    },

    /** Simple relevance search over title, author, genre, year.
     *  Every whitespace-separated term must match somewhere (AND semantics). */
    search(query) {
      const q = query.trim().toLowerCase();
      if (!q) return [];
      const terms = q.split(/\s+/);
      return BOOKS.map((b) => {
        const title = b.title.toLowerCase();
        const author = b.author.toLowerCase();
        const hay = [title, author, b.genres.join(' ').toLowerCase(), b.publisher.toLowerCase(), b.isbn, String(b.year)].join(' ');
        let score = 0;
        for (const t of terms) {
          let s = 0;
          if (title.startsWith(t)) s = 6;
          else if (title.includes(t)) s = 4;
          else if (author.includes(t)) s = 3;
          else if (hay.includes(t)) s = 1;
          if (s === 0) { score = 0; break; }
          score += s;
        }
        return { book: b, score };
      })
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score || b.book.rating - a.book.rating)
        .map((r) => r.book);
    },

    popular(limit = 12) {
      return [...BOOKS].sort((a, b) => b.ratings - a.ratings).slice(0, limit);
    },

    topRated(limit = 12) {
      return [...BOOKS].sort((a, b) => b.rating - a.rating).slice(0, limit);
    },

    recent(limit = 12) {
      return [...BOOKS].sort((a, b) => b.year - a.year).slice(0, limit);
    },

    friends() {
      return USERS.filter((u) => u.id !== ME);
    },

    activityFor(userId) {
      return ACTIVITY.filter((a) => a.userId === userId).sort((a, b) => +new Date(b.date) - +new Date(a.date));
    },

    bookCountByGenre(genre) {
      return BOOKS.filter((b) => b.genres.includes(genre)).length;
    }
  };

  global.DB = DB;
})(window);

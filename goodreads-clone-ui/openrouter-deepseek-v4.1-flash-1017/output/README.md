# Marginalia

A warm, self-hosted reading room — a Goodreads-style UI built with plain HTML, CSS, and JavaScript. Everything is mocked in the browser: no build step, no dependencies, no backend.

## Run it

Open `index.html` directly, or serve the folder locally:

```bash
python3 -m http.server 4173
```

Then visit <http://localhost:4173>.

## What's inside

- **Home** — a greeting, current reads, a progress updater, a reading goal, friend activity, recommendations, and notes from the reading room.
- **My books** — shelves for *want to read*, *currently reading*, and *read*, with grid/list views, sorting, stats, ratings, and per-book progress.
- **Browse** — a genre-filterable catalogue, sorting, book badges, and a featured reading-circle pick.
- **The reading room** — a social feed with reviews, reading notes, discussions, likes, saves, follows, and a working post composer.
- **Reading stats** — a year-in-review summary with a pages chart, genre breakdown, rating distribution, and favourite reads.
- **Book details** — cover, description, shelf controls, star rating, progress updates, reader reviews, and a working review form.
- **Search** — keyboard-friendly search across every book, plus quick actions.
- **Log a book** — add a new mock title to any shelf; a cover is generated automatically.
- **Light and dark themes** — saved locally in the browser.

## Details

- Responsive from 320px up. Desktop navigation collapses to an icon rail, then becomes a mobile header with a bottom tab bar.
- All covers and page data are invented. Cover art and avatars are local SVG assets.
- Interactions persist in memory only; refreshing the page restores the original mock data. Theme preference is saved to `localStorage`.
- Fonts are self-hosted: [Fraunces](https://github.com/undercasetype/Fraunces) and [DM Sans](https://github.com/googlefonts/dm-fonts), both under the SIL Open Font License. License files are in `assets/fonts/`.
- Avatars generated with [DiceBear](https://www.dicebear.com/) (Lorelei).

## Shortcuts

| Key | Action |
| --- | --- |
| `⌘ K` / `Ctrl K` | Open search |
| `/` | Open search |
| `N` | Log a book |
| `↑` `↓` | Move through search results |
| `Enter` | Open the highlighted book |
| `Esc` | Close the current overlay |
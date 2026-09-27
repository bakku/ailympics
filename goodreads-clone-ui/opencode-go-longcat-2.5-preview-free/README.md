# BookNest — LongCat 2.5 Preview Free

BookNest is a responsive mock book-tracking interface built with HTML, CSS, and JavaScript. The model's delivered files are preserved in [`output/`](output/), with the [prompt used for this result](prompt.md) saved alongside them.

## Run details

| Field | Value |
| --- | --- |
| Model | `opencode-go/longcat-2.5-preview-free` |
| Variant | `high` |
| Harness | T3 Code through OpenCode 1.18.30 |
| Started | 2026-09-27 06:53:51 UTC |
| Finished | 2026-09-27 07:06:18 UTC |
| Elapsed time | 12m 27s |
| Tool calls | 14 |
| Recorded cost | $0.00, as reported by OpenCode |

## Token usage

| Token type | Count |
| --- | ---: |
| Input | 122,959 |
| Output, excluding reasoning | 19,481 |
| Reasoning | 821 |
| Cache reads | 345,472 |
| Cache writes | 0 |

Cache reads count repeated context across model calls; they are not the size of the prompt. The cost is OpenCode's recorded value, not an independent billing estimate.

## View locally

From this directory, run:

```sh
python3 -m http.server 8000 --directory output
```

Then open <http://localhost:8000/>. The app uses mocked data and needs no backend. It loads Google Fonts from the web, so those fonts require an internet connection.

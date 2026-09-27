# Shelfmark — MiMo v2.6 Flash

Shelfmark is a responsive mock reading tracker built with HTML, CSS, and JavaScript. The model's delivered files are preserved in [`output/`](output/), with the [prompt used for this result](prompt.md) saved alongside them.

## Run details

| Field | Value |
| --- | --- |
| Model | `opencode-go/mimo-v2.6-flash` |
| Variant | `xhigh` |
| Harness | T3 Code through OpenCode 1.18.30 |
| Started | 2026-09-27 12:35:45 UTC |
| Finished | 2026-09-27 12:54:38 UTC |
| Elapsed time | 18m 53s |
| Tool calls | 79 |
| Recorded cost | $0.05175, as reported by OpenCode |

## Token usage

| Token type | Count |
| --- | ---: |
| Input | 187,814 |
| Output, excluding reasoning | 35,067 |
| Reasoning | 15,423 |
| Cache reads | 4,040,896 |
| Cache writes | 0 |

Cache reads count repeated context across model calls; they are not the size of the prompt. The cost is OpenCode's recorded value, rounded to five decimal places.

## View locally

From this directory, run:

```sh
python3 -m http.server 8000 --directory output
```

Then open <http://localhost:8000/>. The app uses mocked data and does not need a backend.

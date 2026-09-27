# Bookworm — GLM 5.3

Bookworm is a responsive mock reading tracker built with HTML, CSS, and JavaScript. The model's delivered files are preserved in [`output/bookworm/`](output/bookworm/), with the [original test prompt](prompt.md) saved alongside them.

## Run details

| Field | Value |
| --- | --- |
| Model | `opencode-go/glm-5.3` |
| Variant | `max` |
| Harness | T3 Code through OpenCode 1.18.30 |
| Started | 2026-09-27 10:08:34 UTC |
| Finished | 2026-09-27 10:41:14 UTC |
| Elapsed time | 32m 41s |
| Tool calls | 30 |
| Recorded cost | $1.1062, as reported by OpenCode |

The original prompt was followed by one user message, `Continue`, within the same session. The figures here cover the full session.

## Token usage

| Token type | Count |
| --- | ---: |
| Input | 96,889 |
| Output, excluding reasoning | 26,327 |
| Reasoning | 55,375 |
| Cache reads | 2,350,345 |
| Cache writes | 0 |

Cache reads count repeated context across model calls; they are not the size of the prompt. The cost is OpenCode's recorded value, rounded to four decimal places.

## View locally

From this directory, run:

```sh
python3 -m http.server 8000 --directory output/bookworm
```

Then open <http://localhost:8000/>. The app uses mocked data and does not need a backend.

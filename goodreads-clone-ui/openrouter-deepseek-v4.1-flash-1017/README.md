# Marginalia — DeepSeek V4.1 Flash

Marginalia is a responsive, self-hosted reading room built with plain HTML, CSS, and JavaScript. The model's delivered files are preserved in [`output/`](output/), with the [prompt used for this result](prompt.md) saved alongside them.

## Run details

| Field | Value |
| --- | --- |
| Model | `openrouter/deepseek/deepseek-v4.1-flash-1017` |
| Variant | `max` |
| Harness | T3 Code through OpenCode 2.0.29 |
| Started | 2026-10-18 09:07:12 UTC |
| Finished | 2026-10-18 10:10:21 UTC |
| Elapsed time | 1h 3m 9s |
| Tool calls | 193 |
| Recorded cost | $0.60782, as reported by OpenCode |

## Token usage

| Token type | Count |
| --- | ---: |
| Input | 1,987,156 |
| Output, excluding reasoning | 139,731 |
| Reasoning | 154,635 |
| Cache reads | 44,376,192 |
| Cache writes | 0 |

Cache reads count repeated context across model calls; they are not the size of the prompt. The cost is OpenCode's recorded value, rounded to five decimal places.

## View locally

From this directory, run:

```sh
python3 -m http.server 8000 --directory output
```

Then open <http://localhost:8000/>. The app uses mocked data and does not need a backend. Fonts and book covers are self-hosted, so no internet connection is required.

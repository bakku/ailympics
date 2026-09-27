# Shelfd — GLM 5.3 Flash

Shelfd is a responsive mock reading tracker built with HTML, CSS, and JavaScript. The model's delivered files are preserved in [`output/shelfd/`](output/shelfd/), with the [prompt used for this result](prompt.md) saved alongside them.

## Run details

| Field | Value |
| --- | --- |
| Model | `opencode-go/glm-5.3-flash` |
| Variant | `max` |
| Harness | T3 Code through OpenCode 1.18.30 |
| Started | 2026-09-27 09:57:19 UTC |
| Finished | 2026-09-27 10:04:10 UTC |
| Elapsed time | 6m 51s |
| Tool calls | 30 |
| Recorded cost | $0.04085, as reported by OpenCode |

## Token usage

| Token type | Count |
| --- | ---: |
| Input | 37,058 |
| Output, excluding reasoning | 19,504 |
| Reasoning | 9,186 |
| Cache reads | 698,240 |
| Cache writes | 0 |

Cache reads count repeated context across model calls; they are not the size of the prompt. The cost is OpenCode's recorded value, rounded to five decimal places.

## View locally

From this directory, run:

```sh
python3 -m http.server 8000 --directory output/shelfd
```

Then open <http://localhost:8000/>. The app uses mocked data and needs no backend. It loads Google Fonts from the web, so those fonts require an internet connection.

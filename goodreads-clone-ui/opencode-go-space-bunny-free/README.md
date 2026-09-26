# Shelfie — Space Bunny Free

This result is a responsive, mocked reading tracker built with HTML, CSS, and JavaScript. The delivered app is in [`output/`](output/), and the [prompt used for this run](prompt.md) is saved alongside it.

## Run details

| Field | Value |
| --- | --- |
| Model | `opencode-go/space-bunny-free` |
| Variant | `max` |
| Harness | T3 Code through OpenCode 1.18.30 |
| Started | 2026-09-26 21:12:21 UTC |
| Finished | 2026-09-26 21:41:56 UTC |
| Elapsed time | 29m 34s |
| Recorded cost | $0.00, as reported by OpenCode |

## Usage

| Token type | Count |
| --- | ---: |
| Input | 64,728 |
| Output, excluding reasoning | 93,709 |
| Reasoning | 37,916 |
| Cache reads | 17,225,680 |
| Cache writes | 0 |

OpenCode recorded 139 tool calls. Its summary combines output and reasoning into 131,625 output tokens. Cache reads count repeated context across model calls; they are not the size of the prompt.

## View locally

From this directory, run:

```sh
python3 -m http.server 8000 --directory output
```

Then open <http://localhost:8000/>. The app uses mocked data and does not need a backend.

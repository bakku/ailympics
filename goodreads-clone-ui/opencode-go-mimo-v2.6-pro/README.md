# The Midnight Stacks — MiMo v2.6 Pro

The Midnight Stacks is a responsive mock reading tracker delivered as one HTML file with inline CSS and JavaScript. The model's file is preserved in [`output/`](output/), with the [prompt used for this result](prompt.md) saved alongside it.

## Run details

| Field | Value |
| --- | --- |
| Model | `opencode-go/mimo-v2.6-pro` |
| Variant | `xhigh` |
| Harness | T3 Code through OpenCode 1.18.30 |
| Started | 2026-09-27 10:47:29 UTC |
| Finished | 2026-09-27 11:32:27 UTC |
| Elapsed time | 44m 58s |
| Tool calls | 98 |
| Recorded cost | $0.51505, as reported by OpenCode |

## Token usage

| Token type | Count |
| --- | ---: |
| Input | 921,678 |
| Output, excluding reasoning | 61,396 |
| Reasoning | 40,678 |
| Cache reads | 6,984,064 |
| Cache writes | 0 |

Cache reads count repeated context across model calls; they are not the size of the prompt. The cost is OpenCode's recorded value, rounded to five decimal places.

## View locally

From this directory, run:

```sh
python3 -m http.server 8000 --directory output
```

Then open <http://localhost:8000/>. The app uses mocked data and does not need a backend. Fonts load from Google Fonts and book covers load from Open Library, so those visuals require an internet connection.

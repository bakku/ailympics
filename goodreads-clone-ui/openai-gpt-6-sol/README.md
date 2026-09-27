# Margins — GPT-6 Sol

Margins is a responsive, dependency-free mock reading tracker built with HTML, CSS, and JavaScript. The model's delivered files are preserved in [`output/`](output/), including its own README. The [prompt used for this result](prompt.md) is saved alongside them.

## Run details

| Field | Value |
| --- | --- |
| Model | `gpt-6-sol` |
| Reasoning effort | `max` |
| Harness | Codex 0.155.1 via T3 Code desktop |
| Started | 2026-09-26 22:03:06 UTC |
| Finished | 2026-09-26 22:18:13 UTC |
| Elapsed time | 15m 07s |
| Tool calls | 42 |
| Recorded charge | Not available in the Codex session |
| Estimated API-equivalent cost | $1.12 at standard text-token rates on 2026-09-27 |

## Token usage

| Token type | Count |
| --- | ---: |
| Input, total | 2,304,968 |
| Input, cached | 2,169,984 |
| Input, uncached | 134,984 |
| Output, total | 41,642 |
| Reasoning output | 11,556 |
| Cache writes | 0 |

Cached input is included in total input, and reasoning output is included in total output. The cost estimate applies the published [GPT-6 Sol standard API rates](https://developers.openai.com/api/docs/models/gpt-6-sol) of $2 per million uncached input tokens, $0.20 per million cached input tokens, and $10 per million output tokens. It is an estimate for comparison, not an actual Codex charge.

## View locally

From this directory, run:

```sh
python3 -m http.server 8000 --directory output
```

Then open <http://localhost:8000/>. The app uses mock data and stores a few choices in browser local storage; it does not need a backend.

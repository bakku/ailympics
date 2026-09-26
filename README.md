# Ailympics

Ailympics checks what AI models can do with a set of practical prompts. Each test preserves the work a model produced and the conditions under which it produced it, so results can be explored and compared as the prompts and models change.

## Tests

| Test | Focus |
| --- | --- |
| [Goodreads clone UI](goodreads-clone-ui/) | Responsive, self-hosted book app interface with mocked data and behavior |

## Repository layout

Each top-level directory is one test:

```text
<test-name>/
├── README.md                 # What the test asks and how to assess it
├── prompt.md                 # Current prompt
└── <provider>-<model>/
    ├── README.md             # Model, harness, settings, cost, and notes
    ├── prompt.md             # Exact prompt used for this result
    └── output/               # Anything the model produced
        └── ...               # Code, text, images, or other files
```

The test's `prompt.md` is the current version; Git records its history. Each model directory keeps a copy of the prompt used for that result, so later prompt edits do not change the context of earlier results.

The model's files go in `output/` in their original format and directory structure. Keeping them there also leaves `README.md` and `prompt.md` available for the test record, even when the model produces files with those names.

## Recording a result

Use the model directory's `README.md` to record the exact model and provider, date, harness and its version, relevant settings, token usage, cost, and any observations about the result. The test-level `README.md` should explain the task and what a good result would demonstrate.

For now, each model directory holds one result. If a test needs repeated runs of the same model, the layout can grow to accommodate them.

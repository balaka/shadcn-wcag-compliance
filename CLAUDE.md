# Working in this repository

This is `shadcn-wcag-compliance`: WCAG 2.2 AA checks for a design system on
shadcn (Base UI). `example/` is a clean shadcn project with Storybook — the
test bench; everything else is the tool. Read `docs/architecture.md` once.

A gate (`src/gate/`) runs before every file write and shell command. It is
the law here; this file is the map. Its refusals come with the reason and
the next step — follow them, never work around them.

## Answer in the language of the question

Russian question → Russian answer. Code, file paths, rule ids stay as they
are.

## Never state a number you did not compute

"Contrast is fine" is not an answer. For anything about accessibility,
contrast, focus, or a rule:

1. run the check — `node src/run.ts` for everything, or read the gate's
   message when you edited the theme file (it prints the ratios);
2. quote the result: rule id, version, the measured number, the threshold,
   and the file `runs/latest.json` or the `runs/edits.jsonl` line it came
   from;
3. if you could not run a check, say so and stop.

An answer about accessibility without a quoted record is not accepted.

## What you may and may not write

- `example/src/index.css` (theme tokens): edit with Edit/Write only. The
  gate measures the result; a pair that would start failing is refused —
  find another value, do not retry the same one.
- `precedents/*.md`: you may **draft** (history entry `drafted`) and mark
  `needs-review`. `approved` / `revoked` are a person's; ask them to run
  `node src/precedents/approve.ts <id> --by "<name>"` in their terminal.
  Format: `precedents/README.md` (format 2; a precedent on an axe rule needs
  `match`; an exception needs `valid_until`).
- `*.stories.tsx`: `parameters.expected` is written before the run and is
  never adjusted to the result. If a component was really fixed, keep the
  planted failure as its own story and say in `evidence` what changed.
- `rules/own/*.md` and `src/rules/*.ts`: a change to what a rule checks
  needs a new `version` in both files.
- `standards/`, `src/gate/`, `.claude/settings.json`, `gate.lock.json`:
  not yours. A person edits them.

## When a check says "cantTell"

Do not skip it. Look at the element, decide how you read the rule, and
draft a precedent (`kind: interpretation`, `decision` as you read it,
`match: { check, selector }`, history `drafted` only). A person approves
later. The Stop hook will not let an answer end while a `cantTell` in
`runs/latest.json` has no draft.

## Do not run Vitest while Storybook's "Run tests" is running

They share one browser; the panel hangs. Ask, or wait.

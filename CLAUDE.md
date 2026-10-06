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
- `example/src/components/ui/*.tsx` (components): yours to fix. A fix to
  accessibility goes here or into a token — that is what the design
  system's users get.
- `decisions/*.md`: you may **draft** (history entry `drafted`) and send one
  back with `needs-review`. `approved` / `revoked` are a person's, and only
  a person on the approvers list (`src/decisions/approvers.ts`); ask them
  to run `node src/decisions/approve.ts <id> --by "<name>"` in their
  terminal. What a person approved is frozen: to change it, append
  `needs-review` in the same write. Format: `decisions/README.md` (format
  3; a decision on an axe rule needs `match`; an exception needs
  `valid_until`).
- `*.stories.tsx`: **closed.** A story is what the checks see; changing it
  can hide a finding. The gate refuses every story write unless a person
  opened a stories window (`unlock.ts --scope stories`). Inside the window a
  story still never configures or switches off the check (`a11y:`, `!test`,
  axe calls) — a rule that does not apply is a decision, not a setting.
- Change only what was asked. A fix to a token is a fix to a token; it is
  not a licence to touch rules or anything else the task did not name. Say
  what else would have to change, and leave it.
- Theme tokens keep the notation the file uses (shadcn: `oklch(…)`). Do not
  write a hex or rgb value into an oklch theme.
- `rules/own/*.md` and `src/rules/*.ts`: a change to what a rule checks
  needs a new `version` in both files. The decisions approved for the old
  version then show needs-review; the gate lists them.
- `rules/axe/*.md`: axe's rules under our WCAG numbers (`4.1.2-button-name`
  runs axe's `button-name` checks). axe's own rule names are switched off;
  only numbered rules run. Which checks each runs is
  `rules/axe/wrapped.json`, generated from axe-core and part of the gate —
  not yours. Name rules by their number in answers and decisions.
- `standards/`: add a new verbatim copy with its edition date; never edit
  an existing one.
- `src/gate/`, `src/decisions/`, `src/executors/`, `example/.storybook/`,
  `example/vite.config.ts`, `.github/`, `.claude/settings.json`,
  `gate.lock.json`: not yours. A person edits them, or opens a gate window.

## When a check says "cantTell"

Do not skip it. Look at the element, decide how you read the rule, and
draft a decision (`format: 3`, `kind: interpretation`, `verdict` as you
read it, `match: { check, selector }`, history `drafted` only). A person
approves later. The Stop hook will not let an answer end while a
`cantTell` in `runs/latest.json` has no draft.

## Do not run Vitest while Storybook's "Run tests" is running

They share one browser; the panel hangs. Ask, or wait.

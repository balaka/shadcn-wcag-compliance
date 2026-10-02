# Architecture

Status: first vertical slice built 2026-10-01 around one rule
(`border-contrast`, WCAG 1.4.11). Everything below exists in the repository
for that one rule; the folders are the shape every further rule follows.

## The unit is a rule, not a criterion

A WCAG success criterion is one sentence of requirement. How to test it lives
elsewhere: in W3C's ACT rules (90 of them, each with pass/fail examples) and,
where W3C has none, in rules we write ourselves in the same format. One
criterion can have several rules; a rule passing never proves the criterion
("further testing needed" in ACT's own words), a rule failing does disprove
it. So the registry, the findings, the precedents and the versions all hang
off rules.

Each rule names its **executor** — what is able to run it:

| executor | what it needs | example |
|---|---|---|
| `axe` | a rendered page | `color-contrast`, `button-name`, `label` |
| `code` | a fact from code or CSS: a number, an attribute, a size | `border-contrast` (ours) |
| `judge` | a judgement about meaning | "is this label descriptive?" (not built yet) |

Which executor a rule gets is not a classification of the criterion; it is
read off the rule's `input_aspects`: DOM and CSS → machine; meaning → judge.

## Folders

```
standards/      verbatim copies of what rules rest on — WCAG criterion text,
                ACT rules and their test cases — each with edition + capture date
rules/
  act/          ACT rules we adopt (axe runs them); file = pointer + axe rule id
  own/          our rules where W3C has none; ACT format 1.1 + executor/version/source
  judge/        rules of judgement; examples come from precedents/
precedents/     decisions on cases a rule could not settle; one file per case
src/
  wcag/contrast-ratio.ts   the WCAG contrast formula: two colors in, a ratio out
  theme/read-tokens.ts     service: theme CSS in, tokens per theme out, every
                           var() followed to its end, color + alpha per token
  rules/<criterion>-<name>.ts   the code side of each rule in rules/; same file
                           name as the Markdown rule, same version, same threshold
  executors/               who runs a rule, where:
    storybook-axe.ts         inside Storybook, as an axe custom rule
    edit-hook.ts             before a file write, as a Claude Code PreToolUse hook
  finding.ts               the one finding format (carries `format: 1`)
  run.ts                   gathers findings from all executors → runs/<stamp>.json,
                           prints expected-vs-actual
runs/           one file per run + latest.json; nothing server-side
example/        clean shadcn (Base UI) + Storybook: the test bench
  src/stories/  stories = the state table of each component; every story
                carries `parameters.expected`, written before the first run
```

## Rule file format

W3C ACT Rules Format 1.1, unchanged: YAML front matter (`id`, `name`,
`rule_type`, `accessibility_requirements`, `input_aspects`) and the sections
Applicability · Expectation · Background · Test Cases (Passed / Failed /
Inapplicable, each with markup). We add three front-matter fields:
`executor`, `version`, `source` (path into `standards/`). Our rules therefore
read like W3C's and their examples run through the same bench.

## Finding format

One shape for every executor (`src/finding.ts`): rule + version, criterion,
executor, outcome, subject (component, story, theme, selector or file),
evidence as text, measured values, timestamp. Outcomes are EARL's four:
`passed`, `failed`, `cantTell` (axe's "incomplete" — a person decides),
`inapplicable`. The axe JSON is translated into this shape; nothing
downstream knows axe exists.

## Pipeline

```
standards/ ──► rules/ ──► stories (expected written first) ──► run
                                                                 │
          ┌──────────────────────────────────────────────────────┘
          ▼
   findings (one format) ──► runs/<stamp>.json
          │
          ├─► expected vs actual: does each rule catch what it should?
          ├─► while editing: hook refuses the write, returns the number
          ├─► on a PR: SARIF → line annotations (planned)
          ├─► full sweep: history page from runs/ (planned)
          └─► cantTell / disagreement ──► precedents/ ──► example in a rule
                                                      ──► new rule version
```

The same rule runs through two executors on purpose: `storybook-axe.ts`
shows the finding where people look (Storybook's Accessibility tab) and in
the Vitest report; `edit-hook.ts` answers in milliseconds from the CSS text
alone, which is what a write hook needs. Both call the same rule file, so
they cannot disagree on the number.

Naming: a rule file is `<criterion>-<name>` (`1.4.11-border-contrast`) in
both `rules/` and `src/rules/`. The criterion prefix says where the rule
grows from; the name keeps it apart from the other rules under the same
criterion, each with its own version. Every record format — rule, precedent,
finding, run — carries a `format` number; older formats live in git history.

## Checking the bench itself

ACT publishes its test cases machine-readably
(https://act-rules.github.io/testcases.json — 1,134 cases over 91 rules,
each with `expected`). Running them through the bench and comparing outcomes
measures the bench before it says anything about shadcn. Planned.

## First measurements (2026-10-01, shadcn CLI 4.21, axe-core 4.13)

Three components, 13 stories, every prediction confirmed. Clean shadcn
fails on its own: destructive button text 3.98:1 (axe catches), field
border 1.26:1 light / 1.47:1 dark (axe silent — `border-contrast` catches),
focus ring 1.54:1 (axe silent — next rule). The write hook refuses an edit
that drops `--input` below 3:1 and reports the ratio.

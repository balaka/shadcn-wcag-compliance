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
it. So the registry, the findings, the decisions and the versions all hang
off rules.

Each rule names its **executor** — what is able to run it:

| executor | what it needs | example |
|---|---|---|
| `axe` | a rendered page | `color-contrast`, `button-name`, `label` — only behind our own rule file, after an exam (below) |
| `code` | a fact from code or CSS: a number, an attribute, a size | `border-contrast` (ours) |
| `judge` | a judgement about meaning | "is this label descriptive?" (not built yet) |

Which executor a rule gets is not a classification of the criterion; it is
read off the rule's `input_aspects`: DOM and CSS → machine; meaning → judge.

We answer for every rule in the report, so none of axe's rules reaches the
report on its own (decided 2026-10-06). An axe rule is adopted as our rule
file in `rules/` — ACT format, our version, the criterion it serves, plus
`executor: axe`, the axe rule id and the axe-core version — and only after
axe passes that rule's exam: the W3C ACT test cases for it. A new axe-core
version sits the exam again before it is accepted. axe's rules without such
a file are switched off. Where axe fails the exam or has no rule, we write
the code ourselves, as for the field border.

## Folders

```
standards/      verbatim copies of what rules rest on — WCAG criterion text,
                ACT rules and their test cases — each with edition + capture date
rules/
  act/          axe's rules we adopt: our rule file, executor axe + pinned
                version, exam on the ACT test cases (planned)
  own/          our rules where W3C has none; ACT format 1.1 + executor/version/source
  judge/        rules of judgement; examples come from decisions/
decisions/      a person's decisions on cases a rule could not settle; one
                file per case (format 3, see decisions/README.md)
src/
  wcag/contrast-ratio.ts   the WCAG contrast formula: two colors in, a ratio out
  theme/read-tokens.ts     service: theme CSS in, tokens per theme out, every
                           var() followed to its end, color + alpha per token
  rules/<criterion>-<name>.ts   the code side of each rule in rules/; same file
                           name as the Markdown rule, same version, same threshold
  executors/storybook-axe.ts   runs a rule inside Storybook, as an axe custom rule
  decisions/               the register: parse + match (pure, also used by the
                           Storybook page), load from disk, the approvers list,
                           approve.ts (a person's command)
  gate/                    the Claude Code hooks: launcher (fails closed), runner,
                           one guard per kind of file, shell analysis, integrity
                           lock, Stop hook; people's commands sign/unlock — see
                           src/gate/README.md
  finding.ts               the one finding format (carries `format: 1`)
  run.ts                   gathers findings from all executors → runs/<stamp>.json,
                           prints what each rule found
runs/           one file per run + latest.json; nothing server-side. Run
                format 2: one line per failed or cantTell finding and per
                token measurement; every other "passed" is a count per rule
                (a full run of the design system: 367 KB instead of 12.5 MB)
example/        clean shadcn (Base UI) + Storybook: the test bench
  src/stories/  stories = the design system as its users get it, state by
                state; closed to agents (written in a person's window), and
                a story never switches a check off
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
standards/ ──► rules/ (+ golden set) ──► stories (closed) ──────► run
                                                                 │
          ┌──────────────────────────────────────────────────────┘
          ▼
   findings (one format) ──► runs/<stamp>.json
          │
          ├─► while editing: the gate refuses the write, returns the number;
          │   a person's decision lets an accepted failure through, marked
          ├─► on a PR: SARIF → line annotations (planned)
          ├─► full sweep: history page from runs/ (planned)
          └─► cantTell / disagreement ──► decisions/ ──► example in a rule
                                                      ──► new rule version
```

The same rule runs through two executors on purpose: `storybook-axe.ts`
shows the finding where people look (Storybook's Accessibility tab) and in
the Vitest report; the gate's theme guard answers in milliseconds from the
CSS text alone, which is what a write hook needs. Both call the same rule file, so
they cannot disagree on the number.

Naming: a rule file is `<criterion>-<name>` (`1.4.11-border-contrast`) in
both `rules/` and `src/rules/`. The criterion prefix says where the rule
grows from; the name keeps it apart from the other rules under the same
criterion, each with its own version. Every record format — rule, decision,
finding, run — carries a `format` number; older formats live in git history.

Whether a rule is right is not decided by the stories. It is decided by the
rule's golden set: the Passed / Failed / Inapplicable examples in its file
(and, for an adopted axe rule, the ACT test cases). The stories are where
the rule is applied. Until 2026-10-06 every story carried an answer
written before the run (`parameters.expected`); that was a measurement of
the first rule, not part of the tool, and it is gone.

## Checking the bench itself

ACT publishes its test cases machine-readably
(https://act-rules.github.io/testcases.json — 1,134 cases over 91 rules,
each with `expected`). Running them through the bench and comparing outcomes
measures the bench before it says anything about shadcn. Planned: this is
the exam an axe rule sits before we adopt it.

## First measurements (2026-10-01, shadcn CLI 4.21, axe-core 4.13)

Three components, 13 stories with answers written before the run (removed
2026-10-06, together with the planted failures), every prediction confirmed. Clean shadcn
fails on its own: destructive button text 3.98:1 (axe catches), field
border 1.26:1 light / 1.47:1 dark (axe silent — `border-contrast` catches),
focus ring 1.54:1 (axe silent — next rule). The write hook refuses an edit
that drops `--input` below 3:1 and reports the ratio.

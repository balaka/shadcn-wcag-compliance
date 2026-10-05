# shadcn-wcag-compliance

[![Storybook on GitHub Pages](https://github.com/balaka/shadcn-wcag-compliance/actions/workflows/storybook-pages.yml/badge.svg)](https://github.com/balaka/shadcn-wcag-compliance/actions/workflows/storybook-pages.yml)
![WCAG 2.2 AA](https://img.shields.io/badge/WCAG-2.2%20AA-0F6E56)
![shadcn on Base UI](https://img.shields.io/badge/shadcn-Base%20UI-1B1F2A)
![status: one rule end to end](https://img.shields.io/badge/status-one%20rule%20end%20to%20end-BA7517)
![license: MIT](https://img.shields.io/badge/license-MIT-534AB7)

**Accessibility rules, written once, kept on every edit.**

An accessible product is easier and more obvious to use for more people, so it can earn more. shadcn is used by hundreds of teams, and this is an accessibility control for a design system built on it: a specialist writes a rule once and records a disputed decision as a precedent. From then on every edit, including an edit made by an agent, is checked against those rules and decisions.

**Live demo:** <https://balaka.github.io/shadcn-wcag-compliance/> — open *WCAG compliance › Overview* and follow the four steps. The Accessibility tab runs axe and our rule in your browser. What the demo cannot show: the edit gate (it lives in the agent's tool) and the test runner (it needs a server).

## Why

- **Behaviour is tested, appearance is not.** Under shadcn sits Base UI, a component library with its own tests for keyboard, focus and screen readers. shadcn wraps those components and puts the look on top; teams copy the wrapper files and restyle them. The look is what breaks, and no one checks it.
- **Clean shadcn fails as installed.** Field border 1.26:1 against the background (3:1 required), destructive button text 3.98:1 (4.5:1 required), focus ring 1.54:1. The shadcn repository has no accessibility checks at all.
- **axe sees part of it.** It catches the red button; it has no rule for the border, the focus ring, or a status shown by colour alone.
- **An agent's verdict is not a check.** Ask "is the contrast fine?" and it answers "fine" without measuring; ask again and it answers differently; a hundred components checked ten times leave no trace. The person who has to sign has nothing to sign on.
- **The law asks for it.** The European Accessibility Act has applied since June 2025 and requires WCAG level AA.

## How it works

```
standards/   the WCAG 2.2 criterion, copied word for word with its edition date
    ↓
rules/own/   a rule in the W3C ACT format: applicability, expectation,
             pass/fail examples with numbers, a version
    ↓
src/rules/   code with the same name; runs inside Storybook (as an axe rule,
             same Accessibility tab) and in a hook on every edit
    ↓
three outcomes
    passed      → the report
    failed      → the write is refused; the agent gets the number back
    cannot tell → a person; the agent drafts a precedent
    ↓
precedents/  a person's decision as a card: what, which text of the standard,
             who, why, until when. The checks read it. The agent may draft;
             only a person approves.
    ↓
runs/        one file per run, one line per gate decision: the trace
```

The gate (`src/gate/`) is the part the chat cannot talk its way around: it refuses a write that would make a rule start failing, refuses a chat approving a precedent, refuses changes to itself, and fails closed. It is a threshold, not a wall: a determined bypass leaves a trace and breaks the signed lock; the wall is the pull request. Details in [src/gate/README.md](src/gate/README.md) and [docs/architecture.md](docs/architecture.md).

### A rule, end to end

Rule [`1.4.11-border-contrast`](rules/own/1.4.11-border-contrast.md): the border of a form control must have at least 3:1 contrast against the colour it sits on (WCAG 1.4.11, for which axe has no rule).

1. In Storybook, *Input › With Label* shows `1.4.11-border-contrast · 1.26:1, needs 3:1` next to axe's own findings.
2. An agent asked to fix it raises `--input` to 3:1 in both themes, runs the check and quotes the numbers.
3. Asked to set `--input` to `oklch(0.9 0 0)` "as a design decision", it cannot: the gate refuses the write with `1.35:1, needs 3:1`, and the refusal is recorded. The agent's own words: *"a designer's decision doesn't change the measured ratio"*.
4. A person who wants that value anyway records a precedent, approves it in their own terminal, and the same write goes through, marked.

## Who it is for

Teams that build or use a design system on shadcn, and whoever answers for the product's accessibility.

Accessibility is not about a minority. Presbyopia affects up to 85 % of people over 40; 8 % of men have a colour vision deficiency; everyone has sunlight on the screen, a cheap monitor, a remote desktop that flattens colours, a night at 3 a.m. during an incident. In a study with 61 participants without disabilities, a WCAG AA site completed tasks faster and more often and was rated more trustworthy (Schmutz, Sonderegger, Sauer, *Human Factors*). A visible border is a completed form.

For the person doing the checking: the repeated work disappears. Rules are written once; the checks run on every edit; the specialist is left with the disputed cases, each recorded with its reasoning.

## Roadmap

| | Done | Next |
|---|---|---|
| **Rules** | standard copy with edition date (1) · rule in ACT format with version (1) | map every A and AA criterion to axe (after measuring it against the W3C ACT test cases), own code, judge, or person · focus ring, target size, status by colour · first judgement rule with a golden set and a stability measurement · behaviour smoke checks on the wrapped components |
| **Where it runs** | locally: full run in Storybook + the edit hook | on pull requests: the same check in CI, approvals only in a person's commits |
| **Mechanism** | three outcomes, one finding format, run history · precedents with a register page in Storybook · the gate: fails closed, protects itself, signed by a person | triage: what a person sees first, one token = one finding · the agent attaches the run record to any claim about accessibility · token notation guard |
| **Delivery** | — | `npm install` + `init`: the section appears in your own Storybook |

## Repository

```
example/      a clean shadcn (Base UI) project with Storybook: the test bench
standards/    verbatim WCAG text, dated
rules/        our rules (ACT format)
precedents/   a person's decisions
src/          contrast math, theme reader, rule code, executors, the gate
runs/         findings per run, gate decisions per edit
docs/         architecture, research notes
```

Run the bench: `cd example && npm install && npm run storybook`. Full check from the repository root: `node src/run.ts` (Node 22.6+; Vitest must have produced `example/reports/vitest.json` first).

## Status

One rule carried through every step, measured on 2026-10-01. Nothing to install yet; the npm name is reserved. Russian notes on the way here: [docs/research-gates-evals-2026-09-30.md](docs/research-gates-evals-2026-09-30.md).

License: [MIT](LICENSE).

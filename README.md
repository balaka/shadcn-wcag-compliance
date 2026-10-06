# shadcn-wcag-compliance

[![Storybook on GitHub Pages](https://github.com/balaka/shadcn-wcag-compliance/actions/workflows/storybook-pages.yml/badge.svg)](https://github.com/balaka/shadcn-wcag-compliance/actions/workflows/storybook-pages.yml)
![WCAG 2.2 AA](https://img.shields.io/badge/WCAG-2.2%20AA-0F6E56)
![shadcn on Base UI](https://img.shields.io/badge/shadcn-Base%20UI-1B1F2A)
![status: one rule end to end](https://img.shields.io/badge/status-one%20rule%20end%20to%20end-BA7517)
![license: MIT](https://img.shields.io/badge/license-MIT-534AB7)

**Accessibility rules, written once, kept on every edit.**

An accessible product is easier and more obvious to use for more people, so it can earn more. shadcn is used by hundreds of teams, and this is an accessibility control for a design system built on it: a specialist writes a rule once and records a disputed case as a decision. From then on every edit, including an edit made by an agent, is checked against those rules and decisions.

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
    cannot tell → a person; the agent drafts a decision
    ↓
decisions/   a person's decision as a card: what, which text of the standard,
             who, why, until when. The checks read it. The agent may draft;
             only a person on the approvers list approves.
    ↓
runs/        one file per run, one line per gate decision: the trace
```

The gate (`src/gate/`) is the part the chat cannot talk its way around: it refuses a write that would make a rule start failing, refuses a chat approving a decision, refuses a chat rewriting a story (a story is what the checks see), refuses changes to itself and to how the checks run, and fails closed. It is a threshold, not a wall: a determined bypass leaves a trace and breaks the signed lock; the wall is the pull request. Details in [src/gate/README.md](src/gate/README.md) and [docs/architecture.md](docs/architecture.md).

### A rule, end to end

Rule [`1.4.11-border-contrast`](rules/own/1.4.11-border-contrast.md): the border of a form control must have at least 3:1 contrast against the colour it sits on (WCAG 1.4.11, for which axe has no rule).

1. On shadcn as it installs, Storybook's *Input › With Label* shows `1.4.11-border-contrast · 1.26:1, needs 3:1` next to axe's own findings.
2. An agent asked to fix it raises `--input` in both themes, runs the check and quotes the numbers. This repository's theme now passes: 3.02:1 light, 4.08:1 dark.
3. Asked to set `--input` to `oklch(0.9 0 0)` "as a design decision", it cannot: the gate refuses the write with `1.35:1, needs 3:1`, and the refusal is recorded. The agent's own words: *"a designer's decision doesn't change the measured ratio"*.
4. A person who wants that value anyway records a decision, approves it in their own terminal, and the same write goes through, marked.

## Who it is for

Teams that build or use a design system on shadcn, and whoever answers for the product's accessibility: a designer, a developer, a product owner, legal.

### Who inaccessible interfaces actually hurt

Accessibility is sold as "16 % of people". The number is real (1.3 billion people live with a significant disability[^who]), and it is the smallest of the groups below. Every WCAG rule, from contrast and focus to names, labels and error text, protects everyone in this table, and most of them are paying customers.

| Group | Who, concretely | What breaks for them |
|---|---|---|
| **Permanent** | blind and low-vision users, deaf users, people with motor or cognitive impairments | everything the standard covers |
| **Temporary** | a broken arm, eye drops after an examination, a concussion, flu, no sleep | one hand means keyboard only; blurred vision means contrast |
| **Situational** | sunlight on the screen, a child in one arm, a train, a noisy room, gloves | contrast, target size, labels instead of colour |
| **Hardware** | a cheap LCD, an old projector in a meeting, a night-mode colour filter, **a remote desktop or screen share** (RDP, VNC, Zoom compress colours; a pale border is the first thing to vanish) | border and focus contrast |
| **Age** | presbyopia in up to 85 % of people over 40[^presbyopia]; after 60 the lens yellows and needs more contrast; colour vision deficiency in 8 % of men[^cvd] | contrast; status not by colour alone |
| **State and context** | an administrator at 3 a.m. during an incident; a reader in a second language; a first-time user; a power user who never touches the mouse | readable labels and error text, a visible focus, a sane tab order |
| **Machines** | a screen reader, but also a search engine, an automated test, voice control, **an agent operating the interface on a user's behalf** | an element's name and role; structure |

Two of these are the daily life of the people who use hosting control panels: **a remote desktop** flattens colours so that low-contrast text, borders and focus rings are simply not there, and **3 a.m. during an incident** leaves no attention for an error shown only by colour, a control without a name, or a form with no clear label.

### What this is worth

- **Easier and more obvious to use, for the people who pay.** In a study with 61 participants *without* disabilities, a WCAG AA site had faster task completion and higher completion rates than the same site without conformance, and was rated more usable and more trustworthy; level A alone made no difference[^schmutz]. A form that can be seen, understood and completed is a registration and a paid order.
- **The rules the law asks for.** The European Accessibility Act has applied since 28 June 2025; fines are national, up to 100,000 EUR in Germany, 200,000 EUR in Belgium, 1,000,000 EUR in Spain[^eaa]. In the United States more than 5,000 digital accessibility lawsuits were filed in 2025, nearly half against companies already sued once[^ada]. Enterprise and public buyers ask for proof of conformance before a deal; the run history and the decision register here are that proof, kept automatically.
- **The specialist stops repeating work.** A manual audit of a hundred-component design system takes weeks and has to be redone after every change. Here the rules are written once; the checks run on every edit; what is left for the specialist is the disputed case, recorded with its reasoning. Decisions with legal weight can be approved by legal, in the same card.
- **One fix in the design system fixes every product.** A design system is shared across products: a rule enforced in one place holds on every screen that uses it, and one gate guards all of them.

[^who]: WHO, *Global report on health equity for persons with disabilities*, 2022: 1.3 billion people, 16 % of the world population.
[^presbyopia]: Prevalence of presbyopia from 40 years of age up to about 85 %; 1.8 billion people in 2015 (Fricke et al., *Ophthalmology*, 2018).
[^cvd]: Red–green colour vision deficiency in about 8 % of males and 0.5 % of females of Northern European descent.
[^schmutz]: Schmutz, Sonderegger, Sauer, "Implementing recommendations from web accessibility guidelines: would they also provide benefits to nondisabled users", *Human Factors*, 2016.
[^eaa]: Directive (EU) 2019/882; national penalties as summarised by Fieldfisher and Clym, 2025.
[^ada]: UsableNet, 2025 year-end report on digital accessibility lawsuits.

## Roadmap

| | Done | Next |
|---|---|---|
| **Rules** | standard copies with edition date (2) · the list of every A and AA criterion · rules in ACT format with versions (2): field border contrast (1.4.11); text contrast (1.4.3) — axe where it measures, our code where it cannot: all 155 of axe's "cannot tell" on the whole design system measured | axe's rules only as executors behind our own rule files, each after an exam on the W3C ACT test cases (first: text contrast, ACT afw4f7) · target size through axe; focus ring and status by colour as our own code · behaviour smoke checks on the wrapped components |
| **Stories** | the whole design system: 58 components, 445 stories from the official shadcn examples, grouped as in a design system, with Docs, Playground and the open state of every popup · closed to agents; written only in a person's window; a story never switches a check off | Message and MessageScroller with static messages · every story in both themes |
| **Where it runs** | locally: full run in Storybook + the edit hook | on pull requests: the same check in CI, approvals only in a person's commits |
| **Mechanism** | three outcomes, one finding format, run history · decisions with a register page in Storybook · approvers list + CODEOWNERS · a decision shows needs review when its rule changes · the gate: fails closed, protects itself and how the checks run, signed by a person | triage: what a person sees first, one token = one finding · the agent attaches the run record to any claim about accessibility · token notation guard |
| **Delivery** | — | `npm install` + `init`: the section appears in your own Storybook |

## Repository

```
example/      a clean shadcn (Base UI) project with Storybook: the test bench
standards/    verbatim WCAG text, dated
rules/        our rules (ACT format)
decisions/    a person's decisions
src/          contrast math, theme reader, rule code, executors, the gate
runs/         findings per run, gate decisions per edit
docs/         architecture, research notes
```

## Try it

You need Node 22.6 or newer, and Claude Code for the gate. About five minutes:

```bash
git clone https://github.com/balaka/shadcn-wcag-compliance
cd shadcn-wcag-compliance/example
npm install
npx playwright install chromium
npm run storybook
```

Storybook opens at <http://localhost:6006>. Press **Run tests** (bottom left, Accessibility ticked) and open any story's **Accessibility** tab.

Then open the repository folder in Claude Code. It reads `CLAUDE.md`; the gate is already registered in `.claude/settings.json`, nothing to switch on. Ask it to change a theme token in `example/src/index.css` and watch the gate measure the write. Prompts that show the refusal, in order, are in [docs/talk-2026-10-05.md](docs/talk-2026-10-05.md).

The full check from the repository root, after a test run has written `example/reports/vitest.json`:

```bash
node src/run.ts
```

What this version does not do yet: it checks the clean shadcn design system in `example/`, not your own components; one rule is carried end to end; the gate works inside Claude Code only.

## Status

One rule carried through every step, measured on 2026-10-01. Not an npm package yet; the name is reserved.

License: [MIT](LICENSE).

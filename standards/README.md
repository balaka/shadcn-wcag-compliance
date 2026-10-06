# standards/

Verbatim copies of the texts our rules rest on. Nothing here is ours and
nothing here is edited: a new edition is a new file (the gate refuses an
edit to an existing copy).

- `wcag22/criteria-a-aa.md` — the index: every WCAG 2.2 success criterion
  at level A and AA, with its number, name, level and link. The map of what
  a design system has to answer for; the rules grow from it.
- `wcag22/<number>-<name>.md` — one file per criterion we write a rule
  against, with the normative text. Each carries the edition date and the
  capture date in its front matter, so a rule or a decision can point at
  the exact wording it was decided against.
- `act/` — W3C ACT rules and their test cases, as published at
  https://act-rules.github.io/ (added as we adopt them: the test cases are
  the exam an axe rule sits before it becomes ours).

Why copies and not links: W3C revises the Understanding documents and ACT
rules. A decision recorded against a link silently changes meaning when the
page changes; a decision recorded against a dated copy does not. When a new
edition lands, add the new file and review every rule and decision that
cites the old one.

Licenses: WCAG text — W3C Document License; ACT rules — W3C Software and
Document License. Both allow copying with attribution.

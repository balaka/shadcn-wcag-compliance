---
format: 3
id: d-2026-10-03-01
formerly: p-2026-10-03-01
kind: exception
rule: 1.4.11-border-contrast
rule_version: 1
criterion: 1.4.11
scope: tokens
subject:
  file: example/src/index.css
  tokens: [--input, --background]   # both themes: no theme given
verdict: accept
evidence:
  - "light: --input oklch(0.922 0 0) (#e5e5e5) on --background #ffffff = 1.26:1, needs 3:1"
  - "dark: --input oklch(1 0 0 / 15%) (#2f2f2f) on --background #0a0a0a = 1.47:1, needs 3:1"
reason: >
  The example must show shadcn exactly as it installs, so that the
  demonstration on 2026-10-06 starts from the real default and the fix
  happens live in front of the team. The violation is real and known;
  it is kept on purpose for four days.
valid_until: 2026-10-07
history:
  - { at: 2026-10-03T03:20, action: drafted, by: "claude (session bd7e5d39)" }
  - { at: 2026-10-03T03:23, action: approved, by: "Yuriy Balaka", why: "его слово в чате 03.10: «согласен, вноси; вернём изначальное состояние токенов, как в дистрибутиве shadcn»" }
  - { at: 2026-10-04T17:21, action: revoked, by: "Yuriy Balaka", why: "the planted failure stays as the demo state; no exception needed" }
---

## What happens without this precedent

The edit hook refuses to set `--input` back to the shadcn default because
the pairs would drop from 3.11:1 / 3.77:1 to 1.26:1 / 1.47:1 — a regression by
the rule, and the rule is right.

## What this precedent allows

Exactly one thing: the pair `--input` / `--background` in `example/src/index.css`,
both themes, may fail rule `1.4.11-border-contrast` v1 until 2026-10-07. The
finding still appears in every report, marked `accepted by p-2026-10-03-01`.

## After the demo

Revoke (append a `revoked` entry with why) and fix the token, or let the
precedent expire on 2026-10-07 — the hook then blocks again on its own.

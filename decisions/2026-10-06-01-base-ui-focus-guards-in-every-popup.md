---
format: 3
id: d-2026-10-06-01
kind: interpretation
rule: aria-hidden-focus
rule_version: axe-core 4.13.0
criterion: 4.1.2
scope: rule
match:
  check: focusable-not-tabbable
  selector: data-base-ui-focus-guard
verdict: not-applicable
evidence:
  - "run 2026-10-06T14-36-54 (all components): 36 cantTell findings, every one on <span aria-hidden=\"true\" tabindex=\"0\" data-base-ui-focus-guard> — 'Check that focusable elements are not tabbable in the current state'"
  - "in AlertDialog 3, ContextMenu 2, Dialog 3, Drawer 3, DropdownMenu 12, Menubar 4, Popover 6, Select 4, Sheet 3 — always the Open state"
  - "the same elements as d-2026-10-03-02 (DropdownMenu, approved 2026-10-05), now in every Base UI popup"
reason: >
  These spans are Base UI's focus guards: invisible, 1×1 px, placed before
  and after an open popup so that Tab cannot leave it. They are tabbable on
  purpose — that is how the trap works — and hidden from the accessibility
  tree on purpose, because they carry no content. Every Base UI popup uses
  the same guards, so the reading of d-2026-10-03-02 holds for all of them:
  the rule is not applicable to these guard elements. It stays applicable
  to anything else that is aria-hidden and focusable.
history:
  - { at: 2026-10-06T14:50, action: drafted, by: "claude (session 51e04f22)" }
---

## Why a rule-wide decision

d-2026-10-03-02 was decided for DropdownMenu, the only popup that had a
story then. With a story for every component, the same six guards appear
around every open popup. One decision on the pattern, bound to the guard
attribute, instead of nine copies of the same reasoning.

## Scope

Rule `aria-hidden-focus`, axe-core 4.13.0, elements whose selector contains
`data-base-ui-focus-guard` only.

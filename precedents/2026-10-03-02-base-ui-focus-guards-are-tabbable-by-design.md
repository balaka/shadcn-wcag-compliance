---
format: 2
id: p-2026-10-03-02
kind: interpretation
rule: aria-hidden-focus
rule_version: axe-core 4.13.0
criterion: 4.1.2
scope: component
subject:
  component: DropdownMenu
match:
  check: focusable-not-tabbable
  selector: data-base-ui-focus-guard
decision: not-applicable
evidence:
  - "DropdownMenu › Open: 6 × <span aria-hidden=\"true\" tabindex=\"0\" data-base-ui-focus-guard> — axe: cantTell, 'Check that focusable elements are not tabbable in the current state'"
  - "DropdownMenu › Destructive Item Highlighted: the same 6 elements"
reason: >
  These spans are Base UI's focus guards: invisible, 1×1 px, placed before
  and after the open menu so that Tab cannot leave it (the focus trap).
  They are tabbable on purpose — that is how the trap works — and hidden
  from the accessibility tree on purpose, because they carry no content.
  axe cannot tell this from markup alone and asks a person. The behaviour
  layer (Base UI) is trusted for keyboard and focus; the rule is not
  applicable to these guard elements. It stays applicable to anything else
  inside the menu that is aria-hidden and focusable.
history:
  - { at: 2026-10-03T21:40, action: drafted, by: "claude (session bd7e5d39)" }
---

## What axe saw

Six `span` elements with `aria-hidden="true"` and `tabindex="0"`, each
marked `data-base-ui-focus-guard`, around and inside the open menu.
The check `focusable-not-tabbable` returns "needs review".

## Why not-applicable

Focus guards are the standard technique for keeping keyboard focus inside
a popup (used by Floating UI, Radix and Base UI alike). Removing
`tabindex` would break the trap; removing `aria-hidden` would announce
empty elements to a screen reader. Neither is a defect.

## Scope

Component `DropdownMenu`, elements matching `data-base-ui-focus-guard`
only. Any other `aria-hidden` focusable element in the menu is still a
finding.

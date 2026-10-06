---
format: 3
id: d-2026-10-03-03
formerly: p-2026-10-03-03
kind: interpretation
rule: aria-valid-attr-value
rule_version: axe-core 4.13.0
criterion: 4.1.2
scope: component
subject:
  component: DropdownMenu
match:
  check: aria-valid-attr-value
  selector: "#base-ui-"   # axe reports the trigger by its generated id, base-ui-_r_*_
verdict: not-applicable
evidence:
  - "DropdownMenu › Open: trigger <button aria-haspopup=\"menu\" aria-expanded=\"true\" aria-controls=\"_r_1_\"> — axe: cantTell, 'Unable to determine if aria-controls referenced ID exists on the page while using aria-haspopup'"
  - "Checked in the live story on 2026-10-03: document.getElementById('_r_1_') exists, role=menu"
reason: >
  axe does not resolve aria-controls when the element also has
  aria-haspopup, because the popup may not be rendered yet. In the open
  state Base UI renders the menu with exactly that id and role=menu, so
  the reference is valid. The attribute value is correct; the rule is not
  applicable to this trigger while Base UI manages the ids.
history:
  - { at: 2026-10-03T21:40, action: drafted, by: "claude (session bd7e5d39)" }
---

## What axe saw

The menu trigger carries `aria-controls` pointing at the popup. With
`aria-haspopup` present, axe stops short of checking whether the target
exists and reports "needs review".

## Why not-applicable

The target exists whenever the menu is open; when it is closed, WAI-ARIA
allows `aria-controls` to reference an element that is not currently
rendered. Base UI generates both ids, so they cannot drift apart.

## Scope

Component `DropdownMenu`, the trigger element (`data-slot="dropdown-menu-trigger"`).

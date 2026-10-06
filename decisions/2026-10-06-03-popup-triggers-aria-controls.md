---
format: 3
id: d-2026-10-06-03
kind: interpretation
rule: aria-valid-attr-value
rule_version: axe-core 4.13.0
criterion: 4.1.2
scope: rule
match:
  check: aria-valid-attr-value
  selector: "#base-ui-"   # axe reports the trigger by its generated id, base-ui-_r_*_
verdict: not-applicable
evidence:
  - "run 2026-10-06T14-36-54: 6 cantTell findings, each a Base UI popup trigger with aria-haspopup and aria-controls — Combobox › Open, DropdownMenu › Open, DropdownMenu › Destructive Item Highlighted, Menubar › Open, Popover › Open, Select › Open"
  - "verified for DropdownMenu on 2026-10-03 (d-2026-10-03-03): the referenced id exists in the open state, role=menu"
  - "NOT verified one by one for Combobox, Menubar, Popover and Select: opened by hand on 2026-10-06, Select's trigger showed no aria-controls at all, so the attribute appears only in some states"
reason: >
  axe does not resolve aria-controls when the element also has
  aria-haspopup, because the popup may not be rendered yet, and asks a
  person. Base UI generates both the trigger's aria-controls and the
  popup's id, so they cannot drift apart; in the open state the popup is
  rendered with that id. This draft extends d-2026-10-03-03 from
  DropdownMenu to every Base UI popup trigger — on the strength of one
  verified component, which is why a person should check one more before
  approving.
history:
  - { at: 2026-10-06T14:50, action: drafted, by: "claude (session 51e04f22)" }
---

## What a person should check

In Popover › Open (or any of the four not verified): the trigger's
`aria-controls` value names an element that exists while the popup is open.

## Scope

Rule `aria-valid-attr-value`, axe-core 4.13.0, triggers whose selector
contains `#base-ui-`.

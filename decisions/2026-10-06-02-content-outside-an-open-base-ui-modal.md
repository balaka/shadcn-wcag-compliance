---
format: 3
id: d-2026-10-06-02
kind: interpretation
rule: aria-hidden-focus
rule_version: axe-core 4.13.0
criterion: 4.1.2
scope: rule
match:
  check: focusable-not-tabbable
  selector: data-base-ui-inert
verdict: not-applicable
evidence:
  - "run 2026-10-06T14-36-54: 4 cantTell findings on div[data-base-ui-inert][aria-hidden=\"true\"] — AlertDialog › Open, Dialog › Open, Drawer › Open, Sheet › Open"
  - "looked at in Dialog › Open (Storybook, 2026-10-06): while the dialog is open, Base UI puts aria-hidden=\"true\" and data-base-ui-inert on everything outside it, #storybook-root included; inside #storybook-root is one tabbable element, the button that opened the dialog"
reason: >
  While a modal dialog, alert dialog, sheet or drawer is open, Base UI hides
  the rest of the page from assistive technology (aria-hidden) and keeps
  keyboard focus inside the modal with its focus guards, so the button
  outside cannot be reached with Tab until the modal closes. That is the
  expected behaviour of a modal (WAI-ARIA dialog pattern). axe sees a
  focusable element inside aria-hidden content and cannot tell from markup
  that a focus trap is active. The rule is not applicable to content Base UI
  has made inert for an open modal.
history:
  - { at: 2026-10-06T14:50, action: drafted, by: "claude (session 51e04f22)" }
---

## What a person should check

That focus really cannot reach the trigger while the modal is open: open
Dialog › Open, press Tab repeatedly, focus stays inside the dialog.

## Scope

Rule `aria-hidden-focus`, axe-core 4.13.0, elements whose selector contains
`data-base-ui-inert` only. Base UI sets that attribute only on content it
hides for an open modal.

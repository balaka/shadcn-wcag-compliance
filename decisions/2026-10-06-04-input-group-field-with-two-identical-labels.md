---
format: 3
id: d-2026-10-06-04
kind: interpretation
rule: form-field-multiple-labels
rule_version: axe-core 4.13.0
criterion: 3.3.2
scope: story
subject:
  component: InputGroup
  story: InputGroup › With Addons
match:
  check: multiple-label
  selector: "#input-label-10"
verdict: accept
evidence:
  - "run 2026-10-06T14-36-54: cantTell on #input-label-10 — 'Multiple label elements is not widely supported in assistive technologies. Ensure the first label contains all necessary information.'"
  - "the story (shadcn's own example): <FieldLabel htmlFor=\"input-label-10\">Label</FieldLabel> above the group and a second <FieldLabel htmlFor=\"input-label-10\">Label</FieldLabel> inside its addon"
reason: >
  axe asks a person to make sure the first label carries everything the
  field needs. It does: both labels say exactly "Label", so a screen reader
  that reads only the first one loses nothing, and one that reads both
  hears the same word twice. The field has a name; the duplicate is how
  this example shows a label placed inside an input group. Accepted for
  this story only; a field whose labels say different things is still a
  finding.
history:
  - { at: 2026-10-06T15:05, action: drafted, by: "claude (session 51e04f22)" }
---

## Scope

Story *InputGroup › With Addons*, the field `#input-label-10` only.

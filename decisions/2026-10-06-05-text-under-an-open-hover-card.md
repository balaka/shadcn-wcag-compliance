---
format: 3
id: d-2026-10-06-05
kind: interpretation
rule: 1.4.3-text-contrast
rule_version: 3
criterion: 1.4.3
scope: story
subject:
  component: HoverCard
  story: HoverCard › Open
match:
  check: text-contrast-ratio
  selector: "#base-ui-"   # the other hover-card triggers, by their generated ids
verdict: not-applicable
evidence:
  - "run 2026-10-06T15-23-43 (rule 1.4.3-text-contrast v3): 4 cantTell — 'the text is covered by div[data-slot=\"hover-card-content\"]: is it visible to anyone?' on #base-ui-_r_h_, _r_j_, _r_l_, _r_n_"
  - "the story opens the first hover card of the Sides example; its card is drawn over the neighbouring triggers"
reason: >
  While a hover card is open it lies over the content next to it — that is
  what a hover card does, and it closes when the pointer or focus leaves.
  At that moment the covered text is not visible to anyone, which WCAG
  1.4.3 counts as Incidental: no contrast requirement. The same triggers
  are measured with the card closed in the other HoverCard stories. Only
  this story, only the triggers under the open card.
history:
  - { at: 2026-10-06T16:05, action: drafted, by: "claude (session 51e04f22)" }
---

## What a person should check

Open HoverCard › Open: the open card covers the other triggers of the
Sides example, and nothing a user needs while the card is open is hidden
under it.

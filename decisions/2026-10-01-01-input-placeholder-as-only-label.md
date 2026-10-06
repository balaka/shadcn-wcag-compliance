---
id: p-2026-10-01-01
format: 1
rule: (none yet — candidate for rules/judge/field-has-visible-label)
version: —
criterion: 3.3.2 Labels or Instructions (A)
standard: standards/wcag22/ (criterion copy to be added with the rule)
where: Input › Placeholder Only, light theme, example/src/stories/shadcn/Input.stories.tsx
decision: pending
approved_by: —
scope: —
status: draft
---

## Evidence

```html
<input type="email" placeholder="Email">
```

No `<label>`, no `aria-label`. The placeholder gives the field an accessible
name (axe's `label` rule passes), so 4.1.2 is met. The placeholder
disappears as soon as the user types.

## Question for a person

Is a placeholder alone a "label or instruction" in the sense of 3.3.2?

## Draft reasoning (model, unapproved)

W3C's Understanding 3.3.2 says labels need not be visible at all times but
must be available; the technique "Using a placeholder as the only label" is
listed by W3C as a *failure* for 3.3.2 only in combination with 1.3.1 when
the placeholder is the sole visible instruction and vanishes. The common
reading of practitioners is "fail". A person should confirm against the
captured Understanding text before this becomes a rule example.

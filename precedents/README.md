# precedents/

The register of decisions a person made where a rule alone could not
settle the case. Format 2. One file per decision; a file is never
rewritten, only appended to (see `history`).

A precedent is born when an executor answers `cantTell`, when a person
disagrees with a `failed` / `passed`, or when a person decides to keep a
violation knowingly. The model may **draft** a precedent; only a person
can **approve** it, and a precedent without an approval does nothing.

## Two kinds

| `kind` | for rules of | means | afterwards |
|---|---|---|---|
| `exception` | code (a number, an attribute) | "the rule is right; here we accept the violation" — always with `valid_until` | expires or is revoked; the rule does not change |
| `interpretation` | judgement (meaning) | "in a case like this we read the rule so" | becomes a Passed/Failed example in the rule → an eval in the golden set → when it recurs, the rule's wording is tightened and its version bumped |

## Front matter

```yaml
format: 2
id: p-2026-10-03-01            # p-<date>-<n>
kind: exception                 # exception | interpretation
rule: 1.4.11-border-contrast
rule_version: 1                 # a new rule version puts every precedent on it in needs-review
criterion: 1.4.11
scope: tokens                   # story | component | tokens | rule — narrow to wide
subject:                        # what the scope points at
  file: example/src/index.css   #   tokens: file + theme + tokens
  theme: light                  #   component: component; story: component + story
  tokens: [--input, --background]
decision: accept                # accept | reject | not-applicable
evidence:                       # one line per measured case (a single string is also accepted)
  - "light: --input oklch(0.922 0 0) on --background oklch(1 0 0) = 1.26:1, needs 3:1"
reason: >
  plain words, citing the standard's text where it matters
valid_until: 2026-10-07         # exceptions only; absent for interpretations
history:                        # append-only; the LAST entry is the status
  - { at: 2026-10-03T03:20, action: drafted,  by: "claude (session b0abf6bf)" }
  - { at: 2026-10-03T03:25, action: approved, by: "Yuriy Balaka" }
  # later: expired (automatic, by valid_until) · revoked (by, why) ·
  #        superseded (by: p-… or rule version N) · needs-review
---
```

Status is read off the last `history` entry: `drafted` → `approved`
(= active) → `expired` | `revoked` | `superseded` | `needs-review`. Only
`approved`, and not past `valid_until`, is active.

## How it is applied

An executor that gets `failed` from a rule asks the register for an active
precedent with the same `rule` and `rule_version` whose scope matches the
finding — looking from the narrowest (`story`) to the widest (`rule`), first
match wins. With `decision: accept` or `not-applicable` the finding stays
in the report, marked `accepted by p-…`, and does not block. Without one, it
blocks as usual. An expired precedent blocks again and the report says so.

Where to see them: the Accessibility tab shows the mark next to the finding;
the Storybook page *Compliance / Precedents* lists the whole register with
each file's history.

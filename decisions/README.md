# decisions/

The register of decisions a person made where a rule alone could not
settle the case. Format 3. One file per decision; a file is never
rewritten, only appended to (see `history`).

A decision is born when an executor answers `cantTell`, when a person
disagrees with a `failed` / `passed`, or when a person decides to keep a
violation knowingly. An agent may **draft** a decision; only a person on
the approvers list (`src/decisions/approvers.ts`) can **approve** it, and a
decision without that approval does nothing.

Until 2026-10-06 the register was called *precedents*, the verdict field
was `decision` and ids began with `p-` (format 2). The records were moved
here unchanged in substance; each keeps its old id as `formerly`, so runs
written before the rename still point at it.

## Two kinds

| `kind` | for rules of | means | afterwards |
|---|---|---|---|
| `exception` | code (a number, an attribute) | "the rule is right; here we accept the violation" — always with `valid_until` | expires or is revoked; the rule does not change |
| `interpretation` | judgement (meaning), or a rule that cannot tell | "in a case like this we read the rule so" | becomes a Passed/Failed example in the rule → an eval in the golden set → when it recurs, the rule's wording is tightened and its version bumped |

## Front matter

```yaml
format: 3
id: d-2026-10-03-02             # d-<date>-<n>
formerly: p-2026-10-03-02       # only for records from before the rename
kind: interpretation            # exception | interpretation
rule: aria-hidden-focus
rule_version: axe-core 4.13.0   # own rules: their version; axe's: the axe-core version
criterion: 4.1.2
scope: component                # story | component | tokens | rule — narrow to wide
subject:                        # what the scope points at
  component: DropdownMenu       #   tokens: file + theme + tokens
                                #   component: component; story: component + story
verdict: not-applicable         # accept | reject | not-applicable
match:                          # rules with several reasons to say cantTell (axe's):
  check: focusable-not-tabbable #   which check inside the rule…
  selector: data-base-ui-focus-guard  # …on which element (substring of its selector)
                                # required for rules that are not ours; omit for own rules
evidence:                       # one line per measured case
  - "DropdownMenu › Open: 6 × <span aria-hidden=\"true\" tabindex=\"0\" data-base-ui-focus-guard>"
reason: >
  plain words, citing the standard's text where it matters
valid_until: 2026-10-07         # exceptions only; absent for interpretations
history:                        # append-only; the LAST entry is the status
  - { at: 2026-10-03T21:40, action: drafted,  by: "claude (session bd7e5d39)" }
  - { at: 2026-10-05T14:35, action: approved, by: "Yuriy Balaka" }
  # later: revoked (by, why) · superseded · needs-review (by, why)
---
```

## Status

Read off the last `history` entry, and then checked:

| status | when | counts? |
|---|---|---|
| `drafted` | an agent or a person wrote it; nobody approved it yet | no |
| `approved` | a person on the approvers list approved it, for the rule version it names | **yes** |
| `needs-review` | sent back (an entry `needs-review`), **or** approved by someone not on the list, **or** approved for an older version of its rule | no |
| `expired` | an exception past `valid_until` | no |
| `revoked` | a person withdrew it | no |

`needs-review` for a rule version is computed, never written: when
`rules/own/<rule>.md` moves to version 2 (or a new axe-core is installed),
every decision approved for the old version stops counting at once, and
the register page and `node src/run.ts` say why. The gate lists those
decisions when the rule's version changes. A person looks at each again
and, if it still holds, re-approves it for the new version:

```bash
node src/decisions/approve.ts d-2026-10-03-02 --rule-version "axe-core 4.14.0" --by "Yuriy Balaka" --why "…"
```

## Who may write what

A chat (any agent) may create a decision and append `drafted` or
`needs-review` to its history. `approved` and `revoked` are a person's
act: run `node src/decisions/approve.ts <id> --by "<name>" [--why "…"]
[--revoke]` in your own terminal. The command refuses a name that is not
on the approvers list.

What a person approved is frozen for a chat: kind, rule, version, scope,
subject, match, verdict, evidence, reason, valid_until. A chat that
thinks one of them is wrong appends `needs-review` in the same write, and
the decision stops counting until a person looks again. The prose below
the front matter is free.

All of this is a threshold, not a wall: a name typed after `--by` is
self-declared, and a determined chat can edit a file outside the tools.
The wall is the pull request: `.github/CODEOWNERS` makes the approvers the
required reviewers of `decisions/`, so with "Require review from Code
Owners" switched on in branch protection, no change here reaches main
without their review on GitHub.

## How it is applied

An executor that gets `failed` from a rule asks the register for an active
decision with the same `rule` and `rule_version` whose scope matches the
finding — looking from the narrowest (`story`) to the widest (`rule`),
first match wins. With `verdict: accept` or `not-applicable` the finding
stays in the report, marked `accepted by d-…`, and does not block. Without
one, it blocks as usual. An expired or stale decision blocks again, and the
report says so.

Where to see them: the Storybook page *WCAG compliance › Decisions* lists
the whole register with each file's history.

# precedents/

The register of decisions on cases a rule could not settle by itself.

A precedent is born when an executor answers `cantTell`, or when a person
disagrees with a `failed` / `passed`. One file per case. The model may
draft a precedent; only a person approves it.

Each file carries:

| field | meaning |
|---|---|
| `rule` + `version` | the rule and the exact version the case was judged against |
| `criterion` | WCAG success criterion, pointing at the copy in `standards/` |
| `where` | component, story, theme — enough to reproduce |
| `evidence` | the number, the markup, the exact phrase |
| `decision` | passed / failed / inapplicable |
| `reasoning` | why, in plain words, citing the Understanding text |
| `approved_by` | the person, and the date |
| `scope` | this story only / this component / the whole design system |
| `status` | active / superseded by `<file>` |

Life of a precedent: decision → becomes a Passed/Failed example in the rule
→ becomes an eval in the golden set → when it recurs, the rule's wording is
tightened and its version bumped. The same case is never escalated twice.
Review precedents when the rule's version or the cited standard edition
changes.

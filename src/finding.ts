// One finding format for every executor. Everything downstream — the run
// summary, the hook message, the PR annotations, the history page — reads
// only this shape.
//
// `format` is the version of THIS shape. Bump it when a field changes
// meaning; older runs keep their number, so a reader knows how to read them.

export const FINDING_FORMAT = 1

// The four outcomes of W3C's EARL vocabulary. `cantTell` is what axe calls
// "incomplete": the executor could not decide; a person must.
export type Outcome = "passed" | "failed" | "cantTell" | "inapplicable"

export interface Finding {
  format: typeof FINDING_FORMAT
  rule: string // rule id, e.g. "1.4.11-border-contrast" or axe's "color-contrast"
  ruleVersion: string // our rules carry a version; axe rules carry axe's version
  criterion: string // WCAG success criterion, e.g. "1.4.11"
  executor: "axe" | "code" | "judge"
  outcome: Outcome
  subject: {
    component?: string // "Input"
    story?: string // "Input › With Label"
    theme?: string // "light" | "dark" | product profile
    selector?: string // CSS selector of the element, when there is one
    file?: string // source file, for executors that read code
  }
  evidence: string // the number, the colors, the exact phrase — verbatim
  measured?: Record<string, string | number> // machine-readable part of the evidence
  at: string // ISO timestamp
}

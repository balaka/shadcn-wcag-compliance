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
  rule: string // our rule id, numbered: "1.4.11-border-contrast", "4.1.2-button-name"
  ruleVersion: string // our own rules carry their version; rules that run axe's checks carry axe's version
  aka?: string // the executor's own name for the rule: axe's "button-name" for 4.1.2-button-name
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

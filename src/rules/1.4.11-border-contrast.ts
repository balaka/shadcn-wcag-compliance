// Rule 1.4.11-border-contrast, the code side of rules/own/1.4.11-border-contrast.md.
// Applicability and Expectation are taken from that file; the threshold and
// the version live here and there and must match.
//
// Two entry points, one rule:
//   fromTokens(tokens)  — given the theme's tokens (read from CSS, no browser):
//                         the --input / --background pair per theme
//   fromColors(...)     — given two final colors (from a browser or a screenshot)

import { contrastRatio, flatten, toHex, type Rgb } from "../wcag/contrast-ratio.ts"
import type { Tokens } from "../theme/read-tokens.ts"
import type { Finding } from "../finding.ts"

export const RULE = {
  id: "1.4.11-border-contrast",
  version: "1",
  criterion: "1.4.11",
  threshold: 3,
  // which tokens draw a field's border and the surface behind it, in shadcn
  borderToken: "--input",
  backgroundToken: "--background",
} as const

export interface Verdict {
  outcome: "passed" | "failed"
  ratio: number
  border: string // final hex, after compositing a translucent border over the backdrop
  backdrop: string
}

// The comparison itself. `borderAlpha` < 1 means the border is translucent:
// it has no hex of its own until it is laid over the backdrop.
export function fromColors(border: Rgb, borderAlpha: number, backdrop: Rgb): Verdict {
  const flat = flatten([border[0], border[1], border[2], borderAlpha], backdrop)
  const ratio = Math.round(contrastRatio(flat, backdrop) * 100) / 100
  return { outcome: ratio >= RULE.threshold ? "passed" : "failed", ratio, border: toHex(flat), backdrop: toHex(backdrop) }
}

export function fromTokens(tokens: Tokens, file = "<css>"): Finding[] {
  const at = new Date().toISOString()
  const findings: Finding[] = []
  for (const [theme, vars] of Object.entries(tokens)) {
    const base = (v: Partial<Finding>): Finding => ({
      format: 1,
      rule: RULE.id,
      ruleVersion: RULE.version,
      criterion: RULE.criterion,
      executor: "code",
      outcome: "cantTell",
      subject: { component: "Input", theme, file },
      evidence: "",
      at,
      ...v,
    })
    const border = vars[RULE.borderToken]
    const bg = vars[RULE.backgroundToken]
    if (!border || !bg) {
      findings.push(base({ outcome: "inapplicable", evidence: `${theme}: no ${RULE.borderToken} or ${RULE.backgroundToken} token` }))
      continue
    }
    if (!border.color || !bg.color) {
      findings.push(base({ evidence: `${theme}: ${!border.color ? RULE.borderToken + " " + border.unresolved : RULE.backgroundToken + " " + bg.unresolved}` }))
      continue
    }
    const v = fromColors(border.color, border.alpha ?? 1, bg.color)
    findings.push(
      base({
        outcome: v.outcome,
        evidence: `${theme}: ${RULE.borderToken} ${border.raw} (${v.border}) on ${RULE.backgroundToken} ${bg.raw} (${v.backdrop}) = ${v.ratio}:1, needs ${RULE.threshold}:1`,
        measured: { ratio: v.ratio, threshold: RULE.threshold, border: v.border, background: v.backdrop },
      })
    )
  }
  return findings
}

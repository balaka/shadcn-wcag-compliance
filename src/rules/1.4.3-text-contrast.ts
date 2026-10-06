// Rule 1.4.3-text-contrast, the code side of rules/own/1.4.3-text-contrast.md.
// Applicability and Expectation are taken from that file; the thresholds and
// the version live here and there and must match.
//
// Pure: colors in, a verdict out. Where the colors come from (computed
// styles, gradient stops, layers under the text) is the executor's job
// (src/executors/storybook-text-contrast.ts).

import { contrastRatio, flatten, toHex, type Rgb, type Rgba } from "../wcag/contrast-ratio.ts"

export const RULE = {
  id: "1.4.3-text-contrast",
  version: "3",
  criterion: "1.4.3",
  normal: 4.5,
  large: 3,
  // WCAG "large scale": at least 18 point, or 14 point bold. 1pt = 4/3 px.
  largePx: 24,
  largeBoldPx: 18.66,
  boldWeight: 700,
} as const

export const isLarge = (fontSizePx: number, fontWeight: number) =>
  fontSizePx >= RULE.largePx || (fontSizePx >= RULE.largeBoldPx && fontWeight >= RULE.boldWeight)

export interface Verdict {
  outcome: "passed" | "failed" | "cantTell"
  ratio: number // the worst pair, rounded DOWN to two decimals (4.499 shows as 4.49, never 4.50)
  threshold: number
  large: boolean
  fg: string // the text color as drawn, after compositing over the backdrop
  bg: string
  pairs: number // how many text-color × backdrop pairs were measured
  why?: string // cantTell: what a person has to look at
}

// The text may be drawn in several colors (a gradient clipped to the text,
// a shimmer) over several possible backdrops (gradient stops, a pseudo
// element that may or may not sit under it). Every pair is measured; the
// worst one decides — the moment the text is hardest to read.
export function fromColors(textColors: Rgba[], backdrops: Rgb[], fontSizePx: number, fontWeight: number): Verdict {
  const large = isLarge(fontSizePx, fontWeight)
  const threshold = large ? RULE.large : RULE.normal
  let worst: { exact: number; fg: Rgb; bg: Rgb } | null = null
  for (const t of textColors) {
    for (const bg of backdrops) {
      const fg = flatten(t, bg)
      const exact = contrastRatio(fg, bg)
      if (!worst || exact < worst.exact) worst = { exact, fg, bg }
    }
  }
  if (!worst) return { outcome: "cantTell", ratio: 0, threshold, large, fg: "", bg: "", pairs: 0, why: "no text color or no backdrop could be read" }
  const fg = toHex(worst.fg)
  const bg = toHex(worst.bg)
  const base = { ratio: Math.floor(worst.exact * 100) / 100, threshold, large, fg, bg, pairs: textColors.length * backdrops.length }
  // Text in the very color of its background is not low contrast, it is not
  // visible at all: hidden on purpose (a real input under OTP slots) or a
  // defect. The number cannot tell which; a person can.
  if (fg === bg) return { ...base, outcome: "cantTell", why: `the text is drawn in the color of its background (${fg}): hidden on purpose, or invisible` }
  return { ...base, outcome: worst.exact >= threshold ? "passed" : "failed" }
}

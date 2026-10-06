// Executor "Storybook / axe" for rule 1.4.11-border-contrast: the same rule
// packaged as an axe custom rule. Plugged into axe through `axe.configure`, so the finding shows
// up wherever axe's own findings show up: the Accessibility tab in Storybook,
// the Vitest a11y report, Playwright's axe output. Same rule code as the hook;
// here the colors come from computed styles, so themes, opacity and nesting
// are already applied by the browser.

import { flatten, parseColor, type Rgb } from "../wcag/contrast-ratio.ts"
import { RULE, fromColors } from "../rules/1.4.11-border-contrast.ts"
import { textContrastAxeConfig } from "./storybook-text-contrast.ts"

const TEXT_INPUT_TYPES = new Set([
  "text", "email", "password", "search", "tel", "url", "number", "date",
  "datetime-local", "month", "week", "time", "",
])

// Applicability, as written in rules/own/1.4.11-border-contrast.md.
export const BORDER_CONTRAST_SELECTOR = [
  "input", "textarea", "select",
  '[data-slot="input"]', '[data-slot="textarea"]', '[data-slot="select-trigger"]', '[data-slot="native-select"]',
].join(",")

function applies(el: Element): boolean {
  if (el instanceof HTMLInputElement && !TEXT_INPUT_TYPES.has(el.type)) return false
  if ((el as HTMLInputElement).disabled || el.getAttribute("aria-disabled") === "true") return false
  const cs = getComputedStyle(el)
  if (cs.borderTopStyle === "none" || parseFloat(cs.borderTopWidth) === 0) return false
  if (cs.visibility === "hidden" || cs.display === "none") return false
  return true
}

// First non-transparent background walking up from the element's parent.
function backdropOf(el: Element): Rgb {
  let node: Element | null = el.parentElement
  while (node) {
    const c = parseColor(getComputedStyle(node).backgroundColor)
    if (c && c[3] > 0) return flatten(c, [1, 1, 1])
    node = node.parentElement
  }
  return [1, 1, 1]
}

// The check: axe calls `evaluate` with `this` bound to its check context;
// `this.data(...)` attaches the evidence to the result.
function evaluate(this: { data: (d: unknown) => void }, node: Element): boolean | undefined {
  if (!applies(node)) return true
  const cs = getComputedStyle(node)
  const borderRaw = cs.borderTopColor
  const border = parseColor(borderRaw)
  if (!border) return undefined // cantTell
  const backdrop = backdropOf(node)
  // The element's own fill, if any, sits inside the border; the border is
  // measured against what is OUTSIDE it, i.e. the backdrop.
  const v = fromColors([border[0], border[1], border[2]], border[3], backdrop)
  this.data({ rule: RULE.id, version: RULE.version, ratio: v.ratio, threshold: RULE.threshold, border: v.border, backdrop: v.backdrop, borderRaw })
  return v.outcome === "passed"
}

// What `axe.configure` wants. Spread into `parameters.a11y.config` in
// Storybook, or pass to `axe.configure()` directly.
export const borderContrastAxeConfig = {
  checks: [
    {
      id: "border-contrast-ratio",
      evaluate,
      metadata: {
        impact: "serious",
        messages: {
          pass: "Border has sufficient contrast against its surroundings",
          // axe fills `${data.x}` itself; a function here is not called
          fail: "Border ${data.border} on ${data.backdrop} has contrast ${data.ratio}:1, needs ${data.threshold}:1 (rule ${data.rule} v${data.version}, WCAG 1.4.11)",
          incomplete: "Could not resolve the border color",
        },
      },
    },
  ],
  rules: [
    {
      id: RULE.id,
      selector: BORDER_CONTRAST_SELECTOR,
      any: ["border-contrast-ratio"],
      tags: ["wcag2aa", "wcag1411", "shadcn-wcag-compliance"],
      metadata: {
        description: "Ensures form control borders have at least 3:1 contrast against adjacent colors",
        help: "Form control border must have 3:1 contrast (WCAG 1.4.11)",
        helpUrl: "https://github.com/balaka/shadcn-wcag-compliance/blob/main/rules/own/1.4.11-border-contrast.md",
      },
    },
  ],
}

// All our rules, for `parameters.a11y.config`: 1.4.11-border-contrast and
// 1.4.3-text-contrast (where axe's color-contrast cannot tell).
export const ourAxeConfig = {
  checks: [...borderContrastAxeConfig.checks, ...textContrastAxeConfig.checks],
  rules: [...borderContrastAxeConfig.rules, ...textContrastAxeConfig.rules],
}

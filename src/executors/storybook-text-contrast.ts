// Executor "Storybook / axe" for rule 1.4.3-text-contrast: our code where axe
// gives up. axe's own `color-contrast` measures most text; where it answers
// "incomplete" (it cannot find the background, the text is a single
// character, a gradient paints the text, the text is SVG, something lies on
// top), this rule measures instead, so the report gets a number instead of
// "cannot tell".
//
// Which elements are ours is decided by axe itself: `matches` asks axe's own
// color functions (window.axe.commons.color, the same instance that runs the
// check) whether they can settle the element. If they can, the element stays
// axe's and this rule does not apply — no element is judged twice.

import { parseColor, type Rgb, type Rgba } from "../wcag/contrast-ratio.ts"
import { RULE, fromColors } from "../rules/1.4.3-text-contrast.ts"

type AxeColor = { red: number; green: number; blue: number; alpha: number }
type AxeCommons = {
  color: {
    getBackgroundColor(el: Element, bgElms?: Element[]): AxeColor | null
    getForegroundColor(el: Element, noScroll?: boolean, bg?: AxeColor | null): AxeColor | null
    getContrast(bg: AxeColor, fg: AxeColor): number
  }
}
const axeCommons = (): AxeCommons | undefined => (globalThis as { axe?: { commons?: AxeCommons } }).axe?.commons

// ---- reading colors ---------------------------------------------------------

// Any CSS color the browser understands → [r, g, b, a] 0..1. A 1×1 canvas
// resolves oklch(), color(), named colors… exactly as the page draws them.
let ctx: CanvasRenderingContext2D | null = null
function rgba(css: string | null | undefined): Rgba | null {
  if (!css || css === "none") return null
  const quick = parseColor(css)
  if (quick) return quick
  ctx ??= document.createElement("canvas").getContext("2d", { willReadFrequently: true })
  if (!ctx) return null
  ctx.clearRect(0, 0, 1, 1)
  ctx.fillStyle = "rgba(0, 0, 0, 0)"
  ctx.fillStyle = css
  ctx.fillRect(0, 0, 1, 1)
  const d = ctx.getImageData(0, 0, 1, 1).data
  return [d[0] / 255, d[1] / 255, d[2] / 255, d[3] / 255]
}

const COLOR_IN = /(?:oklch|oklab|lch|lab|rgba?|hsla?|hwb|color)\((?:[^()]|\([^()]*\))*\)|#[0-9a-fA-F]{3,8}\b|\btransparent\b/g
const gradientStops = (backgroundImage: string): Rgba[] => (backgroundImage.match(COLOR_IN) ?? []).map(rgba).filter((c): c is Rgba => !!c)

const over = (top: Rgba, below: Rgba): Rgba => {
  const a = top[3]
  return [top[0] * a + below[0] * (1 - a), top[1] * a + below[1] * (1 - a), top[2] * a + below[2] * (1 - a), 1]
}

const clipsToText = (s: CSSStyleDeclaration) => s.backgroundClip === "text" || (s as CSSStyleDeclaration & { webkitBackgroundClip?: string }).webkitBackgroundClip === "text"

// ---- applicability ----------------------------------------------------------

// Inputs that show their value as text (a radio's or checkbox's value is
// never drawn).
const TEXT_INPUTS = new Set(["text", "email", "password", "search", "tel", "url", "number", "date", "datetime-local", "month", "week", "time", ""])

function ownText(el: Element): string {
  // a text field's text is its value (what axe's color-contrast reads there too)
  if (el instanceof HTMLTextAreaElement) return el.value.replace(/\s+/g, " ").trim()
  if (el instanceof HTMLInputElement) return TEXT_INPUTS.has(el.type) ? el.value.replace(/\s+/g, " ").trim() : ""
  let t = ""
  for (const n of el.childNodes) if (n.nodeType === Node.TEXT_NODE) t += n.textContent ?? ""
  return t.replace(/\s+/g, " ").trim()
}

// Text whose characters are drawn somewhere else, by design: input-otp's
// real input is transparent (text in the background's color) and the
// digits are rendered in the slots next to it, which are checked in their
// own right. WCAG 1.4.3 "Incidental": text not visible to anyone.
const DRAWN_ELSEWHERE: Array<[string, string]> = [
  ["input[data-input-otp]", "input-otp draws the characters in its slots; this real input is transparent by design (the slots are checked themselves)"],
]
const drawnElsewhere = (el: Element) => DRAWN_ELSEWHERE.find(([sel]) => el.matches(sel))?.[1]

// A ::before / ::after with a background that is big enough to lie under
// text — more than a quarter of its element's area, the threshold axe uses
// (`pseudoSizeThreshold`). Smaller ones are indicators (a 2px underline
// under an active tab) and never carry the text. Returns the pseudo's color
// and whether it covers the given point, when its box can be read.
type Pseudo = { color: Rgba; covers: boolean | null; where: string }
function bigPseudos(n: Element, at: { x: number; y: number } | null): Pseudo[] {
  const out: Pseudo[] = []
  const host = n.getBoundingClientRect()
  const hostArea = host.width * host.height
  for (const p of ["::before", "::after"] as const) {
    const ps = getComputedStyle(n, p)
    const c = rgba(ps.backgroundColor)
    if (ps.content === "none" || !c || c[3] === 0) continue
    const px = (v: string) => (v.endsWith("px") ? parseFloat(v) : NaN)
    const w = px(ps.width), h = px(ps.height)
    const width = isNaN(w) ? host.width : w
    const height = isNaN(h) ? host.height : h
    if (hostArea > 0 && (width * height) / hostArea <= 0.25) continue
    let covers: boolean | null = null
    if (at && (ps.position === "absolute" || ps.position === "fixed")) {
      const left = px(ps.left), top = px(ps.top), right = px(ps.right), bottom = px(ps.bottom)
      const L = !isNaN(left) ? host.left + left : !isNaN(right) ? host.right - right - width : NaN
      const T = !isNaN(top) ? host.top + top : !isNaN(bottom) ? host.bottom - bottom - height : NaN
      if (!isNaN(L) && !isNaN(T)) covers = at.x >= L && at.x <= L + width && at.y >= T && at.y <= T + height
    }
    out.push({ color: c, covers, where: `${p} of ${n.tagName.toLowerCase()}` })
  }
  return out
}

// axe answers "incomplete" (pseudoContent) when, on the text element or ANY
// ancestor, ::before + ::after with a background cover more than a quarter
// of the TEXT element's area — even where its background functions find a
// color. Mirrored here, so those elements are ours.
function pseudoUnder(el: Element): boolean {
  const r = el.getBoundingClientRect()
  const minimum = r.width * r.height * 0.25
  for (let n: Element | null = el; n; n = n.parentElement) {
    const host = n.getBoundingClientRect()
    let area = 0
    for (const p of ["::before", "::after"] as const) {
      const ps = getComputedStyle(n, p)
      const c = rgba(ps.backgroundColor)
      if (ps.content === "none" || !c || c[3] === 0) continue
      const w = ps.width.endsWith("px") ? parseFloat(ps.width) : host.width
      const h = ps.height.endsWith("px") ? parseFloat(ps.height) : host.height
      area += w * h
    }
    if (area > minimum) return true
  }
  return false
}

function visible(el: Element): boolean {
  const s = getComputedStyle(el)
  if (s.display === "none" || s.visibility === "hidden" || s.visibility === "collapse") return false
  const r = el.getBoundingClientRect()
  if (!(r.width > 0 && r.height > 0)) return false
  for (let n: Element | null = el; n; n = n.parentElement) if (parseFloat(getComputedStyle(n).opacity || "1") === 0) return false
  return true
}

// WCAG's "incidental": text of an inactive user interface component.
function inactive(el: Element): boolean {
  return !!el.closest("[disabled], [aria-disabled='true'], [data-disabled]")
}

const NON_BMP_ONLY = /^[\s\p{P}\p{S}\u{10000}-\u{10FFFF}]+$/u

// True where axe's color-contrast would answer "incomplete" for this text.
function axeCannotSettle(el: Element, text: string): boolean {
  const commons = axeCommons()
  if (!commons) return false // no axe here: nothing to complement
  if (text.length <= 1 || NON_BMP_ONLY.test(text)) return true // shortTextContent, nonBmp
  if (drawnElsewhere(el)) return true
  if (pseudoUnder(el)) return true // pseudoContent
  try {
    const bg = commons.color.getBackgroundColor(el, [])
    if (!bg) return true // overlap, gradient, image, pseudo element…
    const fg = commons.color.getForegroundColor(el, false, bg)
    if (!fg) return true
    if (commons.color.getContrast(bg, fg) === 1) return true // equalRatio
    return false
  } catch {
    return true
  }
}

export function textContrastApplies(el: Element): boolean {
  if (drawnElsewhere(el)) return true // recorded as not applicable, with the reason
  const text = ownText(el)
  if (!text) return false
  if (el.closest("script, style, noscript, template, [hidden]")) return false
  if (!visible(el) || inactive(el)) return false
  return axeCannotSettle(el, text)
}

// ---- measuring ----------------------------------------------------------------

interface Measured { textColors: Rgba[]; backdrops: Rgb[]; method: string[] }
type Covered = { covered: string }

function measure(el: Element): Measured | Covered {
  const cs = getComputedStyle(el)
  const isSvg = el instanceof SVGElement
  const method: string[] = []

  // the text's own color: SVG text is drawn with `fill`; a gradient clipped
  // to the text (a shimmer) paints it in every one of its stops
  let textColors: Rgba[]
  if (!isSvg && clipsToText(cs) && cs.backgroundImage !== "none") {
    textColors = gradientStops(cs.backgroundImage)
    method.push(`text painted by a gradient (${textColors.length} stops)`)
  } else {
    const fill = (cs as CSSStyleDeclaration & { webkitTextFillColor?: string }).webkitTextFillColor
    const raw = isSvg ? cs.fill : fill && (rgba(fill)?.[3] ?? 0) > 0 ? fill : cs.color
    const c = rgba(raw)
    textColors = c ? [c] : []
    if (isSvg) method.push("SVG text, measured by its fill")
  }
  let opacity = 1
  for (let n: Element | null = el; n; n = n.parentElement) opacity *= parseFloat(getComputedStyle(n).opacity || "1")
  textColors = textColors.map((c) => [c[0], c[1], c[2], c[3] * opacity] as Rgba)

  // what lies on top of the text, at its center
  const r = el.getBoundingClientRect()
  const stack = document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2)
  const at = stack.indexOf(el)
  const above = (at < 0 ? [] : stack.slice(0, at)).filter((n) => !el.contains(n) && !n.contains(el))
  for (const a of above) {
    const c = rgba(getComputedStyle(a).backgroundColor)
    if ((c && c[3] === 1) || /^(IMG|VIDEO|CANVAS|SVG)$/i.test(a.tagName)) {
      return { covered: `${a.tagName.toLowerCase()}${a.getAttribute("data-slot") ? `[data-slot="${a.getAttribute("data-slot")}"]` : ""}` }
    }
  }

  // layers under the text, from the element up to the first opaque one
  type Layer = { any: Rgba[] } | { maybe: Rgba[] }
  const layers: Layer[] = []
  let opaque = false
  const start = isSvg ? ((el as SVGElement).ownerSVGElement?.parentElement ?? el.parentElement) : el
  const center = { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  for (let n: Element | null = start; n && !opaque; n = n.parentElement) {
    const s = getComputedStyle(n)
    for (const p of bigPseudos(n, center)) {
      if (p.covers === false) continue // its box does not reach the text
      if (p.covers) {
        layers.push({ any: [p.color] })
        method.push(`the ${p.where} lies under the text`)
      } else {
        layers.push({ maybe: [p.color] }) // its box cannot be read: measured both ways
        method.push(`the ${p.where} may lie under the text`)
      }
    }
    const paintsText = n === el && clipsToText(s)
    if (!paintsText && s.backgroundImage !== "none") {
      if (/url\(/.test(s.backgroundImage)) return { covered: "a background image (a picture is not a color)" }
      const st = gradientStops(s.backgroundImage)
      if (st.length) {
        layers.push({ any: st })
        method.push(`a gradient under the text (${st.length} stops)`)
      }
    }
    const c = rgba(s.backgroundColor)
    if (c && c[3] > 0) {
      layers.push({ any: [c] })
      if (c[3] === 1) opaque = true
    }
  }
  for (const a of above) {
    const c = rgba(getComputedStyle(a).backgroundColor)
    if (c && c[3] > 0) {
      layers.unshift({ any: [c] })
      method.push(`a translucent ${a.tagName.toLowerCase()} lies on top`)
    }
  }

  // composite bottom-up into every backdrop the text may sit on; white when
  // nothing below is opaque (WCAG, note to "contrast ratio")
  let backdrops: Rgba[] = [[1, 1, 1, 1]]
  for (const L of [...layers].reverse()) {
    const next: Rgba[] = []
    const options = "any" in L ? L.any : L.maybe
    for (const b of backdrops) {
      for (const o of options) next.push(over(o, b))
      if ("maybe" in L) next.push(b)
    }
    backdrops = next.slice(0, 64)
  }
  return { textColors, backdrops: backdrops.map((b) => [b[0], b[1], b[2]] as Rgb), method }
}

// ---- the axe check ------------------------------------------------------------------

// `summary` is the sentence the Accessibility tab and the report show; the
// other fields are the evidence, recorded as measured.
function evaluate(this: { data: (d: unknown) => void }, node: Element): boolean | undefined {
  const tag = `rule ${RULE.id} v${RULE.version}`
  const elsewhere = drawnElsewhere(node)
  if (elsewhere) {
    // not a pass on contrast: the rule does not apply (run.ts records it as inapplicable)
    this.data({ rule: RULE.id, version: RULE.version, inapplicable: elsewhere, summary: `Not checked: ${elsewhere} (${tag}, WCAG 1.4.3 Incidental)` })
    return true
  }
  const m = measure(node)
  const cs = getComputedStyle(node)
  const px = parseFloat(cs.fontSize)
  const weight = parseInt(cs.fontWeight, 10) || 400
  if ("covered" in m) {
    const why = `the text is covered by ${m.covered}: is it visible to anyone?`
    this.data({ rule: RULE.id, version: RULE.version, why, summary: `A person has to look: ${why} (${tag})` })
    return undefined
  }
  const v = fromColors(m.textColors, m.backdrops, px, weight)
  const how = m.method.join("; ") || "colors from the computed styles"
  const summary =
    v.outcome === "cantTell"
      ? `A person has to look: ${v.why} (${tag})`
      : `Text ${v.fg} on ${v.bg} has contrast ${v.ratio}:1, ${v.outcome === "passed" ? "at least" : "needs"} ${v.threshold}:1 (${tag}, WCAG 1.4.3; ${how})`
  this.data({ rule: RULE.id, version: RULE.version, ratio: v.ratio, threshold: v.threshold, fg: v.fg, bg: v.bg, large: v.large, pairs: v.pairs, how, why: v.why, summary })
  return v.outcome === "cantTell" ? undefined : v.outcome === "passed"
}

export const textContrastAxeConfig = {
  checks: [
    {
      id: "text-contrast-ratio",
      evaluate,
      metadata: {
        impact: "serious",
        messages: {
          // axe fills `${data.x}` itself; evaluate prepares the sentence
          pass: "${data.summary}",
          fail: "${data.summary}",
          incomplete: "${data.summary}",
        },
      },
    },
  ],
  rules: [
    {
      id: RULE.id,
      selector: "*",
      matches: (node: Element) => textContrastApplies(node),
      any: ["text-contrast-ratio"],
      tags: ["wcag2aa", "wcag143", "shadcn-wcag-compliance"],
      metadata: {
        description: "Measures text contrast where axe's color-contrast cannot tell",
        help: "Text must have 4.5:1 contrast, 3:1 when large (WCAG 1.4.3)",
        helpUrl: "https://github.com/balaka/shadcn-wcag-compliance/blob/main/rules/own/1.4.3-text-contrast.md",
      },
    },
  ],
}

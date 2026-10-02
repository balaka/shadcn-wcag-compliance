// WCAG 2.x contrast math. Pure functions, no DOM: shared by the browser
// executor (axe custom rule in Storybook) and the Node executor (token
// check in the hook). Runs on Node 22.6+ without a build step.

export type Rgb = [number, number, number] // sRGB, gamma-encoded, 0..1
export type Rgba = [number, number, number, number]

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

// oklch -> gamma-encoded sRGB (what the browser paints). Out-of-gamut values
// are clipped per channel, which is what Chrome does for `oklch()` today.
export function oklchToRgb(L: number, C: number, h: number): Rgb {
  const hr = (h * Math.PI) / 180
  const a = C * Math.cos(hr)
  const b = C * Math.sin(hr)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b
  const l = l_ ** 3
  const m = m_ ** 3
  const s = s_ ** 3
  const lin: Rgb = [
    clamp01(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    clamp01(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    clamp01(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ]
  return lin.map(encode) as Rgb
}

const encode = (v: number) =>
  v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055
const decode = (v: number) =>
  v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4

// Alpha compositing in gamma space — matches how browsers blend.
export function over(fg: Rgb, alpha: number, bg: Rgb): Rgb {
  return fg.map((v, i) => v * alpha + bg[i] * (1 - alpha)) as Rgb
}

export function luminance([r, g, b]: Rgb): number {
  return 0.2126 * decode(r) + 0.7152 * decode(g) + 0.0722 * decode(b)
}

export function contrastRatio(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

export function toHex(c: Rgb): string {
  return "#" + c.map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("")
}

// Parses the color syntaxes shadcn themes actually use:
//   oklch(L C h), oklch(L C h / 15%), #rgb/#rrggbb/#rrggbbaa,
//   rgb(a)(r, g, b[, a]) and rgb(r g b / a) as computed styles return them.
export function parseColor(input: string): Rgba | null {
  const s = input.trim().toLowerCase()
  let m: RegExpMatchArray | null

  if ((m = s.match(/^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/))) {
    const L = pct(m[1])
    const [r, g, b] = oklchToRgb(L, Number(m[2]), Number(m[3]))
    return [r, g, b, m[4] ? pct(m[4]) : 1]
  }
  if ((m = s.match(/^#([0-9a-f]{3,8})$/))) {
    let h = m[1]
    if (h.length === 3 || h.length === 4) h = h.split("").map((c) => c + c).join("")
    const n = (i: number) => parseInt(h.slice(i, i + 2), 16) / 255
    return [n(0), n(2), n(4), h.length === 8 ? n(6) : 1]
  }
  if ((m = s.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)$/))) {
    return [Number(m[1]) / 255, Number(m[2]) / 255, Number(m[3]) / 255, m[4] ? pct(m[4]) : 1]
  }
  if (s === "transparent") return [0, 0, 0, 0]
  if (s === "white") return [1, 1, 1, 1]
  if (s === "black") return [0, 0, 0, 1]
  return null
}

const pct = (v: string) => (v.endsWith("%") ? Number(v.slice(0, -1)) / 100 : Number(v))

// Resolves a possibly translucent color against an opaque backdrop.
export function flatten([r, g, b, a]: Rgba, backdrop: Rgb): Rgb {
  return a >= 1 ? [r, g, b] : over([r, g, b], a, backdrop)
}

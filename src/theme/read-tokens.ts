// Service: reads a design-system theme file (shadcn index.css, Jesse's
// globals.css, …) and returns its tokens per theme, every value resolved to
// a final color where it is one. Knows nothing about rules or thresholds.
//
//   readTokens(css) → {
//     light: { "--input": { raw: "oklch(0.922 0 0)", color: [r,g,b], alpha: 1 }, … },
//     dark:  { … },
//   }
//
// This is the same object Jesse's design system commits to
// registry/token-values.snapshot.json — here it lives in memory for the
// length of one check.

import { parseColor, type Rgba } from "../wcag/contrast-ratio.ts"

export interface Token {
  raw: string // the text as written, after following var() references
  color?: [number, number, number] // sRGB 0..1 — present when `raw` is a color we can read
  alpha?: number // 0..1; a translucent token has no final hex on its own
  unresolved?: string // why there is no color: an unknown function, a dangling var()
}

export type Theme = Record<string, Token>
export type Tokens = Record<string, Theme>

// Theme blocks we recognise. The shadcn convention is `:root` for light and
// `.dark` for dark; product profiles like Jesse's `[data-profile="cpanel"]`
// can be added here.
const THEME_SELECTORS: Array<{ name: string; selector: RegExp }> = [
  { name: "light", selector: /(^|[\s,}])(:root)\s*\{/g },
  { name: "dark", selector: /(^|[\s,}])(\.dark)\s*\{/g },
]

export function readTokens(css: string): Tokens {
  const out: Tokens = {}
  for (const { name, selector } of THEME_SELECTORS) {
    // a theme may be declared in several blocks; later declarations win, as in CSS
    const vars = new Map<string, string>()
    for (const m of css.matchAll(selector)) {
      const start = css.indexOf("{", m.index!) + 1
      const end = css.indexOf("}", start)
      for (const decl of css.slice(start, end).split(";")) {
        const kv = decl.match(/--([\w-]+)\s*:\s*([^;]+)/)
        if (kv) vars.set("--" + kv[1], kv[2].trim())
      }
    }
    if (vars.size === 0) continue
    // light-theme tokens are the base the dark theme overrides, as in CSS
    const base = name === "light" ? new Map<string, string>() : new Map(Object.entries(out.light ?? {}).map(([k, v]) => [k, v.raw]))
    const theme: Theme = {}
    for (const key of vars.keys()) theme[key] = resolve(key, vars, base)
    out[name] = theme
  }
  return out
}

// Follows var(--a) → var(--b) → … until a value that is not a reference.
function resolve(key: string, vars: Map<string, string>, fallback: Map<string, string>): Token {
  const seen = new Set<string>()
  let raw = vars.get(key) ?? fallback.get(key)
  while (raw) {
    const ref = raw.match(/^var\(\s*(--[\w-]+)\s*(?:,\s*([^)]+))?\)$/)
    if (!ref) break
    if (seen.has(ref[1])) return { raw, unresolved: `circular var(): ${[...seen].join(" → ")}` }
    seen.add(ref[1])
    raw = vars.get(ref[1]) ?? fallback.get(ref[1]) ?? ref[2]
  }
  if (!raw) return { raw: "", unresolved: `var() points at a token that does not exist` }
  const c: Rgba | null = parseColor(raw)
  if (!c) return { raw, unresolved: looksLikeColor(raw) ? `color syntax not supported: ${raw.split("(")[0]}()` : "not a color" }
  return { raw, color: [c[0], c[1], c[2]], alpha: c[3] }
}

const looksLikeColor = (v: string) => /^(oklch|oklab|hsl|hsla|rgb|rgba|lab|lch|color|color-mix|light-dark)\(/i.test(v) || /^#/.test(v)

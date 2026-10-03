// rules/own/*.md and src/rules/*.ts: a change to what the rule checks
// (Applicability, Expectation, the RULE constants) needs a new version.
// Wording elsewhere in the file may change freely.
import { GUARDED } from "../paths.ts"
import { allow, refuse, type Guard } from "../types.ts"

export const rule: Guard = {
  name: "rule",
  matches: (rel) => GUARDED.ruleText.test(rel) || GUARDED.ruleCode.test(rel),
  check(ctx) {
    if (!ctx.before) return allow("passed", [], [], "new rule")
    const isText = GUARDED.ruleText.test(ctx.rel)
    const sig = isText ? textSignature : codeSignature
    const ver = isText ? textVersion : codeVersion
    if (sig(ctx.before) !== sig(ctx.after) && ver(ctx.before) === ver(ctx.after)) {
      return refuse([
        `${ctx.rel}: what the rule checks changed, but version stayed ${ver(ctx.after) ?? "unset"}.`,
        "Bump version in both rules/own/<id>.md and src/rules/<id>.ts; precedents on the old version go to needs-review.",
      ])
    }
    return allow()
  },
}

const textVersion = (s: string) => s.match(/^version:\s*(\S+)/m)?.[1]
const codeVersion = (s: string) => s.match(/version:\s*"([^"]+)"/)?.[1]

function textSignature(md: string): string {
  const pick = (h: string) => {
    const m = md.match(new RegExp(`^## ${h}\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`, "m"))
    return (m?.[1] ?? "").replace(/\s+/g, " ").trim()
  }
  return pick("Applicability") + "|" + pick("Expectation")
}
function codeSignature(ts: string): string {
  const m = ts.match(/export const RULE = \{([\s\S]*?)\} as const/)
  return (m?.[1] ?? "").replace(/version:\s*"[^"]*",?/, "").replace(/\s+/g, " ")
}

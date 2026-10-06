// rules/own/*.md and src/rules/*.ts: a change to what the rule checks
// (Applicability, Expectation, the RULE constants) needs a new version.
// Wording elsewhere in the file may change freely.
//
// A new version lets the write through and says what it costs: every
// decision approved for the old version stops counting (the register shows
// it as needs-review) until a person re-approves it for the new one.
import { basename } from "node:path"
import { loadDecisions } from "../../decisions/load.ts"
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
    const was = ver(ctx.before)
    const now = ver(ctx.after)
    if (sig(ctx.before) !== sig(ctx.after) && was === now) {
      return refuse([
        `${ctx.rel}: what the rule checks changed, but version stayed ${now ?? "unset"}.`,
        "Bump version in both rules/own/<id>.md and src/rules/<id>.ts; decisions on the old version then show needs-review until a person re-approves them.",
      ])
    }
    if (was !== now) {
      const id = basename(ctx.rel).replace(/\.(md|ts)$/, "")
      const stale = loadDecisions().filter((d) => d.rule === id && d.rule_version === was && d.history.some((h) => h.action === "approved") && d.status !== "revoked")
      const lines = stale.length
        ? [
            `${id} v${was} → v${now}: ${stale.length} decision(s) approved for v${was} stop counting and show needs-review:`,
            ...stale.map((d) => `• ${d.id} (${d.scope}, ${d.verdict}) — ${d.file}`),
            `A person looks at each again and, if it still holds: node src/decisions/approve.ts <id> --rule-version ${now} --by "<name>"`,
          ]
        : []
      return allow("passed", lines, [], `version ${was} → ${now}`)
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

// decisions/*.md: a tool may only draft. A write must parse as format 3,
// history is append-only, `approved` / `revoked` are a person's entries, a
// decision on a rule that is not ours needs `match`, an exception needs
// `valid_until`, and the scope must name its subject.
//
// Once a person approved a decision, what they approved is frozen for a
// chat: kind, rule, version, scope, subject, match, verdict, evidence,
// reason, valid_until. A chat that thinks it is wrong appends
// `needs-review` in the same write — the decision stops counting until a
// person looks again. (Renaming an id is allowed when `formerly` keeps the
// old one; the prose below the front matter is free.)
import { existsSync } from "node:fs"
import { join } from "node:path"
import { DECISION_FORMAT, parseDecision, type Decision } from "../../decisions/registry.ts"
import { GUARDED } from "../paths.ts"
import { allow, refuse, type Guard } from "../types.ts"

const CHAT_MAY_WRITE = new Set(["drafted", "needs-review"])
const FROZEN: (keyof Decision)[] = ["kind", "rule", "rule_version", "criterion", "scope", "subject", "match", "verdict", "evidence", "reason", "valid_until"]

export const decision: Guard = {
  name: "decision",
  matches: (rel) => GUARDED.decision.test(rel),
  check(ctx) {
    const next = parseDecision(ctx.after, ctx.rel)
    if (!next || next.format !== DECISION_FORMAT) {
      return refuse([
        `${ctx.rel} does not parse as a decision (format ${DECISION_FORMAT}).`,
        "See decisions/README.md: front matter with format, id, kind, rule, rule_version, scope, subject, verdict, evidence, reason, history.",
      ])
    }
    const prev = ctx.before ? parseDecision(ctx.before, ctx.rel) : null
    const prevN = prev?.history.length ?? 0
    if (prev && JSON.stringify(prev.history) !== JSON.stringify(next.history.slice(0, prevN))) {
      return refuse([`history in ${ctx.rel} is append-only — an existing entry was changed or removed.`])
    }
    const added = next.history.slice(prevN)
    const human = added.find((h) => !CHAT_MAY_WRITE.has(h.action))
    if (human) {
      return refuse([
        `a chat may only draft a decision — the entry "${human.action}" in ${ctx.rel} must be written by a person.`,
        `Ask the person to run: node src/decisions/approve.ts ${next.id} --by "<their name>"  (or to edit the file themselves).`,
      ])
    }
    if (prev && prev.id !== next.id && next.formerly !== prev.id) {
      return refuse([`${ctx.rel}: the id changed from ${prev.id} to ${next.id} — keep the old one as formerly: ${prev.id}, so earlier runs still point at this decision.`])
    }
    const approvedBefore = prev?.history.some((h) => h.action === "approved")
    const sentBack = added.some((h) => h.action === "needs-review")
    if (prev && approvedBefore && !sentBack) {
      const changed = FROZEN.filter((k) => JSON.stringify(prev[k] ?? null) !== JSON.stringify(next[k] ?? null))
      if (changed.length) {
        return refuse([
          `${ctx.rel} was approved by a person; a chat does not change what they approved (${changed.join(", ")}).`,
          "If it is wrong, append `- { at: …, action: needs-review, by: \"<you>\", why: \"…\" }` in the same write: the decision stops counting until a person looks again.",
        ])
      }
    }
    const problems: string[] = []
    if (next.kind === "exception" && !next.valid_until) problems.push("an exception needs valid_until")
    if (!next.evidence.length) problems.push("evidence is empty")
    if (!next.reason) problems.push("reason is empty")
    if (!isOurRule(ctx.root, next.rule) && !next.match) problems.push(`a decision on a rule that is not ours (${next.rule}) needs match: { check, selector } — which check inside the rule, on which element`)
    if (next.scope === "tokens" && !next.subject.tokens?.length) problems.push("scope tokens needs subject.tokens")
    if (next.scope === "component" && !next.subject.component) problems.push("scope component needs subject.component")
    if (next.scope === "story" && !next.subject.story) problems.push("scope story needs subject.story")
    if (problems.length) return refuse([`${ctx.rel} is incomplete:`, ...problems.map((p) => "• " + p)])
    return allow("passed", [], [], added.map((h) => h.action).join(",") || "edited")
  },
}

const isOurRule = (root: string, id: string) => existsSync(join(root, "rules", "own", `${id}.md`))

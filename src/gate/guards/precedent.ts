// precedents/*.md: a tool may only draft. The file must parse as format 2,
// history is append-only, `approved` / `revoked` are a person's entries, a
// precedent on a rule that is not ours needs `match`, an exception needs
// `valid_until`, and the scope must name its subject.
import { existsSync } from "node:fs"
import { join } from "node:path"
import { parsePrecedent } from "../../precedents/registry.ts"
import { GUARDED } from "../paths.ts"
import { allow, refuse, type Guard } from "../types.ts"

const CHAT_MAY_WRITE = new Set(["drafted", "needs-review"])

export const precedent: Guard = {
  name: "precedent",
  matches: (rel) => GUARDED.precedent.test(rel),
  check(ctx) {
    const next = parsePrecedent(ctx.after, ctx.rel)
    if (!next) {
      return refuse([
        `${ctx.rel} does not parse as a precedent (format 2).`,
        "See precedents/README.md: front matter with format, id, kind, rule, rule_version, scope, subject, decision, evidence, reason, history.",
      ])
    }
    const prev = ctx.before ? parsePrecedent(ctx.before, ctx.rel) : null
    const prevN = prev?.history.length ?? 0
    if (prev && JSON.stringify(prev.history) !== JSON.stringify(next.history.slice(0, prevN))) {
      return refuse([`history in ${ctx.rel} is append-only — an existing entry was changed or removed.`])
    }
    const added = next.history.slice(prevN)
    const human = added.find((h) => !CHAT_MAY_WRITE.has(h.action))
    if (human) {
      return refuse([
        `a chat may only draft a precedent — the entry "${human.action}" in ${ctx.rel} must be written by a person.`,
        `Ask the person to run: node src/precedents/approve.ts ${next.id} --by "<their name>"  (or to edit the file themselves).`,
      ])
    }
    const problems: string[] = []
    if (next.kind === "exception" && !next.valid_until) problems.push("an exception needs valid_until")
    if (!next.evidence.length) problems.push("evidence is empty")
    if (!next.reason) problems.push("reason is empty")
    if (!isOurRule(ctx.root, next.rule) && !next.match) problems.push(`a precedent on a rule that is not ours (${next.rule}) needs match: { check, selector } — which check inside the rule, on which element`)
    if (next.scope === "tokens" && !next.subject.tokens?.length) problems.push("scope tokens needs subject.tokens")
    if (next.scope === "component" && !next.subject.component) problems.push("scope component needs subject.component")
    if (next.scope === "story" && !next.subject.story) problems.push("scope story needs subject.story")
    if (problems.length) return refuse([`${ctx.rel} is incomplete:`, ...problems.map((p) => "• " + p)])
    return allow("passed", [], [], added.map((h) => h.action).join(",") || "edited")
  },
}

const isOurRule = (root: string, id: string) => existsSync(join(root, "rules", "own", `${id}.md`))

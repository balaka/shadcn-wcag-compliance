// Theme file (index.css / globals.css): rule 1.4.11-border-contrast must not
// start failing. A pair that already fails is noted, not blocked — the gate
// stops regressions, it does not hold the repository hostage to its history.
// An approved decision may accept a failing pair; the finding then stays in
// the record, marked.
import { loadDecisions } from "../../decisions/load.ts"
import { findDecision } from "../../decisions/registry.ts"
import { fromTokens, RULE } from "../../rules/1.4.11-border-contrast.ts"
import { readTokens } from "../../theme/read-tokens.ts"
import { GUARDED } from "../paths.ts"
import { allow, refuse, type Guard } from "../types.ts"

export const theme: Guard = {
  name: "theme",
  matches: (rel) => GUARDED.theme.test(rel),
  check(ctx) {
    const was = new Map(fromTokens(readTokens(ctx.before), ctx.rel).map((f) => [f.subject.theme, f]))
    const now = fromTokens(readTokens(ctx.after), ctx.rel)

    const decisions = loadDecisions()
    const accepted = new Set<string>()
    for (const f of now) {
      if (f.outcome !== "failed") continue
      const p = findDecision(f, [RULE.borderToken, RULE.backgroundToken], decisions)
      if (p) {
        accepted.add(f.subject.theme!)
        f.evidence += ` — accepted by ${p.id} (${p.scope}, until ${p.valid_until ?? "revoked"}, approved by ${p.history.find((h) => h.action === "approved")?.by ?? "?"})`
      }
    }
    const regressions = now.filter((f) => f.outcome === "failed" && !accepted.has(f.subject.theme!) && was.get(f.subject.theme)?.outcome !== "failed")
    const stillFailing = now.filter((f) => f.outcome === "failed" && !accepted.has(f.subject.theme!) && was.get(f.subject.theme)?.outcome === "failed")
    const unchecked = now.filter((f) => f.outcome === "cantTell")

    if (regressions.length) {
      return refuse(
        [
          `write to ${ctx.rel} refused — rule ${RULE.id} v${RULE.version} (WCAG ${RULE.criterion}) would start failing:`,
          ...regressions.map((f) => `✗ ${f.evidence}`),
          `Keep ${RULE.borderToken} at ${RULE.threshold}:1 or better against ${RULE.backgroundToken} in every theme, then write again.`,
        ],
        now
      )
    }
    const lines: string[] = []
    const say = (head: string, items: typeof now, mark: string, tail?: string) => lines.push(head, ...items.map((f) => `${mark} ${f.evidence}`), ...(tail ? [tail] : []))
    if (accepted.size) say(`${RULE.id} fails in ${ctx.rel}, accepted by a decision — the write goes through:`, now.filter((f) => accepted.has(f.subject.theme!)), "≈")
    if (unchecked.length) say(`could not check ${RULE.id} in ${ctx.rel} — the write goes through unchecked:`, unchecked, "?", "Storybook (Accessibility › Inconclusive) or a person has to look at this pair.")
    if (stillFailing.length) say(`note — ${RULE.id} already fails in ${ctx.rel} and this write does not fix it:`, stillFailing, "•")
    const decision = stillFailing.length ? "noted" : accepted.size ? "accepted" : unchecked.length ? "unchecked" : "passed"
    return allow(decision, lines, now)
  },
}

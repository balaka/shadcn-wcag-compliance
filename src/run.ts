// Step 5 + 6 of the pipeline: one run = one file.
// Gathers findings from every executor into the single Finding format,
// writes runs/<timestamp>.json (+ runs/latest.json), and prints what the
// run found, rule by rule. Whether a rule itself is right is not decided
// here: that is its golden set (the Passed / Failed / Inapplicable examples
// in its rule file). A story is the design system as its users see it.
//
// Usage: node src/run.ts [example/reports/vitest.json] [example/src/index.css]

import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { readTokens } from "./theme/read-tokens.ts"
import { fromTokens, RULE } from "./rules/1.4.11-border-contrast.ts"
import { findDecision } from "./decisions/registry.ts"
import { loadDecisions, reviewContext } from "./decisions/load.ts"
import { FINDING_FORMAT, type Finding, type Outcome } from "./finding.ts"

const [vitestPath = "example/reports/vitest.json", cssPath = "example/src/index.css"] = process.argv.slice(2)
const ctx = reviewContext()

// --- executor "axe" (incl. our rules that ride inside axe) ----------------
// The Vitest JSON carries, per story, meta.reports[] with type "a11y" (axe's
// full result).

interface AxeNode { target: string[]; failureSummary?: string; any?: Array<{ data?: Record<string, unknown>; message?: string }> }
interface AxeRule { id: string; tags: string[]; nodes: AxeNode[] }
interface AxeResult { violations: AxeRule[]; incomplete: AxeRule[]; passes: AxeRule[]; inapplicable: AxeRule[]; testEngine?: { version: string } }

const criterionOf = (tags: string[]) => {
  const t = tags.find((x) => /^wcag\d{3,4}$/.test(x))
  return t ? t.slice(4).split("").join(".").replace(/^(\d)\.(\d)\.(\d)\.(\d)$/, "$1.$2.$3$4") : "?"
}

function axeFindings(vitest: any): Finding[] {
  const findings: Finding[] = []
  for (const file of vitest.testResults) {
    const component = String(file.name).split("/").pop()!.replace(/\.stories\.tsx?$/, "")
    for (const test of file.assertionResults) {
      const reports: any[] = test.meta?.reports ?? []
      const axe: AxeResult | undefined = reports.find((r) => r.type === "a11y")?.result
      if (!axe) continue
      const story = `${component} › ${test.title}`
      const at = new Date(test.startAt ?? Date.now()).toISOString()
      const push = (rules: AxeRule[], outcome: Outcome) => {
        for (const rule of rules) {
          if (outcome !== "failed" && outcome !== "cantTell" && rule.nodes.length === 0) continue
          const ours = rule.tags.includes("shadcn-wcag-compliance")
          for (const node of rule.nodes.length ? rule.nodes : [{ target: [] } as AxeNode]) {
            const data = node.any?.[0]?.data as Record<string, string | number> | undefined
            findings.push({
              format: FINDING_FORMAT,
              rule: rule.id,
              ruleVersion: ours ? (ctx.ownRuleVersions?.[rule.id] ?? "?") : `axe-core ${axe.testEngine?.version ?? "?"}`,
              criterion: criterionOf(rule.tags),
              executor: ours ? "code" : "axe",
              outcome,
              subject: { component, story, selector: node.target.join(" ") || undefined },
              evidence: node.any?.[0]?.message ?? node.failureSummary ?? "",
              measured: data,
              at,
            })
          }
        }
      }
      push(axe.violations, "failed")
      push(axe.incomplete, "cantTell")
      push(axe.passes, "passed")
    }
  }
  return findings
}

// --- gather --------------------------------------------------------------
const vitest = JSON.parse(readFileSync(vitestPath, "utf8"))
const rawAxe = axeFindings(vitest)
// Rule 1.4.3: axe's color-contrast where it measured, our code where it
// could not. Our rule applies only to elements axe cannot settle; where it
// produced a finding, axe's "incomplete" on the same element is replaced.
const OWN_TEXT_RULE = "1.4.3-text-contrast"
// the rule's own "does not apply" (text drawn elsewhere by design) arrives as
// an axe pass with a reason; it is recorded as what it is
for (const f of rawAxe) if (f.rule === OWN_TEXT_RULE && (f.measured as { inapplicable?: string } | undefined)?.inapplicable) f.outcome = "inapplicable"
const measuredByUs = new Set(rawAxe.filter((f) => f.rule === OWN_TEXT_RULE).map((f) => `${f.subject.story}|${f.subject.selector}`))
let settledByOwnCode = 0
const fromAxe = rawAxe.filter((f) => {
  if (f.rule === "color-contrast" && f.outcome === "cantTell" && measuredByUs.has(`${f.subject.story}|${f.subject.selector}`)) {
    settledByOwnCode++
    return false
  }
  return true
})
const fromCss = fromTokens(readTokens(readFileSync(cssPath, "utf8")), cssPath)
const findings = [...fromCss, ...fromAxe]

// Decisions: a failed finding a person has accepted stays failed in the
// record but is marked, so every reader sees both the number and the decision.
const decisions = loadDecisions()
let acceptedCount = 0
for (const f of findings) {
  if (f.outcome !== "failed") continue
  const tokens = f.rule === RULE.id ? [RULE.borderToken, RULE.backgroundToken] : undefined
  const d = findDecision(f, tokens, decisions)
  if (d) {
    acceptedCount++
    ;(f as Finding & { acceptedBy?: string }).acceptedBy = d.id
    f.evidence += ` — accepted by ${d.id}`
  }
}

// Run format 2 (2026-10-06): with every component in Storybook a run holds
// some 25 000 results, nearly all "passed" — 12.5 MB a run. A person acts on
// what failed or could not be told, so those stay one line each, with the
// token-level measurements of the css executor (a handful, and cited in the
// docs). Every other "passed" is a count per rule and version, with the
// number of stories it passed in. (Whether a failure disappeared without a
// cause is read from the failures of two runs, not from their passes.)
const keep = (f: Finding) => f.outcome !== "passed" || (!f.subject.story && !!f.subject.file) // token-level: a file, no story
const passedCounts = new Map<string, { rule: string; ruleVersion: string; executor: string; count: number; stories: number }>()
const passedStories = new Map<string, Set<string>>()
for (const f of findings) {
  if (keep(f)) continue
  const key = `${f.rule}|${f.ruleVersion}`
  const row = passedCounts.get(key) ?? { rule: f.rule, ruleVersion: f.ruleVersion, executor: f.executor, count: 0, stories: 0 }
  row.count++
  const seen = passedStories.get(key) ?? new Set<string>()
  seen.add(f.subject.story ?? "")
  passedStories.set(key, seen)
  row.stories = seen.size
  passedCounts.set(key, row)
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)
const run = {
  format: 2,
  id: stamp,
  at: new Date().toISOString(),
  inputs: { vitest: vitestPath, css: cssPath },
  summary: Object.fromEntries((["failed", "cantTell", "passed", "inapplicable"] as Outcome[]).map((o) => [o, findings.filter((f) => f.outcome === o).length])),
  settledByOwnCode, // axe "incomplete" on text contrast, measured by rule 1.4.3-text-contrast instead
  findings: findings.filter(keep),
  passed: [...passedCounts.values()],
}
mkdirSync("runs", { recursive: true })
writeFileSync(`runs/${stamp}.json`, JSON.stringify(run, null, 2))
writeFileSync("runs/latest.json", JSON.stringify(run, null, 2))

// --- what the run found, rule by rule --------------------------------------
const byRule = new Map<string, { rule: string; version: string; executor: string; criterion: string; failed: number; accepted: number; cantTell: number; passed: number }>()
for (const f of findings) {
  const key = `${f.rule}|${f.ruleVersion}`
  const row = byRule.get(key) ?? { rule: f.rule, version: f.ruleVersion, executor: f.executor, criterion: f.criterion, failed: 0, accepted: 0, cantTell: 0, passed: 0 }
  if (f.outcome === "failed") (f as { acceptedBy?: string }).acceptedBy ? row.accepted++ : row.failed++
  if (f.outcome === "cantTell") row.cantTell++
  if (f.outcome === "passed") row.passed++
  byRule.set(key, row)
}
const rows = [...byRule.values()].sort((a, b) => b.failed - a.failed || b.cantTell - a.cantTell || a.rule.localeCompare(b.rule))
console.table(rows.filter((r) => r.failed || r.accepted || r.cantTell))
const open = findings.filter((f) => f.outcome === "failed" && !(f as { acceptedBy?: string }).acceptedBy)
for (const f of open.slice(0, 20)) console.log(`✗ ${f.rule} · ${f.subject.story ?? f.subject.file} · ${f.subject.selector ?? f.subject.theme ?? ""} — ${f.evidence.replace(/\s+/g, " ").slice(0, 140)}`)
if (open.length > 20) console.log(`  … and ${open.length - 20} more`)

const review = decisions.filter((d) => d.status === "needs-review")
console.log(`\nrules with a finding: ${rows.filter((r) => r.failed || r.cantTell).length} of ${rows.length} that ran · failed: ${open.length} · accepted by a decision: ${acceptedCount} · cantTell: ${run.summary.cantTell}`)
console.log(`css executor: ${fromCss.map((f) => `${f.subject.theme} ${f.outcome} ${f.measured?.ratio}:1`).join(" · ")}`)
console.log(`text contrast: ${settledByOwnCode} axe "cannot tell" measured by ${OWN_TEXT_RULE} instead`)
console.log(`decisions: ${decisions.length} on file, ${decisions.filter((d) => d.status === "approved").length} active, ${review.length} need review`)
for (const d of review) console.log(`  needs review: ${d.id} — ${d.review ?? "sent back by a chat"}`)
console.log(`run written: runs/${stamp}.json (${findings.length} findings)`)

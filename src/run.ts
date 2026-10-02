// Step 5 + 6 of the pipeline: one run = one file.
// Gathers findings from every executor into the single Finding format,
// writes runs/<timestamp>.json (+ runs/latest.json), and prints the
// expected-vs-actual table: for each story, did the rules that should fire
// actually fire?
//
// Usage: node src/run.ts [example/reports/vitest.json] [example/src/index.css]

import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { readTokens } from "./theme/read-tokens.ts"
import { fromTokens } from "./rules/1.4.11-border-contrast.ts"
import { FINDING_FORMAT, type Finding, type Outcome } from "./finding.ts"

const [vitestPath = "example/reports/vitest.json", cssPath = "example/src/index.css"] = process.argv.slice(2)

// --- executor "axe" (incl. our rules that ride inside axe) ----------------
// The Vitest JSON carries, per story, meta.reports[] with type "a11y" (axe's
// full result) and type "expected" (the answer written before the run).

interface AxeNode { target: string[]; failureSummary?: string; any?: Array<{ data?: Record<string, unknown>; message?: string }> }
interface AxeRule { id: string; tags: string[]; nodes: AxeNode[] }
interface AxeResult { violations: AxeRule[]; incomplete: AxeRule[]; passes: AxeRule[]; inapplicable: AxeRule[]; testEngine?: { version: string } }
interface Expected { wcag: "pass" | "fail" | "disputed"; criteria: string[]; evidence: string; axe: string | null }

const criterionOf = (tags: string[]) => {
  const t = tags.find((x) => /^wcag\d{3,4}$/.test(x))
  return t ? t.slice(4).split("").join(".").replace(/^(\d)\.(\d)\.(\d)\.(\d)$/, "$1.$2.$3$4") : "?"
}

function axeFindings(vitest: any): { findings: Finding[]; expectations: Array<{ story: string; expected: Expected; fired: string[]; incomplete: string[] }> } {
  const findings: Finding[] = []
  const expectations = []
  for (const file of vitest.testResults) {
    const component = String(file.name).split("/").pop()!.replace(/\.stories\.tsx?$/, "")
    for (const test of file.assertionResults) {
      const reports: any[] = test.meta?.reports ?? []
      const axe: AxeResult | undefined = reports.find((r) => r.type === "a11y")?.result
      const expected: Expected | undefined = reports.find((r) => r.type === "expected")?.result
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
              ruleVersion: ours ? "1" : `axe-core ${axe.testEngine?.version ?? "?"}`,
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
      if (expected) {
        expectations.push({
          story,
          expected,
          fired: axe.violations.map((v) => v.id),
          incomplete: axe.incomplete.map((v) => v.id),
        })
      }
    }
  }
  return { findings, expectations }
}

// --- gather --------------------------------------------------------------
const vitest = JSON.parse(readFileSync(vitestPath, "utf8"))
const { findings: fromAxe, expectations } = axeFindings(vitest)
const fromCss = fromTokens(readTokens(readFileSync(cssPath, "utf8")), cssPath)
const findings = [...fromCss, ...fromAxe]

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)
const run = {
  format: 1,
  id: stamp,
  at: new Date().toISOString(),
  inputs: { vitest: vitestPath, css: cssPath },
  summary: Object.fromEntries((["failed", "cantTell", "passed", "inapplicable"] as Outcome[]).map((o) => [o, findings.filter((f) => f.outcome === o).length])),
  findings,
}
mkdirSync("runs", { recursive: true })
writeFileSync(`runs/${stamp}.json`, JSON.stringify(run, null, 2))
writeFileSync("runs/latest.json", JSON.stringify(run, null, 2))

// --- expected vs actual ---------------------------------------------------
const rows = expectations.map(({ story, expected, fired, incomplete }) => {
  const shouldFire = expected.axe
  const predictionRight = shouldFire ? fired.includes(shouldFire) : fired.length === 0
  const caught = fired.length > 0
  const verdict =
    expected.wcag === "fail" ? (caught ? "caught" : "MISSED") :
    expected.wcag === "pass" ? (caught ? "FALSE ALARM" : "clean") :
    "disputed → person"
  return { story, truth: expected.wcag, criteria: expected.criteria.join("; "), fired: fired.join(", ") || "-", cantTell: incomplete.join(", ") || "-", "prediction right": predictionRight ? "yes" : "NO", verdict }
})
console.table(rows)
const real = rows.filter((r) => r.truth === "fail")
const missed = real.filter((r) => r.verdict === "MISSED")
console.log(`\nreal problems: ${real.length}, caught: ${real.length - missed.length}, missed: ${missed.length}`)
console.log(`css executor: ${fromCss.map((f) => `${f.subject.theme} ${f.outcome} ${f.measured?.ratio}:1`).join(" · ")}`)
console.log(`run written: runs/${stamp}.json (${findings.length} findings)`)

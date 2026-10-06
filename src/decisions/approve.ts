// A person's act: appends an `approved` (or `revoked`) entry to a decision.
// Meant to be run by the person in their own terminal. The edit hook refuses
// this command when a chat tries to run it, and refuses a chat writing such
// an entry by hand — a threshold, not a wall: a chat set on bypassing it can,
// and leaves a trace. The wall is the pull request: decisions/ is owned in
// .github/CODEOWNERS, so a change there needs an approver's review.
//
//   node src/decisions/approve.ts d-2026-10-03-02 --by "Yuriy Balaka" [--why "…"]
//   node src/decisions/approve.ts d-2026-10-03-02 --revoke --by "Yuriy Balaka" --why "…"
//   node src/decisions/approve.ts d-2026-10-03-02 --rule-version 2 --by "Yuriy Balaka" --why "…"
//
// --rule-version re-approves a decision for a new version of its rule: the
// rule changed, the decision stopped counting (needs-review), a person has
// looked again and says it still holds. rule_version is rewritten and the
// approval says what it was before.

import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { APPROVERS, isApprover } from "./approvers.ts"
import { reviewContext } from "./load.ts"
import { parseDecision } from "./registry.ts"

const ROOT = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
const args = process.argv.slice(2)
const valueOf = (k: string) => (args.indexOf(k) >= 0 ? args[args.indexOf(k) + 1] : undefined)
const VALUED = new Set(["--by", "--why", "--rule-version"])
const id = args.find((a, i) => !a.startsWith("--") && !VALUED.has(args[i - 1]))
const by = valueOf("--by")
const why = valueOf("--why")
const newVersion = valueOf("--rule-version")
const action = args.includes("--revoke") ? "revoked" : "approved"

if (!id || !by) {
  console.error('usage: node src/decisions/approve.ts <id> --by "<name>" [--why "…"] [--revoke] [--rule-version <v>]')
  process.exit(2)
}
if (!isApprover(by)) {
  console.error(`"${by}" is not on the approvers list (src/decisions/approvers.ts): ${APPROVERS.map((a) => a.name).join(", ")}.`)
  console.error("Only a person on that list approves or revokes a decision; the list itself is changed by editing that file.")
  process.exit(2)
}

const dir = join(ROOT, "decisions")
const file = readdirSync(dir).find((f) => f.endsWith(".md") && readFileSync(join(dir, f), "utf8").includes(`\nid: ${id}\n`))
if (!file) {
  console.error(`no decision with id ${id} in ${dir}`)
  process.exit(2)
}
const path = join(dir, file)
let text = readFileSync(path, "utf8")
const ctx = reviewContext(ROOT)
const d = parseDecision(text, file, ctx)
if (!d) {
  console.error(`${file} does not parse as a decision (format 2 or 3)`)
  process.exit(2)
}
const current = d.rule_version.startsWith("axe-core") ? ctx.axeVersion && `axe-core ${ctx.axeVersion}` : ctx.ownRuleVersions?.[d.rule]
if (action === "approved" && current && current !== d.rule_version && !newVersion) {
  console.error(`${id} was decided for ${d.rule} ${d.rule_version}; the rule is now ${current}.`)
  console.error(`Look at the case again under the new version; if it still holds, run again with --rule-version "${current}".`)
  process.exit(2)
}
if (action === "approved" && d.status === "approved" && !newVersion) {
  console.log(`${id} is already approved`)
  process.exit(0)
}
let note = why
if (newVersion) {
  if (action !== "approved") {
    console.error("--rule-version goes with an approval, not a revocation")
    process.exit(2)
  }
  const replaced = text.replace(/^rule_version:.*$/m, `rule_version: ${newVersion}`)
  if (replaced === text && d.rule_version !== newVersion) {
    console.error("could not find rule_version to rewrite")
    process.exit(2)
  }
  text = replaced
  note = `re-approved for rule version ${newVersion} (was ${d.rule_version})${why ? "; " + why : ""}`
}
const at = new Date().toISOString().slice(0, 16)
const q = (s: string) => s.replace(/"/g, "'")
const entry = `  - { at: ${at}, action: ${action}, by: "${q(by)}"${note ? `, why: "${q(note)}"` : ""} }`
const updated = text.replace(/(history:\n(?:[ \t]+-[^\n]*\n)*)/, (block) => block + entry + "\n")
if (updated === text) {
  console.error("could not find the history block to append to")
  process.exit(2)
}
writeFileSync(path, updated)
console.log(`${id}: ${action} by ${by} at ${at}${newVersion ? ` for rule version ${newVersion}` : ""} → ${file}`)

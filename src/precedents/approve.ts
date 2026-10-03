// A person's act: appends an `approved` (or `revoked`) entry to a precedent.
// Meant to be run by the person in their own terminal. The edit hook refuses
// this command when a chat tries to run it, and refuses a chat writing such
// an entry by hand — a threshold, not a wall: a chat set on bypassing it can,
// and leaves a trace. The wall is the PR: an `approved` line has to arrive
// in a commit a person made.
//
//   node src/precedents/approve.ts p-2026-10-03-01 --by "Yuriy Balaka" [--why "…"]
//   node src/precedents/approve.ts p-2026-10-03-01 --revoke --by "Yuriy Balaka" --why "…"

import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { parsePrecedent } from "./registry.ts"

const ROOT = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
const args = process.argv.slice(2)
const id = args.find((a) => !a.startsWith("--") && args[args.indexOf(a) - 1] !== "--by" && args[args.indexOf(a) - 1] !== "--why")
const byIdx = args.indexOf("--by")
const by = byIdx >= 0 ? args[byIdx + 1] : undefined
const whyIdx = args.indexOf("--why")
const why = whyIdx >= 0 ? args[whyIdx + 1] : undefined
const action = args.includes("--revoke") ? "revoked" : "approved"

if (!id || !by) {
  console.error('usage: node src/precedents/approve.ts <id> --by "<name>" [--why "…"] [--revoke]')
  process.exit(2)
}

const dir = join(ROOT, "precedents")
const file = readdirSync(dir).find((f) => f.endsWith(".md") && readFileSync(join(dir, f), "utf8").includes(`\nid: ${id}\n`))
if (!file) {
  console.error(`no precedent with id ${id} in ${dir}`)
  process.exit(2)
}
const path = join(dir, file)
const text = readFileSync(path, "utf8")
const p = parsePrecedent(text, file)
if (!p) {
  console.error(`${file} does not parse as format 2`)
  process.exit(2)
}
if (action === "approved" && p.status === "approved") {
  console.log(`${id} is already approved`)
  process.exit(0)
}
const at = new Date().toISOString().slice(0, 16)
const q = (s: string) => s.replace(/"/g, "'")
const entry = `  - { at: ${at}, action: ${action}, by: "${q(by)}"${why ? `, why: "${q(why)}"` : ""} }`
const updated = text.replace(/(history:\n(?:[ \t]+-[^\n]*\n)*)/, (block) => block + entry + "\n")
if (updated === text) {
  console.error("could not find the history block to append to")
  process.exit(2)
}
writeFileSync(path, updated)
console.log(`${id}: ${action} by ${by} at ${at} → ${file}`)

// A Claude Code Stop hook: runs when the chat is about to finish its answer.
// It reads the latest run and, if there are `cantTell` findings that no
// precedent — not even a draft — covers, it does not let the answer end:
// exit 2 with the list, and the chat has to draft them first. This is the
// hook that hands out the next step instead of only saying no.
//
// `stop_hook_active` is set by Claude Code when the chat is already
// continuing because of this hook; then we let it finish, so a draft the
// chat could not write never turns into an endless loop.

import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { loadPrecedents } from "../precedents/load.ts"
import { findPrecedent } from "../precedents/registry.ts"
import type { Finding } from "../finding.ts"

const ROOT = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()

let raw = ""
for await (const chunk of process.stdin) raw += chunk
const call = JSON.parse(raw || "{}")
if (call.stop_hook_active) process.exit(0)

const latest = join(ROOT, "runs", "latest.json")
if (!existsSync(latest)) process.exit(0)
const run = JSON.parse(readFileSync(latest, "utf8")) as { findings: Finding[] }
const precedents = loadPrecedents()

const open = new Map<string, Finding>()
for (const f of run.findings) {
  if (f.outcome !== "cantTell") continue
  const key = `${f.rule}|${f.subject.component ?? ""}|${f.subject.selector ?? ""}`
  if (open.has(key)) continue
  // drafts count here: the chat's job is to draft, a person decides later
  const covered = findPrecedent(f, undefined, precedents, { includeDrafts: true })
  if (!covered) open.set(key, f)
}
if (open.size === 0) process.exit(0)

const lines = [...open.values()].slice(0, 8).map((f) => `  ? ${f.rule} · ${f.subject.story ?? f.subject.component ?? f.subject.file ?? ""} · ${f.subject.selector ?? ""} — ${f.evidence.slice(0, 120)}`)
console.error(
  [
    `shadcn-wcag-compliance: the latest run has ${open.size} "cantTell" finding(s) with no precedent, not even a draft.`,
    ...lines,
    ...(open.size > 8 ? [`  … and ${open.size - 8} more`] : []),
    "Before finishing: look at each one and draft a precedent in precedents/ (kind: interpretation, decision as you read it, match: { check, selector }, history: drafted only). A person approves later.",
  ].join("\n")
)
process.exit(2)

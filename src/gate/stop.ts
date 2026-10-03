// The Stop hook: when the chat is about to finish, the latest run's
// `cantTell` findings must each have a precedent — at least a draft. If not,
// the answer does not end: the list and the next step go back to the chat.
// `stop_hook_active` means the chat is already continuing because of this;
// then it may finish, so a draft it could not write never loops forever.

import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import type { Finding } from "../finding.ts"
import { loadPrecedents } from "../precedents/load.ts"
import { findPrecedent } from "../precedents/registry.ts"

export async function stop(call: any): Promise<number> {
  if (call.stop_hook_active) return 0
  const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
  const latest = join(root, "runs", "latest.json")
  if (!existsSync(latest)) return 0
  const run = JSON.parse(readFileSync(latest, "utf8")) as { findings: Finding[] }
  const precedents = loadPrecedents(join(root, "precedents"))

  const open = new Map<string, Finding>()
  for (const f of run.findings) {
    if (f.outcome !== "cantTell") continue
    const key = `${f.rule}|${f.subject.component ?? ""}|${f.subject.selector ?? ""}`
    if (open.has(key)) continue
    if (!findPrecedent(f, undefined, precedents, { includeDrafts: true })) open.set(key, f)
  }
  if (open.size === 0) return 0

  const lines = [...open.values()].slice(0, 8).map((f) => `  ? ${f.rule} · ${f.subject.story ?? f.subject.component ?? f.subject.file ?? ""} · ${f.subject.selector ?? ""} — ${f.evidence.replace(/\s+/g, " ").slice(0, 120)}`)
  console.error(
    [
      `shadcn-wcag-compliance: the latest run has ${open.size} "cantTell" finding(s) with no precedent, not even a draft.`,
      ...lines,
      ...(open.size > 8 ? [`  … and ${open.size - 8} more`] : []),
      "Before finishing: look at each one and draft a precedent in precedents/ (kind: interpretation, decision as you read it, match: { check, selector }, history: drafted only). A person approves later.",
    ].join("\n")
  )
  return 2
}

// Reads decisions/*.md from disk for the Node executors (edit hook, Stop
// hook, run.ts), with what is needed to tell a stale approval: the current
// version of each own rule and the installed axe-core.
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { parseDecision, type Decision, type ReviewContext } from "./registry.ts"

const ROOT = () => process.env.CLAUDE_PROJECT_DIR ?? "."

export function loadDecisions(dir = join(ROOT(), "decisions")): Decision[] {
  let files: string[] = []
  try {
    files = readdirSync(dir).filter((f) => f.endsWith(".md") && f !== "README.md")
  } catch {
    return []
  }
  const ctx = reviewContext(join(dir, ".."))
  return files.map((f) => parseDecision(readFileSync(join(dir, f), "utf8"), f, ctx)).filter((d): d is Decision => !!d)
}

export function reviewContext(root = ROOT()): ReviewContext {
  const ownRuleVersions: Record<string, string> = {}
  const rulesDir = join(root, "rules", "own")
  try {
    for (const f of readdirSync(rulesDir).filter((x) => x.endsWith(".md"))) {
      const v = readFileSync(join(rulesDir, f), "utf8").match(/^version:\s*(\S+)/m)?.[1]
      if (v) ownRuleVersions[f.replace(/\.md$/, "")] = v
    }
  } catch {}
  let axeVersion: string | undefined
  const axePkg = join(root, "example", "node_modules", "axe-core", "package.json")
  try {
    if (existsSync(axePkg)) axeVersion = JSON.parse(readFileSync(axePkg, "utf8")).version
  } catch {}
  return { ownRuleVersions, axeVersion }
}

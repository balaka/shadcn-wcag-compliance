// A person's command: opens a window during which closed files may be
// written through the tools. Refused when run from a chat. Every write in
// the window is recorded in runs/edits.jsonl; sign.ts (or --close) ends it.
//
//   --scope gate     the gate's own files and how the checks run (default)
//   --scope stories  *.stories.tsx — closed to a chat otherwise, because a
//                    story is what the checks see
//   --scope gate,stories
//
//   node src/gate/unlock.ts --scope stories --by "Yuriy Balaka" --minutes 60 --why "Input stories from the shadcn examples"
//   node src/gate/unlock.ts --close

import { existsSync, unlinkSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { UNLOCK_FILE, type Scope, type Unlock } from "./integrity.ts"

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
const args = process.argv.slice(2)
const arg = (k: string) => (args.indexOf(k) >= 0 ? args[args.indexOf(k) + 1] : undefined)
const USAGE = 'usage: node src/gate/unlock.ts [--scope gate|stories|gate,stories] --by "<name>" [--minutes 60] [--why "…"]  |  --close'

if (args.includes("--close")) {
  if (existsSync(join(root, UNLOCK_FILE))) unlinkSync(join(root, UNLOCK_FILE))
  console.log("gate: window closed")
  process.exit(0)
}
const by = arg("--by")
const minutes = Number(arg("--minutes") ?? 60)
const scope = (arg("--scope") ?? "gate").split(",").map((s) => s.trim()) as Scope[]
if (!by || !Number.isFinite(minutes) || minutes <= 0 || !scope.every((s) => s === "gate" || s === "stories")) {
  console.error(USAGE)
  process.exit(2)
}
const u: Unlock = { until: new Date(Date.now() + minutes * 60_000).toISOString(), by, why: arg("--why"), scope }
writeFileSync(join(root, UNLOCK_FILE), JSON.stringify(u, null, 2) + "\n")
console.log(`gate: window for ${scope.join(" + ")} opened by ${by} until ${u.until}${u.why ? " — " + u.why : ""}.${scope.includes("gate") ? " Re-sign with sign.ts when done." : " Close with --close when done."}`)

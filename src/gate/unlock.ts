// A person's command: opens a window during which the gate's own files may
// be edited through the tools (for developing the gate). Refused when run
// from a chat. Every edit in the window is recorded; sign.ts closes it.
//
//   node src/gate/unlock.ts --by "Yuriy Balaka" --minutes 60 --why "refactor guards"
//   node src/gate/unlock.ts --close

import { existsSync, unlinkSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { UNLOCK_FILE, type Unlock } from "./integrity.ts"

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
const args = process.argv.slice(2)
const arg = (k: string) => (args.indexOf(k) >= 0 ? args[args.indexOf(k) + 1] : undefined)

if (args.includes("--close")) {
  if (existsSync(join(root, UNLOCK_FILE))) unlinkSync(join(root, UNLOCK_FILE))
  console.log("gate: unlock window closed")
  process.exit(0)
}
const by = arg("--by")
const minutes = Number(arg("--minutes") ?? 60)
if (!by || !Number.isFinite(minutes) || minutes <= 0) {
  console.error('usage: node src/gate/unlock.ts --by "<name>" [--minutes 60] [--why "…"]  |  --close')
  process.exit(2)
}
const u: Unlock = { until: new Date(Date.now() + minutes * 60_000).toISOString(), by, why: arg("--why") }
writeFileSync(join(root, UNLOCK_FILE), JSON.stringify(u, null, 2) + "\n")
console.log(`gate: unlocked by ${by} until ${u.until}${u.why ? " — " + u.why : ""}. Re-sign with sign.ts when done.`)

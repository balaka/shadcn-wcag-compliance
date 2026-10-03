// A person's command: signs the gate — writes gate.lock.json with the sha256
// of every protected file. Refused when run from a chat (shell.ts knows the
// name). Run it after you changed the gate's code or registration yourself.
//
//   node src/gate/sign.ts --by "Yuriy Balaka"

import { writeFileSync, unlinkSync, existsSync } from "node:fs"
import { join } from "node:path"
import { LOCK_FILE, UNLOCK_FILE, manifest, type Lock } from "./integrity.ts"

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
const args = process.argv.slice(2)
const by = args.indexOf("--by") >= 0 ? args[args.indexOf("--by") + 1] : undefined
if (!by) {
  console.error('usage: node src/gate/sign.ts --by "<name>"')
  process.exit(2)
}
const lock: Lock = { format: 1, signedAt: new Date().toISOString(), signedBy: by, files: manifest(root) }
writeFileSync(join(root, LOCK_FILE), JSON.stringify(lock, null, 2) + "\n")
if (existsSync(join(root, UNLOCK_FILE))) unlinkSync(join(root, UNLOCK_FILE)) // signing closes any open window
console.log(`gate signed by ${by}: ${Object.keys(lock.files).length} protected files → ${LOCK_FILE}`)

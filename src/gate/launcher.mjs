#!/usr/bin/env node
// The one file Claude Code calls. Deliberately tiny and dependency-free, so
// it runs even when the rest of the gate is broken — and then it fails
// CLOSED: a gate that cannot run refuses the write instead of allowing it.
//
//   PreToolUse: node src/gate/launcher.mjs          (matcher Edit|MultiEdit|Write|NotebookEdit|Bash)
//   Stop:       node src/gate/launcher.mjs --stop
//
// Exit 0 = allow, exit 2 = refuse (stderr goes back to the agent).

import { appendFileSync, mkdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
const mode = process.argv.includes("--stop") ? "stop" : "pre"

let raw = ""
for await (const chunk of process.stdin) raw += chunk
let call = {}
try { call = JSON.parse(raw || "{}") } catch { call = {} }

try {
  const mod = await import(join(here, mode === "stop" ? "stop.ts" : "runner.ts"))
  const code = mode === "stop" ? await mod.stop(call) : await mod.run(call)
  process.exit(typeof code === "number" ? code : 0)
} catch (err) {
  const message = err && err.message ? err.message.split("\n")[0] : String(err)
  try {
    mkdirSync(join(root, "runs"), { recursive: true })
    appendFileSync(join(root, "runs", "edits.jsonl"), JSON.stringify({ at: new Date().toISOString(), place: "launcher", guard: "fail-closed", tool: call.tool_name ?? mode, file: (call.tool_input && (call.tool_input.file_path || call.tool_input.command)) || "", session: call.session_id ?? null, decision: mode === "stop" ? "skipped" : "refused", note: message }) + "\n")
  } catch {}
  if (mode === "stop") {
    console.error(`shadcn-wcag-compliance: the stop check could not run (${message}) — finishing anyway; a person should repair the gate.`)
    process.exit(0)
  }
  console.error(
    [
      `shadcn-wcag-compliance: the gate could not run (${message}).`,
      "A gate that cannot run refuses the write instead of allowing it. A person repairs it (see src/gate/README.md) and re-signs with node src/gate/sign.ts.",
    ].join("\n  ")
  )
  process.exit(2)
}

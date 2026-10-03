// The gate's runner: one PreToolUse call in, one decision out.
//
//   1. a shell command → shell.ts reads its text; a write to a guarded or
//      protected path, a whole-tree git rewrite, or a person's command is
//      refused
//   2. a file write → the file as it would become is computed from the tool
//      input (Write / Edit / MultiEdit); other tools cannot be judged and
//      are refused for guarded paths
//   3. before any guard: integrity — if the gate's own files differ from
//      gate.lock.json and no unlock window is open, every guarded write is
//      refused until a person re-signs
//   4. the first matching guard judges; its verdict is recorded and told
//
// Anything thrown inside is caught by launcher.mjs and turns into a refusal
// (fail closed) — a broken gate never becomes an open one.

import { existsSync, readFileSync } from "node:fs"
import { relative, resolve } from "node:path"
import { guardFor } from "./guards/index.ts"
import { verify } from "./integrity.ts"
import { guardedKind, isProtected } from "./paths.ts"
import { record } from "./record.ts"
import { analyze } from "./shell.ts"
import type { Verdict, WriteCtx } from "./types.ts"

const FILE_TOOLS = new Set(["Write", "Edit", "MultiEdit"])

export async function run(call: any): Promise<number> {
  const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
  const tool: string = call.tool_name ?? ""
  const input = call.tool_input ?? {}
  const session = call.session_id ?? null

  // ---- shell -------------------------------------------------------------
  if (tool === "Bash") {
    const v = analyze(String(input.command ?? ""))
    if (v.refuse) {
      record(root, { place: "shell", guard: v.guard, tool, file: v.target ?? "", session, decision: "refused", note: v.why })
      tell([`${v.target ? "shell write to " + v.target + " refused — " : ""}${v.why}`])
      return 2
    }
    return 0
  }

  // ---- files -------------------------------------------------------------
  const file: string | undefined = input.file_path ?? input.notebook_path
  if (!file) return 0
  const rel = relative(root, resolve(root, file))
  const guarded = guardedKind(rel) !== null || isProtected(rel)
  if (!guarded) return 0

  if (!FILE_TOOLS.has(tool)) {
    record(root, { place: "edit-hook", guard: "runner", tool, file: rel, session, decision: "refused", note: "unsupported tool for a guarded file" })
    tell([`${tool} cannot be checked by the gate — use Edit or Write for ${rel}.`])
    return 2
  }

  // ---- integrity ---------------------------------------------------------
  const integrity = verify(root)
  if (!integrity.ok && !integrity.unlock) {
    const what = !integrity.signed
      ? "gate.lock.json is missing — the gate has not been signed."
      : `the gate's own files differ from gate.lock.json: ${[...integrity.changed.map((f) => "changed " + f), ...integrity.added.map((f) => "added " + f), ...integrity.removed.map((f) => "removed " + f)].join(", ")}.`
    record(root, { place: "edit-hook", guard: "integrity", tool, file: rel, session, decision: "refused", note: what })
    tell([
      `gate integrity: ${what}`,
      "Until a person re-signs (node src/gate/sign.ts --by \"<name>\"), no guarded file is written through the tools.",
    ])
    return 2
  }

  // ---- the write as it would be ------------------------------------------
  const before = existsSync(file) ? readFileSync(file, "utf8") : ""
  const after = applyTool(tool, input, before)
  if (after === null) return 0 // the edit itself will fail (old_string not found)

  const guard = guardFor(rel)
  if (!guard) return 0
  const ctx: WriteCtx = { tool, sessionId: session, root, rel, before, after }
  const verdict: Verdict = await guard.check(ctx)
  record(root, { place: "edit-hook", guard: guard.name, tool, file: rel, session, decision: verdict.decision, note: verdict.note, findings: verdict.findings })
  if (verdict.lines?.length) tell(verdict.lines)
  return verdict.decision === "refused" ? 2 : 0
}

function applyTool(tool: string, input: any, before: string): string | null {
  if (tool === "Write") return String(input.content ?? "")
  const edits: Array<{ old_string: string; new_string: string; replace_all?: boolean }> = tool === "Edit" ? [input] : (input.edits ?? [])
  let text = before
  for (const e of edits) {
    const oldS = String(e.old_string ?? "")
    if (!text.includes(oldS)) return null
    text = e.replace_all ? text.split(oldS).join(String(e.new_string ?? "")) : text.replace(oldS, () => String(e.new_string ?? ""))
  }
  return text
}

function tell(lines: string[]) {
  console.error(["shadcn-wcag-compliance: " + lines[0], ...lines.slice(1).map((l) => "  " + l)].join("\n"))
}

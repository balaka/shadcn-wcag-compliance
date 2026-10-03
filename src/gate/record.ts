// Every decision is recorded, refusals above all: a refused write is the
// gate doing its job, and the history of refusals is the evidence that it
// does. One JSON line per attempt in runs/edits.jsonl.

import { appendFileSync, mkdirSync } from "node:fs"
import { join } from "node:path"

export interface Entry {
  place: "edit-hook" | "shell" | "stop" | "launcher"
  guard: string
  tool: string
  file: string
  session: string | null
  decision: string
  note?: string
  findings?: unknown[]
}

export function record(root: string, e: Entry) {
  try {
    mkdirSync(join(root, "runs"), { recursive: true })
    appendFileSync(join(root, "runs", "edits.jsonl"), JSON.stringify({ at: new Date().toISOString(), ...e }) + "\n")
  } catch {
    // never let logging failure change a decision
  }
}

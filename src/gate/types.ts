// The gate's vocabulary. A guard watches a kind of file and judges one
// write by what the file is and what it would become. The runner does
// everything else: talking to Claude Code, recording, failing closed.

export interface WriteCtx {
  tool: string // Edit | MultiEdit | Write | NotebookEdit
  sessionId: string | null
  root: string // repository root (CLAUDE_PROJECT_DIR)
  rel: string // path relative to root, as reported in messages
  before: string // file as it is ("" when new)
  after: string // file as it would be after the write
}

export type Decision = "passed" | "refused" | "accepted" | "noted" | "unchecked" | "unlocked"

export interface Verdict {
  decision: Decision
  lines?: string[] // what the agent is told; first line is the headline
  findings?: unknown[] // evidence, recorded verbatim
  note?: string
}

export interface Guard {
  name: string
  matches(rel: string): boolean
  check(ctx: WriteCtx): Verdict | Promise<Verdict>
}

export const refuse = (lines: string[], findings: unknown[] = []): Verdict => ({ decision: "refused", lines, findings, note: lines[0] })
export const allow = (decision: Decision = "passed", lines: string[] = [], findings: unknown[] = [], note?: string): Verdict => ({ decision, lines, findings, note })

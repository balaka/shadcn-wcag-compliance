// Executor "edit hook" — place of use: while editing. A Claude Code
// PreToolUse hook: Claude Code runs this file as a separate process before
// writing a file and waits for the answer. Before an agent writes a shadcn theme file, it runs the
// theme reader + rule on the file AS IT WOULD BE after the write. If the write
// makes a theme pair fail rule border-contrast that passes today, the write
// is refused and the agent gets the number back. A pair that already fails
// today is reported but not blocked — the gate stops regressions, it does
// not hold the repository hostage to its history.
//
// The decision rests only on data (the two files and the formula): nothing
// said in the chat can open it.
//
// Wire-up: .claude/settings.json → hooks.PreToolUse, matcher "Edit|Write".
// Claude Code passes the tool call as JSON on stdin; exit code 2 blocks the
// call and feeds stderr back to the agent.

import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { readTokens } from "../theme/read-tokens.ts"
import { fromTokens } from "../rules/1.4.11-border-contrast.ts"

const THEME_FILE = /(^|\/)(index|globals)\.css$/

let raw = ""
for await (const chunk of process.stdin) raw += chunk
const call = JSON.parse(raw || "{}")
const input = call.tool_input ?? {}
const file: string | undefined = input.file_path

if (!file || !THEME_FILE.test(file)) process.exit(0)

const before = existsSync(file) ? readFileSync(file, "utf8") : ""
let after: string
if (call.tool_name === "Write") {
  after = String(input.content ?? "")
} else if (call.tool_name === "Edit") {
  const { old_string = "", new_string = "", replace_all = false } = input
  if (!before.includes(old_string)) process.exit(0) // the edit will fail on its own
  after = replace_all ? before.split(old_string).join(new_string) : before.replace(old_string, () => new_string)
} else {
  process.exit(0)
}

const was = new Map(fromTokens(readTokens(before), file).map((f) => [f.subject.theme, f]))
const now = fromTokens(readTokens(after), file)

const regressions = now.filter((f) => f.outcome === "failed" && was.get(f.subject.theme)?.outcome !== "failed")
const stillFailing = now.filter((f) => f.outcome === "failed" && was.get(f.subject.theme)?.outcome === "failed")
// A pair the rule could not read is not a violation, so it never blocks —
// but silence would hide it, so it is said and recorded as "unchecked".
const unchecked = now.filter((f) => f.outcome === "cantTell")

// Every decision is recorded, refusals above all: a refused write is the
// gate doing its job, and the history of refusals is the evidence that it
// does. One JSON line per attempt, same Finding objects as every other run.
const decision = regressions.length ? "refused" : stillFailing.length ? "noted" : unchecked.length ? "unchecked" : "passed"
const log = {
  at: new Date().toISOString(),
  place: "edit-hook",
  tool: call.tool_name,
  file,
  session: call.session_id ?? null,
  decision,
  findings: now,
}
try {
  mkdirSync(join(process.env.CLAUDE_PROJECT_DIR ?? ".", "runs"), { recursive: true })
  appendFileSync(join(process.env.CLAUDE_PROJECT_DIR ?? ".", "runs", "edits.jsonl"), JSON.stringify(log) + "\n")
} catch {
  // never let logging failure change the decision
}

if (regressions.length) {
  console.error(
    [
      `shadcn-wcag-compliance: write to ${file} refused — rule 1.4.11-border-contrast v1 (WCAG 1.4.11) would start failing:`,
      ...regressions.map((f) => `  ✗ ${f.evidence}`),
      `Keep --input at 3:1 or better against --background in every theme, then write again.`,
    ].join("\n")
  )
  process.exit(2)
}
if (unchecked.length) {
  console.error(
    [
      `shadcn-wcag-compliance: could not check 1.4.11-border-contrast in ${file} — the write goes through unchecked:`,
      ...unchecked.map((f) => `  ? ${f.evidence}`),
      `Storybook (Accessibility › Inconclusive) or a person has to look at this pair.`,
    ].join("\n")
  )
}
if (stillFailing.length) {
  console.error(
    [
      `shadcn-wcag-compliance: note — 1.4.11-border-contrast already fails in ${file} and this write does not fix it:`,
      ...stillFailing.map((f) => `  • ${f.evidence}`),
    ].join("\n")
  )
}
process.exit(0)

// Executor "edit hook" — place of use: while editing. A Claude Code
// PreToolUse hook: Claude Code runs this file as a separate process before
// a tool writes a file (or runs a shell command) and waits for the answer.
// Exit 0 lets the call through; exit 2 refuses it and feeds stderr back to
// the agent as the reason.
//
// A Markdown file can tell an agent how to behave; this file makes sure of
// it — as far as a local hook can. It is a threshold, not a wall: it stops
// a chat from approving a precedent or flipping an expected answer by
// mistake or habit, and it leaves a trace in runs/edits.jsonl. A chat set
// on bypassing it (a path hidden in a variable, a copied script) can; the
// wall is the pull request, where an approval has to arrive in a commit a
// person made. Every guard decides from data only — the file as it is and
// as it would become — never from anything said in the conversation.
//
// Guards, by the path being written:
//   theme file (index.css / globals.css)   rule 1.4.11-border-contrast must not
//                                          start failing; an approved precedent
//                                          may accept a failing pair
//   precedents/*.md                        a tool may only draft: `approved` /
//                                          `revoked` entries are refused; the
//                                          file must parse as format 2; a
//                                          precedent on an axe rule needs `match`;
//                                          an exception needs `valid_until`
//   *.stories.tsx                          an `expected` answer may not flip
//                                          from fail to pass without an approved
//                                          precedent covering that story; every
//                                          change to `expected` is recorded
//   rules/own/*.md, src/rules/*.ts         a change to what the rule checks
//                                          needs a new `version`
//   standards/**                           copies of the standard: new files
//                                          only, never edits
//   shell commands                         a command that would write one of
//                                          the paths above, or run approve.ts,
//                                          is refused — its result cannot be
//                                          measured in advance
//
// Wire-up: .claude/settings.json → hooks.PreToolUse, matcher "Edit|Write|Bash".

import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs"
import { join, relative, resolve } from "node:path"
import { readTokens } from "../theme/read-tokens.ts"
import { fromTokens, RULE } from "../rules/1.4.11-border-contrast.ts"
import { findPrecedent, parsePrecedent } from "../precedents/registry.ts"
import { loadPrecedents } from "../precedents/load.ts"

const ROOT = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()

const GUARDED = {
  theme: /(^|\/)(index|globals)\.css$/,
  precedent: /(^|\/)precedents\/(?!README\.md$)[^/]+\.md$/,
  story: /\.stories\.tsx?$/,
  ruleText: /(^|\/)rules\/own\/[^/]+\.md$/,
  ruleCode: /(^|\/)src\/rules\/[^/]+\.ts$/,
  standard: /(^|\/)standards\/.+\.md$/,
} as const
type Guard = keyof typeof GUARDED

let raw = ""
for await (const chunk of process.stdin) raw += chunk
const call = JSON.parse(raw || "{}")
const input = call.tool_input ?? {}
const file: string | undefined = input.file_path
const rel = (p: string) => relative(ROOT, resolve(ROOT, p))

function kindOf(path: string): Guard | null {
  for (const [k, re] of Object.entries(GUARDED)) if (re.test(path)) return k as Guard
  return null
}

// Every decision is recorded, refusals above all: a refused write is the
// gate doing its job, and the history of refusals is the evidence that it
// does. One JSON line per attempt.
function record(decision: string, target: string, guard: string, findings: unknown[] = [], note?: string) {
  const log = { at: new Date().toISOString(), place: "edit-hook", guard, tool: call.tool_name, file: target, session: call.session_id ?? null, decision, note, findings }
  try {
    mkdirSync(join(ROOT, "runs"), { recursive: true })
    appendFileSync(join(ROOT, "runs", "edits.jsonl"), JSON.stringify(log) + "\n")
  } catch {
    // never let logging failure change the decision
  }
}

function refuse(target: string, guard: string, lines: string[], findings: unknown[] = []): never {
  record("refused", target, guard, findings, lines[0])
  console.error(["shadcn-wcag-compliance: " + lines[0], ...lines.slice(1).map((l) => "  " + l)].join("\n"))
  process.exit(2)
}

// ---------------------------------------------------------------- shell ----
if (call.tool_name === "Bash") {
  // Quoted text is data, not a target: a commit message or a journal line
  // that merely mentions a file must not trip the guard.
  const cmd: string = String(input.command ?? "").replace(/'[^']*'|"[^"]*"/g, '""')
  const words = cmd.match(/[\w./~$-]+/g) ?? []
  const targets = words.filter((w) => kindOf(w) !== null)
  const writes =
    /(^|[\s;&|(])(sed\s+-[a-zA-Z]*i|perl\s+-[a-zA-Z]*i|tee\b|cp\b|mv\b|install\b|dd\b|truncate\b|rm\b|unlink\b|>{1,2})/.test(cmd) ||
    /open\([^)]*['"][wa]/.test(cmd)
  if (/precedents\/approve\.ts/.test(cmd)) {
    refuse("precedents/", "precedent", [
      "approving a precedent is a person's act — the approve command is not run from a chat.",
      'Ask the person to run it in their own terminal: node src/precedents/approve.ts <id> --by "<name>"',
    ])
  }
  if (targets.length && writes) {
    refuse(targets[0], kindOf(targets[0])!, [
      `shell write to ${targets[0]} refused — a guarded file rewritten by a shell command cannot be checked in advance.`,
      "Use the Edit or Write tool; the hook then sees what the file will become and lets a passing change through.",
    ])
  }
  process.exit(0)
}

if (!file) process.exit(0)
const kind = kindOf(file)
if (!kind) process.exit(0)

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
const target = rel(file)

// ------------------------------------------------------------- standards ----
if (kind === "standard") {
  if (before && !/(^|\/)README\.md$/.test(target)) refuse(target, "standard", [
    `${target} is a verbatim copy of the standard — it is never edited.`,
    "To move to a new edition, add the new file (with its edition date) and update the rules that cite it.",
  ])
  record("passed", target, "standard")
  process.exit(0)
}

// ------------------------------------------------------------ precedents ----
if (kind === "precedent") {
  const next = parsePrecedent(after, target)
  if (!next) refuse(target, "precedent", [
    `${target} does not parse as a precedent (format 2).`,
    "See precedents/README.md: front matter with format, id, kind, rule, rule_version, scope, subject, decision, evidence, reason, history.",
  ])
  const prev = before ? parsePrecedent(before, target) : null
  const prevN = prev?.history.length ?? 0
  if (prev && JSON.stringify(prev.history) !== JSON.stringify(next.history.slice(0, prevN))) refuse(target, "precedent", [
    `history in ${target} is append-only — an existing entry was changed or removed.`,
  ])
  const added = next.history.slice(prevN)
  const human = added.find((h) => !["drafted", "needs-review"].includes(h.action))
  if (human) refuse(target, "precedent", [
    `a chat may only draft a precedent — the entry "${human.action}" in ${target} must be written by a person.`,
    `Ask the person to run: node src/precedents/approve.ts ${next.id} --by "<their name>"  (or to edit the file themselves).`,
  ])
  const problems: string[] = []
  if (next.kind === "exception" && !next.valid_until) problems.push("an exception needs valid_until")
  if (!next.evidence.length) problems.push("evidence is empty")
  if (!next.reason) problems.push("reason is empty")
  if (!isOurRule(next.rule) && !next.match) problems.push(`a precedent on a rule that is not ours (${next.rule}) needs match: { check, selector } — which check inside the rule, on which element`)
  if (next.scope === "tokens" && !next.subject.tokens?.length) problems.push("scope tokens needs subject.tokens")
  if (next.scope === "component" && !next.subject.component) problems.push("scope component needs subject.component")
  if (next.scope === "story" && !next.subject.story) problems.push("scope story needs subject.story")
  if (problems.length) refuse(target, "precedent", [`${target} is incomplete:`, ...problems.map((p) => "• " + p)])
  record("passed", target, "precedent", [], added.map((h) => h.action).join(",") || "edited")
  process.exit(0)
}

function isOurRule(id: string): boolean {
  return existsSync(join(ROOT, "rules", "own", `${id}.md`))
}

// ----------------------------------------------------------------- rules ----
if (kind === "ruleText" || kind === "ruleCode") {
  if (!before) { record("passed", target, kind, [], "new rule"); process.exit(0) }
  const sig = kind === "ruleText" ? ruleTextSignature : ruleCodeSignature
  const ver = kind === "ruleText" ? (s: string) => s.match(/^version:\s*(\S+)/m)?.[1] : (s: string) => s.match(/version:\s*"([^"]+)"/)?.[1]
  if (sig(before) !== sig(after) && ver(before) === ver(after)) refuse(target, kind, [
    `${target}: what the rule checks changed, but version stayed ${ver(after) ?? "unset"}.`,
    "Bump version in both rules/own/<id>.md and src/rules/<id>.ts; precedents on the old version go to needs-review.",
  ])
  record("passed", target, kind)
  process.exit(0)
}

function ruleTextSignature(md: string): string {
  const pick = (h: string) => {
    const m = md.match(new RegExp(`^## ${h}\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`, "m"))
    return (m?.[1] ?? "").replace(/\s+/g, " ").trim()
  }
  return pick("Applicability") + "|" + pick("Expectation")
}
function ruleCodeSignature(ts: string): string {
  const m = ts.match(/export const RULE = \{([\s\S]*?)\} as const/)
  return (m?.[1] ?? "").replace(/version:\s*"[^"]*",?/, "").replace(/\s+/g, " ")
}

// --------------------------------------------------------------- stories ----
if (kind === "story") {
  const prevX = expectedBlocks(before)
  const nextX = expectedBlocks(after)
  const changed = [...nextX].filter(([name, x]) => prevX.has(name) && prevX.get(name) !== x)
  const flips = changed.filter(([name]) => /wcag:\s*"fail"/.test(prevX.get(name)!) && /wcag:\s*"pass"/.test(nextX.get(name)!))
  if (flips.length) {
    const precedents = loadPrecedents().filter((p) => p.status === "approved")
    const component = target.split("/").pop()!.replace(/\.stories\.tsx?$/, "")
    for (const [name] of flips) {
      const story = `${component} › ${storyTitle(name)}`
      // the rule the story expected to fire — a precedent must be on that rule
      const expectedRule = prevX.get(name)!.match(/axe:\s*"([^"]+)"/)?.[1]
      const covered = precedents.some((p) =>
        p.rule === expectedRule &&
        (p.scope === "story" ? p.subject.story === story :
         p.scope === "component" ? p.subject.component === component :
         true) // tokens / rule: wide enough to cover any story of the system
      )
      if (!covered) refuse(target, "story", [
        `expected answer of "${story}" flips from fail to pass without an approved precedent.`,
        "An expected answer is written before the run and is not adjusted to the result. If the component was really fixed, keep the planted failure as its own story and say in evidence what changed — or record the decision as a precedent first.",
      ])
    }
  }
  record("passed", target, "story", changed.map(([n, x]) => ({ story: n, expected: x.slice(0, 200) })), changed.length ? "expected changed" : undefined)
  process.exit(0)
}

function expectedBlocks(src: string): Map<string, string> {
  const out = new Map<string, string>()
  const re = /export const (\w+)[\s\S]*?expected:\s*\{([\s\S]*?)\n\s*\},?\s*\n\s*\}/g
  let m: RegExpExecArray | null
  while ((m = re.exec(src))) out.set(m[1], m[2].replace(/\s+/g, " ").trim())
  return out
}
function storyTitle(exportName: string): string {
  return exportName.replace(/_$/, "").replace(/([a-z0-9])([A-Z])/g, "$1 $2")
}

// ----------------------------------------------------------------- theme ----
if (kind === "theme") {
  const was = new Map(fromTokens(readTokens(before), file).map((f) => [f.subject.theme, f]))
  const now = fromTokens(readTokens(after), file)

  const precedents = loadPrecedents()
  const accepted = new Map<string, string>()
  for (const f of now) {
    if (f.outcome !== "failed") continue
    const p = findPrecedent(f, [RULE.borderToken, RULE.backgroundToken], precedents)
    if (p) {
      accepted.set(f.subject.theme!, p.id)
      f.evidence += ` — accepted by ${p.id} (${p.scope}, until ${p.valid_until ?? "revoked"}, approved by ${p.history.find((h) => h.action === "approved")?.by ?? "?"})`
    }
  }
  const regressions = now.filter((f) => f.outcome === "failed" && !accepted.has(f.subject.theme!) && was.get(f.subject.theme)?.outcome !== "failed")
  const stillFailing = now.filter((f) => f.outcome === "failed" && !accepted.has(f.subject.theme!) && was.get(f.subject.theme)?.outcome === "failed")
  const unchecked = now.filter((f) => f.outcome === "cantTell")

  if (regressions.length) refuse(target, "theme", [
    `write to ${target} refused — rule ${RULE.id} v${RULE.version} (WCAG ${RULE.criterion}) would start failing:`,
    ...regressions.map((f) => `✗ ${f.evidence}`),
    `Keep ${RULE.borderToken} at ${RULE.threshold}:1 or better against ${RULE.backgroundToken} in every theme, then write again.`,
  ], now)

  const decision = stillFailing.length ? "noted" : accepted.size ? "accepted" : unchecked.length ? "unchecked" : "passed"
  record(decision, target, "theme", now)
  const say = (head: string, items: typeof now, mark: string, tail?: string) =>
    console.error(["shadcn-wcag-compliance: " + head, ...items.map((f) => `  ${mark} ${f.evidence}`), ...(tail ? [tail] : [])].join("\n"))
  if (accepted.size) say(`${RULE.id} fails in ${target}, accepted by precedent — the write goes through:`, now.filter((f) => accepted.has(f.subject.theme!)), "≈")
  if (unchecked.length) say(`could not check ${RULE.id} in ${target} — the write goes through unchecked:`, unchecked, "?", "Storybook (Accessibility › Inconclusive) or a person has to look at this pair.")
  if (stillFailing.length) say(`note — ${RULE.id} already fails in ${target} and this write does not fix it:`, stillFailing, "•")
  process.exit(0)
}

process.exit(0)

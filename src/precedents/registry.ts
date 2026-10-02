// The precedent register, read side: parses a precedent file (format 2) and
// answers one question for an executor: is there an active precedent that
// covers this finding? Pure — no file system — so the Storybook page can
// use it in the browser; Node callers load files through load.ts.

import type { Finding } from "../finding.ts"

export interface HistoryEntry { at: string; action: string; by?: string; why?: string }
export interface Precedent {
  file: string
  format: number
  id: string
  kind: "exception" | "interpretation"
  rule: string
  rule_version: string
  criterion?: string
  scope: "story" | "component" | "tokens" | "rule"
  subject: { file?: string; theme?: string; tokens?: string[]; component?: string; story?: string }
  decision: "accept" | "reject" | "not-applicable"
  evidence?: string
  reason?: string
  valid_until?: string
  history: HistoryEntry[]
  status: string // derived: last history action, or "expired" when past valid_until
  body: string
}

export function parsePrecedent(text: string, file: string): Precedent | null {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!m) return null
  const fm = parseFrontMatter(m[1])
  if (Number(fm.format) !== 2) return null // older drafts are not read by code
  const history: HistoryEntry[] = (fm.history as HistoryEntry[] | undefined) ?? []
  const last = history.at(-1)?.action ?? "drafted"
  const expired = fm.valid_until && new Date(String(fm.valid_until)) < new Date() && last === "approved"
  return {
    file,
    format: 2,
    id: String(fm.id),
    kind: fm.kind as Precedent["kind"],
    rule: String(fm.rule),
    rule_version: String(fm.rule_version),
    criterion: fm.criterion ? String(fm.criterion) : undefined,
    scope: fm.scope as Precedent["scope"],
    subject: (fm.subject as Precedent["subject"]) ?? {},
    decision: fm.decision as Precedent["decision"],
    evidence: fm.evidence ? String(fm.evidence) : undefined,
    reason: fm.reason ? String(fm.reason) : undefined,
    valid_until: fm.valid_until ? String(fm.valid_until) : undefined,
    history,
    status: expired ? "expired" : last,
    body: m[2].trim(),
  }
}

export function isActive(p: Precedent): boolean {
  return p.status === "approved" && (p.decision === "accept" || p.decision === "not-applicable")
}

const SCOPE_ORDER: Precedent["scope"][] = ["story", "component", "tokens", "rule"]

// Narrow to wide; first match wins. `tokens` is what the rule compared.
export function findPrecedent(finding: Pick<Finding, "rule" | "ruleVersion" | "subject">, tokens: string[] | undefined, all: Precedent[]): Precedent | undefined {
  const candidates = all.filter((p) => p.rule === finding.rule && p.rule_version === finding.ruleVersion && isActive(p))
  for (const scope of SCOPE_ORDER) {
    const hit = candidates.find((p) => p.scope === scope && matches(p, finding.subject, tokens))
    if (hit) return hit
  }
  return undefined
}

function matches(p: Precedent, s: Finding["subject"], tokens?: string[]): boolean {
  const sameTheme = !p.subject.theme || !s.theme || p.subject.theme === s.theme
  switch (p.scope) {
    case "story": return !!s.story && p.subject.story === s.story && sameTheme
    case "component": return !!s.component && p.subject.component === s.component && sameTheme
    case "tokens": {
      const want = [...(p.subject.tokens ?? [])].sort().join(",")
      const have = [...(tokens ?? [])].sort().join(",")
      const sameFile = !p.subject.file || !s.file || s.file.endsWith(p.subject.file) || p.subject.file.endsWith(s.file)
      return want === have && sameTheme && sameFile
    }
    case "rule": return true
  }
}

// A deliberately small YAML reader: flat keys, one level of nesting under
// `subject:`, inline arrays, `>` folded strings, and a `history:` list of
// inline maps `- { at: …, action: …, by: "…" }`. Enough for format 2; a
// precedent that needs more is a sign the format should grow, not the parser.
export function parseFrontMatter(src: string): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  const lines = src.split("\n")
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim() || line.trim().startsWith("#")) continue
    const kv = line.match(/^(\w+):\s*(.*)$/)
    if (!kv) continue
    const [, key, rawVal] = kv
    const val = stripComment(rawVal)
    if (val === ">" || val === "|") {
      const buf: string[] = []
      while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) buf.push(lines[++i].trim())
      out[key] = buf.join(" ")
    } else if (val === "" && key === "history") {
      const list: HistoryEntry[] = []
      while (i + 1 < lines.length && /^\s+-\s*\{/.test(lines[i + 1])) list.push(parseInlineMap(lines[++i]) as unknown as HistoryEntry)
      out[key] = list
    } else if (val === "") {
      const obj: Record<string, unknown> = {}
      while (i + 1 < lines.length && /^\s+\w+:/.test(lines[i + 1])) {
        const sub = lines[++i].trim().match(/^(\w+):\s*(.*)$/)!
        obj[sub[1]] = scalar(stripComment(sub[2]))
      }
      out[key] = obj
    } else {
      out[key] = scalar(val)
    }
  }
  return out
}

// A ` # comment` ends a value — unless the value is quoted, where # is text.
function stripComment(v: string): string {
  const t = v.trim()
  if (/^["']/.test(t)) return t
  return t.replace(/\s+#.*$/, "").trim()
}

function parseInlineMap(line: string): Record<string, unknown> {
  const inner = line.slice(line.indexOf("{") + 1, line.lastIndexOf("}"))
  const obj: Record<string, unknown> = {}
  for (const part of inner.match(/\w+:\s*(?:"[^"]*"|'[^']*'|[^,]+)/g) ?? []) {
    const m = part.match(/^(\w+):\s*(.*)$/)!
    obj[m[1]] = scalar(m[2].trim())
  }
  return obj
}

function scalar(v: string): unknown {
  if (/^\[.*\]$/.test(v)) return v.slice(1, -1).split(",").map((x) => scalar(x.trim()))
  if (/^".*"$/.test(v) || /^'.*'$/.test(v)) return v.slice(1, -1)
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v)
  return v
}

// The decision register, read side: parses a decision file and answers one
// question for an executor: is there an active decision that covers this
// finding? Pure — no file system — so the Storybook page can use it in the
// browser; Node callers load files through load.ts.
//
// Format 3 (2026-10-06): the register was called "precedents" and the
// verdict field "decision"; ids started with p-. Format 2 files are still
// read (decision → verdict), so a record written before the rename keeps
// its meaning. New writes are format 3 (the decision guard says so).

import type { Finding } from "../finding.ts"
import { isApprover } from "./approvers.ts"

export const DECISION_FORMAT = 3

// What the reader knows about the rules today, so a decision approved for
// an older version of its rule shows needs-review instead of "approved".
// Own rules: id → version from rules/own/<id>.md. axe rules: the installed
// axe-core version (all of axe's rules move together).
export interface ReviewContext { ownRuleVersions?: Record<string, string>; axeVersion?: string }

export interface HistoryEntry { at: string; action: string; by?: string; why?: string }
export interface Decision {
  file: string
  format: number
  id: string
  formerly?: string // the id before the rename (p-…), so old runs still resolve
  kind: "exception" | "interpretation"
  rule: string
  rule_version: string
  criterion?: string
  scope: "story" | "component" | "tokens" | "rule"
  subject: { file?: string; theme?: string; tokens?: string[]; component?: string; story?: string }
  verdict: "accept" | "reject" | "not-applicable"
  // For rules with several reasons to say "cantTell" (axe's), which one and
  // on which element this decision is about. Required for non-own rules.
  match?: { check?: string; selector?: string }
  evidence: string[]
  reason?: string
  valid_until?: string
  history: HistoryEntry[]
  // Derived, never written: the last history action, except that an
  // approval stops counting — "expired" past valid_until, "needs-review"
  // when the approver is not on the list or the rule has moved to another
  // version since. `review` says which.
  status: string
  review?: string
  body: string
}

export function parseDecision(text: string, file: string, ctx: ReviewContext = {}): Decision | null {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!m) return null
  const fm = parseFrontMatter(m[1])
  const format = Number(fm.format)
  if (format !== 2 && format !== 3) return null // format 1 drafts are not read by code
  const history: HistoryEntry[] = (fm.history as HistoryEntry[] | undefined) ?? []
  const lastEntry = history.at(-1)
  let status = lastEntry?.action ?? "drafted"
  let review: string | undefined
  const rule = String(fm.rule)
  const ruleVersion = String(fm.rule_version)
  if (status === "approved") {
    const current = ruleVersion.startsWith("axe-core")
      ? ctx.axeVersion && `axe-core ${ctx.axeVersion}`
      : ctx.ownRuleVersions?.[rule]
    if (!isApprover(lastEntry?.by)) {
      status = "needs-review"
      review = `approved by ${lastEntry?.by ?? "nobody named"}, who is not on the approvers list (src/decisions/approvers.ts)`
    } else if (fm.valid_until && new Date(String(fm.valid_until)) < new Date()) {
      status = "expired"
    } else if (current && current !== ruleVersion) {
      status = "needs-review"
      review = `approved for ${rule} ${label(ruleVersion)}; the rule is now ${label(current)} — a person re-approves it for the new version or lets it go`
    }
  }
  return {
    file,
    format,
    id: String(fm.id),
    formerly: fm.formerly ? String(fm.formerly) : undefined,
    kind: fm.kind as Decision["kind"],
    rule,
    rule_version: ruleVersion,
    criterion: fm.criterion ? String(fm.criterion) : undefined,
    scope: fm.scope as Decision["scope"],
    subject: (fm.subject as Decision["subject"]) ?? {},
    verdict: (format === 2 ? fm.decision : fm.verdict) as Decision["verdict"],
    match: (fm.match as Decision["match"]) ?? undefined,
    evidence: Array.isArray(fm.evidence) ? fm.evidence.map(String) : fm.evidence ? String(fm.evidence).split(/;\s+/) : [],
    reason: fm.reason ? String(fm.reason) : undefined,
    valid_until: fm.valid_until ? String(fm.valid_until) : undefined,
    history,
    status,
    review,
    body: m[2].trim(),
  }
}

const label = (v: string) => (/^\d/.test(v) ? `v${v}` : v)

export function isActive(d: Decision): boolean {
  return d.status === "approved" && (d.verdict === "accept" || d.verdict === "not-applicable")
}

const SCOPE_ORDER: Decision["scope"][] = ["story", "component", "tokens", "rule"]

// Narrow to wide; first match wins. `tokens` is what the rule compared.
// `includeDrafts` is for the Stop hook only: it asks "has anyone looked at
// this?", not "is it decided?".
// A decision names a rule by our id, or — written before axe's rules got our
// numbers (2026-10-06) — by axe's own name, which the finding carries as `aka`.
export function findDecision(
  finding: Pick<Finding, "rule" | "ruleVersion" | "subject" | "aka">,
  tokens: string[] | undefined,
  all: Decision[],
  opts: { includeDrafts?: boolean } = {}
): Decision | undefined {
  const candidates = all.filter(
    (d) =>
      (d.rule === finding.rule || (!!finding.aka && d.rule === finding.aka)) &&
      d.rule_version === finding.ruleVersion &&
      (opts.includeDrafts ? d.status !== "revoked" : isActive(d))
  )
  for (const scope of SCOPE_ORDER) {
    const hit = candidates.find((d) => d.scope === scope && matches(d, finding.subject, tokens) && matchesDetail(d, finding.subject))
    if (hit) return hit
  }
  return undefined
}

// `match.selector` is a substring of the element's selector; `match.check`
// is compared by the executor that knows axe's check ids (not here).
function matchesDetail(d: Decision, s: Finding["subject"]): boolean {
  if (!d.match?.selector) return true
  return !!s.selector && s.selector.includes(d.match.selector)
}

function matches(d: Decision, s: Finding["subject"], tokens?: string[]): boolean {
  const sameTheme = !d.subject.theme || !s.theme || d.subject.theme === s.theme
  switch (d.scope) {
    case "story": return !!s.story && d.subject.story === s.story && sameTheme
    case "component": return !!s.component && d.subject.component === s.component && sameTheme
    case "tokens": {
      const want = [...(d.subject.tokens ?? [])].sort().join(",")
      const have = [...(tokens ?? [])].sort().join(",")
      const sameFile = !d.subject.file || !s.file || s.file.endsWith(d.subject.file) || d.subject.file.endsWith(s.file)
      return want === have && sameTheme && sameFile
    }
    case "rule": return true
  }
}

// A deliberately small YAML reader: flat keys, one level of nesting under
// `subject:`, inline arrays, `>` folded strings, and a `history:` list of
// inline maps `- { at: …, action: …, by: "…" }`. Enough for format 3; a
// decision that needs more is a sign the format should grow, not the parser.
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
    } else if (val === "" && i + 1 < lines.length && /^\s+-\s+(?!\{)/.test(lines[i + 1])) {
      const list: unknown[] = []
      while (i + 1 < lines.length && /^\s+-\s+(?!\{)/.test(lines[i + 1])) list.push(scalar(lines[++i].trim().slice(2).trim()))
      out[key] = list
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
  const q = t[0]
  if (q === '"' || q === "'") {
    const end = t.indexOf(q, 1)
    return end > 0 ? t.slice(0, end + 1) : t
  }
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
  if (/^".*"$/.test(v)) return v.slice(1, -1).replace(/\\"/g, '"')
  if (/^'.*'$/.test(v)) return v.slice(1, -1)
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v)
  return v
}

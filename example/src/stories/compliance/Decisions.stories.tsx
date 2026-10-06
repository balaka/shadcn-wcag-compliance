import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import axe from "axe-core"
import { ChevronRightIcon, ExternalLinkIcon } from "lucide-react"

import { parseDecision, type Decision } from "../../../../src/decisions/registry"
import { APPROVERS } from "../../../../src/decisions/approvers"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// The decision register, as a page in Storybook: the same files from
// decisions/, read at build time by Vite, nothing copied. Decisions are
// made in the files (and only by a person on the approvers list); this page
// only shows them. Built from the design system's own components, so the
// page itself goes through the same checks as everything else in here.

const files = import.meta.glob("../../../../decisions/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>
const ruleFiles = import.meta.glob("../../../../rules/own/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>

// What the rules are today, so an approval given for an older version shows
// as needs-review here exactly as it does in the hook and in run.ts.
const ownRuleVersions = Object.fromEntries(
  Object.entries(ruleFiles).flatMap(([path, text]) => {
    const v = text.match(/^version:\s*(\S+)/m)?.[1]
    return v ? [[path.split("/").pop()!.replace(/\.md$/, ""), v]] : []
  })
)

const fromFiles: Decision[] = Object.entries(files)
  .filter(([path]) => !path.endsWith("README.md"))
  .map(([path, text]) => parseDecision(text, path.split("/").pop()!, { ownRuleVersions, axeVersion: axe.version }))
  .filter((d): d is Decision => !!d)
  .sort((a, b) => b.id.localeCompare(a.id))

const RULES = [
  "A decision is a person's call on a case a rule alone could not settle.",
  "Two kinds: exception — the rule is right, the violation is accepted for a time; interpretation — how a rule is read in a case like this.",
  "Scope, narrow to wide: story → component → tokens → rule. The narrowest match wins.",
  "A decision binds to one rule version. When the rule moves on, the decision shows needs review and stops counting until a person approves it again.",
  `An agent can only draft. Nothing acts until a person on the approvers list (${APPROVERS.map((a) => a.name).join(", ")}) approves it — by name, with a date.`,
  "An accepted violation stays in every report, marked with the decision id. It never disappears.",
  "Exceptions expire. After valid_until the hook blocks again on its own.",
  "Source of truth: the files in decisions/. This page only shows them.",
]

const REPO = "https://github.com/balaka/shadcn-wcag-compliance/blob/main"
const CRITERION_ANCHOR: Record<string, string> = { "1.4.11": "non-text-contrast", "1.4.3": "contrast-minimum", "3.3.2": "labels-or-instructions", "4.1.2": "name-role-value" }

const statusVariant: Record<string, React.ComponentProps<typeof Badge>["variant"]> = {
  approved: "default",
  drafted: "secondary",
  "needs-review": "outline",
  expired: "outline",
  revoked: "destructive",
}

const approver = (d: Decision) => [...d.history].reverse().find((h) => h.action === "approved")
const isAxe = (d: Decision) => /^axe-core/.test(d.rule_version)
// Whose check produced the finding: axe's own rule (its version is axe's) or ours.
const foundBy = (d: Decision) => (isAxe(d) ? `axe (${d.rule_version})` : "our rule")
const ruleHref = (d: Decision) =>
  isAxe(d)
    ? `https://dequeuniversity.com/rules/axe/${d.rule_version.replace(/^axe-core\s+/, "").split(".").slice(0, 2).join(".")}/${d.rule}`
    : `${REPO}/rules/own/${d.rule}.md`
const uniq = (xs: (string | undefined)[]) => [...new Set(xs.filter((x): x is string => !!x))].sort()

function Register({ decisions }: { decisions: Decision[] }) {
  const [rule, setRule] = React.useState("")
  const [status, setStatus] = React.useState("")
  const [person, setPerson] = React.useState("")
  const [since, setSince] = React.useState("")

  const shown = decisions.filter(
    (d) =>
      (!rule || d.rule === rule) &&
      (!status || d.status === status) &&
      (!person || approver(d)?.by === person) &&
      (!since || (approver(d)?.at ?? d.history[0]?.at ?? "") >= since)
  )
  const dates = uniq(decisions.map((d) => (approver(d)?.at ?? d.history[0]?.at)?.slice(0, 10)))
  const review = decisions.filter((d) => d.status === "needs-review").length

  return (
    <div className="mx-auto max-w-5xl p-6 text-sm">
      <h1 className="text-xl font-semibold">Decisions</h1>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
        {RULES.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>

      <h2 className="mt-8 text-base font-semibold">Register</h2>
      <p className="mt-1 text-muted-foreground">
        {decisions.filter((d) => d.status === "approved").length} active · {review ? `${review} need review · ` : ""}
        {decisions.length} on file
        {shown.length !== decisions.length ? ` · ${shown.length} shown` : ""}
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <Filter id="f-rule" label="Rule" value={rule} onChange={setRule} options={uniq(decisions.map((d) => d.rule))} />
        <Filter id="f-status" label="Status" value={status} onChange={setStatus} options={uniq(decisions.map((d) => d.status))} />
        <Filter id="f-person" label="Approved by" value={person} onChange={setPerson} options={uniq(decisions.map((d) => approver(d)?.by))} />
        <Filter id="f-since" label="Since" value={since} onChange={setSince} options={dates} />
        {(rule || status || person || since) && (
          <Button variant="ghost" size="sm" onClick={() => { setRule(""); setStatus(""); setPerson(""); setSince("") }}>
            Clear
          </Button>
        )}
      </div>

      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-8"><span className="sr-only">Details</span></TableHead>
            <TableHead>Rule</TableHead>
            <TableHead>Verdict</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Scope</TableHead>
            <TableHead>Approved by</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shown.map((d) => (
            <Row key={d.id} d={d} />
          ))}
          {shown.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                Nothing matches these filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function Filter({ id, label, value, onChange, options }: { id: string; label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="grid gap-1">
      <Label htmlFor={id} className="text-xs text-muted-foreground">{label}</Label>
      <NativeSelect id={id} value={value} onChange={(e) => onChange(e.target.value)} className="min-w-40">
        <NativeSelectOption value="">all</NativeSelectOption>
        {options.map((o) => (
          <NativeSelectOption key={o} value={o}>{o}</NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  )
}

// A link that leaves Storybook: marked with an icon and said to screen readers.
function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-foreground" href={href} target="_blank" rel="noreferrer">
      {children}
      <ExternalLinkIcon className="size-3" aria-hidden="true" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}

const SHOWN_TOKENS = 2

function Scope({ d }: { d: Decision }) {
  const [all, setAll] = React.useState(false)
  const tokens = d.subject.tokens ?? []
  const shown = all ? tokens : tokens.slice(0, SHOWN_TOKENS)
  const hidden = tokens.length - shown.length
  return (
    <div className="flex flex-wrap items-center gap-1">
      <span className="font-medium">{d.scope}</span>
      {d.subject.story && <Badge variant="outline">{d.subject.story}</Badge>}
      {d.subject.component && <Badge variant="outline">{d.subject.component}</Badge>}
      {shown.map((t) => (
        <Badge key={t} variant="outline" className="font-mono">{t}</Badge>
      ))}
      {hidden > 0 && (
        <Button variant="link" size="xs" className="h-5 px-1" onClick={() => setAll(true)} aria-label={`Show all ${tokens.length} tokens`}>
          +{hidden} more
        </Button>
      )}
      {all && tokens.length > SHOWN_TOKENS && (
        <Button variant="link" size="xs" className="h-5 px-1" onClick={() => setAll(false)}>less</Button>
      )}
      {d.subject.theme && <Badge variant="secondary">{d.subject.theme}</Badge>}
    </div>
  )
}

function Row({ d }: { d: Decision }) {
  const [open, setOpen] = React.useState(false)
  const a = approver(d)
  const detailsId = `details-${d.id}`
  return (
    <>
      <TableRow className="align-top">
        <TableCell className="pr-0">
          <Button
            variant="ghost"
            size="icon-xs"
            aria-expanded={open}
            aria-controls={detailsId}
            aria-label={open ? `Hide details of ${d.id}` : `Show details of ${d.id}`}
            onClick={() => setOpen(!open)}
          >
            <ChevronRightIcon className={open ? "rotate-90 transition-transform" : "transition-transform"} />
          </Button>
        </TableCell>
        <TableCell className="font-mono text-xs">
          {d.rule} <span className="text-muted-foreground">{isAxe(d) ? d.rule_version : `v${d.rule_version}`}</span>
        </TableCell>
        <TableCell>{d.verdict}</TableCell>
        <TableCell><Badge variant={statusVariant[d.status] ?? "outline"}>{d.status === "needs-review" ? "needs review" : d.status}</Badge></TableCell>
        <TableCell className="whitespace-normal">
          <Scope d={d} />
        </TableCell>
        <TableCell>
          {a ? (
            <>
              <div className="font-medium">{a.by}</div>
              <div className="text-muted-foreground">{a.at.slice(0, 10)}</div>
            </>
          ) : (
            <span className="text-muted-foreground">not approved</span>
          )}
        </TableCell>
      </TableRow>
      {open && (
        <TableRow id={detailsId} className="bg-muted/40 hover:bg-muted/40">
          <TableCell />
          <TableCell colSpan={5} className="py-4 whitespace-normal">
            <div className="grid max-w-3xl gap-3 break-words">
              <Card size="sm">
                <CardHeader><CardTitle>Finding</CardTitle></CardHeader>
                <CardContent>
                  <p className="mb-2 text-muted-foreground">Found by {foundBy(d)}{d.kind === "interpretation" ? " — reported as \"cannot tell\", not as a violation" : ""}</p>
                  <ol className="list-decimal space-y-1 pl-5">
                    {d.evidence.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ol>
                  <p className="mt-3 text-muted-foreground">
                    Rule applied: <ExternalLink href={ruleHref(d)}>{d.rule} {isAxe(d) ? d.rule_version : `v${d.rule_version}`}</ExternalLink>
                    {d.criterion ? (
                      <>
                        {" "}· WCAG <ExternalLink href={`https://www.w3.org/TR/WCAG22/#${CRITERION_ANCHOR[d.criterion] ?? ""}`}>{d.criterion}</ExternalLink>
                      </>
                    ) : null}
                  </p>
                </CardContent>
              </Card>
              <Card size="sm">
                <CardHeader><CardTitle>Verdict</CardTitle></CardHeader>
                <CardContent>
                  <p>
                    <span className="font-medium">{d.verdict}</span>
                    {a ? ` — ${a.by}, ${a.at.slice(0, 10)}` : " — not approved yet"}
                    {d.valid_until ? ` · until ${d.valid_until}` : ""}
                  </p>
                  {d.review ? (
                    <p className="mt-2"><span className="font-medium">Needs review</span> — {d.review}</p>
                  ) : null}
                  <p className="mt-2 text-muted-foreground"><span className="font-medium text-foreground">Why</span> — {d.reason}</p>
                </CardContent>
              </Card>
              <Card size="sm">
                <CardHeader><CardTitle>History</CardTitle></CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {[...d.history].reverse().map((h, i) => (
                      <li key={i} className="grid grid-cols-[8.5rem_1fr] gap-2">
                        <span className="font-mono text-xs text-muted-foreground">{h.at.replace("T", " ")}</span>
                        <span>
                          <span className="font-medium">{h.action}</span>
                          {h.by ? <span className="text-muted-foreground"> · {h.by}</span> : null}
                          {h.why ? <div className="text-muted-foreground">{h.why}</div> : null}
                        </span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
              <p className="font-mono text-xs text-muted-foreground">
                {d.id}{d.formerly ? ` (formerly ${d.formerly})` : ""} · {d.kind} · {d.file}{d.subject.file ? ` · ${d.subject.file}` : ""}
              </p>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}

const meta = {
  title: "WCAG compliance/Decisions",
  component: Register,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Register>

export default meta
type Story = StoryObj<typeof meta>

export const RegisterPage: Story = { name: "Register", args: { decisions: fromFiles } }

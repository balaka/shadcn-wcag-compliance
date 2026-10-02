import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { ChevronRightIcon } from "lucide-react"

import { parsePrecedent, type Precedent } from "../../../../src/precedents/registry"
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

// The precedent register, as a page in Storybook: the same files from
// precedents/, read at build time by Vite, nothing copied. Decisions are
// made in the files (and only by a person); this page only shows them.
// Built from the design system's own components, so the page itself goes
// through the same checks as everything else in here.

const files = import.meta.glob("../../../../precedents/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>

const fromFiles: Precedent[] = Object.entries(files)
  .filter(([path]) => !path.endsWith("README.md"))
  .map(([path, text]) => parsePrecedent(text, path.split("/").pop()!))
  .filter((p): p is Precedent => !!p)
  .sort((a, b) => b.id.localeCompare(a.id))

const RULES = [
  "A precedent is a person's decision on a case a rule alone could not settle.",
  "Two kinds: exception — the rule is right, the violation is accepted for a time; interpretation — how a judgement rule is read in a case like this.",
  "Scope, narrow to wide: story → component → tokens → rule. The narrowest match wins.",
  "A precedent binds to one rule version. A new version puts it in needs-review.",
  "The model can only draft. Nothing acts until a person approves — by name, with a date.",
  "An accepted violation stays in every report, marked with the precedent id. It never disappears.",
  "Exceptions expire. After valid_until the hook blocks again on its own.",
  "Source of truth: the files in precedents/. This page only shows them.",
]

const statusVariant: Record<string, React.ComponentProps<typeof Badge>["variant"]> = {
  approved: "default",
  drafted: "secondary",
  expired: "outline",
  revoked: "destructive",
}

const approver = (p: Precedent) => p.history.find((h) => h.action === "approved")
const uniq = (xs: (string | undefined)[]) => [...new Set(xs.filter((x): x is string => !!x))].sort()

function Register({ precedents }: { precedents: Precedent[] }) {
  const [rule, setRule] = React.useState("")
  const [status, setStatus] = React.useState("")
  const [person, setPerson] = React.useState("")
  const [since, setSince] = React.useState("")

  const shown = precedents.filter(
    (p) =>
      (!rule || p.rule === rule) &&
      (!status || p.status === status) &&
      (!person || approver(p)?.by === person) &&
      (!since || (approver(p)?.at ?? p.history[0]?.at ?? "") >= since)
  )
  const dates = uniq(precedents.map((p) => (approver(p)?.at ?? p.history[0]?.at)?.slice(0, 10)))

  return (
    <div className="mx-auto max-w-5xl p-6 text-sm">
      <h1 className="text-xl font-semibold">Precedents</h1>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
        {RULES.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>

      <h2 className="mt-8 text-base font-semibold">Register</h2>
      <p className="mt-1 text-muted-foreground">
        {precedents.filter((p) => p.status === "approved").length} active · {precedents.length} on file
        {shown.length !== precedents.length ? ` · ${shown.length} shown` : ""}
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <Filter id="f-rule" label="Rule" value={rule} onChange={setRule} options={uniq(precedents.map((p) => p.rule))} />
        <Filter id="f-status" label="Status" value={status} onChange={setStatus} options={uniq(precedents.map((p) => p.status))} />
        <Filter id="f-person" label="Approved by" value={person} onChange={setPerson} options={uniq(precedents.map((p) => approver(p)?.by))} />
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
            <TableHead className="w-8" />
            <TableHead>Rule</TableHead>
            <TableHead>Decision</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Scope</TableHead>
            <TableHead>Approved by</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shown.map((p) => (
            <Row key={p.id} p={p} />
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

const SHOWN_TOKENS = 2

function Scope({ p }: { p: Precedent }) {
  const [all, setAll] = React.useState(false)
  const tokens = p.subject.tokens ?? []
  const shown = all ? tokens : tokens.slice(0, SHOWN_TOKENS)
  const hidden = tokens.length - shown.length
  return (
    <div className="flex flex-wrap items-center gap-1">
      <span className="font-medium">{p.scope}</span>
      {p.subject.story && <Badge variant="outline">{p.subject.story}</Badge>}
      {p.subject.component && <Badge variant="outline">{p.subject.component}</Badge>}
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
      {p.subject.theme && <Badge variant="secondary">{p.subject.theme}</Badge>}
    </div>
  )
}

function Row({ p }: { p: Precedent }) {
  const [open, setOpen] = React.useState(false)
  const a = approver(p)
  const detailsId = `details-${p.id}`
  return (
    <>
      <TableRow className="align-top">
        <TableCell className="pr-0">
          <Button
            variant="ghost"
            size="icon-xs"
            aria-expanded={open}
            aria-controls={detailsId}
            aria-label={open ? `Hide details of ${p.id}` : `Show details of ${p.id}`}
            onClick={() => setOpen(!open)}
          >
            <ChevronRightIcon className={open ? "rotate-90 transition-transform" : "transition-transform"} />
          </Button>
        </TableCell>
        <TableCell className="font-mono text-xs">
          {p.rule} <span className="text-muted-foreground">v{p.rule_version}</span>
        </TableCell>
        <TableCell>{p.decision}</TableCell>
        <TableCell><Badge variant={statusVariant[p.status] ?? "outline"}>{p.status}</Badge></TableCell>
        <TableCell className="whitespace-normal">
          <Scope p={p} />
        </TableCell>
        <TableCell>
          {a ? (
            <>
              <div className="font-medium">{a.at.slice(0, 10)}</div>
              <div className="text-muted-foreground">{a.by}</div>
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
                  <p className="whitespace-pre-wrap">{p.evidence}</p>
                  <p className="mt-2 text-muted-foreground">WCAG {p.criterion} · rule {p.rule} v{p.rule_version}</p>
                </CardContent>
              </Card>
              <Card size="sm">
                <CardHeader><CardTitle>Decision</CardTitle></CardHeader>
                <CardContent>
                  <p>
                    <span className="font-medium">{p.decision}</span>
                    {a ? ` — ${a.by}, ${a.at.slice(0, 10)}` : " — not approved yet"}
                    {p.valid_until ? ` · until ${p.valid_until}` : ""}
                  </p>
                  <p className="mt-2 text-muted-foreground">{p.reason}</p>
                </CardContent>
              </Card>
              <Card size="sm">
                <CardHeader><CardTitle>History</CardTitle></CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {p.history.map((h, i) => (
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
                {p.id} · {p.kind} · {p.file}{p.subject.file ? ` · ${p.subject.file}` : ""}
              </p>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}

// A made-up record with many tokens and a long history, only for this
// page's own stories: checks that the layout wraps instead of stretching.
const stress: Precedent = {
  file: "(not a file — layout check)",
  format: 2,
  id: "p-2026-10-04-99",
  kind: "exception",
  rule: "1.4.11-focus-ring-contrast",
  rule_version: "1",
  criterion: "1.4.11",
  scope: "tokens",
  subject: { file: "example/src/index.css", theme: "dark", tokens: ["--ring", "--background", "--primary", "--primary-foreground", "--sidebar-ring", "--sidebar", "--card", "--popover"] },
  decision: "accept",
  evidence: "dark: --ring oklch(0.556 0 0) at 50% over #0a0a0a = #3f3f3f = 1.87:1; against --primary #e5e5e5 = 11.6:1; needs 3:1 against adjacent colors",
  reason: "A long reason to see how the text wraps: the ring is measured against the page background, but a focused primary button sits on it with a 11.6:1 ring-to-button contrast. The adjacent color in the sense of 1.4.11 is disputed; kept until the rule's version 2 defines which neighbour counts.",
  valid_until: "2026-11-01",
  history: [
    { at: "2026-10-04T10:00", action: "drafted", by: "claude (session 1234abcd)" },
    { at: "2026-10-04T10:30", action: "approved", by: "Jesse Example", why: "agreed in design review" },
    { at: "2026-10-20T09:00", action: "needs-review", why: "rule 1.4.11-focus-ring-contrast bumped to v2" },
  ],
  status: "needs-review",
  body: "",
}

const meta = {
  title: "Compliance/Precedents",
  component: Register,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Register>

export default meta
type Story = StoryObj<typeof meta>

export const RegisterPage: Story = { name: "Register", args: { precedents: fromFiles } }

export const LayoutStress: Story = {
  name: "Layout stress (many tokens)",
  args: { precedents: [stress, ...fromFiles] },
}

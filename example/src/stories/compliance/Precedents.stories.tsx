import type { Meta, StoryObj } from "@storybook/react-vite"

import { parsePrecedent, type Precedent } from "../../../../src/precedents/registry"

// The precedent register, as a page in Storybook: the same files from
// precedents/, read at build time by Vite, nothing copied. Decisions are
// made in the files (and only by a person); this page only shows them.

const files = import.meta.glob("../../../../precedents/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>

const precedents: Precedent[] = Object.entries(files)
  .filter(([path]) => !path.endsWith("README.md"))
  .map(([path, text]) => parsePrecedent(text, path.split("/").pop()!))
  .filter((p): p is Precedent => !!p)
  .sort((a, b) => b.id.localeCompare(a.id))

const tone: Record<string, string> = {
  approved: "bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-100",
  drafted: "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100",
  expired: "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  revoked: "bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-100",
}

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

function Register() {
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
      </p>
      <table className="mt-3 w-full border-collapse">
        <thead>
          <tr className="border-b text-left text-xs text-muted-foreground">
            <th className="py-2 pr-3">id</th>
            <th className="py-2 pr-3">status</th>
            <th className="py-2 pr-3">kind</th>
            <th className="py-2 pr-3">rule</th>
            <th className="py-2 pr-3">scope · subject</th>
            <th className="py-2 pr-3">decision</th>
            <th className="py-2 pr-3">until</th>
          </tr>
        </thead>
        <tbody>
          {precedents.map((p) => (
            <Row key={p.id} p={p} />
          ))}
          {precedents.length === 0 && (
            <tr><td colSpan={7} className="py-6 text-center text-muted-foreground">No precedents yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function Row({ p }: { p: Precedent }) {
  const subject = [p.subject.story, p.subject.component, p.subject.tokens?.join(" / "), p.subject.theme, p.subject.file]
    .filter(Boolean)
    .join(" · ")
  const approved = p.history.find((h) => h.action === "approved")
  return (
    <>
      <tr className="border-b align-top">
        <td className="py-2 pr-3 font-mono text-xs">{p.id}</td>
        <td className="py-2 pr-3"><span className={`rounded px-1.5 py-0.5 text-xs ${tone[p.status] ?? ""}`}>{p.status}</span></td>
        <td className="py-2 pr-3">{p.kind}</td>
        <td className="py-2 pr-3 font-mono text-xs">{p.rule} v{p.rule_version}</td>
        <td className="py-2 pr-3"><span className="font-medium">{p.scope}</span> · {subject}</td>
        <td className="py-2 pr-3">{p.decision}</td>
        <td className="py-2 pr-3">{p.valid_until ?? "—"}</td>
      </tr>
      <tr className="border-b bg-muted/40">
        <td colSpan={7} className="px-3 py-3">
          <div className="grid gap-4 md:grid-cols-3">
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Finding</h3>
              <p className="mt-1">{p.evidence}</p>
              <p className="mt-1 text-xs text-muted-foreground">what the rule measured — WCAG {p.criterion}</p>
            </section>
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Decision</h3>
              <p className="mt-1">
                <span className="font-medium">{p.decision}</span>
                {approved ? ` — ${approved.by}, ${approved.at.slice(0, 10)}` : " — not approved yet"}
              </p>
              <p className="mt-1 text-muted-foreground">{p.reason}</p>
            </section>
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">History</h3>
              <ol className="mt-1 space-y-1">
                {p.history.map((h, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="w-28 shrink-0 font-mono text-xs text-muted-foreground">{h.at.replace("T", " ")}</span>
                    <span>
                      <span className="font-medium">{h.action}</span>
                      {h.by ? <span className="text-muted-foreground"> · {h.by}</span> : null}
                      {h.why ? <div className="text-xs text-muted-foreground">{h.why}</div> : null}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </td>
      </tr>
    </>
  )
}

const meta = {
  title: "Compliance/Precedents",
  component: Register,
  parameters: { layout: "fullscreen", a11y: { test: "off" } },
} satisfies Meta<typeof Register>

export default meta
type Story = StoryObj<typeof meta>

export const Register_: Story = { name: "Register" }

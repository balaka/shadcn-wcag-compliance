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

function Register() {
  return (
    <div className="mx-auto max-w-5xl p-6 text-sm">
      <h1 className="text-xl font-semibold">Precedents</h1>
      <p className="mt-1 text-muted-foreground">
        Decisions a person made where a rule alone could not settle the case. Source: <code>precedents/</code>.
        Only <em>approved</em> ones act on checks; the model can only draft.
      </p>
      <table className="mt-6 w-full border-collapse">
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
        <td colSpan={7} className="px-3 py-2">
          <div className="text-muted-foreground"><span className="font-medium text-foreground">evidence</span> {p.evidence}</div>
          <div className="mt-1 text-muted-foreground"><span className="font-medium text-foreground">reason</span> {p.reason}</div>
          <ol className="mt-2 space-y-0.5 font-mono text-xs">
            {p.history.map((h, i) => (
              <li key={i}>
                {h.at} · {h.action}
                {h.by ? ` · by ${h.by}` : ""}
                {h.why ? ` · ${h.why}` : ""}
              </li>
            ))}
          </ol>
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

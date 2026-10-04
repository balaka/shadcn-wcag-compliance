import type { Meta, StoryObj } from "@storybook/react-vite"

// The title page of the compliance section: what this is, and where to look.
// Links open the Storybook page itself (target _top), not the story frame.

const story = (id: string, panel = "storybook/a11y/panel") => `/?path=/story/${id}&addonPanel=${panel}`

function Overview() {
  return (
    <div className="mx-auto max-w-3xl p-8">
      <p className="text-sm font-medium text-muted-foreground">shadcn-wcag-compliance</p>
      <h1 className="mt-2 text-3xl font-semibold leading-tight">Accessibility rules, written once, kept on every edit</h1>
      <p className="mt-6 text-lg leading-relaxed">
        An accessible product is easier and more obvious to use for more people, so it can earn more. Our design
        system is built on shadcn, and this is its accessibility control: a specialist writes a rule once and records
        a disputed decision as a precedent. From then on every edit, including an edit made by an agent, is checked
        against those rules and decisions.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Where to look</h2>
      <ol className="mt-3 list-decimal space-y-3 pl-5 leading-relaxed">
        <li>
          Press <b>Run tests</b> (bottom left, with the Accessibility box ticked). Every state of every component is
          checked in both themes; stories with findings get a warning mark.
        </li>
        <li>
          Open{" "}
          <a className="underline underline-offset-4" href={story("shadcn-input--with-label")} target="_top">
            Input › With Label
          </a>{" "}
          and the <b>Accessibility</b> tab below it. The field border measures 1.26:1 against the background; the
          standard asks for 3:1. This is shadcn as installed, nothing changed.
        </li>
        <li>
          Open{" "}
          <a className="underline underline-offset-4" href={story("shadcn-button--variants")} target="_top">
            Button › Variants
          </a>
          . The red button is caught by axe itself. The border above is caught by our rule, in the same tab: axe has
          no rule for it.
        </li>
        <li>
          Open{" "}
          <a className="underline underline-offset-4" href={story("wcag-compliance-precedents--register-page", "")} target="_top">
            Precedents
          </a>
          . Decisions a person made where a rule alone could not settle the case: who, when, why, until when. Drafts
          written by an agent wait there for a person.
        </li>
      </ol>

      <h2 className="mt-10 text-xl font-semibold">How it works</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed">
        <li>
          A paragraph of WCAG 2.2, copied word for word with its edition date (<code>standards/</code>).
        </li>
        <li>
          A rule written against it in the W3C ACT format, with a version and pass/fail examples (<code>rules/own/</code>).
        </li>
        <li>
          Code with the same name, run here in Storybook and in a hook on every edit (<code>src/rules/</code>).
        </li>
        <li>Three outcomes: passed goes to the report; failed is not written; cannot tell goes to a person.</li>
        <li>
          A person's decision is a precedent card; the checks read it (<code>precedents/</code>).
        </li>
      </ol>

      <p className="mt-10 text-sm text-muted-foreground">github.com/balaka/shadcn-wcag-compliance · October 2026</p>
    </div>
  )
}

const meta = {
  title: "WCAG compliance/Overview",
  component: Overview,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Overview>

export default meta
type Story = StoryObj<typeof meta>

export const Page: Story = { name: "Overview" }

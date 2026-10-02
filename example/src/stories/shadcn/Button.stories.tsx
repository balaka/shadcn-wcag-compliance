import type { Meta, StoryObj } from "@storybook/react-vite"
import { PlusIcon } from "lucide-react"
import { userEvent } from "storybook/test"

import { Button } from "@/components/ui/button"

// Every story carries `parameters.expected`: the correct answer, written
// before the first run. `wcag` is the truth, `axe` is what we predict axe
// reports (null = axe stays silent). Contrast numbers are computed from the
// tokens in src/index.css.

const meta = {
  title: "shadcn/Button",
  component: Button,
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

const variants = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const

function AllVariants() {
  return (
    <div className="flex flex-wrap gap-2 p-4">
      {variants.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  )
}

export const Variants: Story = {
  render: () => <AllVariants />,
  parameters: {
    expected: {
      wcag: "fail",
      criteria: ["1.4.3 Contrast (Minimum)"],
      evidence:
        "destructive: text #e7000b on destructive/10 #fde5e7 = 3.99:1, needs 4.5:1",
      axe: "color-contrast",
    },
  },
}

export const VariantsDark: Story = {
  render: () => <AllVariants />,
  globals: { theme: "dark" },
  parameters: {
    expected: {
      wcag: "pass",
      criteria: ["1.4.3 Contrast (Minimum)"],
      evidence:
        "destructive: text #ff6467 on destructive/20 #3b1c1d = 5.30:1; default 14.22:1",
      axe: null,
    },
  },
}

export const KeyboardFocus: Story = {
  render: () => (
    <div className="p-4">
      <Button variant="outline">Focus me</Button>
    </div>
  ),
  play: async () => {
    await userEvent.tab()
  },
  parameters: {
    expected: {
      wcag: "fail",
      criteria: ["1.4.11 Non-text Contrast"],
      evidence:
        "focus: border --ring #a1a1a1 on white = 2.59:1, ring --ring/50 #d0d0d0 = 1.54:1, needs 3:1",
      axe: null,
    },
  },
}

// Planted breakage: an icon-only button with no accessible name.
export const IconOnlyWithoutName: Story = {
  render: () => (
    <div className="p-4">
      <Button size="icon">
        <PlusIcon />
      </Button>
    </div>
  ),
  parameters: {
    expected: {
      wcag: "fail",
      criteria: ["4.1.2 Name, Role, Value"],
      evidence: "button has no text, no aria-label; the icon is aria-hidden",
      axe: "button-name",
    },
  },
}

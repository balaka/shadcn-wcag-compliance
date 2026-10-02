import type { Meta, StoryObj } from "@storybook/react-vite"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// `parameters.expected` — see Button.stories.tsx.

const meta = {
  title: "shadcn/Input",
  component: Input,
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-72 gap-2 p-4">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" />
    </div>
  ),
  parameters: {
    expected: {
      wcag: "pass",
      criteria: ["1.4.11 Non-text Contrast"],
      evidence:
        "the border is the only edge of the field: --input #929292 on white = 3.11:1, needs 3:1",
      axe: null,
    },
  },
}

export const WithLabelDark: Story = {
  ...WithLabel,
  globals: { theme: "dark" },
  parameters: {
    expected: {
      wcag: "pass",
      criteria: ["1.4.11 Non-text Contrast"],
      evidence: "--input white/40% over #0a0a0a = #6c6c6c = 3.77:1, needs 3:1",
      axe: null,
    },
  },
}

// Planted breakage: the border from the old shadcn default (--input #e5e5e5),
// kept here so the rule still has a field it must catch.
export const WithLabelFaintBorder: Story = {
  render: () => (
    <div className="grid w-72 gap-2 p-4">
      <Label htmlFor="email-faint">Email</Label>
      <Input id="email-faint" type="email" className="border-[#e5e5e5]" />
    </div>
  ),
  parameters: {
    expected: {
      wcag: "fail",
      criteria: ["1.4.11 Non-text Contrast"],
      evidence: "#e5e5e5 on white = 1.26:1, needs 3:1",
      // axe itself has no rule for this; our rule rides inside axe and must fire
      axe: "1.4.11-border-contrast",
    },
  },
}

// Planted breakage: no label at all.
export const WithoutLabel: Story = {
  render: () => (
    <div className="w-72 p-4">
      <Input type="email" />
    </div>
  ),
  parameters: {
    expected: {
      wcag: "fail",
      criteria: ["4.1.2 Name, Role, Value", "1.3.1 Info and Relationships"],
      evidence: "the field has no label, aria-label or placeholder",
      axe: "label",
    },
  },
}

// Planted breakage: the placeholder is the only label.
export const PlaceholderOnly: Story = {
  render: () => (
    <div className="w-72 p-4">
      <Input type="email" placeholder="Email" />
    </div>
  ),
  parameters: {
    expected: {
      wcag: "disputed",
      criteria: ["3.3.2 Labels or Instructions"],
      evidence:
        "the placeholder gives a name but disappears on typing; a person decides (precedents/2026-10-01-input-placeholder-as-only-label.md)",
      axe: null,
    },
  },
}

// Planted breakage: the error is shown only by the red border.
export const ErrorOnlyByColor: Story = {
  render: () => (
    <div className="grid w-72 gap-2 p-4">
      <Label htmlFor="email-error">Email</Label>
      <Input id="email-error" type="email" defaultValue="yuriy@" aria-invalid />
    </div>
  ),
  parameters: {
    expected: {
      wcag: "fail",
      criteria: ["3.3.1 Error Identification", "1.4.1 Use of Color"],
      evidence: "no error text; only the border turns red",
      axe: null,
    },
  },
}

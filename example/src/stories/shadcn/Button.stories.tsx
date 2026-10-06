import type { Meta, StoryObj } from "@storybook/react-vite"
import { userEvent } from "storybook/test"

import { Button } from "@/components/ui/button"

// A story shows the component the way the design system's users get it:
// no colours, sizes or styles of its own on top, no accessibility settings.
// The checks see exactly this.

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
}

export const VariantsDark: Story = {
  render: () => <AllVariants />,
  globals: { theme: "dark" },
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
}

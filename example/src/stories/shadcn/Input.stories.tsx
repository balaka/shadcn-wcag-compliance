import type { Meta, StoryObj } from "@storybook/react-vite"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// A story shows the component the way the design system's users get it —
// see Button.stories.tsx.

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
}

export const WithLabelDark: Story = {
  ...WithLabel,
  globals: { theme: "dark" },
}

import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import { cn } from "@/lib/utils"
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

// Switch: the official shadcn example for base-nova, one story per example as on
// the shadcn documentation page. Source: https://ui.shadcn.com/r/styles/base-nova/switch-example.json, retrieved 2026-10-06.
// Changed on the way in: our frame instead of the site's, icons from
// lucide-react, Next.js image and link as plain img and a, toasts to the
// Actions panel. A story shows the component as the design system's
// users get it: nothing on top, no accessibility settings.

const meta = {
  title: "Forms/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "From the official shadcn example for base-nova (https://ui.shadcn.com/r/styles/base-nova/switch-example.json, retrieved 2026-10-06). Behaviour comes from Base UI." } } },
} satisfies Meta

export default meta
type Story = StoryObj

// Playground: every prop that changes the look, in Controls; events in Actions.
export const Playground: Story = {
  args: {
    "aria-label": "Airplane mode",
    defaultChecked: false,
    disabled: false,
    onCheckedChange: fn(),
  },
}

// The example's frame, as on the shadcn documentation page but without the
// site's card background: the component sits on the theme's background,
// which is what the rules measure against.
function Example({
  title: _title,
  className,
  containerClassName,
  children,
  ...props
}: import("react").ComponentProps<"div"> & { title?: string; containerClassName?: string }) {
  return (
    <div data-slot="example" className={cn("flex w-full max-w-lg min-w-0 flex-col gap-1", containerClassName)} {...props}>
      <div
        data-slot="example-content"
        className={cn("flex min-w-0 flex-1 flex-col items-start gap-6 p-6 *:[div:not([class*='w-'])]:w-full", className)}
      >
        {children}
      </div>
    </div>
  )
}
function SwitchBasic() {
  return (
    <Example title="Basic">
      <Field orientation="horizontal">
        <Switch id="switch-basic" />
        <FieldLabel htmlFor="switch-basic">Airplane Mode</FieldLabel>
      </Field>
    </Example>
  )
}

function SwitchWithLabel() {
  return (
    <Example title="With Label">
      <div className="flex items-center gap-2">
        <Switch id="switch-bluetooth" defaultChecked />
        <Label htmlFor="switch-bluetooth">Bluetooth</Label>
      </div>
    </Example>
  )
}

function SwitchWithDescription() {
  return (
    <Example title="With Description">
      <FieldLabel htmlFor="switch-focus-mode">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Share across devices</FieldTitle>
            <FieldDescription>
              Focus is shared across devices, and turns off when you leave the
              app.
            </FieldDescription>
          </FieldContent>
          <Switch id="switch-focus-mode" />
        </Field>
      </FieldLabel>
    </Example>
  )
}

function SwitchDisabled() {
  return (
    <Example title="Disabled">
      <div className="flex flex-col gap-12">
        <div className="flex items-center gap-2">
          <Switch id="switch-disabled-unchecked" disabled />
          <Label htmlFor="switch-disabled-unchecked">
            Disabled (Unchecked)
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="switch-disabled-checked" defaultChecked disabled />
          <Label htmlFor="switch-disabled-checked">Disabled (Checked)</Label>
        </div>
      </div>
    </Example>
  )
}

function SwitchSizes() {
  return (
    <Example title="Sizes">
      <div className="flex flex-col gap-12">
        <div className="flex items-center gap-2">
          <Switch id="switch-size-sm" size="sm" />
          <Label htmlFor="switch-size-sm">Small</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="switch-size-default" size="default" />
          <Label htmlFor="switch-size-default">Default</Label>
        </div>
      </div>
    </Example>
  )
}

export const Basic: Story = { name: "Basic", render: () => <SwitchBasic /> }
export const WithDescription: Story = { name: "With Description", render: () => <SwitchWithDescription /> }
export const WithLabel: Story = { name: "With Label", render: () => <SwitchWithLabel /> }
export const Disabled: Story = { name: "Disabled", render: () => <SwitchDisabled /> }
export const Sizes: Story = { name: "Sizes", render: () => <SwitchSizes /> }

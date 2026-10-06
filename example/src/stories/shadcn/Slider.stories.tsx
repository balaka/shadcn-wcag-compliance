import type { Meta, StoryObj } from "@storybook/react-vite"
import { cn } from "@/lib/utils"
import * as React from "react"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

// Slider: the official shadcn example for base-nova, one story per example as on
// the shadcn documentation page. Source: https://ui.shadcn.com/r/styles/base-nova/slider-example.json, retrieved 2026-10-06.
// Changed on the way in: our frame instead of the site's, icons from
// lucide-react, Next.js image and link as plain img and a, toasts to the
// Actions panel. A story shows the component as the design system's
// users get it: nothing on top, no accessibility settings.

const meta = {
  title: "Forms/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "From the official shadcn example for base-nova (https://ui.shadcn.com/r/styles/base-nova/slider-example.json, retrieved 2026-10-06). Behaviour comes from Base UI." } } },
} satisfies Meta

export default meta
type Story = StoryObj

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
function SliderBasic() {
  return (
    <Example title="Basic">
      <Slider defaultValue={50} max={100} step={1} />
    </Example>
  )
}

function SliderRange() {
  return (
    <Example title="Range">
      <Slider defaultValue={[25, 50]} max={100} step={5} />
    </Example>
  )
}

function SliderMultiple() {
  return (
    <Example title="Multiple Thumbs">
      <Slider defaultValue={[10, 20, 70]} max={100} step={10} />
    </Example>
  )
}

function SliderVertical() {
  return (
    <Example title="Vertical">
      <div className="flex items-center gap-6">
        <Slider
          defaultValue={[50]}
          max={100}
          step={1}
          orientation="vertical"
          className="h-40"
        />
        <Slider
          defaultValue={[25]}
          max={100}
          step={1}
          orientation="vertical"
          className="h-40"
        />
      </div>
    </Example>
  )
}

function SliderControlled() {
  const [value, setValue] = React.useState([0.3, 0.7])

  return (
    <Example title="Controlled">
      <div className="grid w-full gap-3">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="slider-demo-temperature">Temperature</Label>
          <span className="text-sm text-muted-foreground">
            {value.join(", ")}
          </span>
        </div>
        <Slider
          id="slider-demo-temperature"
          value={value}
          onValueChange={(value) => setValue(value as number[])}
          min={0}
          max={1}
          step={0.1}
        />
      </div>
    </Example>
  )
}

function SliderDisabled() {
  return (
    <Example title="Disabled">
      <Slider defaultValue={[50]} max={100} step={1} disabled />
    </Example>
  )
}

export const Basic: Story = { name: "Basic", render: () => <SliderBasic /> }
export const RangeStory: Story = { name: "Range", render: () => <SliderRange /> }
export const MultipleThumbs: Story = { name: "Multiple Thumbs", render: () => <SliderMultiple /> }
export const Vertical: Story = { name: "Vertical", render: () => <SliderVertical /> }
export const Controlled: Story = { name: "Controlled", render: () => <SliderControlled /> }
export const Disabled: Story = { name: "Disabled", render: () => <SliderDisabled /> }

import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import { BoldIcon, BookmarkIcon, ItalicIcon, UnderlineIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"

// Toggle: the official shadcn example for base-nova, one story per example as on
// the shadcn documentation page. Source: https://ui.shadcn.com/r/styles/base-nova/toggle-example.json, retrieved 2026-10-06.
// Changed on the way in: our frame instead of the site's, icons from
// lucide-react, Next.js image and link as plain img and a, toasts to the
// Actions panel. A story shows the component as the design system's
// users get it: nothing on top, no accessibility settings.

const meta = {
  title: "Forms/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "From the official shadcn example for base-nova (https://ui.shadcn.com/r/styles/base-nova/toggle-example.json, retrieved 2026-10-06). Behaviour comes from Base UI." } } },
} satisfies Meta

export default meta
type Story = StoryObj

// Playground: every prop that changes the look, in Controls; events in Actions.
export const Playground: Story = {
  args: {
    children: "Bold",
    disabled: false,
    onPressedChange: fn(),
    variant: "default",
    size: "default",
  },
  argTypes: {
    variant: { control: "select", options: ["default", "outline"] },
    size: { control: "select", options: ["default", "sm", "lg"] },
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
function ToggleBasic() {
  return (
    <Example title="Basic">
      <div className="flex flex-wrap items-center gap-2">
        <Toggle aria-label="Toggle bold" defaultPressed>
          <BoldIcon />
        </Toggle>
        <Toggle aria-label="Toggle italic">
          <ItalicIcon />
        </Toggle>
        <Toggle aria-label="Toggle underline">
          <UnderlineIcon />
        </Toggle>
      </div>
    </Example>
  )
}

function ToggleOutline() {
  return (
    <Example title="Outline">
      <div className="flex flex-wrap items-center gap-2">
        <Toggle variant="outline" aria-label="Toggle italic">
          <ItalicIcon />
          Italic
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle bold">
          <BoldIcon />
          Bold
        </Toggle>
      </div>
    </Example>
  )
}

function ToggleSizes() {
  return (
    <Example title="Sizes">
      <div className="flex flex-wrap items-center gap-2">
        <Toggle variant="outline" aria-label="Toggle small" size="sm">
          Small
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle default" size="default">
          Default
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle large" size="lg">
          Large
        </Toggle>
      </div>
    </Example>
  )
}

function ToggleWithButtonText() {
  return (
    <Example title="With Button Text">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            Button
          </Button>
          <Toggle variant="outline" aria-label="Toggle sm" size="sm">
            Toggle
          </Toggle>
        </div>
        <div className="flex items-center gap-2">
          <Button size="default" variant="outline">
            Button
          </Button>
          <Toggle variant="outline" aria-label="Toggle default" size="default">
            Toggle
          </Toggle>
        </div>
        <div className="flex items-center gap-2">
          <Button size="lg" variant="outline">
            Button
          </Button>
          <Toggle variant="outline" aria-label="Toggle lg" size="lg">
            Toggle
          </Toggle>
        </div>
      </div>
    </Example>
  )
}

function ToggleWithButtonIcon() {
  return (
    <Example title="With Button Icon">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm">
            <BoldIcon />
          </Button>
          <Toggle variant="outline" aria-label="Toggle sm icon" size="sm">
            <BoldIcon />
          </Toggle>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <ItalicIcon />
          </Button>
          <Toggle
            variant="outline"
            aria-label="Toggle default icon"
            size="default"
          >
            <ItalicIcon />
          </Toggle>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-lg">
            <UnderlineIcon />
          </Button>
          <Toggle variant="outline" aria-label="Toggle lg icon" size="lg">
            <UnderlineIcon />
          </Toggle>
        </div>
      </div>
    </Example>
  )
}

function ToggleWithButtonIconText() {
  return (
    <Example title="With Button Icon + Text">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <BoldIcon
              data-icon="inline-start" />
            Button
          </Button>
          <Toggle variant="outline" aria-label="Toggle sm icon text" size="sm">
            <BoldIcon />
            Toggle
          </Toggle>
        </div>
        <div className="flex items-center gap-2">
          <Button size="default" variant="outline">
            <ItalicIcon
              data-icon="inline-start" />
            Button
          </Button>
          <Toggle
            variant="outline"
            aria-label="Toggle default icon text"
            size="default"
          >
            <ItalicIcon />
            Toggle
          </Toggle>
        </div>
        <div className="flex items-center gap-2">
          <Button size="lg" variant="outline">
            <UnderlineIcon
              data-icon="inline-start" />
            Button
          </Button>
          <Toggle variant="outline" aria-label="Toggle lg icon text" size="lg">
            <UnderlineIcon />
            Toggle
          </Toggle>
        </div>
      </div>
    </Example>
  )
}

function ToggleDisabled() {
  return (
    <Example title="Disabled">
      <div className="flex flex-wrap items-center gap-2">
        <Toggle aria-label="Toggle disabled" disabled>
          Disabled
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle disabled outline" disabled>
          Disabled
        </Toggle>
      </div>
    </Example>
  )
}

function ToggleWithIcon() {
  return (
    <Example title="With Icon">
      <div className="flex flex-wrap items-center gap-2">
        <Toggle aria-label="Toggle bookmark" defaultPressed>
          <BookmarkIcon
            className="group-data-[state=on]/toggle:fill-accent-foreground" />
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle bookmark outline">
          <BookmarkIcon
            className="group-data-[state=on]/toggle:fill-accent-foreground" />
          Bookmark
        </Toggle>
      </div>
    </Example>
  )
}

export const Basic: Story = { name: "Basic", render: () => <ToggleBasic /> }
export const Outline: Story = { name: "Outline", render: () => <ToggleOutline /> }
export const Sizes: Story = { name: "Sizes", render: () => <ToggleSizes /> }
export const WithButtonText: Story = { name: "With Button Text", render: () => <ToggleWithButtonText /> }
export const WithButtonIcon: Story = { name: "With Button Icon", render: () => <ToggleWithButtonIcon /> }
export const WithButtonIconText: Story = { name: "With Button Icon + Text", render: () => <ToggleWithButtonIconText /> }
export const Disabled: Story = { name: "Disabled", render: () => <ToggleDisabled /> }
export const WithIcon: Story = { name: "With Icon", render: () => <ToggleWithIcon /> }

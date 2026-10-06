import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowLeftIcon, ArrowRightIcon, CircleDashedIcon, SaveIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// Kbd: the official shadcn example for base-nova, one story per example as on
// the shadcn documentation page. Source: https://ui.shadcn.com/r/styles/base-nova/kbd-example.json, retrieved 2026-10-06.
// Changed on the way in: our frame instead of the site's, icons from
// lucide-react, Next.js image and link as plain img and a, toasts to the
// Actions panel. A story shows the component as the design system's
// users get it: nothing on top, no accessibility settings.

const meta = {
  title: "Data display/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "From the official shadcn example for base-nova (https://ui.shadcn.com/r/styles/base-nova/kbd-example.json, retrieved 2026-10-06). Behaviour comes from Base UI." } } },
} satisfies Meta

export default meta
type Story = StoryObj

// Playground: every prop that changes the look, in Controls; events in Actions.
export const Playground: Story = {
  args: {
    children: "⌘K",
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
function KbdBasic() {
  return (
    <Example title="Basic">
      <div className="flex items-center gap-2">
        <Kbd>Ctrl</Kbd>
        <Kbd>⌘K</Kbd>
        <Kbd>Ctrl + B</Kbd>
      </div>
    </Example>
  )
}

function KbdModifierKeys() {
  return (
    <Example title="Modifier Keys">
      <div className="flex items-center gap-2">
        <Kbd>⌘</Kbd>
        <Kbd>C</Kbd>
      </div>
    </Example>
  )
}

function KbdGroupExample() {
  return (
    <Example title="KbdGroup">
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>Shift</Kbd>
        <Kbd>P</Kbd>
      </KbdGroup>
    </Example>
  )
}

function KbdArrowKeys() {
  return (
    <Example title="Arrow Keys">
      <div className="flex items-center gap-2">
        <Kbd>↑</Kbd>
        <Kbd>↓</Kbd>
        <Kbd>←</Kbd>
        <Kbd>→</Kbd>
      </div>
    </Example>
  )
}

function KbdWithIcons() {
  return (
    <Example title="With Icons">
      <KbdGroup>
        <Kbd>
          <CircleDashedIcon />
        </Kbd>
        <Kbd>
          <ArrowLeftIcon />
        </Kbd>
        <Kbd>
          <ArrowRightIcon />
        </Kbd>
      </KbdGroup>
    </Example>
  )
}

function KbdWithIconsAndText() {
  return (
    <Example title="With Icons and Text">
      <KbdGroup>
        <Kbd>
          <ArrowLeftIcon />
          Left
        </Kbd>
        <Kbd>
          <CircleDashedIcon />
          Voice Enabled
        </Kbd>
      </KbdGroup>
    </Example>
  )
}

function KbdInInputGroup() {
  return (
    <Example title="InputGroup">
      <InputGroup>
        <InputGroupInput />
        <InputGroupAddon>
          <Kbd>Space</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </Example>
  )
}

function KbdInTooltip() {
  return (
    <Example title="Tooltip">
      <Tooltip>
        <TooltipTrigger render={<Button size="icon-sm" variant="outline" />}>
          <SaveIcon />
        </TooltipTrigger>
        <TooltipContent className="pr-1.5">
          <div className="flex items-center gap-2">
            Save Changes <Kbd>S</Kbd>
          </div>
        </TooltipContent>
      </Tooltip>
    </Example>
  )
}

function KbdWithSamp() {
  return (
    <Example title="With samp">
      <Kbd>
        <samp>File</samp>
      </Kbd>
    </Example>
  )
}

export const Basic: Story = { name: "Basic", render: () => <KbdBasic /> }
export const ModifierKeys: Story = { name: "Modifier Keys", render: () => <KbdModifierKeys /> }
export const KbdGroupStory: Story = { name: "KbdGroup", render: () => <KbdGroupExample /> }
export const ArrowKeys: Story = { name: "Arrow Keys", render: () => <KbdArrowKeys /> }
export const WithIcons: Story = { name: "With Icons", render: () => <KbdWithIcons /> }
export const WithIconsAndText: Story = { name: "With Icons and Text", render: () => <KbdWithIconsAndText /> }
export const InputGroupStory: Story = { name: "InputGroup", render: () => <KbdInInputGroup /> }
export const TooltipStory: Story = { name: "Tooltip", render: () => <KbdInTooltip /> }
export const WithSamp: Story = { name: "With samp", render: () => <KbdWithSamp /> }

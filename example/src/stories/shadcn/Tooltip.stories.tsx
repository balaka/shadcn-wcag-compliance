import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor } from "storybook/test"
import { InfoIcon, SaveIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// Tooltip: the official shadcn example for base-nova, one story per example as on
// the shadcn documentation page. Source: https://ui.shadcn.com/r/styles/base-nova/tooltip-example.json, retrieved 2026-10-06.
// Changed on the way in: our frame instead of the site's, icons from
// lucide-react, Next.js image and link as plain img and a, toasts to the
// Actions panel. A story shows the component as the design system's
// users get it: nothing on top, no accessibility settings.

const meta = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "From the official shadcn example for base-nova (https://ui.shadcn.com/r/styles/base-nova/tooltip-example.json, retrieved 2026-10-06). Behaviour comes from Base UI." } } },
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
function TooltipBasic() {
  return (
    <Example title="Basic">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" className="w-fit" />}>
          Show Tooltip
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </Example>
  )
}

function TooltipSides() {
  return (
    <Example title="Sides">
      <div className="flex flex-wrap gap-2">
        {(
          [
            "inline-start",
            "left",
            "top",
            "bottom",
            "right",
            "inline-end",
          ] as const
        ).map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger
              render={<Button variant="outline" className="w-fit capitalize" />}
            >
              {side.replace("-", " ")}
            </TooltipTrigger>
            <TooltipContent side={side}>
              <p>Add to library</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </Example>
  )
}

function TooltipWithIcon() {
  return (
    <Example title="With Icon">
      <Tooltip>
        <TooltipTrigger render={<Button variant="ghost" size="icon" />}>
          <InfoIcon />
          <span className="sr-only">Info</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Additional information</p>
        </TooltipContent>
      </Tooltip>
    </Example>
  )
}

function TooltipLongContent() {
  return (
    <Example title="Long Content">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" className="w-fit" />}>
          Show Tooltip
        </TooltipTrigger>
        <TooltipContent>
          To learn more about how this works, check out the docs. If you have
          any questions, please reach out to us.
        </TooltipContent>
      </Tooltip>
    </Example>
  )
}

function TooltipDisabled() {
  return (
    <Example title="Disabled">
      <Tooltip>
        <TooltipTrigger render={<span className="inline-block w-fit" />}>
          <Button variant="outline" disabled>
            Disabled
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This feature is currently unavailable</p>
        </TooltipContent>
      </Tooltip>
    </Example>
  )
}

function TooltipWithKeyboard() {
  return (
    <Example title="With Keyboard Shortcut">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="icon-sm" />}>
          <SaveIcon />
        </TooltipTrigger>
        <TooltipContent>
          Save Changes <Kbd>S</Kbd>
        </TooltipContent>
      </Tooltip>
    </Example>
  )
}

function TooltipOnLink() {
  return (
    <Example title="On Link">
      <Tooltip>
        <TooltipTrigger
          render={
            <a
              href="#"
              className="w-fit text-sm text-primary underline-offset-4 hover:underline"
              onClick={(e) => e.preventDefault()}
            />
          }
        >
          Learn more
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to read the documentation</p>
        </TooltipContent>
      </Tooltip>
    </Example>
  )
}

function TooltipFormatted() {
  return (
    <Example title="Formatted Content">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" className="w-fit" />}>
          Status
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col gap-1">
            <p className="font-semibold">Active</p>
            <p className="text-xs opacity-80">Last updated 2 hours ago</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </Example>
  )
}

export const Basic: Story = { name: "Basic", render: () => <TooltipBasic /> }
export const Sides: Story = { name: "Sides", render: () => <TooltipSides /> }
export const WithIcon: Story = { name: "With Icon", render: () => <TooltipWithIcon /> }
export const LongContent: Story = { name: "Long Content", render: () => <TooltipLongContent /> }
export const Disabled: Story = { name: "Disabled", render: () => <TooltipDisabled /> }
export const WithKeyboardShortcut: Story = { name: "With Keyboard Shortcut", render: () => <TooltipWithKeyboard /> }
export const OnLink: Story = { name: "On Link", render: () => <TooltipOnLink /> }
export const FormattedContent: Story = { name: "Formatted Content", render: () => <TooltipFormatted /> }

// Opens the first example, so the checks see the open state (the content
// renders outside the story's frame, in the page's body).
export const Open: Story = {
  name: "Open",
  render: () => <TooltipBasic />,
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector<HTMLElement>('[data-slot="tooltip-trigger"]')
    await expect(trigger).not.toBeNull()
    await userEvent.hover(trigger!)
    await waitFor(() => expect(document.querySelector('[data-slot="tooltip-content"], [data-slot="tooltip-popup"]')).not.toBeNull(), { timeout: 3000 })
  },
}

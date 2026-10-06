import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor } from "storybook/test"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

// HoverCard: the official shadcn example for base-nova, one story per example as on
// the shadcn documentation page. Source: https://ui.shadcn.com/r/styles/base-nova/hover-card-example.json, retrieved 2026-10-06.
// Changed on the way in: our frame instead of the site's, icons from
// lucide-react, Next.js image and link as plain img and a, toasts to the
// Actions panel. A story shows the component as the design system's
// users get it: nothing on top, no accessibility settings.

const meta = {
  title: "Overlays/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "From the official shadcn example for base-nova (https://ui.shadcn.com/r/styles/base-nova/hover-card-example.json, retrieved 2026-10-06). Behaviour comes from Base UI." } } },
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
const HOVER_CARD_SIDES = [
  "inline-start",
  "left",
  "top",
  "bottom",
  "right",
  "inline-end",
] as const

function HoverCardSides() {
  return (
    <Example title="Sides" containerClassName="col-span-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {HOVER_CARD_SIDES.map((side) => (
          <HoverCard key={side}>
            <HoverCardTrigger
              delay={100}
              closeDelay={100}
              render={<Button variant="outline" className="capitalize" />}
            >
              {side.replace("-", " ")}
            </HoverCardTrigger>
            <HoverCardContent side={side}>
              <div className="flex flex-col ">
                <h4 className="font-medium">Hover Card</h4>
                <p>
                  This hover card appears on the {side.replace("-", " ")} side
                  of the trigger.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </Example>
  )
}

function HoverCardInDialog() {
  return (
    <Example title="In Dialog">
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Open Dialog
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hover Card Example</DialogTitle>
            <DialogDescription>
              Hover over the button below to see the hover card.
            </DialogDescription>
          </DialogHeader>
          <HoverCard>
            <HoverCardTrigger
              delay={100}
              closeDelay={100}
              render={<Button variant="outline" className="w-fit" />}
            >
              Hover me
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="flex flex-col ">
                <h4 className="font-medium">Hover Card</h4>
                <p>
                  This hover card appears inside a dialog. Hover over the button
                  to see it.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </DialogContent>
      </Dialog>
    </Example>
  )
}

export const Sides: Story = { name: "Sides", render: () => <HoverCardSides /> }
export const InDialog: Story = { name: "In Dialog", render: () => <HoverCardInDialog /> }

// Opens the first example, so the checks see the open state (the content
// renders outside the story's frame, in the page's body).
export const Open: Story = {
  name: "Open",
  render: () => <HoverCardSides />,
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector<HTMLElement>('[data-slot="hover-card-trigger"]')
    await expect(trigger).not.toBeNull()
    await userEvent.hover(trigger!)
    await waitFor(() => expect(document.querySelector('[data-slot="hover-card-content"], [data-slot="hover-card-popup"]')).not.toBeNull(), { timeout: 3000 })
  },
}

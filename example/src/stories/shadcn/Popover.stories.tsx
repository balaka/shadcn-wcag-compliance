import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor } from "storybook/test"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"

// Popover: the official shadcn example for base-nova, one story per example as on
// the shadcn documentation page. Source: https://ui.shadcn.com/r/styles/base-nova/popover-example.json, retrieved 2026-10-06.
// Changed on the way in: our frame instead of the site's, icons from
// lucide-react, Next.js image and link as plain img and a, toasts to the
// Actions panel. A story shows the component as the design system's
// users get it: nothing on top, no accessibility settings.

const meta = {
  title: "Overlays/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "From the official shadcn example for base-nova (https://ui.shadcn.com/r/styles/base-nova/popover-example.json, retrieved 2026-10-06). Behaviour comes from Base UI." } } },
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
function PopoverBasic() {
  return (
    <Example title="Basic">
      <Popover>
        <PopoverTrigger render={<Button variant="outline" className="w-fit" />}>
          Open Popover
        </PopoverTrigger>
        <PopoverContent align="start">
          <PopoverHeader>
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>
              Set the dimensions for the layer.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </Example>
  )
}

function PopoverSides() {
  return (
    <Example title="Sides">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          {(["inline-start", "left", "top"] as const).map((side) => (
            <Popover key={side}>
              <PopoverTrigger
                render={
                  <Button variant="outline" className="w-fit capitalize" />
                }
              >
                {side.replace("-", " ")}
              </PopoverTrigger>
              <PopoverContent side={side} className="w-40">
                <p>Popover on {side.replace("-", " ")}</p>
              </PopoverContent>
            </Popover>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {(["bottom", "right", "inline-end"] as const).map((side) => (
            <Popover key={side}>
              <PopoverTrigger
                render={
                  <Button variant="outline" className="w-fit capitalize" />
                }
              >
                {side.replace("-", " ")}
              </PopoverTrigger>
              <PopoverContent side={side} className="w-40">
                <p>Popover on {side.replace("-", " ")}</p>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </div>
    </Example>
  )
}

function PopoverWithForm() {
  return (
    <Example title="With Form">
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          Open Popover
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start">
          <PopoverHeader>
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>
              Set the dimensions for the layer.
            </PopoverDescription>
          </PopoverHeader>
          <FieldGroup className="gap-4">
            <Field orientation="horizontal">
              <FieldLabel htmlFor="width" className="w-1/2">
                Width
              </FieldLabel>
              <Input id="width" defaultValue="100%" />
            </Field>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="height" className="w-1/2">
                Height
              </FieldLabel>
              <Input id="height" defaultValue="25px" />
            </Field>
          </FieldGroup>
        </PopoverContent>
      </Popover>
    </Example>
  )
}

function PopoverAlignments() {
  return (
    <Example title="Alignments">
      <div className="flex gap-6">
        <Popover>
          <PopoverTrigger render={<Button variant="outline" size="sm" />}>
            Start
          </PopoverTrigger>
          <PopoverContent align="start" className="w-40">
            Aligned to start
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger render={<Button variant="outline" size="sm" />}>
            Center
          </PopoverTrigger>
          <PopoverContent align="center" className="w-40">
            Aligned to center
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger render={<Button variant="outline" size="sm" />}>
            End
          </PopoverTrigger>
          <PopoverContent align="end" className="w-40">
            Aligned to end
          </PopoverContent>
        </Popover>
      </div>
    </Example>
  )
}

function PopoverInDialog() {
  return (
    <Example title="In Dialog">
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Open Dialog
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Popover Example</DialogTitle>
            <DialogDescription>
              Click the button below to see the popover.
            </DialogDescription>
          </DialogHeader>
          <Popover>
            <PopoverTrigger
              render={<Button variant="outline" className="w-fit" />}
            >
              Open Popover
            </PopoverTrigger>
            <PopoverContent align="start">
              <PopoverHeader>
                <PopoverTitle>Popover in Dialog</PopoverTitle>
                <PopoverDescription>
                  This popover appears inside a dialog. Click the button to open
                  it.
                </PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </DialogContent>
      </Dialog>
    </Example>
  )
}

export const Basic: Story = { name: "Basic", render: () => <PopoverBasic /> }
export const Sides: Story = { name: "Sides", render: () => <PopoverSides /> }
export const WithForm: Story = { name: "With Form", render: () => <PopoverWithForm /> }
export const Alignments: Story = { name: "Alignments", render: () => <PopoverAlignments /> }
export const InDialog: Story = { name: "In Dialog", render: () => <PopoverInDialog /> }

// Opens the first example, so the checks see the open state (the content
// renders outside the story's frame, in the page's body).
export const Open: Story = {
  name: "Open",
  render: () => <PopoverBasic />,
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector<HTMLElement>('[data-slot="popover-trigger"]')
    await expect(trigger).not.toBeNull()
    await userEvent.click(trigger!)
    await waitFor(() => expect(document.querySelector('[data-slot="popover-content"], [data-slot="popover-popup"]')).not.toBeNull(), { timeout: 3000 })
  },
}

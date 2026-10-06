import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor } from "storybook/test"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

// Sheet: the official shadcn example for base-nova, one story per example as on
// the shadcn documentation page. Source: https://ui.shadcn.com/r/styles/base-nova/sheet-example.json, retrieved 2026-10-06.
// Changed on the way in: our frame instead of the site's, icons from
// lucide-react, Next.js image and link as plain img and a, toasts to the
// Actions panel. A story shows the component as the design system's
// users get it: nothing on top, no accessibility settings.

const meta = {
  title: "Overlays/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "From the official shadcn example for base-nova (https://ui.shadcn.com/r/styles/base-nova/sheet-example.json, retrieved 2026-10-06). Behaviour comes from Base UI." } } },
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
function SheetWithForm() {
  return (
    <Example title="With Form">
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </SheetDescription>
          </SheetHeader>
          <div className="">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="sheet-demo-name">Name</FieldLabel>
                <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
              </Field>
              <Field>
                <FieldLabel htmlFor="sheet-demo-username">Username</FieldLabel>
                <Input id="sheet-demo-username" defaultValue="@peduarte" />
              </Field>
            </FieldGroup>
          </div>
          <SheetFooter>
            <Button type="submit">Save changes</Button>
            <SheetClose render={<Button variant="outline" />}>Close</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Example>
  )
}

function SheetNoCloseButton() {
  return (
    <Example title="No Close Button">
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>
          No Close Button
        </SheetTrigger>
        <SheetContent showCloseButton={false}>
          <SheetHeader>
            <SheetTitle>No Close Button</SheetTitle>
            <SheetDescription>
              This sheet doesn&apos;t have a close button in the top-right
              corner. You can only close it using the button below.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </Example>
  )
}

const SHEET_SIDES = ["top", "right", "bottom", "left"] as const

function SheetWithSides() {
  return (
    <Example title="Sides">
      <div className="flex flex-wrap gap-2">
        {SHEET_SIDES.map((side) => (
          <Sheet key={side}>
            <SheetTrigger
              render={<Button variant="outline" className="capitalize" />}
            >
              {side}
            </SheetTrigger>
            <SheetContent
              side={side}
              className="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]"
            >
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
                </SheetDescription>
              </SheetHeader>
              <div className="no-scrollbar overflow-y-auto ">
                {Array.from({ length: 10 }).map((_, index) => (
                  <p
                    key={index}
                    className="mb-4 leading-normal "
                  >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                ))}
              </div>
              <SheetFooter>
                <Button type="submit">Save changes</Button>
                <SheetClose render={<Button variant="outline" />}>
                  Cancel
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ))}
      </div>
    </Example>
  )
}

export const WithForm: Story = { name: "With Form", render: () => <SheetWithForm /> }
export const NoCloseButton: Story = { name: "No Close Button", render: () => <SheetNoCloseButton /> }
export const Sides: Story = { name: "Sides", render: () => <SheetWithSides /> }

// Opens the first example, so the checks see the open state (the content
// renders outside the story's frame, in the page's body).
export const Open: Story = {
  name: "Open",
  render: () => <SheetWithForm />,
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector<HTMLElement>('[data-slot="sheet-trigger"]')
    await expect(trigger).not.toBeNull()
    await userEvent.click(trigger!)
    await waitFor(() => expect(document.querySelector('[data-slot="sheet-content"], [data-slot="sheet-popup"]')).not.toBeNull(), { timeout: 3000 })
  },
}

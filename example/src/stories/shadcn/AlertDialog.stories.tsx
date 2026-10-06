import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor } from "storybook/test"
import { BluetoothIcon, Trash2Icon } from "lucide-react"
import { cn } from "@/lib/utils"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// AlertDialog: the official shadcn example for base-nova, one story per example as on
// the shadcn documentation page. Source: https://ui.shadcn.com/r/styles/base-nova/alert-dialog-example.json, retrieved 2026-10-06.
// Changed on the way in: our frame instead of the site's, icons from
// lucide-react, Next.js image and link as plain img and a, toasts to the
// Actions panel. A story shows the component as the design system's
// users get it: nothing on top, no accessibility settings.

const meta = {
  title: "Overlays/AlertDialog",
  component: AlertDialog,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "From the official shadcn example for base-nova (https://ui.shadcn.com/r/styles/base-nova/alert-dialog-example.json, retrieved 2026-10-06). Behaviour comes from Base UI." } } },
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
function AlertDialogBasic() {
  return (
    <Example title="Basic" className="items-center">
      <AlertDialog>
        <AlertDialogTrigger
          render={<Button variant="outline">Default</Button>}
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Example>
  )
}

function AlertDialogSmall() {
  return (
    <Example title="Small" className="items-center">
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="outline">Small</Button>} />
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to allow the USB accessory to connect to this device?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
            <AlertDialogAction>Allow</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Example>
  )
}

function AlertDialogWithMedia() {
  return (
    <Example title="With Media" className="items-center">
      <AlertDialog>
        <AlertDialogTrigger
          render={<Button variant="outline">Default (Media)</Button>}
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <BluetoothIcon />
            </AlertDialogMedia>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your account and remove your data
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Example>
  )
}

function AlertDialogSmallWithMedia() {
  return (
    <Example title="Small With Media" className="items-center">
      <AlertDialog>
        <AlertDialogTrigger
          render={<Button variant="outline">Small (Media)</Button>}
        />

        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <BluetoothIcon />
            </AlertDialogMedia>
            <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to allow the USB accessory to connect to this device?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
            <AlertDialogAction>Allow</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Example>
  )
}

function AlertDialogDestructive() {
  return (
    <Example title="Destructive" className="items-center">
      <AlertDialog>
        <AlertDialogTrigger
          render={<Button variant="destructive">Delete Chat</Button>}
        />
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this chat conversation. View{" "}
              <a href="#">Settings</a> delete any memories saved during this
              chat.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="ghost">Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Example>
  )
}

function AlertDialogInDialog() {
  return (
    <Example title="In Dialog" className="items-center">
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Open Dialog
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alert Dialog Example</DialogTitle>
            <DialogDescription>
              Click the button below to open an alert dialog.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <AlertDialog>
              <AlertDialogTrigger render={<Button />}>
                Open Alert Dialog
              </AlertDialogTrigger>
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Example>
  )
}

export const Basic: Story = { name: "Basic", render: () => <AlertDialogBasic /> }
export const Small: Story = { name: "Small", render: () => <AlertDialogSmall /> }
export const WithMedia: Story = { name: "With Media", render: () => <AlertDialogWithMedia /> }
export const SmallWithMedia: Story = { name: "Small With Media", render: () => <AlertDialogSmallWithMedia /> }
export const Destructive: Story = { name: "Destructive", render: () => <AlertDialogDestructive /> }
export const InDialog: Story = { name: "In Dialog", render: () => <AlertDialogInDialog /> }

// Opens the first example, so the checks see the open state (the content
// renders outside the story's frame, in the page's body).
export const Open: Story = {
  name: "Open",
  render: () => <AlertDialogBasic />,
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector<HTMLElement>('[data-slot="alert-dialog-trigger"]')
    await expect(trigger).not.toBeNull()
    await userEvent.click(trigger!)
    await waitFor(() => expect(document.querySelector('[data-slot="alert-dialog-content"], [data-slot="alert-dialog-popup"]')).not.toBeNull(), { timeout: 3000 })
  },
}

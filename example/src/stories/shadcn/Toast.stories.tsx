import type { Meta, StoryObj } from "@storybook/react-vite"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

// Toast: the official shadcn example for base-nova, one story per example as on
// the shadcn documentation page. Source: https://ui.shadcn.com/r/styles/base-nova/toast-example.json, retrieved 2026-10-06.
// Changed on the way in: our frame instead of the site's, icons from
// lucide-react, Next.js image and link as plain img and a, toasts to the
// Actions panel. A story shows the component as the design system's
// users get it: nothing on top, no accessibility settings.

const meta = {
  title: "Overlays/Toast",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "From the official shadcn example for base-nova (https://ui.shadcn.com/r/styles/base-nova/toast-example.json, retrieved 2026-10-06). Behaviour comes from Base UI." } } },
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
function ToastBasic() {
  return (
    <Example title="Basic" className="items-center justify-center">
      <Button
        variant="outline"
        className="w-fit"
        onClick={() =>
          toast.add({
            title: "Event created",
            description: "Sunday, December 3 at 9:00 AM",
          })
        }
      >
        Show Toast
      </Button>
    </Example>
  )
}

function ToastWithAction() {
  function showToast() {
    const id = toast.add({
      title: "Event created",
      description: "You can undo this action.",
      actionProps: {
        children: "Undo",
        onClick() {
          toast.close(id)
          toast.add({
            description: "Event creation undone.",
          })
        },
      },
    })
  }

  return (
    <Example title="With Action" className="items-center justify-center">
      <Button variant="outline" className="w-fit" onClick={showToast}>
        Show Toast
      </Button>
    </Example>
  )
}

function ToastPromise() {
  function showToast() {
    toast.promise(
      new Promise<{ name: string }>((resolve) => {
        window.setTimeout(() => resolve({ name: "Event" }), 2000)
      }),
      {
        loading: "Creating event…",
        success: (data) => `${data.name} created.`,
        error: "Could not create event.",
      }
    )
  }

  return (
    <Example title="Promise" className="items-center justify-center">
      <Button variant="outline" className="w-fit" onClick={showToast}>
        Create Event
      </Button>
    </Example>
  )
}

export const Basic: Story = { name: "Basic", render: () => <ToastBasic /> }
export const WithAction: Story = { name: "With Action", render: () => <ToastWithAction /> }
export const PromiseStory: Story = { name: "Promise", render: () => <ToastPromise /> }

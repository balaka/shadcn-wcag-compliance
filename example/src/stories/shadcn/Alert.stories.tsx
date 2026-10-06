import type { Meta, StoryObj } from "@storybook/react-vite"
import { CircleAlertIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Alert: the official shadcn example for base-nova, one story per example as on
// the shadcn documentation page. Source: https://ui.shadcn.com/r/styles/base-nova/alert-example.json, retrieved 2026-10-06.
// Changed on the way in: our frame instead of the site's, icons from
// lucide-react, Next.js image and link as plain img and a, toasts to the
// Actions panel. A story shows the component as the design system's
// users get it: nothing on top, no accessibility settings.

const meta = {
  title: "Feedback/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "From the official shadcn example for base-nova (https://ui.shadcn.com/r/styles/base-nova/alert-example.json, retrieved 2026-10-06). Behaviour comes from Base UI." } } },
} satisfies Meta

export default meta
type Story = StoryObj

// Playground: every prop that changes the look, in Controls; events in Actions.
export const Playground: Story = {
  args: {
    children: "Heads up! Something needs your attention.",
    variant: "default",
  },
  argTypes: {
    variant: { control: "select", options: ["default", "destructive"] },
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
function AlertExample1() {
  return (
    <Example title="Basic">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <Alert>
          <AlertTitle>Success! Your changes have been saved.</AlertTitle>
        </Alert>
        <Alert>
          <AlertTitle>Success! Your changes have been saved.</AlertTitle>
          <AlertDescription>
            This is an alert with title and description.
          </AlertDescription>
        </Alert>
        <Alert>
          <AlertDescription>
            This one has a description only. No title. No icon.
          </AlertDescription>
        </Alert>
      </div>
    </Example>
  )
}

function AlertExample2() {
  return (
    <Example title="With Icons">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <Alert>
          <CircleAlertIcon />
          <AlertTitle>
            Let&apos;s try one with icon, title and a <a href="#">link</a>.
          </AlertTitle>
        </Alert>
        <Alert>
          <CircleAlertIcon />
          <AlertDescription>
            This one has an icon and a description only. No title.{" "}
            <a href="#">But it has a link</a> and a <a href="#">second link</a>.
          </AlertDescription>
        </Alert>

        <Alert>
          <CircleAlertIcon />
          <AlertTitle>Success! Your changes have been saved</AlertTitle>
          <AlertDescription>
            This is an alert with icon, title and description.
          </AlertDescription>
        </Alert>
        <Alert>
          <CircleAlertIcon />
          <AlertTitle>
            This is a very long alert title that demonstrates how the component
            handles extended text content and potentially wraps across multiple
            lines
          </AlertTitle>
        </Alert>
        <Alert>
          <CircleAlertIcon />
          <AlertDescription>
            This is a very long alert description that demonstrates how the
            component handles extended text content and potentially wraps across
            multiple lines
          </AlertDescription>
        </Alert>
        <Alert>
          <CircleAlertIcon />
          <AlertTitle>
            This is an extremely long alert title that spans multiple lines to
            demonstrate how the component handles very lengthy headings while
            maintaining readability and proper text wrapping behavior
          </AlertTitle>
          <AlertDescription>
            This is an equally long description that contains detailed
            information about the alert. It shows how the component can
            accommodate extensive content while preserving proper spacing,
            alignment, and readability across different screen sizes and
            viewport widths. This helps ensure the user experience remains
            consistent regardless of the content length.
          </AlertDescription>
        </Alert>
      </div>
    </Example>
  )
}

function AlertExample3() {
  return (
    <Example title="Destructive">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <Alert variant="destructive">
          <CircleAlertIcon />
          <AlertTitle>Something went wrong!</AlertTitle>
          <AlertDescription>
            Your session has expired. Please log in again.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <CircleAlertIcon />
          <AlertTitle>Unable to process your payment.</AlertTitle>
          <AlertDescription>
            <p>
              Please verify your <a href="#">billing information</a> and try
              again.
            </p>
            <ul className="list-inside list-disc">
              <li>Check your card details</li>
              <li>Ensure sufficient funds</li>
              <li>Verify billing address</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </Example>
  )
}

function AlertExample4() {
  return (
    <Example title="With Actions">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <Alert>
          <CircleAlertIcon />
          <AlertTitle>The selected emails have been marked as spam.</AlertTitle>
          <AlertAction>
            <Button size="xs">Undo</Button>
          </AlertAction>
        </Alert>
        <Alert>
          <CircleAlertIcon />
          <AlertTitle>The selected emails have been marked as spam.</AlertTitle>
          <AlertDescription>
            This is a very long alert title that demonstrates how the component
            handles extended text content.
          </AlertDescription>
          <AlertAction>
            <Badge variant="secondary">Badge</Badge>
          </AlertAction>
        </Alert>
      </div>
    </Example>
  )
}

export const Basic: Story = { name: "Basic", render: () => <AlertExample1 /> }
export const WithIcons: Story = { name: "With Icons", render: () => <AlertExample2 /> }
export const Destructive: Story = { name: "Destructive", render: () => <AlertExample3 /> }
export const WithActions: Story = { name: "With Actions", render: () => <AlertExample4 /> }

import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import { cn } from "@/lib/utils"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

// Textarea: the official shadcn example for base-nova, one story per example as on
// the shadcn documentation page. Source: https://ui.shadcn.com/r/styles/base-nova/textarea-example.json, retrieved 2026-10-06.
// Changed on the way in: our frame instead of the site's, icons from
// lucide-react, Next.js image and link as plain img and a, toasts to the
// Actions panel. A story shows the component as the design system's
// users get it: nothing on top, no accessibility settings.

const meta = {
  title: "Forms/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "From the official shadcn example for base-nova (https://ui.shadcn.com/r/styles/base-nova/textarea-example.json, retrieved 2026-10-06). Behaviour comes from Base UI." } } },
} satisfies Meta

export default meta
type Story = StoryObj

// Playground: every prop that changes the look, in Controls; events in Actions.
export const Playground: Story = {
  args: {
    "aria-label": "Message",
    placeholder: "Type your message here.",
    disabled: false,
    onChange: fn(),
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
function TextareaBasic() {
  return (
    <Example title="Basic">
      <Textarea placeholder="Type your message here." />
    </Example>
  )
}

function TextareaInvalid() {
  return (
    <Example title="Invalid">
      <Textarea placeholder="Type your message here." aria-invalid="true" />
    </Example>
  )
}

function TextareaWithLabel() {
  return (
    <Example title="With Label">
      <Field>
        <FieldLabel htmlFor="textarea-demo-message">Message</FieldLabel>
        <Textarea
          id="textarea-demo-message"
          placeholder="Type your message here."
          rows={6}
        />
      </Field>
    </Example>
  )
}

function TextareaWithDescription() {
  return (
    <Example title="With Description">
      <Field>
        <FieldLabel htmlFor="textarea-demo-message-2">Message</FieldLabel>
        <Textarea
          id="textarea-demo-message-2"
          placeholder="Type your message here."
          rows={6}
        />
        <FieldDescription>
          Type your message and press enter to send.
        </FieldDescription>
      </Field>
    </Example>
  )
}

function TextareaDisabled() {
  return (
    <Example title="Disabled">
      <Field>
        <FieldLabel htmlFor="textarea-demo-disabled">Message</FieldLabel>
        <Textarea
          id="textarea-demo-disabled"
          placeholder="Type your message here."
          disabled
        />
      </Field>
    </Example>
  )
}

export const Basic: Story = { name: "Basic", render: () => <TextareaBasic /> }
export const Invalid: Story = { name: "Invalid", render: () => <TextareaInvalid /> }
export const WithLabel: Story = { name: "With Label", render: () => <TextareaWithLabel /> }
export const WithDescription: Story = { name: "With Description", render: () => <TextareaWithDescription /> }
export const Disabled: Story = { name: "Disabled", render: () => <TextareaDisabled /> }

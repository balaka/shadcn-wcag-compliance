import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Field, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"

// Spinner: the official shadcn example for base-nova, one story per example as on
// the shadcn documentation page. Source: https://ui.shadcn.com/r/styles/base-nova/spinner-example.json, retrieved 2026-10-06.
// Changed on the way in: our frame instead of the site's, icons from
// lucide-react, Next.js image and link as plain img and a, toasts to the
// Actions panel. A story shows the component as the design system's
// users get it: nothing on top, no accessibility settings.

const meta = {
  title: "Feedback/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "From the official shadcn example for base-nova (https://ui.shadcn.com/r/styles/base-nova/spinner-example.json, retrieved 2026-10-06). Behaviour comes from Base UI." } } },
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
function SpinnerBasic() {
  return (
    <Example title="Basic">
      <div className="flex items-center gap-6">
        <Spinner />
        <Spinner className="size-6" />
      </div>
    </Example>
  )
}

function SpinnerInButtons() {
  return (
    <Example title="In Buttons">
      <div className="flex flex-wrap items-center gap-4">
        <Button>
          <Spinner data-icon="inline-start" /> Submit
        </Button>
        <Button disabled>
          <Spinner data-icon="inline-start" /> Disabled
        </Button>
        <Button variant="outline" disabled>
          <Spinner data-icon="inline-start" /> Outline
        </Button>
        <Button variant="outline" size="icon" disabled>
          <Spinner data-icon="inline-start" />
          <span className="sr-only">Loading...</span>
        </Button>
      </div>
    </Example>
  )
}

function SpinnerInBadges() {
  return (
    <Example title="In Badges" className="items-center justify-center">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Badge>
          <Spinner data-icon="inline-start" />
          Badge
        </Badge>
        <Badge variant="secondary">
          <Spinner data-icon="inline-start" />
          Badge
        </Badge>
        <Badge variant="destructive">
          <Spinner data-icon="inline-start" />
          Badge
        </Badge>
        <Badge variant="outline">
          <Spinner data-icon="inline-start" />
          Badge
        </Badge>
      </div>
    </Example>
  )
}

function SpinnerInInputGroup() {
  return (
    <Example title="In Input Group">
      <Field>
        <FieldLabel htmlFor="input-group-spinner">Input Group</FieldLabel>
        <InputGroup>
          <InputGroupInput id="input-group-spinner" />
          <InputGroupAddon>
            <Spinner />
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </Example>
  )
}

function SpinnerInEmpty() {
  return (
    <Example title="In Empty State" containerClassName="lg:col-span-full">
      <Empty className="min-h-[300px]">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Spinner />
          </EmptyMedia>
          <EmptyTitle>No projects yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t created any projects yet. Get started by creating
            your first project.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button render={<a href="#" />} nativeButton={false}>
              Create project
            </Button>
            <Button variant="outline">Import project</Button>
          </div>
          <Button
            variant="link"
            render={<a href="#" />}
            nativeButton={false}
            className="text-muted-foreground"
          >
            Learn more{" "}
            <ArrowRightIcon />
          </Button>
        </EmptyContent>
      </Empty>
    </Example>
  )
}

export const Basic: Story = { name: "Basic", render: () => <SpinnerBasic /> }
export const InButtons: Story = { name: "In Buttons", render: () => <SpinnerInButtons /> }
export const InBadges: Story = { name: "In Badges", render: () => <SpinnerInBadges /> }
export const InInputGroup: Story = { name: "In Input Group", render: () => <SpinnerInInputGroup /> }
export const InEmptyState: Story = { name: "In Empty State", render: () => <SpinnerInEmpty /> }

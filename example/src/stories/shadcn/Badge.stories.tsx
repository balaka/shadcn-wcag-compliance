import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowRightIcon, ArrowUpRightIcon, BadgeCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"

// Badge: the official shadcn example for base-nova, one story per example as on
// the shadcn documentation page. Source: https://ui.shadcn.com/r/styles/base-nova/badge-example.json, retrieved 2026-10-06.
// Changed on the way in: our frame instead of the site's, icons from
// lucide-react, Next.js image and link as plain img and a, toasts to the
// Actions panel. A story shows the component as the design system's
// users get it: nothing on top, no accessibility settings.

const meta = {
  title: "Data display/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "From the official shadcn example for base-nova (https://ui.shadcn.com/r/styles/base-nova/badge-example.json, retrieved 2026-10-06). Behaviour comes from Base UI." } } },
} satisfies Meta

export default meta
type Story = StoryObj

// Playground: every prop that changes the look, in Controls; events in Actions.
export const Playground: Story = {
  args: {
    children: "Badge",
    variant: "default",
  },
  argTypes: {
    variant: { control: "select", options: ["default", "secondary", "destructive", "outline", "ghost", "link"] },
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
function BadgeVariants() {
  return (
    <Example title="Variants">
      <div className="flex flex-wrap gap-2 ">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="ghost">Ghost</Badge>
        <Badge variant="link">Link</Badge>
      </div>
    </Example>
  )
}

function BadgeWithIconLeft() {
  return (
    <Example title="Icon Left" className="max-w-fit">
      <div className="flex flex-wrap gap-2 ">
        <Badge>
          <BadgeCheck
            data-icon="inline-start" />
          Default
        </Badge>
        <Badge variant="secondary">
          <BadgeCheck
            data-icon="inline-start" />
          Secondary
        </Badge>
        <Badge variant="destructive">
          <BadgeCheck
            data-icon="inline-start" />
          Destructive
        </Badge>
        <Badge variant="outline">
          <BadgeCheck
            data-icon="inline-start" />
          Outline
        </Badge>
        <Badge variant="ghost">
          <BadgeCheck
            data-icon="inline-start" />
          Ghost
        </Badge>
        <Badge variant="link">
          <BadgeCheck
            data-icon="inline-start" />
          Link
        </Badge>
      </div>
    </Example>
  )
}

function BadgeWithIconRight() {
  return (
    <Example title="Icon Right" className="max-w-fit">
      <div className="flex flex-wrap gap-2 ">
        <Badge>
          Default
          <ArrowRightIcon
            data-icon="inline-end" />
        </Badge>
        <Badge variant="secondary">
          Secondary
          <ArrowRightIcon
            data-icon="inline-end" />
        </Badge>
        <Badge variant="destructive">
          Destructive
          <ArrowRightIcon
            data-icon="inline-end" />
        </Badge>
        <Badge variant="outline">
          Outline
          <ArrowRightIcon
            data-icon="inline-end" />
        </Badge>
        <Badge variant="ghost">
          Ghost
          <ArrowRightIcon
            data-icon="inline-end" />
        </Badge>
        <Badge variant="link">
          Link
          <ArrowRightIcon
            data-icon="inline-end" />
        </Badge>
      </div>
    </Example>
  )
}

function BadgeWithSpinner() {
  return (
    <Example title="With Spinner" className="max-w-fit">
      <div className="flex flex-wrap gap-2 ">
        <Badge>
          <Spinner data-icon="inline-start" />
          Default
        </Badge>
        <Badge variant="secondary">
          <Spinner data-icon="inline-start" />
          Secondary
        </Badge>
        <Badge variant="destructive">
          <Spinner data-icon="inline-start" />
          Destructive
        </Badge>
        <Badge variant="outline">
          <Spinner data-icon="inline-start" />
          Outline
        </Badge>
        <Badge variant="ghost">
          <Spinner data-icon="inline-start" />
          Ghost
        </Badge>
        <Badge variant="link">
          <Spinner data-icon="inline-start" />
          Link
        </Badge>
      </div>
    </Example>
  )
}

function BadgeAsLink() {
  return (
    <Example title="asChild">
      <div className="flex flex-wrap gap-2 ">
        <Badge
          render={
            <a href="#">
              Link{" "}
              <ArrowUpRightIcon
                data-icon="inline-end" />
            </a>
          }
        />
        <Badge
          variant="secondary"
          render={
            <a href="#">
              Link{" "}
              <ArrowUpRightIcon
                data-icon="inline-end" />
            </a>
          }
        />
        <Badge
          variant="destructive"
          render={
            <a href="#">
              Link{" "}
              <ArrowUpRightIcon
                data-icon="inline-end" />
            </a>
          }
        />
        <Badge
          variant="ghost"
          render={
            <a href="#">
              Link{" "}
              <ArrowUpRightIcon
                data-icon="inline-end" />
            </a>
          }
        />
      </div>
    </Example>
  )
}

function BadgeLongText() {
  return (
    <Example title="Long Text">
      <div className="flex flex-wrap gap-2 ">
        <Badge variant="secondary">
          A badge with a lot of text to see how it wraps
        </Badge>
      </div>
    </Example>
  )
}

function BadgeCustomColors() {
  return (
    <Example title="Custom Colors" className="max-w-fit">
      <div className="flex flex-wrap gap-2 ">
        <Badge className="bg-blue-600 text-blue-50 dark:bg-blue-600 dark:text-blue-50">
          Blue
        </Badge>
        <Badge className="bg-green-600 text-green-50 dark:bg-green-600 dark:text-green-50">
          Green
        </Badge>
        <Badge className="bg-sky-600 text-sky-50 dark:bg-sky-600 dark:text-sky-50">
          Sky
        </Badge>
        <Badge className="bg-purple-600 text-purple-50 dark:bg-purple-600 dark:text-purple-50">
          Purple
        </Badge>
        <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          Blue
        </Badge>
        <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
          Green
        </Badge>
        <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
          Sky
        </Badge>
        <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
          Purple
        </Badge>
        <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
          Red
        </Badge>
      </div>
    </Example>
  )
}

export const Variants: Story = { name: "Variants", render: () => <BadgeVariants /> }
export const IconLeft: Story = { name: "Icon Left", render: () => <BadgeWithIconLeft /> }
export const IconRight: Story = { name: "Icon Right", render: () => <BadgeWithIconRight /> }
export const WithSpinner: Story = { name: "With Spinner", render: () => <BadgeWithSpinner /> }
export const AsChild: Story = { name: "asChild", render: () => <BadgeAsLink /> }
export const LongText: Story = { name: "Long Text", render: () => <BadgeLongText /> }
export const CustomColors: Story = { name: "Custom Colors", render: () => <BadgeCustomColors /> }

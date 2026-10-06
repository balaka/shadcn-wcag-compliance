import type { Meta, StoryObj } from "@storybook/react-vite"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

// Separator: the official shadcn example for base-nova, one story per example as on
// the shadcn documentation page. Source: https://ui.shadcn.com/r/styles/base-nova/separator-example.json, retrieved 2026-10-06.
// Changed on the way in: our frame instead of the site's, icons from
// lucide-react, Next.js image and link as plain img and a, toasts to the
// Actions panel. A story shows the component as the design system's
// users get it: nothing on top, no accessibility settings.

const meta = {
  title: "Layout/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "From the official shadcn example for base-nova (https://ui.shadcn.com/r/styles/base-nova/separator-example.json, retrieved 2026-10-06). Behaviour comes from Base UI." } } },
} satisfies Meta

export default meta
type Story = StoryObj

// Playground: every prop that changes the look, in Controls; events in Actions.
export const Playground: Story = {
  args: {
    orientation: "horizontal",
  },
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
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
function SeparatorHorizontal() {
  return (
    <Example title="Horizontal">
      <div className="flex flex-col gap-4 text-sm ">
        <div className="flex flex-col gap-1">
          <div className="leading-none font-medium">shadcn/ui</div>
          <div className="text-muted-foreground">
            The Foundation for your Design System
          </div>
        </div>
        <Separator />
        <div>
          A set of beautifully designed components that you can customize,
          extend, and build on.
        </div>
      </div>
    </Example>
  )
}

function SeparatorVertical() {
  return (
    <Example title="Vertical">
      <div className="flex h-5 items-center gap-4 text-sm ">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </Example>
  )
}

function SeparatorVerticalMenu() {
  return (
    <Example title="Vertical Menu">
      <div className="flex items-center gap-2 text-sm md:gap-4 ">
        <div className="flex flex-col gap-1">
          <span className="font-medium">Settings</span>
          <span className="text-xs text-muted-foreground">
            Manage preferences
          </span>
        </div>
        <Separator orientation="vertical" />
        <div className="flex flex-col gap-1">
          <span className="font-medium">Account</span>
          <span className="text-xs text-muted-foreground">
            Profile & security
          </span>
        </div>
        <Separator orientation="vertical" />
        <div className="flex flex-col gap-1">
          <span className="font-medium">Help</span>
          <span className="text-xs text-muted-foreground">Support & docs</span>
        </div>
      </div>
    </Example>
  )
}

function SeparatorInList() {
  return (
    <Example title="In List">
      <div className="flex flex-col gap-2 text-sm ">
        <dl className="flex items-center justify-between">
          <dt>Item 1</dt>
          <dd className="text-muted-foreground">Value 1</dd>
        </dl>
        <Separator />
        <dl className="flex items-center justify-between">
          <dt>Item 2</dt>
          <dd className="text-muted-foreground">Value 2</dd>
        </dl>
        <Separator />
        <dl className="flex items-center justify-between">
          <dt>Item 3</dt>
          <dd className="text-muted-foreground">Value 3</dd>
        </dl>
      </div>
    </Example>
  )
}

export const Horizontal: Story = { name: "Horizontal", render: () => <SeparatorHorizontal /> }
export const Vertical: Story = { name: "Vertical", render: () => <SeparatorVertical /> }
export const VerticalMenu: Story = { name: "Vertical Menu", render: () => <SeparatorVerticalMenu /> }
export const InList: Story = { name: "In List", render: () => <SeparatorInList /> }

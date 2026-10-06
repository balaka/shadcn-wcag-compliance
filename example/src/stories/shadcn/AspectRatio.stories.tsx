import type { Meta, StoryObj } from "@storybook/react-vite"
import { cn } from "@/lib/utils"

import { AspectRatio } from "@/components/ui/aspect-ratio"

// AspectRatio: the official shadcn example for base-nova, one story per example as on
// the shadcn documentation page. Source: https://ui.shadcn.com/r/styles/base-nova/aspect-ratio-example.json, retrieved 2026-10-06.
// Changed on the way in: our frame instead of the site's, icons from
// lucide-react, Next.js image and link as plain img and a, toasts to the
// Actions panel. A story shows the component as the design system's
// users get it: nothing on top, no accessibility settings.

const meta = {
  title: "Layout/AspectRatio",
  component: AspectRatio,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "From the official shadcn example for base-nova (https://ui.shadcn.com/r/styles/base-nova/aspect-ratio-example.json, retrieved 2026-10-06). Behaviour comes from Base UI." } } },
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
function AspectRatio16x9() {
  return (
    <Example title="16:9" className="items-center justify-center">
      <AspectRatio
        ratio={16 / 9}
        className="rounded-lg bg-muted "
      >
        <img
          src="https://avatar.vercel.sh/shadcn1"
          alt="Photo"
          className="absolute inset-0 h-full w-full rounded-lg object-cover grayscale dark:brightness-20 "
        />
      </AspectRatio>
    </Example>
  )
}

function AspectRatio1x1() {
  return (
    <Example title="1:1" className="items-start">
      <AspectRatio
        ratio={1 / 1}
        className="rounded-lg bg-muted "
      >
        <img
          src="https://avatar.vercel.sh/shadcn1"
          alt="Photo"
          className="absolute inset-0 h-full w-full rounded-lg object-cover grayscale dark:brightness-20 "
        />
      </AspectRatio>
    </Example>
  )
}

function AspectRatio9x16() {
  return (
    <Example title="9:16" className="items-center justify-center">
      <AspectRatio
        ratio={9 / 16}
        className="rounded-lg bg-muted "
      >
        <img
          src="https://avatar.vercel.sh/shadcn1"
          alt="Photo"
          className="absolute inset-0 h-full w-full rounded-lg object-cover grayscale dark:brightness-20 "
        />
      </AspectRatio>
    </Example>
  )
}

function AspectRatio21x9() {
  return (
    <Example title="21:9" className="items-center justify-center">
      <AspectRatio
        ratio={21 / 9}
        className="rounded-lg bg-muted "
      >
        <img
          src="https://avatar.vercel.sh/shadcn1"
          alt="Photo"
          className="absolute inset-0 h-full w-full rounded-lg object-cover grayscale dark:brightness-20 "
        />
      </AspectRatio>
    </Example>
  )
}

export const Story169: Story = { name: "16:9", render: () => <AspectRatio16x9 /> }
export const Story219: Story = { name: "21:9", render: () => <AspectRatio21x9 /> }
export const Story11: Story = { name: "1:1", render: () => <AspectRatio1x1 /> }
export const Story916: Story = { name: "9:16", render: () => <AspectRatio9x16 /> }

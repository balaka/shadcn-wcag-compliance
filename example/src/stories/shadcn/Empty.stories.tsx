import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowUpRightIcon, CircleDashedIcon, FolderIcon, PlusIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"

// Empty: the official shadcn example for base-nova, one story per example as on
// the shadcn documentation page. Source: https://ui.shadcn.com/r/styles/base-nova/empty-example.json, retrieved 2026-10-06.
// Changed on the way in: our frame instead of the site's, icons from
// lucide-react, Next.js image and link as plain img and a, toasts to the
// Actions panel. A story shows the component as the design system's
// users get it: nothing on top, no accessibility settings.

const meta = {
  title: "Feedback/Empty",
  component: Empty,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "From the official shadcn example for base-nova (https://ui.shadcn.com/r/styles/base-nova/empty-example.json, retrieved 2026-10-06). Behaviour comes from Base UI." } } },
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
function EmptyBasic() {
  return (
    <Example title="Basic">
      <Empty>
        <EmptyHeader>
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
            className="text-muted-foreground"
            nativeButton={false}
          >
            Learn more{" "}
            <ArrowUpRightIcon />
          </Button>
        </EmptyContent>
      </Empty>
    </Example>
  )
}

function EmptyWithMutedBackground() {
  return (
    <Example title="With Muted Background">
      <Empty className="bg-muted">
        <EmptyHeader>
          <EmptyTitle>No results found</EmptyTitle>
          <EmptyDescription>
            No results found for your search. Try adjusting your search terms.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button>Try again</Button>
          <Button
            variant="link"
            render={<a href="#" />}
            className="text-muted-foreground"
            nativeButton={false}
          >
            Learn more{" "}
            <ArrowUpRightIcon />
          </Button>
        </EmptyContent>
      </Empty>
    </Example>
  )
}

function EmptyWithBorder() {
  return (
    <Example title="With Border">
      <Empty className="border">
        <EmptyHeader>
          <EmptyTitle>404 - Not Found</EmptyTitle>
          <EmptyDescription>
            The page you&apos;re looking for doesn&apos;t exist. Try searching
            for what you need below.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <InputGroup className="w-3/4">
            <InputGroupInput placeholder="Try searching for pages..." />
            <InputGroupAddon>
              <CircleDashedIcon />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <Kbd>/</Kbd>
            </InputGroupAddon>
          </InputGroup>
          <EmptyDescription>
            Need help? <a href="#">Contact support</a>
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    </Example>
  )
}

function EmptyWithIcon() {
  return (
    <Example title="With Icon">
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderIcon />
          </EmptyMedia>
          <EmptyTitle>Nothing to see here</EmptyTitle>
          <EmptyDescription>
            No posts have been created yet. Get started by{" "}
            <a href="#">creating your first post</a>.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline">
            <PlusIcon
              data-icon="inline-start" />
            New Post
          </Button>
        </EmptyContent>
      </Empty>
    </Example>
  )
}

function EmptyWithMutedBackgroundAlt() {
  return (
    <Example title="With Muted Background Alt">
      <Empty className="bg-muted/50">
        <EmptyHeader>
          <EmptyTitle>404 - Not Found</EmptyTitle>
          <EmptyDescription>
            The page you&apos;re looking for doesn&apos;t exist. Try searching
            for what you need below.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <InputGroup className="w-3/4">
            <InputGroupInput placeholder="Try searching for pages..." />
            <InputGroupAddon>
              <CircleDashedIcon />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <Kbd>/</Kbd>
            </InputGroupAddon>
          </InputGroup>
          <EmptyDescription>
            Need help? <a href="#">Contact support</a>
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    </Example>
  )
}

function EmptyInCard() {
  return (
    <Example title="In Card">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderIcon />
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
            className="text-muted-foreground"
            nativeButton={false}
          >
            Learn more{" "}
            <ArrowUpRightIcon />
          </Button>
        </EmptyContent>
      </Empty>
    </Example>
  )
}

export const Basic: Story = { name: "Basic", render: () => <EmptyBasic /> }
export const WithMutedBackground: Story = { name: "With Muted Background", render: () => <EmptyWithMutedBackground /> }
export const WithBorder: Story = { name: "With Border", render: () => <EmptyWithBorder /> }
export const WithIcon: Story = { name: "With Icon", render: () => <EmptyWithIcon /> }
export const WithMutedBackgroundAlt: Story = { name: "With Muted Background Alt", render: () => <EmptyWithMutedBackgroundAlt /> }
export const InCard: Story = { name: "In Card", render: () => <EmptyInCard /> }

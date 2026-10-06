import type { Meta, StoryObj } from "@storybook/react-vite"
import { FileIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import * as React from "react"

import { Item, ItemActions, ItemContent, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"

// Progress: the official shadcn example for base-nova, one story per example as on
// the shadcn documentation page. Source: https://ui.shadcn.com/r/styles/base-nova/progress-example.json, retrieved 2026-10-06.
// Changed on the way in: our frame instead of the site's, icons from
// lucide-react, Next.js image and link as plain img and a, toasts to the
// Actions panel. A story shows the component as the design system's
// users get it: nothing on top, no accessibility settings.

const meta = {
  title: "Feedback/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "From the official shadcn example for base-nova (https://ui.shadcn.com/r/styles/base-nova/progress-example.json, retrieved 2026-10-06). Behaviour comes from Base UI." } } },
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
function ProgressValues() {
  return (
    <Example title="Progress Bar">
      <div className="flex w-full flex-col gap-4">
        <Progress value={0} />
        <Progress value={25} className="w-full" />
        <Progress value={50} />
        <Progress value={75} />
        <Progress value={100} />
      </div>
    </Example>
  )
}

function ProgressWithLabel() {
  return (
    <Example title="With Label">
      <Progress value={56}>
        <ProgressLabel>Upload progress</ProgressLabel>
        <ProgressValue />
      </Progress>
    </Example>
  )
}

function ProgressControlled() {
  const [value, setValue] = React.useState(50)

  return (
    <Example title="Controlled">
      <div className="flex w-full flex-col gap-4">
        <Progress value={value} className="w-full" />
        <Slider
          value={value}
          onValueChange={(value) => setValue(value as number)}
          min={0}
          max={100}
          step={1}
        />
      </div>
    </Example>
  )
}

function FileUploadList() {
  const files = React.useMemo(
    () => [
      {
        id: "1",
        name: "document.pdf",
        progress: 45,
        timeRemaining: "2m 30s",
      },
      {
        id: "2",
        name: "presentation.pptx",
        progress: 78,
        timeRemaining: "45s",
      },
      {
        id: "3",
        name: "spreadsheet.xlsx",
        progress: 12,
        timeRemaining: "5m 12s",
      },
      {
        id: "4",
        name: "image.jpg",
        progress: 100,
        timeRemaining: "Complete",
      },
    ],
    []
  )

  return (
    <Example title="File Upload List">
      <ItemGroup>
        {files.map((file) => (
          <Item key={file.id} size="xs" className="px-0">
            <ItemMedia variant="icon">
              <FileIcon
                className="size-5" />
            </ItemMedia>
            <ItemContent className="inline-block truncate">
              <ItemTitle className="inline">{file.name}</ItemTitle>
            </ItemContent>
            <ItemContent>
              <Progress value={file.progress} className="w-32" />
            </ItemContent>
            <ItemActions className="w-16 justify-end">
              <span className="text-sm text-muted-foreground">
                {file.timeRemaining}
              </span>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </Example>
  )
}

export const ProgressBar: Story = { name: "Progress Bar", render: () => <ProgressValues /> }
export const WithLabel: Story = { name: "With Label", render: () => <ProgressWithLabel /> }
export const Controlled: Story = { name: "Controlled", render: () => <ProgressControlled /> }
export const FileUploadListStory: Story = { name: "File Upload List", render: () => <FileUploadList /> }

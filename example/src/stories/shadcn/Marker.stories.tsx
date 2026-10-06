import type { Meta, StoryObj } from "@storybook/react-vite"
import { action } from "storybook/actions"
import { CheckIcon, ChevronRightIcon, CircleUserIcon, ClockIcon, FileTextIcon, GitBranchIcon, SearchIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import { Spinner } from "@/components/ui/spinner"

// Marker: the official shadcn example for base-nova, one story per example as on
// the shadcn documentation page. Source: https://ui.shadcn.com/r/styles/base-nova/marker-example.json, retrieved 2026-10-06.
// Changed on the way in: our frame instead of the site's, icons from
// lucide-react, Next.js image and link as plain img and a, toasts to the
// Actions panel. A story shows the component as the design system's
// users get it: nothing on top, no accessibility settings.

const toast = action("toast")

const meta = {
  title: "AI/Marker",
  component: Marker,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "From the official shadcn example for base-nova (https://ui.shadcn.com/r/styles/base-nova/marker-example.json, retrieved 2026-10-06). Behaviour comes from Base UI." } } },
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
function MarkerExample() {
  return (
    <Example title="Markers" className="gap-8">
      <Marker>
        <MarkerContent>A default marker</MarkerContent>
      </Marker>
      <Marker>
        <MarkerIcon>
          <FileTextIcon />
        </MarkerIcon>
        <MarkerContent>Marker with icon</MarkerContent>
      </Marker>
      <Marker role="status">
        <MarkerIcon>
          <Spinner />
        </MarkerIcon>
        <MarkerContent>Marker with a spinner</MarkerContent>
      </Marker>
      <Marker role="status">
        <MarkerIcon>
          <Spinner />
        </MarkerIcon>
        <MarkerContent className="shimmer">
          Marker with shimmer effect
        </MarkerContent>
      </Marker>
      <Marker role="status">
        <MarkerContent className="shimmer">Thinking...</MarkerContent>
      </Marker>
      <Marker render={<a href="#" />}>
        <MarkerIcon>
          <GitBranchIcon />
        </MarkerIcon>
        <MarkerContent>Marker as a link</MarkerContent>
      </Marker>
      <Marker
        render={
          <button
            onClick={() => toast("You clicked the button")}
            className="transition-colors hover:text-foreground"
          />
        }
      >
        <MarkerIcon>
          <ClockIcon />
        </MarkerIcon>
        <MarkerContent className="flex-1">
          <div>Marker as a button</div>
        </MarkerContent>
        <MarkerIcon>
          <ChevronRightIcon />
        </MarkerIcon>
      </Marker>
      <Marker>
        <MarkerIcon>
          <CircleUserIcon />
        </MarkerIcon>
        <MarkerContent>Rhea joined the chat</MarkerContent>
      </Marker>
      <Marker className="justify-center">
        <MarkerContent>
          <strong className="font-medium">Olivia Rose</strong> left the chat
        </MarkerContent>
      </Marker>
      <Marker className="flex-col">
        <MarkerIcon>
          <FileTextIcon />
        </MarkerIcon>
        <MarkerContent>Marker with icon at the top</MarkerContent>
      </Marker>
    </Example>
  )
}

function MarkerBorder() {
  return (
    <Example title="Border" className="gap-3">
      <Marker variant="border">
        <MarkerIcon>
          <GitBranchIcon />
        </MarkerIcon>
        <MarkerContent>Switched to release-candidate</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerIcon>
          <SearchIcon />
        </MarkerIcon>
        <MarkerContent>Reviewed 8 related files</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerIcon>
          <FileTextIcon />
        </MarkerIcon>
        <MarkerContent>Opened implementation notes</MarkerContent>
      </Marker>
    </Example>
  )
}

function MarkerSeparator() {
  return (
    <Example title="Separator" className="gap-8">
      <Marker variant="separator">
        <MarkerContent>Worked for 42s</MarkerContent>
      </Marker>
      <Marker variant="separator" role="status">
        <MarkerIcon>
          <Spinner />
        </MarkerIcon>
        <MarkerContent>Compacting conversation</MarkerContent>
      </Marker>
      <Marker variant="separator" role="status">
        <MarkerContent className="shimmer">Reading 4 files</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerIcon>
          <CheckIcon />
        </MarkerIcon>
        <MarkerContent>Conversation compacted</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>
          With a <a href="#">link to learn more</a>
        </MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>
          <Button variant="outline">
            <GitBranchIcon />
            Button
          </Button>
        </MarkerContent>
      </Marker>
    </Example>
  )
}

function MarkerAccordion() {
  return (
    <Example title="Accordion" containerClassName="min-h-72">
      <Accordion>
        <AccordionItem value="1">
          <AccordionTrigger>
            <Marker>
              <MarkerIcon>
                <ClockIcon />
              </MarkerIcon>
              <MarkerContent>Worked for 42s</MarkerContent>
            </Marker>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground">
              The user asked for a list of all the files in the current
              directory. The assistant responded with a list of all the files in
              the current directory.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Example>
  )
}

function MarkerDrawer() {
  return (
    <Example title="Drawer">
      <Drawer swipeDirection="right">
        <Marker variant="separator">
          <DrawerTrigger render={<Button variant="outline" />}>
            <SearchIcon
              data-icon="inline-start" />
            Explored 4 files
          </DrawerTrigger>
        </Marker>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>File Activity</DrawerTitle>
            <DrawerDescription>
              Files read while preparing the response.
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-3 px-4 text-sm">
            <div className="flex items-center justify-between gap-4 rounded-md border px-3 py-2">
              <span className="truncate">app/chat/page.tsx</span>
              <span className="text-muted-foreground">read</span>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-md border px-3 py-2">
              <span className="truncate">components/message.tsx</span>
              <span className="text-muted-foreground">read</span>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-md border px-3 py-2">
              <span className="truncate">lib/ai.ts</span>
              <span className="text-muted-foreground">read</span>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose render={<Button variant="outline" />}>
              Close
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Example>
  )
}

export const Markers: Story = { name: "Markers", render: () => <MarkerExample /> }
export const Border: Story = { name: "Border", render: () => <MarkerBorder /> }
export const Separator: Story = { name: "Separator", render: () => <MarkerSeparator /> }
export const AccordionStory: Story = { name: "Accordion", render: () => <MarkerAccordion /> }
export const DrawerStory: Story = { name: "Drawer", render: () => <MarkerDrawer /> }

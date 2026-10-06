import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowDownIcon, ArrowUpIcon, BoldIcon, BookmarkIcon, HeartIcon, ItalicIcon, StarIcon, TrendingUpIcon, UnderlineIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import * as React from "react"

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

// ToggleGroup: the official shadcn example for base-nova, one story per example as on
// the shadcn documentation page. Source: https://ui.shadcn.com/r/styles/base-nova/toggle-group-example.json, retrieved 2026-10-06.
// Changed on the way in: our frame instead of the site's, icons from
// lucide-react, Next.js image and link as plain img and a, toasts to the
// Actions panel. A story shows the component as the design system's
// users get it: nothing on top, no accessibility settings.

const meta = {
  title: "Forms/ToggleGroup",
  component: ToggleGroup,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "From the official shadcn example for base-nova (https://ui.shadcn.com/r/styles/base-nova/toggle-group-example.json, retrieved 2026-10-06). Behaviour comes from Base UI." } } },
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
function ToggleGroupBasic() {
  return (
    <Example title="Basic">
      <ToggleGroup multiple spacing={1}>
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <ItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <UnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  )
}

function ToggleGroupOutline() {
  return (
    <Example title="Outline">
      <ToggleGroup variant="outline" defaultValue={["all"]}>
        <ToggleGroupItem value="all" aria-label="Toggle all">
          All
        </ToggleGroupItem>
        <ToggleGroupItem value="missed" aria-label="Toggle missed">
          Missed
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  )
}

function ToggleGroupOutlineWithIcons() {
  return (
    <Example title="Outline With Icons">
      <ToggleGroup variant="outline" multiple size="sm">
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <ItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <UnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  )
}

function ToggleGroupSizes() {
  return (
    <Example title="Sizes">
      <div className="flex flex-col gap-4">
        <ToggleGroup size="sm" defaultValue={["top"]} variant="outline">
          <ToggleGroupItem value="top" aria-label="Toggle top">
            Top
          </ToggleGroupItem>
          <ToggleGroupItem value="bottom" aria-label="Toggle bottom">
            Bottom
          </ToggleGroupItem>
          <ToggleGroupItem value="left" aria-label="Toggle left">
            Left
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Toggle right">
            Right
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup defaultValue={["top"]} variant="outline">
          <ToggleGroupItem value="top" aria-label="Toggle top">
            Top
          </ToggleGroupItem>
          <ToggleGroupItem value="bottom" aria-label="Toggle bottom">
            Bottom
          </ToggleGroupItem>
          <ToggleGroupItem value="left" aria-label="Toggle left">
            Left
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Toggle right">
            Right
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </Example>
  )
}

function ToggleGroupSpacing() {
  return (
    <Example title="With Spacing">
      <ToggleGroup size="sm" defaultValue={["top"]} spacing={2}>
        <ToggleGroupItem value="top" aria-label="Toggle top">
          Top
        </ToggleGroupItem>
        <ToggleGroupItem value="bottom" aria-label="Toggle bottom">
          Bottom
        </ToggleGroupItem>
        <ToggleGroupItem value="left" aria-label="Toggle left">
          Left
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Toggle right">
          Right
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  )
}

function ToggleGroupWithIcons() {
  return (
    <Example title="With Icons">
      <ToggleGroup multiple variant="outline" spacing={2} size="sm">
        <ToggleGroupItem
          value="star"
          aria-label="Toggle star"
          className="aria-pressed:bg-transparent aria-pressed:*:[svg]:fill-foreground aria-pressed:*:[svg]:stroke-foreground"
        >
          <StarIcon />
          Star
        </ToggleGroupItem>
        <ToggleGroupItem
          value="heart"
          aria-label="Toggle heart"
          className="aria-pressed:bg-transparent aria-pressed:*:[svg]:fill-foreground aria-pressed:*:[svg]:stroke-foreground"
        >
          <HeartIcon />
          Heart
        </ToggleGroupItem>
        <ToggleGroupItem
          value="bookmark"
          aria-label="Toggle bookmark"
          className="aria-pressed:bg-transparent aria-pressed:*:[svg]:fill-foreground aria-pressed:*:[svg]:stroke-foreground"
        >
          <BookmarkIcon />
          Bookmark
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  )
}

function ToggleGroupFilter() {
  return (
    <Example title="Filter">
      <ToggleGroup defaultValue={["all"]} variant="outline" size="sm">
        <ToggleGroupItem value="all" aria-label="All">
          All
        </ToggleGroupItem>
        <ToggleGroupItem value="active" aria-label="Active">
          Active
        </ToggleGroupItem>
        <ToggleGroupItem value="completed" aria-label="Completed">
          Completed
        </ToggleGroupItem>
        <ToggleGroupItem value="archived" aria-label="Archived">
          Archived
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  )
}

function ToggleGroupDateRange() {
  return (
    <Example title="Date Range">
      <ToggleGroup
        defaultValue={["today"]}
        variant="outline"
        size="sm"
        spacing={2}
      >
        <ToggleGroupItem value="today" aria-label="Today">
          Today
        </ToggleGroupItem>
        <ToggleGroupItem value="week" aria-label="This Week">
          This Week
        </ToggleGroupItem>
        <ToggleGroupItem value="month" aria-label="This Month">
          This Month
        </ToggleGroupItem>
        <ToggleGroupItem value="year" aria-label="This Year">
          This Year
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  )
}

function ToggleGroupSort() {
  return (
    <Example title="Sort">
      <ToggleGroup defaultValue={["newest"]} variant="outline" size="sm">
        <ToggleGroupItem value="newest" aria-label="Newest">
          <ArrowDownIcon />
          Newest
        </ToggleGroupItem>
        <ToggleGroupItem value="oldest" aria-label="Oldest">
          <ArrowUpIcon />
          Oldest
        </ToggleGroupItem>
        <ToggleGroupItem value="popular" aria-label="Popular">
          <TrendingUpIcon />
          Popular
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  )
}

function ToggleGroupWithInputAndSelect() {
  const items = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Archived", value: "archived" },
  ]
  return (
    <Example title="With Input and Select">
      <div className="flex items-center gap-2">
        <Input type="search" placeholder="Search..." className="flex-1" />
        <Select items={items} defaultValue={items[0]}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <ToggleGroup defaultValue={["grid"]} variant="outline">
          <ToggleGroupItem value="grid" aria-label="Grid view">
            Grid
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            List
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </Example>
  )
}

function ToggleGroupVertical() {
  return (
    <Example title="Vertical">
      <ToggleGroup multiple orientation="vertical" spacing={1}>
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <ItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <UnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  )
}

function ToggleGroupVerticalOutline() {
  return (
    <Example title="Vertical Outline">
      <ToggleGroup
        variant="outline"
        defaultValue={["all"]}
        orientation="vertical"
        size="sm"
      >
        <ToggleGroupItem value="all" aria-label="Toggle all">
          All
        </ToggleGroupItem>
        <ToggleGroupItem value="active" aria-label="Toggle active">
          Active
        </ToggleGroupItem>
        <ToggleGroupItem value="completed" aria-label="Toggle completed">
          Completed
        </ToggleGroupItem>
        <ToggleGroupItem value="archived" aria-label="Toggle archived">
          Archived
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  )
}

function ToggleGroupVerticalOutlineWithIcons() {
  return (
    <Example title="Vertical Outline With Icons">
      <ToggleGroup variant="outline" multiple orientation="vertical" size="sm">
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <ItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <UnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  )
}

function ToggleGroupFontWeightSelector() {
  const [fontWeight, setFontWeight] = React.useState("normal")
  return (
    <Example title="Font Weight Selector">
      <Field>
        <FieldLabel>Font Weight</FieldLabel>
        <ToggleGroup
          value={[fontWeight]}
          onValueChange={(value) => setFontWeight(value[0])}
          variant="outline"
          spacing={2}
          size="lg"
        >
          <ToggleGroupItem
            value="light"
            aria-label="Light"
            className="flex size-16 flex-col items-center justify-center rounded-xl"
          >
            <span className="text-2xl leading-none font-light">Aa</span>
            <span className="text-xs text-muted-foreground">Light</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="normal"
            aria-label="Normal"
            className="flex size-16 flex-col items-center justify-center rounded-xl"
          >
            <span className="text-2xl leading-none font-normal">Aa</span>
            <span className="text-xs text-muted-foreground">Normal</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="medium"
            aria-label="Medium"
            className="flex size-16 flex-col items-center justify-center rounded-xl"
          >
            <span className="text-2xl leading-none font-medium">Aa</span>
            <span className="text-xs text-muted-foreground">Medium</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="bold"
            aria-label="Bold"
            className="flex size-16 flex-col items-center justify-center rounded-xl"
          >
            <span className="text-2xl leading-none font-bold">Aa</span>
            <span className="text-xs text-muted-foreground">Bold</span>
          </ToggleGroupItem>
        </ToggleGroup>
        <FieldDescription>
          Use{" "}
          <code className="rounded-md bg-muted px-1 py-0.5 font-mono">
            font-{fontWeight}
          </code>{" "}
          to set the font weight.
        </FieldDescription>
      </Field>
    </Example>
  )
}

function ToggleGroupVerticalWithSpacing() {
  return (
    <Example title="Vertical With Spacing">
      <ToggleGroup
        size="sm"
        defaultValue={["top"]}
        orientation="vertical"
        spacing={1}
      >
        <ToggleGroupItem value="top" aria-label="Toggle top">
          Top
        </ToggleGroupItem>
        <ToggleGroupItem value="bottom" aria-label="Toggle bottom">
          Bottom
        </ToggleGroupItem>
        <ToggleGroupItem value="left" aria-label="Toggle left">
          Left
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Toggle right">
          Right
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  )
}

export const Basic: Story = { name: "Basic", render: () => <ToggleGroupBasic /> }
export const Outline: Story = { name: "Outline", render: () => <ToggleGroupOutline /> }
export const OutlineWithIcons: Story = { name: "Outline With Icons", render: () => <ToggleGroupOutlineWithIcons /> }
export const Sizes: Story = { name: "Sizes", render: () => <ToggleGroupSizes /> }
export const WithSpacing: Story = { name: "With Spacing", render: () => <ToggleGroupSpacing /> }
export const WithIcons: Story = { name: "With Icons", render: () => <ToggleGroupWithIcons /> }
export const Filter: Story = { name: "Filter", render: () => <ToggleGroupFilter /> }
export const DateRange: Story = { name: "Date Range", render: () => <ToggleGroupDateRange /> }
export const Sort: Story = { name: "Sort", render: () => <ToggleGroupSort /> }
export const WithInputAndSelect: Story = { name: "With Input and Select", render: () => <ToggleGroupWithInputAndSelect /> }
export const Vertical: Story = { name: "Vertical", render: () => <ToggleGroupVertical /> }
export const VerticalOutline: Story = { name: "Vertical Outline", render: () => <ToggleGroupVerticalOutline /> }
export const VerticalOutlineWithIcons: Story = { name: "Vertical Outline With Icons", render: () => <ToggleGroupVerticalOutlineWithIcons /> }
export const VerticalWithSpacing: Story = { name: "Vertical With Spacing", render: () => <ToggleGroupVerticalWithSpacing /> }
export const FontWeightSelector: Story = { name: "Font Weight Selector", render: () => <ToggleGroupFontWeightSelector /> }

import type { Meta, StoryObj } from "@storybook/react-vite"
import { cn } from "@/lib/utils"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "@/components/ui/native-select"

// NativeSelect: the official shadcn example for base-nova, one story per example as on
// the shadcn documentation page. Source: https://ui.shadcn.com/r/styles/base-nova/native-select-example.json, retrieved 2026-10-06.
// Changed on the way in: our frame instead of the site's, icons from
// lucide-react, Next.js image and link as plain img and a, toasts to the
// Actions panel. A story shows the component as the design system's
// users get it: nothing on top, no accessibility settings.

const meta = {
  title: "Forms/NativeSelect",
  component: NativeSelect,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "From the official shadcn example for base-nova (https://ui.shadcn.com/r/styles/base-nova/native-select-example.json, retrieved 2026-10-06). Behaviour comes from Base UI." } } },
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
function NativeSelectBasic() {
  return (
    <Example title="Basic">
      <NativeSelect>
        <NativeSelectOption value="">Select a fruit</NativeSelectOption>
        <NativeSelectOption value="apple">Apple</NativeSelectOption>
        <NativeSelectOption value="banana">Banana</NativeSelectOption>
        <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
        <NativeSelectOption value="grapes" disabled>
          Grapes
        </NativeSelectOption>
        <NativeSelectOption value="pineapple">Pineapple</NativeSelectOption>
      </NativeSelect>
    </Example>
  )
}

function NativeSelectWithGroups() {
  return (
    <Example title="With Groups">
      <NativeSelect>
        <NativeSelectOption value="">Select a food</NativeSelectOption>
        <NativeSelectOptGroup label="Fruits">
          <NativeSelectOption value="apple">Apple</NativeSelectOption>
          <NativeSelectOption value="banana">Banana</NativeSelectOption>
          <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Vegetables">
          <NativeSelectOption value="carrot">Carrot</NativeSelectOption>
          <NativeSelectOption value="broccoli">Broccoli</NativeSelectOption>
          <NativeSelectOption value="spinach">Spinach</NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
    </Example>
  )
}

function NativeSelectSizes() {
  return (
    <Example title="Sizes">
      <div className="flex flex-col gap-4">
        <NativeSelect size="sm">
          <NativeSelectOption value="">Select a fruit</NativeSelectOption>
          <NativeSelectOption value="apple">Apple</NativeSelectOption>
          <NativeSelectOption value="banana">Banana</NativeSelectOption>
          <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
        </NativeSelect>
        <NativeSelect size="default">
          <NativeSelectOption value="">Select a fruit</NativeSelectOption>
          <NativeSelectOption value="apple">Apple</NativeSelectOption>
          <NativeSelectOption value="banana">Banana</NativeSelectOption>
          <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
        </NativeSelect>
      </div>
    </Example>
  )
}

function NativeSelectWithField() {
  return (
    <Example title="With Field">
      <Field>
        <FieldLabel htmlFor="native-select-country">Country</FieldLabel>
        <NativeSelect id="native-select-country">
          <NativeSelectOption value="">Select a country</NativeSelectOption>
          <NativeSelectOption value="us">United States</NativeSelectOption>
          <NativeSelectOption value="uk">United Kingdom</NativeSelectOption>
          <NativeSelectOption value="ca">Canada</NativeSelectOption>
          <NativeSelectOption value="au">Australia</NativeSelectOption>
        </NativeSelect>
        <FieldDescription>Select your country of residence.</FieldDescription>
      </Field>
    </Example>
  )
}

function NativeSelectDisabled() {
  return (
    <Example title="Disabled">
      <NativeSelect disabled>
        <NativeSelectOption value="">Disabled</NativeSelectOption>
        <NativeSelectOption value="apple">Apple</NativeSelectOption>
        <NativeSelectOption value="banana">Banana</NativeSelectOption>
        <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
      </NativeSelect>
    </Example>
  )
}

function NativeSelectInvalid() {
  return (
    <Example title="Invalid">
      <NativeSelect aria-invalid="true">
        <NativeSelectOption value="">Error state</NativeSelectOption>
        <NativeSelectOption value="apple">Apple</NativeSelectOption>
        <NativeSelectOption value="banana">Banana</NativeSelectOption>
        <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
      </NativeSelect>
    </Example>
  )
}

export const Basic: Story = { name: "Basic", render: () => <NativeSelectBasic /> }
export const WithGroups: Story = { name: "With Groups", render: () => <NativeSelectWithGroups /> }
export const Sizes: Story = { name: "Sizes", render: () => <NativeSelectSizes /> }
export const WithField: Story = { name: "With Field", render: () => <NativeSelectWithField /> }
export const Disabled: Story = { name: "Disabled", render: () => <NativeSelectDisabled /> }
export const Invalid: Story = { name: "Invalid", render: () => <NativeSelectInvalid /> }

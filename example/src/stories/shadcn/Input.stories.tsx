import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Input: the official shadcn example for base-nova, one story per example as on
// the shadcn documentation page. Source: https://ui.shadcn.com/r/styles/base-nova/input-example.json, retrieved 2026-10-06.
// Changed on the way in: our frame instead of the site's, icons from
// lucide-react, Next.js image and link as plain img and a, toasts to the
// Actions panel. A story shows the component as the design system's
// users get it: nothing on top, no accessibility settings.

const meta = {
  title: "Forms/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "From the official shadcn example for base-nova (https://ui.shadcn.com/r/styles/base-nova/input-example.json, retrieved 2026-10-06). Behaviour comes from Base UI." } } },
} satisfies Meta

export default meta
type Story = StoryObj

// Playground: every prop that changes the look, in Controls; events in Actions.
export const Playground: Story = {
  args: {
    "aria-label": "Email",
    type: "email",
    placeholder: "name@example.com",
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
function InputBasic() {
  return (
    <Example title="Basic">
      <Input type="email" placeholder="Email" />
    </Example>
  )
}

function InputInvalid() {
  return (
    <Example title="Invalid">
      <Input type="text" placeholder="Error" aria-invalid="true" />
    </Example>
  )
}

function InputWithLabel() {
  return (
    <Example title="With Label">
      <Field>
        <FieldLabel htmlFor="input-demo-email">Email</FieldLabel>
        <Input
          id="input-demo-email"
          type="email"
          placeholder="name@example.com"
        />
      </Field>
    </Example>
  )
}

function InputWithDescription() {
  return (
    <Example title="With Description">
      <Field>
        <FieldLabel htmlFor="input-demo-username">Username</FieldLabel>
        <Input
          id="input-demo-username"
          type="text"
          placeholder="Enter your username"
        />
        <FieldDescription>
          Choose a unique username for your account.
        </FieldDescription>
      </Field>
    </Example>
  )
}

function InputDisabled() {
  return (
    <Example title="Disabled">
      <Field>
        <FieldLabel htmlFor="input-demo-disabled">Email</FieldLabel>
        <Input
          id="input-demo-disabled"
          type="email"
          placeholder="Email"
          disabled
        />
      </Field>
    </Example>
  )
}

function InputTypes() {
  return (
    <Example title="Input Types">
      <div className="flex w-full flex-col gap-6">
        <Field>
          <FieldLabel htmlFor="input-demo-password">Password</FieldLabel>
          <Input
            id="input-demo-password"
            type="password"
            placeholder="Password"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="input-demo-tel">Phone</FieldLabel>
          <Input
            id="input-demo-tel"
            type="tel"
            placeholder="+1 (555) 123-4567"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="input-demo-url">URL</FieldLabel>
          <Input
            id="input-demo-url"
            type="url"
            placeholder="https://example.com"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="input-demo-search">Search</FieldLabel>
          <Input id="input-demo-search" type="search" placeholder="Search" />
        </Field>
        <Field>
          <FieldLabel htmlFor="input-demo-number">Number</FieldLabel>
          <Input id="input-demo-number" type="number" placeholder="123" />
        </Field>
        <Field>
          <FieldLabel htmlFor="input-demo-date">Date</FieldLabel>
          <Input id="input-demo-date" type="date" />
        </Field>
        <Field>
          <FieldLabel htmlFor="input-demo-time">Time</FieldLabel>
          <Input id="input-demo-time" type="time" />
        </Field>
        <Field>
          <FieldLabel htmlFor="input-demo-file">File</FieldLabel>
          <Input id="input-demo-file" type="file" />
        </Field>
      </div>
    </Example>
  )
}

function InputWithSelect() {
  return (
    <Example title="With Select">
      <div className="flex w-full gap-2">
        <Input type="text" placeholder="Enter amount" className="flex-1" />
        <Select defaultValue="usd">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="usd">USD</SelectItem>
              <SelectItem value="eur">EUR</SelectItem>
              <SelectItem value="gbp">GBP</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </Example>
  )
}

function InputWithButton() {
  return (
    <Example title="With Button">
      <div className="flex w-full gap-2">
        <Input type="search" placeholder="Search..." className="flex-1" />
        <Button>Search</Button>
      </div>
    </Example>
  )
}

function InputWithNativeSelect() {
  return (
    <Example title="With Native Select">
      <div className="flex w-full gap-2">
        <Input type="tel" placeholder="(555) 123-4567" className="flex-1" />
        <NativeSelect defaultValue="+1">
          <NativeSelectOption value="+1">+1</NativeSelectOption>
          <NativeSelectOption value="+44">+44</NativeSelectOption>
          <NativeSelectOption value="+46">+46</NativeSelectOption>
        </NativeSelect>
      </div>
    </Example>
  )
}

function InputForm() {
  return (
    <Example title="Form">
      <form className="w-full">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="form-name">Name</FieldLabel>
            <Input id="form-name" type="text" placeholder="John Doe" />
          </Field>
          <Field>
            <FieldLabel htmlFor="form-email">Email</FieldLabel>
            <Input
              id="form-email"
              type="email"
              placeholder="john@example.com"
            />
            <FieldDescription>
              We&apos;ll never share your email with anyone.
            </FieldDescription>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="form-phone">Phone</FieldLabel>
              <Input
                id="form-phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="form-country">Country</FieldLabel>
              <Select defaultValue="us">
                <SelectTrigger id="form-country">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="form-address">Address</FieldLabel>
            <Input id="form-address" type="text" placeholder="123 Main St" />
          </Field>
          <Field orientation="horizontal">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </Field>
        </FieldGroup>
      </form>
    </Example>
  )
}

export const Basic: Story = { name: "Basic", render: () => <InputBasic /> }
export const Invalid: Story = { name: "Invalid", render: () => <InputInvalid /> }
export const WithLabel: Story = { name: "With Label", render: () => <InputWithLabel /> }
export const WithDescription: Story = { name: "With Description", render: () => <InputWithDescription /> }
export const Disabled: Story = { name: "Disabled", render: () => <InputDisabled /> }
export const InputTypesStory: Story = { name: "Input Types", render: () => <InputTypes /> }
export const WithSelect: Story = { name: "With Select", render: () => <InputWithSelect /> }
export const WithButton: Story = { name: "With Button", render: () => <InputWithButton /> }
export const WithNativeSelect: Story = { name: "With Native Select", render: () => <InputWithNativeSelect /> }
export const Form: Story = { name: "Form", render: () => <InputForm /> }

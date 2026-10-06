import type { Meta, StoryObj } from "@storybook/react-vite"
import { cn } from "@/lib/utils"
import { Field, FieldContent, FieldDescription, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// RadioGroup: the official shadcn example for base-nova, one story per example as on
// the shadcn documentation page. Source: https://ui.shadcn.com/r/styles/base-nova/radio-group-example.json, retrieved 2026-10-06.
// Changed on the way in: our frame instead of the site's, icons from
// lucide-react, Next.js image and link as plain img and a, toasts to the
// Actions panel. A story shows the component as the design system's
// users get it: nothing on top, no accessibility settings.

const meta = {
  title: "Forms/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "From the official shadcn example for base-nova (https://ui.shadcn.com/r/styles/base-nova/radio-group-example.json, retrieved 2026-10-06). Behaviour comes from Base UI." } } },
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
function RadioGroupBasic() {
  return (
    <Example title="Basic">
      <RadioGroup defaultValue="comfortable">
        <Field orientation="horizontal">
          <RadioGroupItem value="default" id="r1" />
          <FieldLabel htmlFor="r1" className="font-normal">
            Default
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="comfortable" id="r2" />
          <FieldLabel htmlFor="r2" className="font-normal">
            Comfortable
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="compact" id="r3" />
          <FieldLabel htmlFor="r3" className="font-normal">
            Compact
          </FieldLabel>
        </Field>
      </RadioGroup>
    </Example>
  )
}

function RadioGroupWithDescriptions() {
  return (
    <Example title="With Descriptions">
      <RadioGroup defaultValue="plus">
        <FieldLabel htmlFor="plus-plan">
          <Field orientation="horizontal">
            <FieldContent>
              <div className="font-medium">Plus</div>
              <FieldDescription>
                For individuals and small teams
              </FieldDescription>
            </FieldContent>
            <RadioGroupItem value="plus" id="plus-plan" />
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="pro-plan">
          <Field orientation="horizontal">
            <FieldContent>
              <div className="font-medium">Pro</div>
              <FieldDescription>For growing businesses</FieldDescription>
            </FieldContent>
            <RadioGroupItem value="pro" id="pro-plan" />
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="enterprise-plan">
          <Field orientation="horizontal">
            <FieldContent>
              <div className="font-medium">Enterprise</div>
              <FieldDescription>
                For large teams and enterprises
              </FieldDescription>
            </FieldContent>
            <RadioGroupItem value="enterprise" id="enterprise-plan" />
          </Field>
        </FieldLabel>
      </RadioGroup>
    </Example>
  )
}

function RadioGroupWithFieldSet() {
  return (
    <Example title="With FieldSet">
      <FieldSet>
        <FieldLegend>Battery Level</FieldLegend>
        <FieldDescription>
          Choose your preferred battery level.
        </FieldDescription>
        <RadioGroup defaultValue="medium">
          <Field orientation="horizontal">
            <RadioGroupItem value="high" id="battery-high" />
            <FieldLabel htmlFor="battery-high" className="font-normal">
              High
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="medium" id="battery-medium" />
            <FieldLabel htmlFor="battery-medium" className="font-normal">
              Medium
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="low" id="battery-low" />
            <FieldLabel htmlFor="battery-low" className="font-normal">
              Low
            </FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
    </Example>
  )
}

function RadioGroupGrid() {
  return (
    <Example title="Grid Layout">
      <RadioGroup defaultValue="medium" className="grid grid-cols-2 gap-2">
        <FieldLabel htmlFor="size-small">
          <Field orientation="horizontal">
            <RadioGroupItem value="small" id="size-small" />
            <div className="font-medium">Small</div>
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="size-medium">
          <Field orientation="horizontal">
            <RadioGroupItem value="medium" id="size-medium" />
            <div className="font-medium">Medium</div>
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="size-large">
          <Field orientation="horizontal">
            <RadioGroupItem value="large" id="size-large" />
            <div className="font-medium">Large</div>
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="size-xlarge">
          <Field orientation="horizontal">
            <RadioGroupItem value="xlarge" id="size-xlarge" />
            <div className="font-medium">X-Large</div>
          </Field>
        </FieldLabel>
      </RadioGroup>
    </Example>
  )
}

function RadioGroupDisabled() {
  return (
    <Example title="Disabled">
      <RadioGroup defaultValue="option2" disabled>
        <Field orientation="horizontal">
          <RadioGroupItem value="option1" id="disabled-1" />
          <FieldLabel htmlFor="disabled-1" className="font-normal">
            Option 1
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="option2" id="disabled-2" />
          <FieldLabel htmlFor="disabled-2" className="font-normal">
            Option 2
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="option3" id="disabled-3" />
          <FieldLabel htmlFor="disabled-3" className="font-normal">
            Option 3
          </FieldLabel>
        </Field>
      </RadioGroup>
    </Example>
  )
}

function RadioGroupInvalid() {
  return (
    <Example title="Invalid">
      <FieldSet>
        <FieldLegend>Notification Preferences</FieldLegend>
        <FieldDescription>
          Choose how you want to receive notifications.
        </FieldDescription>
        <RadioGroup defaultValue="email">
          <Field orientation="horizontal" data-invalid>
            <RadioGroupItem value="email" id="invalid-email" aria-invalid />
            <FieldLabel htmlFor="invalid-email" className="font-normal">
              Email only
            </FieldLabel>
          </Field>
          <Field orientation="horizontal" data-invalid>
            <RadioGroupItem value="sms" id="invalid-sms" aria-invalid />
            <FieldLabel htmlFor="invalid-sms" className="font-normal">
              SMS only
            </FieldLabel>
          </Field>
          <Field orientation="horizontal" data-invalid>
            <RadioGroupItem value="both" id="invalid-both" aria-invalid />
            <FieldLabel htmlFor="invalid-both" className="font-normal">
              Both Email & SMS
            </FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
    </Example>
  )
}

export const Basic: Story = { name: "Basic", render: () => <RadioGroupBasic /> }
export const WithDescriptions: Story = { name: "With Descriptions", render: () => <RadioGroupWithDescriptions /> }
export const WithFieldSet: Story = { name: "With FieldSet", render: () => <RadioGroupWithFieldSet /> }
export const GridLayout: Story = { name: "Grid Layout", render: () => <RadioGroupGrid /> }
export const Disabled: Story = { name: "Disabled", render: () => <RadioGroupDisabled /> }
export const Invalid: Story = { name: "Invalid", render: () => <RadioGroupInvalid /> }

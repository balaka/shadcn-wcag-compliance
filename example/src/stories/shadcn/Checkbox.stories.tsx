import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import { cn } from "@/lib/utils"
import * as React from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Checkbox: the official shadcn example for base-nova, one story per example as on
// the shadcn documentation page. Source: https://ui.shadcn.com/r/styles/base-nova/checkbox-example.json, retrieved 2026-10-06.
// Changed on the way in: our frame instead of the site's, icons from
// lucide-react, Next.js image and link as plain img and a, toasts to the
// Actions panel. A story shows the component as the design system's
// users get it: nothing on top, no accessibility settings.

const meta = {
  title: "Forms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "From the official shadcn example for base-nova (https://ui.shadcn.com/r/styles/base-nova/checkbox-example.json, retrieved 2026-10-06). Behaviour comes from Base UI." } } },
} satisfies Meta

export default meta
type Story = StoryObj

// Playground: every prop that changes the look, in Controls; events in Actions.
export const Playground: Story = {
  args: {
    "aria-label": "Accept terms and conditions",
    defaultChecked: false,
    disabled: false,
    onCheckedChange: fn(),
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
function CheckboxBasic() {
  return (
    <Example title="Basic">
      <Field orientation="horizontal">
        <Checkbox id="terms" />
        <FieldLabel htmlFor="terms">Accept terms and conditions</FieldLabel>
      </Field>
    </Example>
  )
}

function CheckboxWithDescription() {
  return (
    <Example title="With Description">
      <Field orientation="horizontal">
        <Checkbox id="terms-2" defaultChecked />
        <FieldContent>
          <FieldLabel htmlFor="terms-2">Accept terms and conditions</FieldLabel>
          <FieldDescription>
            By clicking this checkbox, you agree to the terms and conditions.
          </FieldDescription>
        </FieldContent>
      </Field>
    </Example>
  )
}

function CheckboxInvalid() {
  return (
    <Example title="Invalid">
      <Field orientation="horizontal" data-invalid>
        <Checkbox id="terms-3" aria-invalid />
        <FieldLabel htmlFor="terms-3">Accept terms and conditions</FieldLabel>
      </Field>
    </Example>
  )
}

function CheckboxDisabled() {
  return (
    <Example title="Disabled">
      <Field orientation="horizontal">
        <Checkbox id="toggle" disabled />
        <FieldLabel htmlFor="toggle">Enable notifications</FieldLabel>
      </Field>
    </Example>
  )
}

function CheckboxWithTitle() {
  return (
    <Example title="With Title">
      <FieldGroup>
        <FieldLabel htmlFor="toggle-2">
          <Field orientation="horizontal">
            <Checkbox id="toggle-2" defaultChecked />
            <FieldContent>
              <FieldTitle>Enable notifications</FieldTitle>
              <FieldDescription>
                You can enable or disable notifications at any time.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="toggle-4">
          <Field orientation="horizontal" data-disabled>
            <Checkbox id="toggle-4" disabled />
            <FieldContent>
              <FieldTitle>Enable notifications</FieldTitle>
              <FieldDescription>
                You can enable or disable notifications at any time.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
      </FieldGroup>
    </Example>
  )
}

const tableData = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    role: "Admin",
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    email: "marcus.rodriguez@example.com",
    role: "User",
  },
  {
    id: "3",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    role: "User",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@example.com",
    role: "Editor",
  },
]

function CheckboxInTable() {
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(
    new Set(["1"])
  )

  const selectAll = selectedRows.size === tableData.length

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(tableData.map((row) => row.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedRows(newSelected)
  }

  return (
    <Example title="In Table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">
              <Checkbox
                id="select-all"
                checked={selectAll}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row) => (
            <TableRow
              key={row.id}
              data-state={selectedRows.has(row.id) ? "selected" : undefined}
            >
              <TableCell>
                <Checkbox
                  id={`row-${row.id}`}
                  checked={selectedRows.has(row.id)}
                  onCheckedChange={(checked) =>
                    handleSelectRow(row.id, checked === true)
                  }
                />
              </TableCell>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Example>
  )
}

function CheckboxGroup() {
  return (
    <Example title="Group">
      <Field>
        <FieldLabel>Show these items on the desktop:</FieldLabel>
        <Field orientation="horizontal">
          <Checkbox id="finder-pref-9k2-hard-disks-ljj" />
          <FieldLabel
            htmlFor="finder-pref-9k2-hard-disks-ljj"
            className="font-normal"
          >
            Hard disks
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="finder-pref-9k2-external-disks-1yg" />
          <FieldLabel
            htmlFor="finder-pref-9k2-external-disks-1yg"
            className="font-normal"
          >
            External disks
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="finder-pref-9k2-cds-dvds-fzt" />
          <FieldLabel
            htmlFor="finder-pref-9k2-cds-dvds-fzt"
            className="font-normal"
          >
            CDs, DVDs, and iPods
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="finder-pref-9k2-connected-servers-6l2" />
          <FieldLabel
            htmlFor="finder-pref-9k2-connected-servers-6l2"
            className="font-normal"
          >
            Connected servers
          </FieldLabel>
        </Field>
      </Field>
    </Example>
  )
}

export const Basic: Story = { name: "Basic", render: () => <CheckboxBasic /> }
export const WithDescription: Story = { name: "With Description", render: () => <CheckboxWithDescription /> }
export const Invalid: Story = { name: "Invalid", render: () => <CheckboxInvalid /> }
export const Disabled: Story = { name: "Disabled", render: () => <CheckboxDisabled /> }
export const WithTitle: Story = { name: "With Title", render: () => <CheckboxWithTitle /> }
export const InTable: Story = { name: "In Table", render: () => <CheckboxInTable /> }
export const Group: Story = { name: "Group", render: () => <CheckboxGroup /> }

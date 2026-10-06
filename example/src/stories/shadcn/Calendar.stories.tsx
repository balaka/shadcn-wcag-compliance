import type { Meta, StoryObj } from "@storybook/react-vite"
import { CalendarIcon, ChevronDownIcon, Clock2Icon } from "lucide-react"
import { cn } from "@/lib/utils"
import * as React from "react"
import { addDays, format } from "date-fns"
import { type DateRange } from "react-day-picker"
import { es } from "react-day-picker/locale"

import { Button } from "@/components/ui/button"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Calendar: the official shadcn example for base-nova, one story per example as on
// the shadcn documentation page. Source: https://ui.shadcn.com/r/styles/base-nova/calendar-example.json, retrieved 2026-10-06.
// Changed on the way in: our frame instead of the site's, icons from
// lucide-react, Next.js image and link as plain img and a, toasts to the
// Actions panel. A story shows the component as the design system's
// users get it: nothing on top, no accessibility settings.

const meta = {
  title: "Forms/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "From the official shadcn example for base-nova (https://ui.shadcn.com/r/styles/base-nova/calendar-example.json, retrieved 2026-10-06). Behaviour comes from Base UI." } } },
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
function CalendarInCard() {
  return (
    <Example title="In Card">
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <Calendar mode="single" />
        </CardContent>
      </Card>
    </Example>
  )
}

function CalendarInPopover() {
  return (
    <Example title="In Popover">
      <Popover>
        <PopoverTrigger
          render={<Button variant="outline" className="px-2.5 font-normal" />}
        >
          <CalendarIcon
            data-icon="inline-start" />
          Open Calendar
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" />
        </PopoverContent>
      </Popover>
    </Example>
  )
}

function CalendarSingle() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 12)
  )
  return (
    <Example title="Single">
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            captionLayout="dropdown"
          />
        </CardContent>
      </Card>
    </Example>
  )
}

function CalendarMultiple() {
  return (
    <Example title="Multiple">
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <Calendar mode="multiple" />
        </CardContent>
      </Card>
    </Example>
  )
}

function CalendarRange() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 12),
    to: addDays(new Date(new Date().getFullYear(), 0, 12), 30),
  })

  return (
    <Example
      title="Range"
      containerClassName="lg:col-span-full 2xl:col-span-full"
      className="p-12"
    >
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
          />
        </CardContent>
      </Card>
    </Example>
  )
}

function CalendarRangeMultipleMonths() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 3, 12),
    to: addDays(new Date(new Date().getFullYear(), 3, 12), 60),
  })

  return (
    <Example
      title="Range Multiple Months"
      containerClassName="lg:col-span-full 2xl:col-span-full"
      className="p-12"
    >
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <Calendar
            mode="range"
            defaultMonth={range?.from}
            selected={range}
            onSelect={setRange}
            numberOfMonths={3}
            locale={es}
            fixedWeeks
          />
        </CardContent>
      </Card>
    </Example>
  )
}

function CalendarBookedDates() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), 1, 3)
  )
  const bookedDates = Array.from(
    { length: 15 },
    (_, i) => new Date(new Date().getFullYear(), 1, 12 + i)
  )

  return (
    <Example title="Booked Dates">
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <Calendar
            mode="single"
            defaultMonth={date}
            selected={date}
            onSelect={setDate}
            disabled={bookedDates}
            modifiers={{
              booked: bookedDates,
            }}
            modifiersClassNames={{
              booked: "[&>button]:line-through opacity-100",
            }}
          />
        </CardContent>
      </Card>
    </Example>
  )
}

function CalendarWithTime() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 12)
  )

  return (
    <Example title="With Time">
      <Card size="sm" className="mx-auto w-fit">
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="p-0"
          />
        </CardContent>
        <CardFooter className="border-t bg-card">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="time-from">Start Time</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="time-from"
                  type="time"
                  step="1"
                  defaultValue="10:30:00"
                  className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
                <InputGroupAddon>
                  <Clock2Icon
                    className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="time-to">End Time</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="time-to"
                  type="time"
                  step="1"
                  defaultValue="12:30:00"
                  className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
                <InputGroupAddon>
                  <Clock2Icon
                    className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </FieldGroup>
        </CardFooter>
      </Card>
    </Example>
  )
}

function CalendarCustomDays() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 11, 8),
    to: addDays(new Date(new Date().getFullYear(), 11, 8), 10),
  })

  return (
    <Example title="Custom Days">
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <Calendar
            mode="range"
            defaultMonth={range?.from}
            selected={range}
            onSelect={setRange}
            numberOfMonths={1}
            captionLayout="dropdown"
            className="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
            formatters={{
              formatMonthDropdown: (date) => {
                return date.toLocaleString("default", { month: "long" })
              },
            }}
            components={{
              DayButton: ({ children, modifiers, day, ...props }) => {
                const isWeekend =
                  day.date.getDay() === 0 || day.date.getDay() === 6

                return (
                  <CalendarDayButton day={day} modifiers={modifiers} {...props}>
                    {children}
                    {!modifiers.outside && (
                      <span>{isWeekend ? "$120" : "$100"}</span>
                    )}
                  </CalendarDayButton>
                )
              },
            }}
          />
        </CardContent>
      </Card>
    </Example>
  )
}

function CalendarWithPresets() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), 1, 12)
  )
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  )

  return (
    <Example title="With Presets">
      <Card className="mx-auto w-fit max-w-[300px]" size="sm">
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            fixedWeeks
            className="p-0 [--cell-size:--spacing(9.5)]"
          />
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 border-t">
          {[
            { label: "Today", value: 0 },
            { label: "Tomorrow", value: 1 },
            { label: "In 3 days", value: 3 },
            { label: "In a week", value: 7 },
            { label: "In 2 weeks", value: 14 },
          ].map((preset) => (
            <Button
              key={preset.value}
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                const newDate = addDays(new Date(), preset.value)
                setDate(newDate)
                setCurrentMonth(
                  new Date(newDate.getFullYear(), newDate.getMonth(), 1)
                )
              }}
            >
              {preset.label}
            </Button>
          ))}
        </CardFooter>
      </Card>
    </Example>
  )
}

function DatePickerSimple() {
  const [date, setDate] = React.useState<Date>()

  return (
    <Example title="Date Picker Simple">
      <Field className="mx-auto w-72">
        <FieldLabel htmlFor="date-picker-simple">Date</FieldLabel>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                id="date-picker-simple"
                className="justify-start px-2.5 font-normal"
              />
            }
          >
            <CalendarIcon
              data-icon="inline-start" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </PopoverContent>
        </Popover>
      </Field>
    </Example>
  )
}

function DatePickerWithRange() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  })

  return (
    <Example title="Date Picker Range">
      <Field className="mx-auto w-72">
        <FieldLabel htmlFor="date-picker-range">Date Picker Range</FieldLabel>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                id="date-picker-range"
                className="justify-start px-2.5 font-normal"
              />
            }
          >
            <CalendarIcon
              data-icon="inline-start" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </Field>
    </Example>
  )
}

function DataPickerWithDropdowns() {
  const [date, setDate] = React.useState<Date>()
  const [open, setOpen] = React.useState(false)

  return (
    <Example title="Date Picker with Dropdowns">
      <Field className="mx-auto w-72">
        <Popover open={open} onOpenChange={setOpen}>
          <FieldLabel htmlFor="date-picker-with-dropdowns-desktop">
            Date
          </FieldLabel>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                id="date-picker-with-dropdowns-desktop"
                className="justify-start px-2.5 font-normal"
              />
            }
          >
            {date ? format(date, "PPP") : <span>Pick a date</span>}
            <ChevronDownIcon
              data-icon="inline-start"
              className="ml-auto" />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              captionLayout="dropdown"
            />
            <div className="flex gap-2 border-t p-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Done
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </Field>
    </Example>
  )
}

function CalendarWeekNumbers() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), 1, 3)
  )

  return (
    <Example title="Week Numbers" className="justify-center">
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <Calendar
            mode="single"
            defaultMonth={date}
            selected={date}
            onSelect={setDate}
            showWeekNumber
          />
        </CardContent>
      </Card>
    </Example>
  )
}

export const Single: Story = { name: "Single", render: () => <CalendarSingle /> }
export const Multiple: Story = { name: "Multiple", render: () => <CalendarMultiple /> }
export const WeekNumbers: Story = { name: "Week Numbers", render: () => <CalendarWeekNumbers /> }
export const BookedDates: Story = { name: "Booked Dates", render: () => <CalendarBookedDates /> }
export const RangeStory: Story = { name: "Range", render: () => <CalendarRange /> }
export const RangeMultipleMonths: Story = { name: "Range Multiple Months", render: () => <CalendarRangeMultipleMonths /> }
export const WithTime: Story = { name: "With Time", render: () => <CalendarWithTime /> }
export const WithPresets: Story = { name: "With Presets", render: () => <CalendarWithPresets /> }
export const CustomDays: Story = { name: "Custom Days", render: () => <CalendarCustomDays /> }
export const DatePickerSimpleStory: Story = { name: "Date Picker Simple", render: () => <DatePickerSimple /> }
export const DatePickerWithDropdowns: Story = { name: "Date Picker with Dropdowns", render: () => <DataPickerWithDropdowns /> }
export const DatePickerRange: Story = { name: "Date Picker Range", render: () => <DatePickerWithRange /> }
export const InCard: Story = { name: "In Card", render: () => <CalendarInCard /> }
export const InPopover: Story = { name: "In Popover", render: () => <CalendarInPopover /> }

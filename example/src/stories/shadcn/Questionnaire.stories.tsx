import type { Meta, StoryObj } from "@storybook/react-vite"
import { action } from "storybook/actions"
import { cn } from "@/lib/utils"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Questionnaire, QuestionnaireActions, QuestionnaireChoice, QuestionnaireChoiceDescription, QuestionnaireChoices, QuestionnaireDescription, QuestionnaireError, QuestionnaireInput, QuestionnaireItem, QuestionnaireNext, QuestionnairePrevious, QuestionnaireProgress, QuestionnaireSkip, QuestionnaireSubmit, QuestionnaireTitle } from "@/components/ui/questionnaire"

// Questionnaire: the official shadcn example for base-nova, one story per example as on
// the shadcn documentation page. Source: https://ui.shadcn.com/r/styles/base-nova/questionnaire-example.json, retrieved 2026-10-06.
// Changed on the way in: our frame instead of the site's, icons from
// lucide-react, Next.js image and link as plain img and a, toasts to the
// Actions panel. A story shows the component as the design system's
// users get it: nothing on top, no accessibility settings.

const toast = action("toast")

const meta = {
  title: "AI/Questionnaire",
  component: Questionnaire,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "From the official shadcn example for base-nova (https://ui.shadcn.com/r/styles/base-nova/questionnaire-example.json, retrieved 2026-10-06). Behaviour comes from Base UI." } } },
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
const questionnaireItems = [
  {
    choices: [
      { value: "delegation" },
      { value: "questions" },
      { value: "both" },
    ],
    name: "direction",
    required: true,
  },
  {
    choices: [
      { value: "progress" },
      { value: "decisions" },
      { value: "risks" },
    ],
    name: "signals",
  },
  {
    choices: [{ value: "week" }, { value: "cycle" }, { value: "later" }],
    name: "timing",
    required: true,
  },
] as const

const taskItems = [
  {
    choices: [
      { value: "inspect" },
      { value: "implement" },
      { value: "review" },
    ],
    name: "task",
    required: true,
  },
] as const

const planItems = [
  {
    choices: [
      { value: "plus" },
      { value: "pro" },
      { value: "enterprise", disabled: true },
    ],
    name: "plan",
    required: true,
  },
] as const

function QuestionnaireDisabled() {
  return (
    <Example title="Disabled" containerClassName="md:col-span-2">
      <Questionnaire
        className="mx-auto max-w-lg"
        defaultItem="plan"
        items={planItems}
        onSubmit={handleSubmit}
      >
        <QuestionnaireItem name="plan" required>
          <QuestionnaireTitle>Choose a plan</QuestionnaireTitle>
          <QuestionnaireDescription>
            Enterprise is not available on your account.
          </QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="plus">
              <span className="font-medium">Plus</span>
              <QuestionnaireChoiceDescription>
                For individuals and small teams
              </QuestionnaireChoiceDescription>
            </QuestionnaireChoice>
            <QuestionnaireChoice value="pro">
              <span className="font-medium">Pro</span>
              <QuestionnaireChoiceDescription>
                For growing businesses
              </QuestionnaireChoiceDescription>
            </QuestionnaireChoice>
            <QuestionnaireChoice value="enterprise" disabled>
              <span className="font-medium">Enterprise</span>
              <QuestionnaireChoiceDescription>
                For large teams and enterprises
              </QuestionnaireChoiceDescription>
            </QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireNavigation />
      </Questionnaire>
    </Example>
  )
}

function QuestionnaireNoDescription() {
  return (
    <Example title="No description" containerClassName="md:col-span-2">
      <Questionnaire
        className="mx-auto max-w-lg"
        defaultItem="task"
        items={taskItems}
        shortcuts="letters"
        onSubmit={handleSubmit}
      >
        <QuestionnaireProgress />
        <QuestionnaireItem name="task" required>
          <QuestionnaireTitle>
            What should the agent do next?
          </QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="inspect">
              Inspect the codebase
            </QuestionnaireChoice>
            <QuestionnaireChoice value="implement">
              Implement the change
            </QuestionnaireChoice>
            <QuestionnaireChoice value="review">
              Review the result
            </QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireNavigation />
      </Questionnaire>
    </Example>
  )
}

function QuestionnaireStandalone() {
  return (
    <Example title="Standalone" containerClassName="md:col-span-2">
      <Questionnaire
        className="mx-auto max-w-lg"
        defaultItem="direction"
        items={questionnaireItems}
        shortcuts="letters"
        onSubmit={handleSubmit}
      >
        <QuestionnaireProgress />
        <QuestionnaireQuestions />
        <QuestionnaireNavigation />
      </Questionnaire>
    </Example>
  )
}

function QuestionnaireCard() {
  return (
    <Example title="Card" containerClassName="md:col-span-2">
      <Questionnaire
        defaultItem="direction"
        items={questionnaireItems}
        shortcuts="numbers"
        onSubmit={handleSubmit}
      >
        <QuestionnaireCardQuestions />
      </Questionnaire>
    </Example>
  )
}

function QuestionnaireDialog() {
  return (
    <Example
      title="Dialog"
      className="items-center justify-center"
      containerClassName="md:col-span-2"
    >
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Open questionnaire
        </DialogTrigger>
        <DialogContent>
          <Questionnaire
            defaultItem="direction"
            items={questionnaireItems}
            onSubmit={handleSubmit}
          >
            <DialogHeader>
              <DialogTitle className="sr-only">
                Plan an agent interface
              </DialogTitle>
              <DialogDescription className="sr-only">
                Answer three questions to shape the next prototype.
              </DialogDescription>
              <QuestionnaireProgress
                className="font-semibold tracking-widest text-foreground uppercase"
                render={(props, state) => (
                  <span {...props}>
                    Question {state.current} of {state.total}
                  </span>
                )}
              />
            </DialogHeader>
            <QuestionnaireQuestions />
            <DialogFooter>
              <QuestionnaireNavigation />
            </DialogFooter>
          </Questionnaire>
        </DialogContent>
      </Dialog>
    </Example>
  )
}

function QuestionnaireCardQuestions() {
  const directionTitleId = React.useId()
  const signalsTitleId = React.useId()
  const timingTitleId = React.useId()

  return (
    <>
      <QuestionnaireItem
        aria-labelledby={directionTitleId}
        name="direction"
        required
      >
        <Card className="mx-auto w-full max-w-lg">
          <CardHeader>
            <QuestionnaireTitle id={directionTitleId} render={<CardTitle />}>
              What should we prototype next?
            </QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              Choose one direction or write another answer.
            </QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="delegation">
                <span className="font-medium">Sub-agent delegation</span>
                <QuestionnaireChoiceDescription>
                  Show when work is delegated and what comes back.
                </QuestionnaireChoiceDescription>
              </QuestionnaireChoice>
              <QuestionnaireChoice value="questions">
                <span className="font-medium">Question prompts</span>
                <QuestionnaireChoiceDescription>
                  Show choices while the agent waits for input.
                </QuestionnaireChoiceDescription>
              </QuestionnaireChoice>
              <QuestionnaireChoice value="both">
                <span className="font-medium">Both together</span>
                <QuestionnaireChoiceDescription>
                  Explore one unified interaction pattern.
                </QuestionnaireChoiceDescription>
              </QuestionnaireChoice>
              <QuestionnaireInput
                aria-label="Another direction"
                placeholder="Type another direction…"
              />
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
          <CardFooter>
            <QuestionnaireNavigation />
          </CardFooter>
        </Card>
      </QuestionnaireItem>
      <QuestionnaireItem
        aria-labelledby={signalsTitleId}
        name="signals"
        multiple
      >
        <Card className="mx-auto w-full max-w-lg">
          <CardHeader>
            <QuestionnaireTitle id={signalsTitleId} render={<CardTitle />}>
              What should every progress update include?
            </QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              Select all that apply, or skip this question.
            </QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="progress">
                Progress
              </QuestionnaireChoice>
              <QuestionnaireChoice value="decisions">
                Decisions
              </QuestionnaireChoice>
              <QuestionnaireChoice value="risks">Risks</QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
          <CardFooter>
            <QuestionnaireNavigation />
          </CardFooter>
        </Card>
      </QuestionnaireItem>
      <QuestionnaireItem aria-labelledby={timingTitleId} name="timing" required>
        <Card className="mx-auto w-full max-w-lg">
          <CardHeader>
            <QuestionnaireTitle id={timingTitleId} render={<CardTitle />}>
              When should this be revisited?
            </QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              Choose when this should be revisited.
            </QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="week">This week</QuestionnaireChoice>
              <QuestionnaireChoice value="cycle">
                Next cycle
              </QuestionnaireChoice>
              <QuestionnaireChoice value="later">
                Revisit later
              </QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
          <CardFooter>
            <QuestionnaireNavigation />
          </CardFooter>
        </Card>
      </QuestionnaireItem>
    </>
  )
}

function QuestionnaireQuestions() {
  return (
    <>
      <QuestionnaireItem name="direction" required>
        <QuestionnaireTitle>What should we prototype next?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Choose one direction or write another answer.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="delegation">
            <span className="font-medium">Sub-agent delegation</span>
            <QuestionnaireChoiceDescription>
              Show when work is delegated and what comes back.
            </QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="questions">
            <span className="font-medium">Question prompts</span>
            <QuestionnaireChoiceDescription>
              Show choices while the agent waits for input.
            </QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="both">
            <span className="font-medium">Both together</span>
            <QuestionnaireChoiceDescription>
              Explore one unified interaction pattern.
            </QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireInput
            aria-label="Another direction"
            placeholder="Type another direction…"
          />
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="signals" multiple>
        <QuestionnaireTitle>
          What should every progress update include?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Select all that apply, or skip this question.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="progress">Progress</QuestionnaireChoice>
          <QuestionnaireChoice value="decisions">Decisions</QuestionnaireChoice>
          <QuestionnaireChoice value="risks">Risks</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="timing" required>
        <QuestionnaireTitle>When should this be revisited?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Choose when this should be revisited.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="week">This week</QuestionnaireChoice>
          <QuestionnaireChoice value="cycle">Next cycle</QuestionnaireChoice>
          <QuestionnaireChoice value="later">Revisit later</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
    </>
  )
}

function QuestionnaireNavigation() {
  return (
    <QuestionnaireActions className="w-full">
      <QuestionnairePrevious />
      <QuestionnaireSkip />
      <QuestionnaireNext>Next</QuestionnaireNext>
      <QuestionnaireSubmit>Save answers</QuestionnaireSubmit>
    </QuestionnaireActions>
  )
}

function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()

  const formData = new FormData(event.currentTarget)
  const values = {
    direction: formData.get("direction"),
    signals: formData.getAll("signals"),
    timing: formData.get("timing"),
  }

  toast("Questionnaire submitted", {
    description: `Direction: ${values.direction ?? "None"} · Progress signals: ${values.signals.join(", ") || "None"} · Timing: ${values.timing ?? "None"}`,
  })
}

export const Standalone: Story = { name: "Standalone", render: () => <QuestionnaireStandalone /> }
export const CardStory: Story = { name: "Card", render: () => <QuestionnaireCard /> }
export const DialogStory: Story = { name: "Dialog", render: () => <QuestionnaireDialog /> }
export const NoDescription: Story = { name: "No description", render: () => <QuestionnaireNoDescription /> }
export const Disabled: Story = { name: "Disabled", render: () => <QuestionnaireDisabled /> }

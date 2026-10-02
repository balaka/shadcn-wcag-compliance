import type { Meta, StoryObj } from "@storybook/react-vite"
import { EllipsisIcon } from "lucide-react"
import { userEvent } from "storybook/test"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// `parameters.expected` — see Button.stories.tsx.

const meta = {
  title: "shadcn/DropdownMenu",
  component: DropdownMenu,
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

function AccountMenu({ trigger }: { trigger: React.ReactElement }) {
  return (
    <div className="p-4">
      <DropdownMenu>
        <DropdownMenuTrigger render={trigger} />
        <DropdownMenuContent className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuCheckboxItem defaultChecked>
              Show status bar
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete account</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export const Open: Story = {
  render: () => <AccountMenu trigger={<Button variant="outline">Account</Button>} />,
  play: async () => {
    // open from the keyboard, like a keyboard user would
    await userEvent.tab()
    await userEvent.keyboard("{Enter}")
  },
  parameters: {
    expected: {
      wcag: "pass",
      criteria: ["1.4.3 Contrast (Minimum)"],
      evidence:
        "label --muted-foreground #737373 on white = 4.73:1; destructive item #e7000b on white = 4.76:1",
      axe: null,
    },
  },
}

export const DestructiveItemHighlighted: Story = {
  render: () => <AccountMenu trigger={<Button variant="outline">Account</Button>} />,
  play: async () => {
    await userEvent.tab()
    await userEvent.keyboard("{Enter}")
    // End moves the highlight to the last item: Delete account
    await userEvent.keyboard("{End}")
  },
  parameters: {
    expected: {
      wcag: "fail",
      criteria: ["1.4.3 Contrast (Minimum)"],
      evidence:
        "highlighted destructive item: text #e7000b on destructive/10 #fde5e7 = 3.99:1, needs 4.5:1",
      axe: "color-contrast",
    },
  },
}

// Planted breakage: an icon-only trigger with no accessible name.
export const TriggerWithoutName: Story = {
  render: () => (
    <AccountMenu
      trigger={
        <Button variant="ghost" size="icon">
          <EllipsisIcon />
        </Button>
      }
    />
  ),
  parameters: {
    expected: {
      wcag: "fail",
      criteria: ["4.1.2 Name, Role, Value"],
      evidence: "menu button has no text and no aria-label",
      axe: "button-name",
    },
  },
}

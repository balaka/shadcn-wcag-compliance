import type { Meta, StoryObj } from "@storybook/react-vite"
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

// A story shows the component the way the design system's users get it —
// see Button.stories.tsx.

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
}

export const DestructiveItemHighlighted: Story = {
  render: () => <AccountMenu trigger={<Button variant="outline">Account</Button>} />,
  play: async () => {
    await userEvent.tab()
    await userEvent.keyboard("{Enter}")
    // End moves the highlight to the last item: Delete account
    await userEvent.keyboard("{End}")
  },
}

import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor } from "storybook/test"
import { ArchiveIcon, ClipboardPasteIcon, CopyIcon, PencilIcon, ScissorsIcon, ShareIcon, TrashIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuLabel, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// ContextMenu: the official shadcn example for base-nova, one story per example as on
// the shadcn documentation page. Source: https://ui.shadcn.com/r/styles/base-nova/context-menu-example.json, retrieved 2026-10-06.
// Changed on the way in: our frame instead of the site's, icons from
// lucide-react, Next.js image and link as plain img and a, toasts to the
// Actions panel. A story shows the component as the design system's
// users get it: nothing on top, no accessibility settings.

const meta = {
  title: "Overlays/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "From the official shadcn example for base-nova (https://ui.shadcn.com/r/styles/base-nova/context-menu-example.json, retrieved 2026-10-06). Behaviour comes from Base UI." } } },
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
function ContextMenuBasic() {
  return (
    <Example title="Basic">
      <ContextMenu>
        <ContextMenuTrigger className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuItem>Back</ContextMenuItem>
            <ContextMenuItem disabled>Forward</ContextMenuItem>
            <ContextMenuItem>Reload</ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </Example>
  )
}

function ContextMenuWithIcons() {
  return (
    <Example title="With Icons">
      <ContextMenu>
        <ContextMenuTrigger className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuItem>
              <CopyIcon />
              Copy
            </ContextMenuItem>
            <ContextMenuItem>
              <ScissorsIcon />
              Cut
            </ContextMenuItem>
            <ContextMenuItem>
              <ClipboardPasteIcon />
              Paste
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem variant="destructive">
              <TrashIcon />
              Delete
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </Example>
  )
}

function ContextMenuWithShortcuts() {
  return (
    <Example title="With Shortcuts">
      <ContextMenu>
        <ContextMenuTrigger className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuItem>
              Back
              <ContextMenuShortcut>⌘[</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem disabled>
              Forward
              <ContextMenuShortcut>⌘]</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Reload
              <ContextMenuShortcut>⌘R</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem>
              Save
              <ContextMenuShortcut>⌘S</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Save As...
              <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </Example>
  )
}

function ContextMenuWithSubmenu() {
  return (
    <Example title="With Submenu">
      <ContextMenu>
        <ContextMenuTrigger className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuItem>
              Copy
              <ContextMenuShortcut>⌘C</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Cut
              <ContextMenuShortcut>⌘X</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSub>
            <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuGroup>
                <ContextMenuItem>Save Page...</ContextMenuItem>
                <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                <ContextMenuItem>Name Window...</ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem>Developer Tools</ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
    </Example>
  )
}

function ContextMenuWithGroups() {
  return (
    <Example title="With Groups, Labels & Separators">
      <ContextMenu>
        <ContextMenuTrigger className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuLabel>File</ContextMenuLabel>
            <ContextMenuItem>
              New File
              <ContextMenuShortcut>⌘N</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Open File
              <ContextMenuShortcut>⌘O</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Save
              <ContextMenuShortcut>⌘S</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuLabel>Edit</ContextMenuLabel>
            <ContextMenuItem>
              Undo
              <ContextMenuShortcut>⌘Z</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Redo
              <ContextMenuShortcut>⇧⌘Z</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem>
              Cut
              <ContextMenuShortcut>⌘X</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Copy
              <ContextMenuShortcut>⌘C</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Paste
              <ContextMenuShortcut>⌘V</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem variant="destructive">
              Delete
              <ContextMenuShortcut>⌫</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </Example>
  )
}

function ContextMenuWithCheckboxes() {
  return (
    <Example title="With Checkboxes">
      <ContextMenu>
        <ContextMenuTrigger className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuCheckboxItem defaultChecked>
              Show Bookmarks Bar
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem defaultChecked>
              Show Developer Tools
            </ContextMenuCheckboxItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </Example>
  )
}

function ContextMenuWithRadio() {
  const [user, setUser] = React.useState("pedro")
  const [theme, setTheme] = React.useState("light")

  return (
    <Example title="With Radio Group">
      <ContextMenu>
        <ContextMenuTrigger className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuLabel>People</ContextMenuLabel>
            <ContextMenuRadioGroup value={user} onValueChange={setUser}>
              <ContextMenuRadioItem value="pedro">
                Pedro Duarte
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="colm">
                Colm Tuite
              </ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuLabel>Theme</ContextMenuLabel>
            <ContextMenuRadioGroup value={theme} onValueChange={setTheme}>
              <ContextMenuRadioItem value="light">Light</ContextMenuRadioItem>
              <ContextMenuRadioItem value="dark">Dark</ContextMenuRadioItem>
              <ContextMenuRadioItem value="system">System</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </Example>
  )
}

function ContextMenuWithDestructive() {
  return (
    <Example title="With Destructive Items">
      <ContextMenu>
        <ContextMenuTrigger className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuItem>
              <PencilIcon />
              Edit
            </ContextMenuItem>
            <ContextMenuItem>
              <ShareIcon />
              Share
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem>
              <ArchiveIcon />
              Archive
            </ContextMenuItem>
            <ContextMenuItem variant="destructive">
              <TrashIcon />
              Delete
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </Example>
  )
}

function ContextMenuWithSides() {
  return (
    <Example title="With Sides" containerClassName="col-span-2">
      <div className="flex flex-wrap justify-center gap-2">
        {(
          [
            "inline-start",
            "left",
            "top",
            "bottom",
            "right",
            "inline-end",
          ] as const
        ).map((side) => (
          <ContextMenu key={side}>
            <ContextMenuTrigger className="flex aspect-[2/0.5] items-center justify-center rounded-lg border p-4 text-sm capitalize">
              {side.replace("-", " ")}
            </ContextMenuTrigger>
            <ContextMenuContent side={side}>
              <ContextMenuGroup>
                <ContextMenuItem>Back</ContextMenuItem>
                <ContextMenuItem>Forward</ContextMenuItem>
                <ContextMenuItem>Reload</ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>
    </Example>
  )
}

function ContextMenuInDialog() {
  return (
    <Example title="In Dialog">
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Open Dialog
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Context Menu Example</DialogTitle>
            <DialogDescription>
              Right click on the area below to see the context menu.
            </DialogDescription>
          </DialogHeader>
          <ContextMenu>
            <ContextMenuTrigger className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
              Right click here
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuGroup>
                <ContextMenuItem>
                  <CopyIcon />
                  Copy
                </ContextMenuItem>
                <ContextMenuItem>
                  <ScissorsIcon />
                  Cut
                </ContextMenuItem>
                <ContextMenuItem>
                  <ClipboardPasteIcon />
                  Paste
                </ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuSub>
                <ContextMenuSubTrigger>More Options</ContextMenuSubTrigger>
                <ContextMenuSubContent>
                  <ContextMenuGroup>
                    <ContextMenuItem>Save Page...</ContextMenuItem>
                    <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                    <ContextMenuItem>Name Window...</ContextMenuItem>
                  </ContextMenuGroup>
                  <ContextMenuSeparator />
                  <ContextMenuGroup>
                    <ContextMenuItem>Developer Tools</ContextMenuItem>
                  </ContextMenuGroup>
                </ContextMenuSubContent>
              </ContextMenuSub>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem variant="destructive">
                  <TrashIcon />
                  Delete
                </ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuContent>
          </ContextMenu>
        </DialogContent>
      </Dialog>
    </Example>
  )
}

function ContextMenuWithInset() {
  const [showBookmarks, setShowBookmarks] = React.useState(true)
  const [showUrls, setShowUrls] = React.useState(false)
  const [theme, setTheme] = React.useState("system")

  return (
    <Example title="With Inset">
      <ContextMenu>
        <ContextMenuTrigger className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent className="w-44">
          <ContextMenuGroup>
            <ContextMenuLabel>Actions</ContextMenuLabel>
            <ContextMenuItem>
              <CopyIcon />
              Copy
            </ContextMenuItem>
            <ContextMenuItem>
              <ScissorsIcon />
              Cut
            </ContextMenuItem>
            <ContextMenuItem inset>Paste</ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuLabel inset>Appearance</ContextMenuLabel>
            <ContextMenuCheckboxItem
              inset
              checked={showBookmarks}
              onCheckedChange={setShowBookmarks}
            >
              Bookmarks
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              inset
              checked={showUrls}
              onCheckedChange={setShowUrls}
            >
              Full URLs
            </ContextMenuCheckboxItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuLabel inset>Theme</ContextMenuLabel>
            <ContextMenuRadioGroup value={theme} onValueChange={setTheme}>
              <ContextMenuRadioItem inset value="light">
                Light
              </ContextMenuRadioItem>
              <ContextMenuRadioItem inset value="dark">
                Dark
              </ContextMenuRadioItem>
              <ContextMenuRadioItem inset value="system">
                System
              </ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuSubTrigger inset>More Options</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuGroup>
                <ContextMenuItem>Save Page...</ContextMenuItem>
                <ContextMenuItem>Create Shortcut...</ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
    </Example>
  )
}

export const Basic: Story = { name: "Basic", render: () => <ContextMenuBasic /> }
export const WithIcons: Story = { name: "With Icons", render: () => <ContextMenuWithIcons /> }
export const WithSides: Story = { name: "With Sides", render: () => <ContextMenuWithSides /> }
export const WithShortcuts: Story = { name: "With Shortcuts", render: () => <ContextMenuWithShortcuts /> }
export const WithSubmenu: Story = { name: "With Submenu", render: () => <ContextMenuWithSubmenu /> }
export const WithGroupsLabelsSeparators: Story = { name: "With Groups, Labels & Separators", render: () => <ContextMenuWithGroups /> }
export const WithCheckboxes: Story = { name: "With Checkboxes", render: () => <ContextMenuWithCheckboxes /> }
export const WithRadioGroup: Story = { name: "With Radio Group", render: () => <ContextMenuWithRadio /> }
export const WithDestructiveItems: Story = { name: "With Destructive Items", render: () => <ContextMenuWithDestructive /> }
export const InDialog: Story = { name: "In Dialog", render: () => <ContextMenuInDialog /> }
export const WithInset: Story = { name: "With Inset", render: () => <ContextMenuWithInset /> }

// Opens the first example, so the checks see the open state (the content
// renders outside the story's frame, in the page's body).
export const Open: Story = {
  name: "Open",
  render: () => <ContextMenuBasic />,
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector<HTMLElement>('[data-slot="context-menu-trigger"]')
    await expect(trigger).not.toBeNull()
    await userEvent.pointer({ keys: "[MouseRight]", target: trigger! })
    await waitFor(() => expect(document.querySelector('[data-slot="context-menu-content"], [data-slot="context-menu-popup"]')).not.toBeNull(), { timeout: 3000 })
  },
}

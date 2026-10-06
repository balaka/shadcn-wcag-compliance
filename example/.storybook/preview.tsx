import type { Preview } from "@storybook/react-vite"

import "../src/index.css"

import { ourAxeConfig } from "../../src/executors/storybook-axe"

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Color theme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: ["light", "dark"],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [
    (Story, context) => {
      // shadcn switches themes with the .dark class on <html>
      document.documentElement.classList.toggle(
        "dark",
        context.globals.theme === "dark"
      )
      return <Story />
    },
  ],
  parameters: {
    // Components first, grouped as in a design system; the compliance pages
    // close the sidebar.
    // Components alphabetically inside a group; a component's stories keep
    // the order of the shadcn example they come from.
    options: {
      storySort: {
        order: [
          "Forms", ["Button", "ButtonGroup", "Calendar", "Checkbox", "Combobox", "Field", "Input", "InputGroup", "InputOTP", "Label", "NativeSelect", "RadioGroup", "Select", "Slider", "Switch", "Textarea", "Toggle", "ToggleGroup"],
          "Overlays", ["AlertDialog", "Command", "ContextMenu", "Dialog", "Drawer", "DropdownMenu", "HoverCard", "Menubar", "Popover", "Sheet", "Toast", "Tooltip"],
          "Navigation", ["Breadcrumb", "NavigationMenu", "Pagination", "Sidebar", "Tabs"],
          "Data display", ["Accordion", "Avatar", "Badge", "Card", "Carousel", "Chart", "Collapsible", "Item", "Kbd", "Table"],
          "Feedback", ["Alert", "Empty", "Progress", "Skeleton", "Spinner"],
          "Layout", ["AspectRatio", "Resizable", "ScrollArea", "Separator"],
          "AI", ["Attachment", "Bubble", "Marker", "Questionnaire"],
          "*",
          "WCAG compliance", ["Overview", "Decisions"],
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
      // Our own rules ride inside axe, so they show up in the same
      // Accessibility tab and the same report as axe's rules.
      config: ourAxeConfig,
    },
  },
}

export default preview

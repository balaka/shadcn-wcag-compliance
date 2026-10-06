import type { Preview } from "@storybook/react-vite"

import "../src/index.css"

import { borderContrastAxeConfig } from "../../src/executors/storybook-axe"

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
    // Components first; the compliance pages close the sidebar.
    options: {
      storySort: { order: ["shadcn", "WCAG compliance", ["Overview", "Decisions"]] },
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
      config: borderContrastAxeConfig,
    },
  },
}

export default preview

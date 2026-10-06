/// <reference types="vitest/config" />
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Every module the components and stories import, optimised up front.
  // Without this Vite discovers Base UI's parts one by one during a test
  // run, reloads, and the stories after the reload never run.
  optimizeDeps: {
    include: [
      "@base-ui/react", "@base-ui/react/accordion", "@base-ui/react/alert-dialog", "@base-ui/react/avatar",
      "@base-ui/react/button", "@base-ui/react/checkbox", "@base-ui/react/collapsible", "@base-ui/react/context-menu",
      "@base-ui/react/dialog", "@base-ui/react/direction-provider", "@base-ui/react/drawer", "@base-ui/react/input",
      "@base-ui/react/menu", "@base-ui/react/menubar", "@base-ui/react/merge-props", "@base-ui/react/navigation-menu",
      "@base-ui/react/popover", "@base-ui/react/preview-card", "@base-ui/react/progress", "@base-ui/react/radio",
      "@base-ui/react/radio-group", "@base-ui/react/scroll-area", "@base-ui/react/select", "@base-ui/react/separator",
      "@base-ui/react/slider", "@base-ui/react/switch", "@base-ui/react/tabs", "@base-ui/react/toast",
      "@base-ui/react/toggle", "@base-ui/react/toggle-group", "@base-ui/react/tooltip", "@base-ui/react/use-render",
      "@shadcn/react/message-scroller", "@shadcn/react/questionnaire",
      "axe-core", "class-variance-authority", "cmdk", "cn", "date-fns", "embla-carousel-react", "input-otp",
      "lucide-react", "react-day-picker", "react-day-picker/locale", "react-resizable-panels", "recharts",
    ],
  },
  server: {
    // the example imports the tool's own rules from the repository root
    fs: { allow: [resolve(import.meta.dirname, "..")] },
  },
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src")
    }
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});
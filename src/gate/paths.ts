// Which paths the gate cares about. Two sets:
//
//   GUARDED    data the rules rest on — a write is judged by a guard
//   PROTECTED  the gate itself — a write is refused unless a person opened
//              an unlock window; integrity of these files is verified on
//              every call against gate.lock.json
//
// Both are matched on a path relative to the repository root, and also on
// bare words taken from a shell command, so every pattern tolerates a
// leading directory.

export const GUARDED = {
  theme: /(^|\/)(index|globals)\.css$/,
  decision: /(^|\/)decisions\/(?!README\.md$)[^/]+\.md$/,
  story: /\.stories\.[jt]sx?$/,
  ruleText: /(^|\/)rules\/own\/[^/]+\.md$/,
  ruleCode: /(^|\/)src\/rules\/[^/]+\.ts$/,
  standard: /(^|\/)standards\/.+\.md$/,
} as const
export type GuardedKind = keyof typeof GUARDED

export const PROTECTED: RegExp[] = [
  // the directories themselves: moving or deleting one is a write to all of it
  /(^|\/)(src\/(gate|decisions|theme|wcag|executors)|\.claude|\.github|example\/\.storybook)\/?$/,
  /(^|\/)\.claude\/settings(\.local)?\.json$/,
  /(^|\/)gate\.lock\.json$/,
  /(^|\/)\.gate-unlock\.json$/,
  /(^|\/)src\/gate\/.+/,
  /(^|\/)src\/decisions\/.+/,
  /(^|\/)src\/theme\/.+/,
  /(^|\/)src\/wcag\/.+/,
  /(^|\/)src\/finding\.ts$/,
  // how the checks run: our rules inside axe, Storybook's a11y settings,
  // the test runner. Switching a check off here switches it off everywhere.
  /(^|\/)src\/executors\/.+/,
  /(^|\/)example\/\.storybook\/.+/,
  /(^|\/)example\/(vite|vitest)\.config\.[cm]?[jt]s$/,
  // who owns what on GitHub (decisions/ needs an approver's review) and CI
  /(^|\/)\.github\/.+/,
]

// Files whose hashes go into gate.lock.json: everything PROTECTED that
// exists in the repository (globbed at sign time), see integrity.ts.
export const PROTECTED_DIRS = ["src/gate", "src/decisions", "src/theme", "src/wcag", "src/executors", "example/.storybook", ".github"]
export const PROTECTED_FILES = [".claude/settings.json", "src/finding.ts", "example/vite.config.ts"]

// Commands only a person runs. From a chat they are refused when invoked
// (node/tsx/npx … approve.ts) — mentioning or reading the files is fine;
// writing the lock or the unlock file is caught by the protected set.
export const HUMAN_COMMANDS = /(^|[\s;&|(])(node|tsx|bun|deno|npx)\b[^|;&\n]*src\/(decisions\/approve|gate\/(sign|unlock))\.ts/

export function guardedKind(path: string): GuardedKind | null {
  for (const [k, re] of Object.entries(GUARDED)) if (re.test(path)) return k as GuardedKind
  return null
}
export const isProtected = (path: string) => PROTECTED.some((re) => re.test(path))

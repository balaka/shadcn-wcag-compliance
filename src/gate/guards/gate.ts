// The gate protects itself: its code, its registration in Claude Code, its
// lock. A tool may not change these unless a person opened an unlock window
// (unlock.ts). Edits made in the window are recorded; the person re-signs
// the lock when done (sign.ts).
import { readUnlock } from "../integrity.ts"
import { isProtected } from "../paths.ts"
import { allow, refuse, type Guard } from "../types.ts"

export const gate: Guard = {
  name: "gate",
  matches: (rel) => isProtected(rel),
  check(ctx) {
    const unlock = readUnlock(ctx.root)
    if (unlock) return allow("unlocked", [`gate: ${ctx.rel} edited inside the unlock window opened by ${unlock.by} until ${unlock.until} — re-sign with sign.ts when done.`], [], `unlock by ${unlock.by}`)
    return refuse([
      `${ctx.rel} is part of the gate — a chat does not change the gate.`,
      'A person edits it in their own editor, or opens a window first: node src/gate/unlock.ts --by "<name>" --minutes 60 --why "…"; then re-signs: node src/gate/sign.ts --by "<name>".',
    ])
  },
}

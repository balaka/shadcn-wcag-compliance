// *.stories.tsx: a story is what the checks see. Changing it can hide a
// finding — a colour on top of the component, an added label, a wrapper —
// while the design system's users still get the component without it. So:
//
//   closed — a chat does not write stories. An accessibility fix goes into
//            the component or the token, which is what users get. Stories
//            are written inside a person's window (unlock.ts --scope
//            stories); every write there is recorded, and the person answers
//            for what the window wrote, as an author answers for a rule.
//   never  — even inside the window, a story does not configure or switch
//            off the check: no a11y settings, no `!test` tag, no axe calls.
//            A rule that does not apply to a story is a decision, recorded
//            in decisions/ with a reason and a person's approval.
import { opens, readUnlock } from "../integrity.ts"
import { GUARDED } from "../paths.ts"
import { allow, refuse, type Guard } from "../types.ts"

const SWITCHED_OFF: Array<[RegExp, string]> = [
  [/\ba11y\s*:/, "an a11y setting (parameters.a11y / globals.a11y)"],
  [/["']!test["']/, "the tag !test, which leaves the story out of the test run"],
  [/\baxe\.(configure|reset|setup|run)\s*\(/, "a call that configures or runs axe from the story"],
]

export const story: Guard = {
  name: "story",
  matches: (rel) => GUARDED.story.test(rel),
  check(ctx) {
    const off = SWITCHED_OFF.filter(([re]) => re.test(ctx.after)).map(([, what]) => what)
    if (off.length) {
      return refuse([
        `${ctx.rel} would configure or switch off the accessibility check: ${off.join("; ")}.`,
        "A story does not decide what is checked — not even in a person's window. If a rule does not apply here, draft a decision in decisions/ (kind: interpretation, verdict: not-applicable, scope: story) and a person approves it.",
      ])
    }
    const unlock = readUnlock(ctx.root)
    if (!unlock || !opens(unlock, "stories")) {
      return refuse([
        `${ctx.rel} is a story, and stories are closed to a chat: a story is what the checks see, and changing it can hide a finding.`,
        "Fix the component (example/src/components/ui/) or the token (example/src/index.css) instead — that is what the design system's users get.",
        'If the task really is to write stories, a person opens a window: node src/gate/unlock.ts --scope stories --by "<name>" --minutes 60 --why "…"',
      ])
    }
    return allow("unlocked", [`story: ${ctx.rel} written inside the stories window opened by ${unlock.by} until ${unlock.until}.`], [], `stories window by ${unlock.by}`)
  },
}

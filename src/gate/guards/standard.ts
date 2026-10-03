// standards/: verbatim copies of the standard. New files only, never edits.
import { GUARDED } from "../paths.ts"
import { allow, refuse, type Guard } from "../types.ts"

export const standard: Guard = {
  name: "standard",
  matches: (rel) => GUARDED.standard.test(rel),
  check(ctx) {
    if (ctx.before && !/(^|\/)README\.md$/.test(ctx.rel)) {
      return refuse([
        `${ctx.rel} is a verbatim copy of the standard — it is never edited.`,
        "To move to a new edition, add the new file (with its edition date) and update the rules that cite it.",
      ])
    }
    return allow("passed", [], [], ctx.before ? "readme" : "new copy")
  },
}

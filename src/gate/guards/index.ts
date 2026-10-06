// The guards, in the order they are asked. The first whose `matches` says
// yes judges the write. `gate` comes first: the gate's own files are never
// judged by anything softer.
import type { Guard } from "../types.ts"
import { gate } from "./gate.ts"
import { standard } from "./standard.ts"
import { decision } from "./decision.ts"
import { rule } from "./rule.ts"
import { story } from "./story.ts"
import { theme } from "./theme.ts"

export const guards: Guard[] = [gate, standard, decision, rule, story, theme]

export const guardFor = (rel: string): Guard | undefined => guards.find((g) => g.matches(rel))

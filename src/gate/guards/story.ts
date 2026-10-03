// *.stories.tsx: an `expected` answer is written before the run and is not
// adjusted to the result. Flipping one from fail to pass needs an approved
// precedent on the rule that story expected to fire. Every change to an
// expected block is recorded.
import { loadPrecedents } from "../../precedents/load.ts"
import { GUARDED } from "../paths.ts"
import { allow, refuse, type Guard } from "../types.ts"

export const story: Guard = {
  name: "story",
  matches: (rel) => GUARDED.story.test(rel),
  check(ctx) {
    const prevX = expectedBlocks(ctx.before)
    const nextX = expectedBlocks(ctx.after)
    const changed = [...nextX].filter(([name, x]) => prevX.has(name) && prevX.get(name) !== x)
    const flips = changed.filter(([name]) => /wcag:\s*"fail"/.test(prevX.get(name)!) && /wcag:\s*"pass"/.test(nextX.get(name)!))
    if (flips.length) {
      const approved = loadPrecedents().filter((p) => p.status === "approved")
      const component = ctx.rel.split("/").pop()!.replace(/\.stories\.tsx?$/, "")
      for (const [name] of flips) {
        const storyName = `${component} › ${title(name)}`
        const expectedRule = prevX.get(name)!.match(/axe:\s*"([^"]+)"/)?.[1]
        const covered = approved.some(
          (p) =>
            p.rule === expectedRule &&
            (p.scope === "story" ? p.subject.story === storyName : p.scope === "component" ? p.subject.component === component : true)
        )
        if (!covered) {
          return refuse([
            `expected answer of "${storyName}" flips from fail to pass without an approved precedent on ${expectedRule ?? "its rule"}.`,
            "An expected answer is written before the run and is not adjusted to the result. If the component was really fixed, keep the planted failure as its own story and say in evidence what changed — or record the decision as a precedent first.",
          ])
        }
      }
    }
    return allow("passed", [], changed.map(([n, x]) => ({ story: n, expected: x.slice(0, 200) })), changed.length ? "expected changed" : undefined)
  },
}

function expectedBlocks(src: string): Map<string, string> {
  const out = new Map<string, string>()
  const re = /export const (\w+)[\s\S]*?expected:\s*\{([\s\S]*?)\n\s*\},?\s*\n\s*\}/g
  let m: RegExpExecArray | null
  while ((m = re.exec(src))) out.set(m[1], m[2].replace(/\s+/g, " ").trim())
  return out
}
const title = (exportName: string) => exportName.replace(/_$/, "").replace(/([a-z0-9])([A-Z])/g, "$1 $2")

// Reads precedents/*.md from disk for the Node executors (edit hook, run.ts).
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { parsePrecedent, type Precedent } from "./registry.ts"

export function loadPrecedents(dir = join(process.env.CLAUDE_PROJECT_DIR ?? ".", "precedents")): Precedent[] {
  let files: string[] = []
  try {
    files = readdirSync(dir).filter((f) => f.endsWith(".md") && f !== "README.md")
  } catch {
    return []
  }
  return files.map((f) => parsePrecedent(readFileSync(join(dir, f), "utf8"), f)).filter((p): p is Precedent => !!p)
}

// Integrity of the gate itself. A person signs gate.lock.json — the sha256
// of every protected file. On every call the runner recomputes and compares.
// A mismatch means the gate's code or registration was changed outside the
// gate (an obfuscated shell command, an editor, a merge): from then on every
// guarded write is refused until a person re-signs. Tampering may succeed
// once; it cannot go unnoticed and keep working.
//
// An unlock window (.gate-unlock.json, written by a person with unlock.ts)
// lets protected files be edited through the tools for a limited time —
// for development of the gate itself. Edits made in the window are recorded
// like any other; the person re-signs when done.

import { createHash } from "node:crypto"
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"
import { PROTECTED_DIRS, PROTECTED_FILES } from "./paths.ts"

export const LOCK_FILE = "gate.lock.json"
export const UNLOCK_FILE = ".gate-unlock.json"

export interface Lock { format: 1; signedAt: string; signedBy: string; files: Record<string, string> }
export interface Unlock { until: string; by: string; why?: string }

function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) yield* walk(p)
    else yield p
  }
}

export function protectedFiles(root: string): string[] {
  const out: string[] = []
  for (const d of PROTECTED_DIRS) if (existsSync(join(root, d))) for (const f of walk(join(root, d))) out.push(relative(root, f))
  for (const f of PROTECTED_FILES) if (existsSync(join(root, f))) out.push(f)
  return out.filter((f) => !f.endsWith(".DS_Store")).sort()
}

export function manifest(root: string): Record<string, string> {
  const files: Record<string, string> = {}
  for (const f of protectedFiles(root)) files[f] = createHash("sha256").update(readFileSync(join(root, f))).digest("hex")
  return files
}

export function readLock(root: string): Lock | null {
  const p = join(root, LOCK_FILE)
  if (!existsSync(p)) return null
  try { return JSON.parse(readFileSync(p, "utf8")) as Lock } catch { return null }
}

export function readUnlock(root: string): Unlock | null {
  const p = join(root, UNLOCK_FILE)
  if (!existsSync(p)) return null
  try {
    const u = JSON.parse(readFileSync(p, "utf8")) as Unlock
    return new Date(u.until) > new Date() ? u : null
  } catch { return null }
}

export interface Integrity { ok: boolean; signed: boolean; changed: string[]; added: string[]; removed: string[]; unlock: Unlock | null }

export function verify(root: string): Integrity {
  const lock = readLock(root)
  const unlock = readUnlock(root)
  if (!lock) return { ok: false, signed: false, changed: [], added: [], removed: [], unlock }
  const now = manifest(root)
  const changed = Object.keys(now).filter((f) => lock.files[f] && lock.files[f] !== now[f])
  const added = Object.keys(now).filter((f) => !lock.files[f])
  const removed = Object.keys(lock.files).filter((f) => !now[f])
  return { ok: changed.length + added.length + removed.length === 0, signed: true, changed, added, removed, unlock }
}

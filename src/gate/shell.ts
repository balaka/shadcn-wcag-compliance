// What a shell command would do to the files the gate cares about. The
// result of a command cannot be computed in advance, so the gate reads the
// command's text: a write verb next to a guarded or protected path is
// refused and the agent is pointed at Edit/Write, where the outcome is
// visible before it happens.
//
// Known gaps, stated plainly: a target hidden in a variable or a command
// substitution, a copied script under another name, a nested interpreter
// fed by stdin. Those are caught after the fact by integrity.ts (for the
// gate's own files) and by the next run's findings (for data files).

import { guardedKind, HUMAN_COMMANDS, isProtected } from "./paths.ts"

export interface ShellVerdict { refuse: boolean; target?: string; why?: string; guard: string }

const WRITE_VERBS =
  /(^|[\s;&|(])(sed\s+-[a-zA-Z]*i|perl\s+-[a-zA-Z]*i|tee\b|cp\b|mv\b|ln\b|install\b|dd\b|truncate\b|rm\b|unlink\b|chmod\b|chown\b|>{1,2})/
const PY_OPEN_WRITE = /open\([^)]*['"][wa]/
// git verbs that rewrite the working tree
const GIT_REWRITE = /(^|[\s;&|(])git\s+(checkout|restore|mv|rm|stash|reset|clean|apply|revert|rebase|merge|cherry-pick)\b/
const GIT_WHOLE_TREE = /(^|[\s;&|(])git\s+(reset\s+--hard|clean\b|stash\b|checkout\s+(--\s+)?\.|restore\s+(--\s+)?\.)/

// An interpreter given code on the command line: the quoted part IS the
// program, so it is read, not dropped.
const INLINE_CODE = /(^|[\s;&|(])(python3?|node|deno|bun|perl|ruby|php|bash|sh|zsh)\s+-[a-zA-Z]*[ce]\b/
const CODE_WRITES = /writeFile|appendFile|createWriteStream|fs\.write|open\([^)]*['"][wa]|File\.(write|open)|\.write\(|>{1,2}/

// A here-document's body is data — a commit message, a journal entry — and
// is dropped before the text is read, with two exceptions where the body
// executes: it is fed to an interpreter (`bash <<EOF`, `python3 <<EOF`), or
// its delimiter is unquoted and the body holds a live substitution
// (`$(…)` or a backtick), which the shell expands before anything else.
const HEREDOC = /<<-?\s*(["']?)(\w+)\1([^\n]*)\n([\s\S]*?)\n[ \t]*\2[ \t]*(?=\n|$)/g
const FED_TO_INTERPRETER = /(^|[\s;&|(])(bash|sh|zsh|python3?|node|deno|bun|perl|ruby|php)\b[^|;&\n]*$/

// Returns the command with data bodies dropped, and whether any body was
// kept because it executes — such a body is read as code, quotes and all.
function dropHeredocBodies(command: string): { text: string; keptCode: boolean } {
  let keptCode = false
  const text = command.replace(HEREDOC, (whole: string, quote: string, delim: string, rest: string, body: string, offset: number) => {
    const line = command.slice(0, offset).split("\n").pop() ?? ""
    if (FED_TO_INTERPRETER.test(line) || (!quote && /\$\(|`/.test(body))) {
      keptCode = true
      return whole
    }
    // the rest of the first line (a redirect, a pipe) stays: it is the command's
    return `<<${quote}${delim}${quote}${rest}\n${delim}`
  })
  return { text, keptCode }
}

export function analyze(rawCommand: string): ShellVerdict {
  const { text: command, keptCode } = dropHeredocBodies(rawCommand)
  // Quoted text is data, not a target: a commit message or a journal line
  // that merely mentions a file must not trip the guard — unless the quotes
  // hold a program for an inline interpreter or an executing heredoc body.
  const inline = keptCode || INLINE_CODE.test(command)
  const cmd = inline ? command : command.replace(/'[^']*'|"[^"]*"/g, '""')
  // A person's command is caught by its invocation (node … approve.ts), not
  // by its name appearing somewhere: reading or listing those files is fine.
  if (HUMAN_COMMANDS.test(cmd)) {
    return { refuse: true, guard: "human-command", target: cmd.match(HUMAN_COMMANDS)![0].trim(), why: "this is a person's command — approving, signing or unlocking is not done from a chat. Ask the person to run it in their own terminal." }
  }
  const words = cmd.match(/[\w./~$-]+/g) ?? []
  const targets = words.filter((w) => guardedKind(w) !== null || isProtected(w))
  if (GIT_WHOLE_TREE.test(cmd)) {
    return { refuse: true, guard: "shell", target: "(working tree)", why: "this git command rewrites the working tree, guarded files included, past the gate. Ask the person, or restore single files that are not guarded." }
  }
  if (targets.length && (WRITE_VERBS.test(cmd) || PY_OPEN_WRITE.test(cmd) || GIT_REWRITE.test(cmd) || (inline && CODE_WRITES.test(cmd)))) {
    const kind = guardedKind(targets[0]) ?? "protected"
    return { refuse: true, guard: kind, target: targets[0], why: `a ${kind === "protected" ? "gate" : kind} file rewritten by a shell command cannot be checked in advance. Use the Edit or Write tool; the gate then sees what the file will become and lets a passing change through.` }
  }
  return { refuse: false, guard: "shell" }
}

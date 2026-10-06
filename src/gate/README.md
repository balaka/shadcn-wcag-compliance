# The gate

The place where a chat's write meets the rules. One launcher, one runner,
one guard per kind of file. Decisions come from data — the file as it is
and as it would become, the decisions on disk, the lock — never from
anything said in a conversation.

## Principles

1. **One entry.** Every write a tool makes passes through `launcher.mjs`.
2. **Fail closed.** If the gate cannot run, the write is refused. A broken
   gate never becomes an open one (`launcher.mjs`).
3. **The gate protects itself and how the checks run.** Its code, its
   registration (`.claude/settings.json`), its lock, the decision register's
   code and approvers list, the executors that put our rules inside axe,
   Storybook's settings (`example/.storybook/`, `example/vite.config.ts`)
   and `.github/` are a protected set; a tool does not change them
   (`guards/gate.ts`). A person edits them outside the chat, or opens a gate
   window first (`unlock.ts --scope gate`).
4. **Integrity, every call.** `gate.lock.json` holds a person's signature
   over the protected files (`sign.ts`). A mismatch refuses every guarded
   write until a person re-signs (`integrity.ts`). Tampering may succeed
   once; it cannot go unnoticed and keep working.
5. **A command with an unknown result is a write.** `sed -i`, `>`, `cp`,
   `ln`, `git checkout -- file`, `git reset --hard`… against a guarded or
   protected path are refused; the agent is pointed at Edit/Write
   (`shell.ts`). An arrow (`=>`) or `2>&1` in a command is not a write.
6. **People act outside the chat.** `approve`, `sign`, `unlock` are commands
   a person runs in their own terminal; from a chat they are refused by name.
   Only a person on the approvers list (`src/decisions/approvers.ts`)
   approves; `.github/CODEOWNERS` makes the same people reviewers of
   `decisions/` on GitHub.
7. **Stories are closed.** A story is what the checks see. A chat does not
   write one unless a person opened a stories window (`unlock.ts --scope
   stories`), and no story ever configures or switches off the check
   (`guards/story.ts`).
8. **Data at request time, from the repository.** Guards read `decisions/`
   and `rules/` from disk when called. Nothing is passed in.
9. **Guards are small and alike.** `{ name, matches(path), check(ctx) }`,
   one file each under `guards/`. Adding a guard is adding a file and a line
   in `guards/index.ts`.
10. **Everything is recorded.** `runs/edits.jsonl`: allowed, refused,
   accepted by a decision, unchecked, unlocked, fail-closed.

## Honest limits

This is a threshold, not a wall. A chat set on bypassing it can hide a
path in a variable or feed a nested interpreter; the text analysis in
`shell.ts` will not see it. What it cannot do is keep working afterwards:
the next call finds the lock broken (for the gate's files) or the next run
finds the regression (for data files), and both leave a trace. A name typed
after `--by` is self-declared. The wall is the pull request, where an
approval or a gate change has to arrive in a commit a person made and a
code owner reviewed.

## Files

```
launcher.mjs   what Claude Code calls; dependency-free; fails closed
runner.ts      shell → shell.ts; file → integrity → the matching guard; records
shell.ts       reads a command's text for writes to guarded/protected paths
integrity.ts   protected set, manifest, lock, windows (gate / stories)
paths.ts       GUARDED and PROTECTED patterns, human-only commands
guards/        gate · standard · decision · rule · story · theme
stop.ts        Stop hook: cantTell findings without a decision block the answer
sign.ts        person: write gate.lock.json; closes any window   (refused from a chat)
unlock.ts      person: open/close a window                       (refused from a chat)
record.ts      runs/edits.jsonl
```

## Repairing the gate

If the launcher reports that the gate could not run: fix the cause in
your editor (the message names it), then `node src/gate/sign.ts --by
"<name>"`. To develop the gate through Claude Code: `node src/gate/unlock.ts
--scope gate --by "<name>" --minutes 60`, work, then sign. To have stories
written through Claude Code: `--scope stories`, then `--close`.

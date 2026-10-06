// Who may approve or revoke a decision. A person edits this list (it is
// part of the gate: protected, and signed into gate.lock.json).
//
// Two layers, stated plainly:
//   threshold — approve.ts refuses a name that is not here, and the
//               register treats an approval by anyone else as not given
//               (status needs-review). A name typed on the command line is
//               self-declared, so this stops mistakes, not impostors.
//   wall      — .github/CODEOWNERS names the same people for decisions/;
//               with "Require review from Code Owners" switched on in the
//               repository's branch protection, no change to a decision
//               reaches main without their review on GitHub.
//
// Keep `github` in step with .github/CODEOWNERS.

export interface Approver { name: string; github: string }

export const APPROVERS: Approver[] = [
  { name: "Yuriy Balaka", github: "balaka" },
]

export const isApprover = (name: string | undefined) => !!name && APPROVERS.some((a) => a.name === name)

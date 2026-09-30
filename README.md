# shadcn-wcag-compliance

WCAG 2.2 AA compliance checks for design systems built on shadcn/ui (Base UI) — on every change, on every pull request, and as a full audit on the developer's machine.

## Why

- shadcn/ui is the most common way to build a design system today: a team copies ready components into its code and restyles them.
- Behaviour — keyboard, focus, screen reader — is already tested by the primitives underneath (Base UI, Radix). The look is tested by no one: contrast of every token pair, visible focus, status shown by colour alone, target size. And the look is exactly what breaks when a team or an AI agent restyles components.
- Automated engines such as axe catch only part of real issues.
- Since June 2025 the European Accessibility Act requires digital products in the EU to be accessible to WCAG level.

## What it does (planned)

1. **At write time** — an edit that breaks accessibility is not written.
2. **On pull request** — a CI check blocks the merge.
3. **Full audit** — every token pair, every component and variant, both themes; a report.

All three use the same rules: WCAG 2.2 criteria classified from W3C sources and ACT rules, axe where it works, own checks where axe is blind. Ambiguous cases go to a human and are recorded in a register of decisions. Every run is kept in history.

Status: early work. Nothing to install yet.

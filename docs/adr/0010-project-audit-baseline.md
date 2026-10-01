# 0010 - Project audit baseline

**Date**: 2026-10-01
**Status**: Accepted

## Context
After the full proto pass, a fresh baseline was needed on the evolved code.

## Decision
Audited into docs/AUDIT.md. Stack: React 19, Vite 8, Tailwind v4, shadcn base-nova, npm. Result: 0 high, 6 medium, 3 low findings. Top priorities: enforce a11y checks and commit real tests, fix the crowded template row, add a drag affordance in the queue, resolve the Reset behavior drift.

## Impact
These are fix-forward items; proto-simplify is not needed. Nothing was verified in a real browser, which the audit states explicitly. Re-run proto-audit after major changes.

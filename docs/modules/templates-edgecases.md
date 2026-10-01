# templates — Edge Cases

## Coverage
- **Spec already captured**: duplicate names, empty name, loading into a running queue, saving an empty queue, corrupted data.
- **Already handled in code**: "Untitled template" fallback (`use-templates.tsx:38`), save-queue disabled when empty (`QueueDrawer.tsx`), corrupted entries filtered (`use-templates.tsx:21`), delete confirmation (`TemplatesDrawer.tsx`), empty state.
- **New gaps found**: 2
- **By severity**: 🔴 0 · 🟡 1 · 🟢 1

## Inventory

| # | Severity | Category | Edge case | Behavior today | Suggested behavior | Where |
|---|----------|----------|-----------|----------------|--------------------|-------|
| 1 | 🟡 | Action outcomes | "Start now" while another timer is running | The running timer is replaced without warning | Disable with a hint "Stop the current timer first" | ✅ `src/modules/templates/components/TemplatesDrawer.tsx:74` |
| 2 | 🟢 | Data states | A hand-edited import with a few invalid templates | Invalid ones are dropped silently | Accept for the prototype | ❌ Accepted: invalid entries are dropped on load. |

## Priority list
1. Silent replacement of a running timer (#1).

## Hand-off to proto-harden (done)
- #1.

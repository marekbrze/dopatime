# timer-queue — Edge Cases

## Coverage
- **Spec already captured**: empty queue, unnamed item, edit/remove running item, queue modified mid-run, finished queue, alternating/infinite items.
- **Already handled in code**: empty state and disabled Start (`QueueDrawer.tsx`), default names "Timer N" (`use-queue.tsx:35`), edit disabled while running (`QueueDrawer.tsx:100`), remove-running confirmation (`QueueDrawer.tsx:123`), "Run again" when all done (`use-queue.tsx` `startQueue`), infinite-item warning with auto-advance (`QueueDrawer.tsx`).
- **New gaps found**: 4
- **By severity**: 🔴 1 · 🟡 2 · 🟢 1

## Inventory

| # | Severity | Category | Edge case | Behavior today | Suggested behavior | Where |
|---|----------|----------|-----------|----------------|--------------------|-------|
| 1 | 🔴 | State transitions | Finish a queue item, then press Done | The item is set back to `queued` and will run again | Only revert an item that is still `running` | ✅ `src/modules/timer-queue/hooks/use-queue.tsx:98` |
| 2 | 🟡 | Action outcomes | Start queue while an ad hoc timer is running | The running timer is replaced without warning | Disable Start with a hint "Stop the current timer first" | ✅ `src/modules/timer-queue/components/QueueDrawer.tsx:121` |
| 3 | 🟡 | Cross-module & lifecycle | Reload (or an import) leaves an item `running` with no active run | Item stuck as "Running" forever | Reconcile on load: items marked running without a matching run go back to `queued` | ✅ `src/modules/timer-queue/hooks/use-queue.tsx:76` |
| 4 | 🟢 | Data states | Very long queue names / many items | Names truncate (ok); no count limit | Accept | ❌ Accepted: no count limit needed for a prototype. |

## Priority list
1. Done reverting a finished item (#1): breaks the main flow.
2. Replacing a running timer silently (#2).
3. Stuck running items after reload (#3).

## Hand-off to proto-harden (done)
- #1–#3.

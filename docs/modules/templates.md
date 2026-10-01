# templates

## Vision
Favorite timers and whole sequences available in one click, so the user never rebuilds the same 25/5 or morning routine.

## User Flows

### Save and reuse
1. User builds a timer on the stage (or a queue) and clicks "Save as template" → types a name → saved.
2. Later, the user opens the Templates drawer → sees the list → clicks "Add to queue" on one → its items are appended to the queue.
3. Single-timer templates also offer "Start now" to run it immediately.

### Manage
Rename (inline), delete (with confirmation).

## Screens (rough)

- **Templates drawer**: a flat list; each row shows the name, kind (Timer / Set), a summary (`25/5 × 4`, `3 timers · 55 min`) and actions: Start now (timers), Add to queue, Rename, Delete. Empty state explains how to save one.

## Actions

| Action | Description | Entity | Notes |
|--------|------------|--------|-------|
| Save timer as template | from the stage | Template | kind timer |
| Save queue as template | from the queue | Template | kind set |
| Load template | append to queue | Template | never replaces the queue |
| Start now | run a single-timer template | Template | |
| Rename / Delete | manage | Template | delete confirms |

## Edge Cases

- **Duplicate names**: allowed, but the list shows the creation order.
- **Empty name**: falls back to "Untitled template".
- **Loading into a running queue**: items are appended, the current run is unaffected.
- **Saving an empty queue**: action disabled.
- **Corrupted template data (from a bad import)**: invalid entries are skipped on load.

### Hardened behaviors (proto-harden)
- "Start now" is disabled, with a hint, while a timer is active.

## Integration Points

- **timer-engine**: source for "Save as template", target for "Start now".
- **timer-queue**: load appends; save queue.
- **settings-data**: included in JSON export/import.

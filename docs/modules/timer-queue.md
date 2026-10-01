# timer-queue

## Vision
Plan a stretch of work as a sequence of named timers ("Plan tasks" 10 min → "Work on task 1" 30 min → "Check email" 15 min) and let it run. The user can let items chain automatically or take a breath between them.

## User Flows

### Build and run a queue
1. User opens the Queue drawer → sees the list (or an empty state) and an "Add timer" form.
2. User types a name, builds a duration with the DurationButtons (or an alternating timer), clicks Add.
3. Repeats for each item; drags to reorder.
4. Clicks "Start queue" → the first item runs on the stage.
5. When an item ends: with auto-advance on the next starts by itself; off → the stage shows "Start next: <name>".
6. After the last item the queue is finished; the user can run the queue again or clear it.

### Manage items
Edit name/duration, duplicate, remove, reorder (move up/down buttons plus drag), Clear queue (with confirmation).

### Save queue as template
One click on "Save as template" → name prompt → stored in templates.

## Screens (rough)

- **Queue drawer**: header with total time and the auto-advance switch; list of items (name, duration, status dot: queued / running / done); item actions (edit, duplicate, remove, move); add form at the bottom; footer actions: Start queue, Save as template, Clear queue.

## Actions

| Action | Description | Entity | Notes |
|--------|------------|--------|-------|
| Add item to queue | name + timer | QueueItem | |
| Edit item | rename, change duration | QueueItem | not while running |
| Remove item | delete | QueueItem | removing the running item stops it |
| Duplicate item | copy next to original | QueueItem | |
| Reorder items | move up/down, drag | QueueItem | |
| Clear queue | remove all | TimerQueue | confirmation |
| Start queue / Start next | run | TimerQueue | |
| Toggle auto-advance | switch | TimerQueue | default from settings |
| Save as template | store whole queue | Template | |

## Edge Cases

- **Empty queue**: friendly empty state with a hint; Start disabled.
- **Item without a name**: gets "Timer N" automatically.
- **Edit/remove the running item**: editing is disabled while running; removing asks to stop.
- **Queue modified while a run is active**: new items append; reordering only affects items not yet started.
- **Queue finished**: items stay marked done; "Run again" resets statuses.
- **Alternating items**: shown with a summary like `25/5 × 4`; infinite items block auto-advance (they never finish), flagged with a hint.

## Integration Points

- **timer-engine**: starts runs for items; advances on `finished`.
- **templates**: loading a template appends its items; save queue as template.
- **settings-data**: default auto-advance.

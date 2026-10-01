# timer-engine

## Vision
The heart of Dopatime: set a time in a few taps and start a focus sprint. The main stage shows one large countdown, and everything needed to define and control a timer sits within reach, without typing numbers. The engine runs one "active run" at a time, either an ad hoc timer from the stage or an item of the queue. The countdown is computed from timestamps so it stays accurate in a background tab.

## User Flows

### Quick simple timer (happy path)
1. User opens the page → sees a large `00:00`, the DurationButtons (+1h, +15m, +5m, +1m), a Clear button and a disabled Start.
2. User clicks +5m twice → display shows `10:00`, Start becomes enabled.
3. User clicks Start → the run begins, the display counts down, the tab title shows the remaining time.
4. Timer ends → `end-alerts` fires; the stage shows "Time's up" with Restart.
5. User clicks Restart → the same timer runs again.

### Alternating timer
1. User switches the mode toggle from Simple to Alternating.
2. User builds a duration with the buttons (e.g. 25 min), clicks "Add phase"; builds 5 min, clicks "Add phase" → phases appear as chips `25:00 · 5:00`.
3. User sets cycles: a number stepper (1–99) or the Infinite toggle.
4. User clicks Start → phase 1 runs; the stage shows "Phase 1 of 2 · Cycle 1 of 4".
5. Each phase end fires an alert and the next phase starts by itself, until the last cycle ends (or forever for infinite, until Stop).

### Control a running timer
Pause / Resume, Reset (back to the full duration of the current phase, paused-free restart), Skip (jump to the next phase or queue item), +1 min, Stop (end the run, back to idle).

### Add to queue / save as template
From the builder the user can click "Add to queue" (optionally typing a name first) or "Save as template".

## Screens (rough)

- **Stage (idle)**: mode toggle (Simple | Alternating), big display of the built duration, DurationButtons row, Clear, optional name input, Start, and secondary actions (Add to queue, Save as template). In alternating mode: phase chips (removable), Add phase, cycles control.
- **Stage (running / paused)**: big countdown, name and phase/cycle info, progress bar, Pause/Resume, Reset, Skip, +1 min, Stop.
- **Stage (finished)**: "Time's up" state with Restart and Done (back to idle); in a queue run with auto-advance off: "Start next: <name>".
- **Mini timer (header)**: compact countdown with status, always visible while a run is active.

## Actions

| Action | Description | Entity | Notes |
|--------|------------|--------|-------|
| Build simple timer | DurationButtons add time | Timer | clicks accumulate |
| Clear built duration | Zero the built duration | Timer | |
| Define alternating timer | Add phases, set cycles | Timer, Phase | cycles: number or infinite |
| Start / Pause / Resume / Reset / Skip / Add 1 minute / Stop / Restart | Run controls | Timer | |
| Add to queue | Push the built timer to the queue | QueueItem | |
| Save as template | Store the built timer | Template | |

## Edge Cases

- **Start with zero duration**: Start is disabled; helper text "Add some time to start".
- **Alternating with no phases**: Start disabled; hint "Add at least one phase".
- **Very long durations**: capped at 99:59:59; further additions are ignored with the display flashing the max.
- **Page reload while running**: the run is restored from the stored end timestamp; if it already ended, it shows the finished state.
- **Background tab**: countdown is derived from timestamps, so throttling doesn't drift it.
- **+1 min while finished**: not available; use Restart.
- **Infinite cycles**: cycle label shows "Cycle N" without a total; Stop is the only way out.

## Integration Points

- **end-alerts**: the runner emits `phase-end` and `finished` events and exposes status and remaining time for the tab title.
- **timer-queue**: starts runs from queue items and reacts to `finished` to advance.
- **templates**: "Save as template" receives the built timer definition.

# timer-engine — Edge Cases

## Coverage
- **Spec already captured**: zero duration, empty alternating, duration cap, reload while running, background tab, +1 min while finished, infinite cycles.
- **Already handled in code**: Start disabled for zero/empty (`TimerBuilder.tsx:21`), 99:59:59 cap (`use-builder.ts:41`), timestamp-based countdown and catch-up (`lib/timer.ts` `advanceRun`), restore after reload (`use-timer-runner.tsx:73`), Web Worker ticker (`shared/hooks/use-ticker.ts`), infinite cycles label (`RunView.tsx`).
- **New gaps found**: 7
- **By severity**: 🔴 0 · 🟡 4 · 🟢 3

## Inventory

| # | Severity | Category | Edge case | Behavior today | Suggested behavior | Where |
|---|----------|----------|-----------|----------------|--------------------|-------|
| 1 | 🟡 | Forms & input | Alternating: duration built but "Add phase" not clicked, then Start | Leftover time is silently ignored | Hint "05:00 not added yet. Add it as a phase or clear it." and Start stays enabled | `src/modules/timer-engine/components/TimerBuilder.tsx:21` |
| 2 | 🟡 | Action outcomes | Double-click on Start | The second click lands on Pause (same screen position) and pauses immediately | Ignore control clicks for a moment after the run starts | `src/modules/timer-engine/components/RunView.tsx:86` |
| 3 | 🟡 | Navigation & flow | Keyboard focus after Start / finish | The clicked button unmounts, focus drops to `<body>` | Move focus to the primary run button on start and to Restart on finish | `src/modules/timer-engine/components/RunView.tsx:30` |
| 4 | 🟡 | Data states | Stored `active-run` / `builder` have the wrong shape (old version, import) | Spread without validation; `.map` on a non-array crashes the stage | Normalizers that validate and fall back to idle / defaults | `src/modules/timer-engine/hooks/use-timer-runner.tsx:38`, `use-builder.ts:25` |
| 5 | 🟢 | Boundary values | Adding time past the cap | Silently clamped | Brief "Maximum is 99:59:59" notice | `src/modules/timer-engine/hooks/use-builder.ts:41` |
| 6 | 🟢 | Data states | Very long timer name | Overflows the heading | Truncate with `title` tooltip | `src/modules/timer-engine/components/RunView.tsx:42` |
| 7 | 🟢 | Action outcomes | After "Add to queue" the name stays in the field | Next add reuses the same name | Clear the name, keep the time | `src/modules/timer-engine/components/TimerBuilder.tsx:52` |

## Priority list
1. Shape validation of stored state (#4): prevents a crash.
2. Double-click Start pausing (#2) and focus management (#3).
3. Leftover time in alternating mode (#1).
4. Polish (#5–#7).

## Hand-off to proto-harden
- #1–#4 first, then #5–#7.

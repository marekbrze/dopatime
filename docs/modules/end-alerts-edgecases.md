# end-alerts — Edge Cases

## Coverage
- **Spec already captured**: notifications blocked/unsupported, audio autoplay, phase-change chime, overlapping alerts, foreground tab.
- **Already handled in code**: permission states with hints in Settings (`SettingsDrawer.tsx` `NotificationsStatus`), audio unlock on first interaction (`use-end-alerts.tsx:61`), short chime on phase end (`use-end-alerts.tsx:96`), alert replaced on new event (`use-end-alerts.tsx:93`), silent skip (`event.silent`).
- **New gaps found**: 4
- **By severity**: 🔴 0 · 🟡 2 · 🟢 2

## Inventory

| # | Severity | Category | Edge case | Behavior today | Suggested behavior | Where |
|---|----------|----------|-----------|----------------|--------------------|-------|
| 1 | 🟡 | Navigation & flow | The tab is closed while a timer runs | No alert ever fires; nothing warns the user | Ask for confirmation on close while a timer is running ("beforeunload") | ✅ `src/modules/end-alerts/hooks/use-end-alerts.tsx:121` |
| 2 | 🟡 | Errors | Audio can't play at all (blocked, no device) | Nothing indicates it; only the title/banner remain | The finished state already shows "Time's up"; add a visible "Silence alarm" only when alerting (exists) and a hint in Settings preview if audio is suspended | ✅ `src/modules/settings-data/components/SettingsDrawer.tsx:94` (hint after Preview) |
| 3 | 🟢 | Action outcomes | Spec says any interaction dismisses the alarm | Only Silence / Restart / Done / Start dismiss it | Also dismiss on the first click anywhere in the page | ✅ `src/modules/end-alerts/hooks/use-end-alerts.tsx:129` |
| 4 | 🟢 | Loading & async | Run finished while the page was closed | Alarm plays silently (audio locked), title flashes | Accept; the finished screen explains | ❌ Accepted: the finished screen explains what happened. |

## Priority list
1. Close-tab warning while running (#1).
2. Audio-suspended hint (#2).

## Hand-off to proto-harden (done)
- #1 (implement), #2 (implement hint), #3 (implement), #4 (accept).

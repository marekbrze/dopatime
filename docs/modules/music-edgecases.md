# music — Edge Cases

## Coverage
- **Spec already captured**: invalid link, duplicate link, unavailable stream, offline, reload, no station selected.
- **Already handled in code**: link validation message (`use-music.tsx` `addStation`), duplicate rejection, "Open on YouTube" fallback link, Play disabled without a station (`MusicDrawer.tsx`), no autoplay after reload (`use-music.tsx:30`).
- **New gaps found**: 4
- **By severity**: 🔴 0 · 🟡 3 · 🟢 1

## Inventory

| # | Severity | Category | Edge case | Behavior today | Suggested behavior | Where |
|---|----------|----------|-----------|----------------|--------------------|-------|
| 1 | 🟡 | Errors | The player fails (embedding blocked, offline, removed video) | UI says "Playing" regardless | Listen to the player's error messages and show "This stream can't be played here. Open it on YouTube." | ✅ `src/modules/music/hooks/use-music.tsx:153` |
| 2 | 🟡 | Forms & input | Pasting an invalid link | Native `type=url` validation blocks submit with a browser tooltip instead of our message | Turn off native validation so the inline error shows | ✅ `src/modules/music/components/MusicDrawer.tsx:117` |
| 3 | 🟡 | Data states | Stored music prefs with the wrong shape (import) | Spread without validation; a non-array crashes `.filter` | Normalizer that validates arrays and volume | ✅ `src/modules/music/hooks/use-music.tsx:10` |
| 4 | 🟢 | Action outcomes | Playing state when the stream ends or is paused from inside the player | UI state can drift from reality | Sync with the player's state messages | ✅ `src/modules/music/hooks/use-music.tsx:164` |

## Priority list
1. Player errors (#1) and native validation (#2).
2. Shape validation (#3).

## Hand-off to proto-harden (done)
- #1–#4.

# App-wide (cross-cutting) — Edge Cases

## Coverage
- **Spec already captured**: none at app level (module specs cover their own cases).
- **Already handled in code**: LocalStorage read failures fall back to defaults (`src/shared/hooks/use-stored-state.ts:19`); the production build hides the DevToolbar.
- **New gaps found**: 5
- **By severity**: 🔴 2 · 🟡 3 · 🟢 0

## Inventory

| # | Severity | Category | Edge case | Behavior today | Suggested behavior | Where |
|---|----------|----------|-----------|----------------|--------------------|-------|
| 1 | 🔴 | Prototype-specific | LocalStorage write fails (quota, private mode, blocked) | `console.error` only; the user thinks data is saved | Persistent banner "Your changes can't be saved in this browser" with Export JSON shortcut | ✅ `src/shared/hooks/use-stored-state.ts:33`, banner `src/shared/components/StorageBanner.tsx` |
| 2 | 🔴 | Errors | A render error anywhere (e.g. corrupted stored data) | White screen, no way back | Error boundary with "Reload" and "Reset app data" | ✅ `src/shared/components/ErrorBoundary.tsx:34` |
| 3 | 🟡 | Data states | Stored JSON is corrupted or has the wrong shape | Silently replaced by defaults, then overwritten on the next write | Keep working with defaults, but warn once that saved data was unreadable | ✅ `src/shared/hooks/use-stored-state.ts:22` (warning banner) |
| 4 | 🟡 | Navigation & flow | The app open in two tabs | Tabs overwrite each other's state; both may alarm | Out of scope for the prototype; note in docs | ❌ Deferred: out of scope for the prototype; the app is meant to be used in one tab. |
| 5 | 🟡 | Prototype-specific | Offline | Works (static assets cached by the browser); YouTube music can't load | Music drawer shows an offline hint | ✅ `src/modules/music/components/MusicDrawer.tsx:62` |

## Priority list
1. Storage write failure feedback (#1): the only place data can silently disappear.
2. Error boundary (#2): a bad import should never brick the app.
3. Corrupted data warning (#3).

## Hand-off to proto-harden (done)
- #1 and #2 (implement), #3 (implement with a normalizer pass), #4 (accept and document), #5 (covered by the music error state).

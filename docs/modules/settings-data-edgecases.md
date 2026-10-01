# settings-data — Edge Cases

## Coverage
- **Spec already captured**: invalid JSON, newer version, notification denied, missing sections, large files.
- **Already handled in code**: all five (`lib/backup.ts` `parseBackupFile`, `SettingsDrawer.tsx` `NotificationsStatus`), plus a replace-data confirmation.
- **New gaps found**: 3
- **By severity**: 🔴 0 · 🟡 2 · 🟢 1

## Inventory

| # | Severity | Category | Edge case | Behavior today | Suggested behavior | Where |
|---|----------|----------|-----------|----------------|--------------------|-------|
| 1 | 🟡 | Data states | A valid-looking backup with malformed inner values (e.g. `queue.items` not an array) | Written as is; features that don't validate can crash after reload | Validate known keys against their normalizers before applying; reject with a clear message | `src/modules/settings-data/lib/backup.ts:62` |
| 2 | 🟡 | Action outcomes | Export | No confirmation that a file was downloaded | Inline "Backup downloaded" message | `src/modules/settings-data/components/SettingsDrawer.tsx:143` |
| 3 | 🟢 | Cross-module & lifecycle | Importing while a timer runs | The run is not part of a backup and is wiped by the reload | Mention it in the confirmation text | `src/modules/settings-data/lib/backup.ts:62` |

## Priority list
1. Validate before apply (#1).
2. Export feedback (#2).

## Hand-off to proto-harden
- #1–#3.

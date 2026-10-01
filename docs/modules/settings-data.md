# settings-data

## Vision
A small, quiet place for preferences and for moving data between browsers. Nothing leaves the user's machine; export and import use a plain JSON file.

## User Flows

### Preferences
1. User opens the Settings drawer → sees Alarm (sound, volume, repeat until dismissed, preview), Queue (auto-advance default), Notifications (permission status) and Appearance (theme).
2. Changes apply immediately and persist.

### Export / import
1. Export → a `dopatime-backup-YYYY-MM-DD.json` file downloads.
2. Import → user picks a file → app validates it → confirmation "This replaces your current data" → page state reloads with the imported data.

## Screens (rough)

- **Settings drawer**: grouped sections (Alarm, Queue, Notifications, Appearance, Data) with controls; Data section has Export and Import buttons and a short note about local-only storage.

## Actions

| Action | Description | Entity | Notes |
|--------|------------|--------|-------|
| Choose alarm sound | select + preview | Settings | chime, bell, beep |
| Change alarm volume | slider | Settings | |
| Toggle repeat until dismissed | switch | Settings | |
| Switch theme | system / light / dark | Settings | |
| Set default auto-advance | switch | Settings | |
| Enable notifications | request permission | Settings | |
| Export JSON | download | all data | |
| Import JSON | replace data | all data | confirms; replaces rather than merges |

## Edge Cases

- **Invalid JSON / wrong file**: error message, nothing changes.
- **File from a newer version**: rejected with "unsupported version".
- **Notification permission denied**: the button is replaced with instructions.
- **Import with missing sections**: missing parts fall back to defaults.
- **Large files**: files over 2 MB are rejected.

### Hardened behaviors (proto-harden)
- Import validates each known section before replacing anything and names the damaged section.
- Export shows "Backup downloaded."; the import confirmation mentions that a running timer will be stopped.
- App-wide: a banner warns when LocalStorage can't be written or data had to be reset, and an error boundary offers Reload / Reset app data instead of a blank page.

## Integration Points

- **end-alerts**: alarm preferences.
- **timer-queue**: default auto-advance.
- **templates / music**: their data is part of the backup.

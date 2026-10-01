# Action Inventory

Complete list of actions users can perform, organized by entity.

## Roles
- **User**: The only role. Anyone using the page; no accounts, no sharing between users. Data stays in the browser, with JSON export/import as the only way to move it.

## Actions

### Timer

| Action | Description | Role | Notes |
|--------|------------|------|-------|
| Build simple timer | Tap DurationButtons (1h, 15 min, 5 min, 1 min); each click adds that amount to the timer | User | Clicks accumulate |
| Clear built duration | Reset the duration being built back to zero | User | |
| Define alternating timer | Set phases (e.g. 25/5, 5/10/15) and cycles | User | Cycles: a number or infinite |
| Start | Begin the countdown | User | idle → running |
| Pause | Freeze the countdown | User | running → paused |
| Resume | Continue after a pause | User | paused → running |
| Reset | Return the timer to its full duration | User | |
| Skip | Jump to the next phase or the next queue item | User | |
| Add 1 minute | Extend a running timer by 1 min | User | |
| Stop | End the timer without finishing | User | → idle |
| Restart | Run the same timer again after it finished | User | Offered on the end screen |
| Dismiss alert | Silence the end-of-timer alert | User | Alert can repeat until dismissed |

### EndAlert

| Action | Description | Role | Notes |
|--------|------------|------|-------|
| Trigger alert | On finish: sound, browser notification and tab title change, all at once | System | Not user-triggered |
| Update tab title | Show remaining time in the tab title while running | System | |
| Request notification permission | Ask the browser for permission to notify | User | Needed for the notification channel |

### QueueItem / TimerQueue

| Action | Description | Role | Notes |
|--------|------------|------|-------|
| Add item to queue | Add a named timer (simple or alternating) | User | |
| Edit item | Change name, duration or phases | User | |
| Remove item | Delete one item | User | |
| Duplicate item | Copy an item next to the original | User | |
| Reorder items | Drag items to change order | User | |
| Clear queue | Remove all items | User | Button next to the queue |
| Start queue | Run items one after another | User | |
| Toggle auto-advance | Next item starts by itself, or waits for a click | User | |
| Start next item | Manually start the next item when auto-advance is off | User | |

### Template

| Action | Description | Role | Notes |
|--------|------------|------|-------|
| Save timer as template | Store a favorite single timer | User | |
| Save queue as template | Store the current queue as a TimerSet | User | One click |
| Load template | Append the template's item(s) to the end of the queue | User | Does not replace the queue |
| Rename template | Change its name | User | |
| Delete template | Remove it permanently | User | |

### MusicStation

| Action | Description | Role | Notes |
|--------|------------|------|-------|
| Select station | Pick Chillhop, Lofi Girl or a saved one | User | |
| Play / Pause | Start or stop the stream | User | Independent of the timer |
| Change volume | Adjust stream volume | User | |
| Add custom station | Paste a YouTube link | User | |
| Remove custom station | Delete a saved link | User | Built-ins can't be removed |
| Mark / unmark favorite | Flag a station as favorite | User | |

### Settings

| Action | Description | Role | Notes |
|--------|------------|------|-------|
| Choose alarm sound | Pick the end-of-timer sound | User | |
| Change alarm volume | Adjust alarm loudness | User | |
| Toggle repeat until dismissed | Alarm keeps sounding until silenced | User | |
| Switch theme | Light / dark | User | |
| Set default auto-advance | Default for new queues | User | |

### Data (export/import)

| Action | Description | Role | Notes |
|--------|------------|------|-------|
| Export JSON | Download a JSON file with settings, templates, queue and stations | User | |
| Import JSON | Load a JSON file with settings and data | User | Replace vs. merge is an open question |

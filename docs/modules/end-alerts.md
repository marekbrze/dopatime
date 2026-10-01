# end-alerts

## Vision
The user never misses the end of a timer. While a timer runs, the browser tab title shows the countdown. When a phase or timer ends, everything fires at once: a sound, a browser notification and an attention-grabbing tab title. The alarm can keep repeating until dismissed.

## User Flows

### Countdown in the tab title
1. A run starts → tab title becomes `⏳ 09:42 · Focus`.
2. Every second the title updates; paused shows `⏸ 09:42 · Focus`.
3. Run ends or is stopped → title returns to `Dopatime`.

### Alert on finish
1. Timer finishes → sound plays, a notification "Time's up: Focus" appears, the tab title flashes `🔔 Time's up!`.
2. If "repeat until dismissed" is on, the sound repeats every few seconds.
3. User clicks Dismiss (or Restart / Done / interacts with the page) → sound stops, title restored, notification closed.

### Notification permission
On the first Start the app asks for notification permission. If denied, the other channels (sound, title) still work and Settings shows a hint explaining how to re-enable.

## Screens (rough)

- **Finished banner on the stage**: "Time's up" with Dismiss/Restart (owned by timer-engine, driven by the alert state).
- **Settings hint** (in settings-data): notification permission status with a "Enable notifications" button.

## Actions

| Action | Description | Entity | Notes |
|--------|------------|--------|-------|
| Update tab title | Show countdown | TabTitleCountdown | system |
| Trigger alert | Sound + notification + title flash | EndAlert | system; also on phase end (short chime) |
| Request notification permission | Ask the browser | EndAlert | on first Start |
| Dismiss alert | Stop sound and flashing | EndAlert | user |
| Preview sound | Play the chosen sound once | EndAlert | from Settings |

## Edge Cases

- **Notifications blocked / unsupported**: skip silently, sound and title still fire; Settings explains.
- **Audio blocked by autoplay policy**: the audio context is unlocked on the first Start click; if it still can't play, the visual alert (title flash, banner) remains.
- **Phase change in alternating timers**: short chime and notification "Next: Break" instead of the full alarm.
- **Multiple alerts overlapping**: a new alert replaces the previous one.
- **Tab in the foreground**: notification is still shown but low-priority; sound plays.

### Hardened behaviors (proto-harden)
- The browser asks for confirmation before the tab is closed while a timer is running.
- Any click on the page silences a ringing alarm.
- Settings > Alarm > Preview tells the user when the browser is blocking sound.

## Integration Points

- **timer-engine**: reads status, remaining time, name and phase events.
- **settings-data**: alarm sound, volume, repeat-until-dismissed.

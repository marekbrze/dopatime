# music

## Vision
Background lofi/chillhop that plays independently of the timer, so the user can start it once and work.

## User Flows

1. User opens the Music drawer → sees stations: Lofi Girl, Chillhop Radio (built in) and their own.
2. Clicks a station → it becomes selected; clicks Play → the stream starts (the click is the user gesture that allows autoplay).
3. Adjusts the volume with the slider; Pause stops it. Closing the drawer does not stop the music.
4. To add a station: pastes a YouTube link → Add → it appears in the list; the star marks favorites (shown first).

## Screens (rough)

- **Music drawer**: now-playing card (station name, Play/Pause, volume slider); station list with favorite star and remove button for custom ones; add-station form with link validation.
- **Hidden player**: a persistent, visually hidden YouTube iframe mounted outside the drawer so playback survives closing it.

## Actions

| Action | Description | Entity | Notes |
|--------|------------|--------|-------|
| Select station | choose | MusicStation | |
| Play / Pause | control | MusicStation | via YouTube iframe API messages |
| Change volume | slider | MusicStation | persisted |
| Add custom station | paste link | MusicStation | watch, live, youtu.be links |
| Remove custom station | delete | MusicStation | built-ins can't be removed |
| Mark / unmark favorite | star | MusicStation | |

## Edge Cases

- **Invalid link**: inline error "That doesn't look like a YouTube link".
- **Duplicate link**: rejected with a hint.
- **Stream unavailable / blocked embedding**: the iframe shows YouTube's error; a "Open on YouTube" link is offered.
- **Offline**: the player fails to load; the UI shows a short note and keeps controls usable.
- **Page reload**: music doesn't autoplay; the last station and volume are remembered.
- **No stations selected**: Play is disabled until one is chosen.

## Integration Points

- **settings-data**: stations, favorites and volume are part of the export/import.

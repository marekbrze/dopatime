# Domain Glossary

Terms and concepts specific to this project. Used across all project skills to maintain a consistent language. The whole project — code, UI, docs — is English; the interview is in the designer's language.

| Term (original, from interview) | Code Name | Definition | Avoid saying |
|---|---|---|---|
| timer | `Timer` | A single countdown with a duration and an optional name. | clock, stopwatch |
| przyciski czasu (1h, 15 min, 5 min, 1 min) | `DurationButton` | A button that adds a fixed amount of time to the timer being defined. Clicking several buttons adds up. | preset (reserved for templates) |
| timer naprzemienny (np. 25/5, 5/10/15) | `AlternatingTimer` | A timer made of phases that follow one another in a cycle, e.g. 25 min work / 5 min break. | interval timer |
| faza | `Phase` | One segment of an alternating timer, with its own duration. | step, round |
| kolejka timerów | `TimerQueue` | An ordered list of named timers that run one after another. | playlist, list |
| nazwany timer (np. "ogarnięcie zadań") | `QueueItem` | A timer in the queue with a name and a duration. | task |
| auto-start następnego | `autoAdvance` | A toggle: when a timer ends, the next one starts by itself; if off, it waits for a click. | autoplay |
| szablon | `Template` | A saved favorite single timer or set of timers, reusable later. | preset, favorite (as a noun for the saved object) |
| zestaw timerów | `TimerSet` | A saved group of timers (queue) stored as a template. | bundle |
| powiadomienie / alarm końca | `EndAlert` | The combined signal at the end of a timer: sound, browser notification and tab title change. | notification (only one channel) |
| odliczanie w nagłówku karty | `TabTitleCountdown` | The remaining time shown in the browser tab title. | |
| uruchom ponownie | `restart` | The action offered after a timer ends to run the same timer again. | repeat |
| muzyka w tle / stream | `MusicStream` | A background lofi/chillhop stream (e.g. Chillhop, Lofi Girl on YouTube), independent of the timer. | player, playlist |
| turbo focus | `FocusSprint` | A short, intense, fixed-length focus session, e.g. 10 minutes. | work session |
| timer zwykły | `SimpleTimer` | A timer variant with a single duration. | basic timer |
| liczba cykli / bez końca | `cycles` | How many times an alternating timer repeats: a number or infinite. | loops, repeats |
| Clear queue (wyczyść kolejkę) | `clearQueue` | Action that removes all items from the queue. | reset queue |
| eksport / import JSON | `DataExport` / `DataImport` | Downloading or loading a JSON file with settings, templates, queue and stations. | backup, sync |
| ustawienia | `Settings` | Global preferences: alarm sound and volume, repeat-until-dismissed, theme, auto-advance default, notification permission. | config, preferences |
| stacja muzyczna | `MusicStation` | A built-in or user-added YouTube stream with a favorite flag. | channel, radio |
| ulubiona stacja | `favorite` | A flag on a MusicStation marking it as preferred. | pinned |
| pomiń | `skip` | Action that jumps to the next phase or queue item. | next |
| +1 min | `addMinute` | Action that extends a running timer by one minute. | extend |
| stan timera | `TimerStatus` | Timer state: idle, running, paused, finished. | mode |
| moduł | `Module` | A self-contained design area of the app that can be prototyped independently (timer-engine, end-alerts, timer-queue, templates, music, settings-data). | feature, section |

# Dopatime

## Core Idea
A simple, convenient and flexible one-page timer hosted on GitHub Pages. It runs quick focus sprints, alternating timers (Pomodoro-style) and queues of named timers, with optional lofi/chillhop music playing in the background.

## User Problems
- **Existing online timers are poor**: The user searches for an online timer whenever they need a short, intense focus sprint (e.g. 10 minutes of "turbo focus"), and most results are low quality. They lack the things that matter: the countdown in the browser tab title and reliable end-of-timer notifications.
- **Easy to miss the end of a timer**: When working in another tab, it is easy to overlook that time is up. The user does not want to miss it.
- **Setting up a custom duration is clumsy**: Typing numbers into fields is slower than tapping a few buttons.
- **No way to plan a sequence of work blocks**: Chaining several named timers (plan the day, work on a task, check email) usually means manually restarting a timer each time.

## Target Users
A single type of user: a person working at a computer who needs to focus hard for a short, fixed period (typically around 10 minutes, sometimes longer). They keep the timer in a background tab, so it must be visible from the tab title and must get their attention when it ends. They also like background music (lofi/chillhop) while they work.

## Key Actions
1. Start a simple timer — quick duration (e.g. 10 min) built by tapping additive buttons: 1h, 15 min, 5 min, 1 min. Each click adds that amount of time to the timer.
2. Start an alternating timer — phases that repeat in turn, e.g. 25/5 (Pomodoro) or 5/10/15.
3. Build and run a queue of named timers — e.g. "Plan tasks" 10 min, "Work on task 1" 30 min, "Check email" 15 min. Auto-start of the next timer is a toggle; the alternative is waiting for a click.
4. Save and reuse templates — favorite single timers and whole sets (queues) of timers.
5. Play background music — start a lofi/chillhop stream (e.g. Chillhop, Lofi Girl from YouTube) independently of the timer.

## Happy Path
1. The user opens the page.
2. They tap duration buttons (e.g. 5 min + 5 min) to set a 10-minute timer, or pick a saved template.
3. They start the timer. The remaining time is shown in the browser tab title.
4. Optionally, they start a lofi stream as background music (independent of the timer).
5. They work in another tab, seeing the countdown in the tab title.
6. When the timer ends, the user is alerted through every channel at once: a sound, a browser notification and an attention-grabbing tab title.
7. They choose to restart the same timer, or the next timer in the queue starts (automatically or on click, depending on the toggle).

## Open Questions
- Should the app keep a history or statistics of completed sessions? (Not discussed; assumed out of scope for now.)
- Where is the "auto-start next" setting stored: globally, per queue, or per template?
- Which exact music sources? Chillhop and Lofi Girl streams are named; the ability to open "radios on YouTube" in general may be wanted. Needs a decision on embedding vs. opening a link.
- Behavior of alternating timers: do they repeat indefinitely or for a set number of cycles?
- Data persistence for templates: assumed to be in the browser (LocalStorage), as the app is a static GitHub Pages site.

## Open Questions (added by proto-deepen)
- How to embed YouTube streams: iframe player vs. opening a link in a new tab.
- JSON import: does it replace existing data or merge with it?
- Template organization is assumed to be a flat list; folders or tags are out of scope for now.

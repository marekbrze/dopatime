# Dopatime

A simple, flexible one-page timer for focus sprints, with lofi music in the background.

**Live:** https://marekbrze.github.io/dopatime/

## What it does

- **Quick timers**: build a time by tapping `+1h`, `+15m`, `+5m` and `+1m`; each tap adds to the timer.
- **Alternating timers**: Pomodoro-style phases such as 25/5 or 5/10/15, repeated a set number of times or forever.
- **Queue**: line up named timers ("Plan tasks" 10 min, "Deep work" 30 min, "Email" 15 min) and let them auto-start one after another, or wait for you.
- **Templates**: save favorite timers and whole queues and add them back in one click.
- **Never miss the end**: the countdown shows in the browser tab title, and when time is up you get a sound, a browser notification and a flashing title, with an option to repeat the alarm until you dismiss it.
- **Music**: Lofi Girl and Chillhop streams, or any YouTube link, playing independently of the timer.
- **Yours only**: everything is stored in your browser. Export and import a JSON backup from Settings.

## Develop

```bash
npm install
npm run dev          # start the app
npm run storybook    # browse components and their states
npm run lint         # eslint + jsx-a11y
npm run build        # type-check and build
```

Built with React, Vite, TypeScript, Tailwind CSS v4, shadcn/ui (Base UI) and Storybook. Pushing to `main` deploys to GitHub Pages through `.github/workflows/deploy.yml`.

## Project layout

```
src/modules/        one folder per module (timer-engine, end-alerts, timer-queue,
                    templates, music, settings-data)
src/shared/         app shell, shared components and hooks
src/scenarios/      mock data scenarios for development (empty, minimal, full)
docs/               product docs: idea, entities, actions, modules, UI strategy,
                    design direction (DESIGN.md), per-module specs, edge cases, ADRs
```

The design direction lives in [`docs/DESIGN.md`](docs/DESIGN.md): a calm, dark-first interface in a dim aqua-teal, with the countdown as its one large element.

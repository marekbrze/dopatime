# Project Audit

Scope: the whole project, after the full proto pass (detail, lofi, harden, design, polish). Evidence comes from reading the code and from automated behavior checks run in jsdom. **Nothing was checked in a real browser** (no Chromium was available in the build environment), so visual alignment, real keyboard flows, notifications and audio are unverified.

## Scan
- **Stack**: React 19 + Vite 8 + TypeScript, Tailwind CSS **v4** (CSS-first, `@theme inline`), shadcn/ui `base-nova` on `@base-ui/react`, Storybook with the a11y addon, ESLint with jsx-a11y. No router (single page).
- **Package manager**: npm (`package-lock.json`).
- **Tokens**: `src/index.css`. Semantic shadcn tokens in OKLCH: `:root` (light, line 60), `.dark` (line 111), registered in `@theme inline` (line 8). Extra tokens: `--alert`, `--success`, `--brand-300/600`, `--z-pinned`, motion variables. Dark is the default theme.
- **Component inventory**: 7 shadcn primitives in `src/components/ui`, 27 app components and hooks under `src/modules` and `src/shared` (no `.stories`), 10 story files. No duplicated components, except the two near-identical "cycles / repeat forever" controls noted below.
- **Drift from plan**: one behavior drift. `docs/modules/timer-engine.md` says Reset returns to the full duration of the current phase, but the code resets the whole run to its first phase and first cycle, paused (`src/modules/timer-engine/hooks/use-timer-runner.tsx`, `reset`). Everything else in `MODULES.md`, `UI-STRATEGY.md`, `DESIGN.md` and the module specs matches the code.

## Findings

### Typography
No issues found. One family (Geist Variable), weights 400/500/600, a single display utility (`text-countdown`), `tabular-nums` on every changing number.

### Color & surfaces
- 🟢 Hard-coded hex colors and inline styles in `src/shared/components/DevToolbar.tsx:23-58` (`#888` etc.). Dev-only: the component returns `null` in production.
- No gradients, glassmorphism, shadows or side-stripe borders in app code. All 46 text and UI token pairs pass contrast in both themes (computed from `src/index.css`).

### Layout
- 🟡 The header grid `grid-cols-[1fr_auto_1fr]` with four labeled buttons has no narrow-width behavior (`src/shared/components/AppShell.tsx:29`). Desktop-only was a deliberate decision, but narrowing the window or splitting the screen will crush the header.
- 🟡 A template row carries a name, two text buttons and two icon buttons inside a 384px drawer, leaving very little width for the name (`src/modules/templates/components/TemplatesDrawer.tsx:66`).
- No `100vh` (uses `dvh`), a max-width container is in place, spacing is on the scale.

### Interactivity & states
- 🟡 Queue rows are draggable but show no affordance (no handle, no grab cursor, no drop indicator), so the feature is undiscoverable (`src/modules/timer-queue/components/QueueDrawer.tsx:60`). The move up/down buttons are the only visible way to reorder.
- Focus ring, hover, disabled, error and empty states are present. No loading skeletons exist because every operation is synchronous (LocalStorage); nothing to add.

### Content
No issues found. No placeholder names, no round fake numbers, no marketing clichés; copy uses sentence case consistently.

### Components & code quality
- 🟢 `src/shared/hooks/use-local-storage.ts` is unused (all state goes through `use-stored-state.ts`); a leftover from the template.
- 🟢 The "Cycles + Repeat forever" controls are implemented twice, in `src/modules/timer-engine/components/TimerDefinitionEditor.tsx:103` and `src/modules/timer-queue/components/QueueItemEditor.tsx:105`. Worth one shared component if either changes.
- 🟡 Storybook a11y runs in report-only mode (`test: 'todo'` at `.storybook/preview.tsx:20`), so a violation never fails anything.
- 🟢 `z-index: 9999` in `DevToolbar.tsx:35` (dev-only). The app itself uses the sheet's `z-50` and the `--z-pinned` token.

### Strategic omissions
- 🟡 No automated tests are committed. The behavior checks used during hardening (jsdom smoke tests for the timer flow, queue, storage failure, corrupted data) live outside the repository, so regressions in the timer logic would go unnoticed.
- No 404 page is needed: the deploy workflow copies `index.html` to `404.html`. No dead links. Back navigation does not apply (single page).

## Priority list
1. Make accessibility enforceable (a11y addon `test: 'error'`) and commit the core logic and flow checks as real tests. This protects everything else.
2. Fix the crowded template row (move actions into a second line or a menu).
3. Give queue dragging an affordance (a handle and a drop indicator), or remove drag and keep the buttons.
4. Decide what Reset should do and align either the code or `docs/modules/timer-engine.md`.
5. Give the header a narrow-width behavior (collapse the button labels to icons).
6. Remove the unused `use-local-storage.ts` and share the cycles control.

## Hand-off to proto-simplify
Not needed: the project was already designed to a deliberate direction, and there is no visual chaos to strip back. The items above are fix-forward work for `proto-bug` or `proto-feature` plans rather than a simplify pass.

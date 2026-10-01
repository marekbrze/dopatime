# Design Direction

## Register
product

## Scene
Someone alone at a desk in the evening, a single warm lamp on and the room otherwise dim, a chillhop stream low in the background, working through a hard 10-minute sprint on one task. They glance at the timer from the corner of their eye and need to read it instantly without the screen pulling their attention or lighting up the room.

That scene forces a **dark default**: low ambient light, long glances, no glare. A light theme still exists for daytime use (Settings > Appearance), but dark is the designed-first surface.

## Personality
**Calm, steady, tactile.** Think of a ceramic kitchen timer or the amber display of a hi-fi deck: a quiet object that does one thing and keeps its composure. Numbers are the hero; everything else stays out of their way.

## References
- **Linear**: restraint. One accent used sparingly, tinted neutrals, and no decoration that isn't carrying state.
- **Teenage Engineering OP-1 / EP-133 displays**: a single glowing readout against a quiet body, with numerals treated as the product's face.
- **Raycast**: dark surfaces built from stepped lightness instead of shadows, and a fast, dense, keyboard-first feel.
- **Apple Clock (timer)**: a huge, unambiguous countdown with few controls and immediate state changes.

## Anti-references
- **Pomodoro apps with tomato clip-art and cheerful mascots**: novelty ornament on a tool the user needs to disappear.
- **Synthwave / "lofi girl" purple-pink gradient aesthetics**: the obvious skin for a lofi app, and exactly the second-order reflex to avoid. The music is a feature, not the visual theme.
- **Glass dashboards with blurred panels and glowing gradient text**: decoration that lowers contrast in a dim room.
- **Productivity apps full of confetti and streak badges**: celebration chrome the user didn't ask for.

## Color
**Strategy**: Restrained. Tinted neutrals plus one accent used at ≤10% of the surface (progress, primary action, focus, running state). A separate amber is reserved for the single "time's up" signal.
**Seed hue**: `oklch(0.80 0.105 190)`: a dim aqua-teal, like the phosphor of an old oscilloscope or a VU meter. It's cool, not blue (hue ~250) and not warm orange (~60), and it sits well against a dim room without feeling neon.

All values are OKLCH, inside the sRGB gamut. Contrast ratios were computed, not eyeballed.

### Dark (default)

| Role | Token | Value | Notes |
|------|-------|-------|-------|
| Canvas | `--canvas` | `oklch(0.17 0.012 190)` | page background |
| Surface 1 | `--surface-1` | `oklch(0.21 0.014 190)` | header, cards, drawer |
| Surface 2 | `--surface-2` | `oklch(0.25 0.016 190)` | raised: inputs, hovered rows |
| Border | `--line` | `oklch(0.32 0.016 190)` | hairlines |
| Ink | `--ink` | `oklch(0.95 0.008 190)` | body text, 16.5:1 on canvas |
| Muted ink | `--ink-muted` | `oklch(0.74 0.02 190)` | secondary text, 7.0:1 on surface 2 |
| Primary/500 | `--brand-500` | `oklch(0.80 0.105 190)` | seed; 10.7:1 on canvas |
| Primary/600 | `--brand-600` | `oklch(0.74 0.10 190)` | hover/pressed |
| Primary/300 | `--brand-300` | `oklch(0.88 0.07 190)` | subtle highlights |
| On primary | `--on-brand` | `oklch(0.18 0.03 190)` | text on primary, 10.4:1 |
| Alert (time's up) | `--alert` | `oklch(0.82 0.14 80)` | the one warm signal, 10.8:1 |
| Success | `--success` | `oklch(0.78 0.13 150)` | 10.0:1 |
| Error | `--error` | `oklch(0.72 0.16 25)` | 7.2:1 on canvas |

### Light

| Role | Token | Value | Notes |
|------|-------|-------|-------|
| Canvas | `--canvas` | `oklch(0.985 0.004 190)` | |
| Surface 1 | `--surface-1` | `oklch(0.965 0.006 190)` | |
| Surface 2 | `--surface-2` | `oklch(0.94 0.008 190)` | |
| Border | `--line` | `oklch(0.88 0.01 190)` | |
| Ink | `--ink` | `oklch(0.22 0.02 190)` | 16.5:1 |
| Muted ink | `--ink-muted` | `oklch(0.46 0.02 190)` | 5.9:1 on surface 2 |
| Primary/500 | `--brand-500` | `oklch(0.48 0.08 190)` | 6.0:1 on canvas, white text 6.0:1 |
| Primary/600 | `--brand-600` | `oklch(0.42 0.075 190)` | hover/pressed |
| On primary | `--on-brand` | `oklch(0.985 0.004 190)` | |
| Alert | `--alert` | `oklch(0.50 0.09 75)` | 5.8:1 |
| Success | `--success` | `oklch(0.48 0.12 150)` | 5.9:1 |
| Error | `--error` | `oklch(0.52 0.19 25)` | 5.8:1 |

**Neutrals**: tinted with chroma 0.004–0.02 toward hue 190 (the brand's own teal), not the default warm/cream pair. Pure gray is not used anywhere.
**Dark mode depth**: three surface steps at 17 / 21 / 25 % lightness with the same hue. Higher elevation is lighter; no drop shadows. Accents are slightly desaturated compared to the light theme, and body weight is one step lighter (400, never 500).
**Token layers**: primitives (`--brand-500`, neutrals) are constant; semantic tokens (`--primary`, `--background`, `--muted-foreground`, …) are the only thing the `.dark` class overrides.
**Radius**: single value `--radius: 0.5rem`; the shadcn scale (sm/md/lg/xl) is computed from it. The timer chips and the Start button use the same radius family, not pills for everything.
**Focus ring**: 2px `--brand-500` ring with a 2px offset, visible on every interactive element in both themes.

## Typography
**Direction**: one well-tuned sans carries the whole UI, and the countdown is the single large display element.
**Family**: **Geist Variable** (already installed in the project, so there is no extra network request on GitHub Pages). It fits the three words: calm (even, low-contrast strokes), steady (a regular rhythm with real tabular numerals) and tactile (open apertures that stay legible at a glance). It rejects the reflex defaults (Inter, DM Sans, system-ui as a personality) and it is not a monospace used as lazy "technical" shorthand.
**Scale** (fixed rem, ratio 1.2): 0.75 · 0.875 · 1 · 1.2 · 1.44 · 1.728 · 2.074. The countdown is the only exception: `clamp(4.5rem, 12vw, 7.5rem)`, weight 500, `font-variant-numeric: tabular-nums`, slightly tight tracking (`-0.02em`).
**Weights**: 400 body, 500 labels and numerals, 600 headings. Maximum of three.
**Loading**: `font-display: swap`; the Geist variable file is bundled by Vite (already imported in `index.css`), and the system sans stack is the fallback.
**Details**: `tabular-nums` on every number that changes (countdown, mini timer, totals); prose is not used in the UI, so no measure rule is needed; line-height 1.5 for body, 1 for the countdown.

## Motion
Product register: 150–250 ms, state changes only. Allowed: drawer slide, button press, progress bar movement, focus ring. No page-load choreography and no signature moments.
The finished state gets one deliberate cue beyond color: the "Time's up" text and the mini timer pulse at most three times (opacity, not scale), then stay still. Everything respects `prefers-reduced-motion` (the pulse becomes a static alert color).

## Guardrails
**Absolute bans**:
- Side-stripe borders (`border-left/right` > 1px as a colored accent). Use hairline borders, background tints or leading glyphs.
- Gradient text. Single solid color; emphasize with weight or size.
- Glassmorphism. No blurred translucent panels.
- The hero-metric template, identical card grids, tiny uppercase tracked eyebrows over sections, `01/02/03` scaffolding.
- Text that overflows its container at any width (long timer names truncate with a tooltip).

**Product bans**:
- Decorative motion that isn't state.
- Inconsistent component vocabulary: all drawers look and behave alike, all lists use the same row anatomy, all destructive confirmations use the same dialog.
- Display fonts in labels, buttons or data.
- Reinvented standard controls (custom scrollbars, bespoke form widgets); use the shadcn/Base UI controls already in place.
- Heavy accent on inactive states: the accent appears only on the running timer, the primary action and the focus ring.
- Modal as a first thought: confirmations only for destructive actions; everything else stays inline.
- Purple/pink "lofi" styling and any music-themed illustration.

**Contrast floor**: body ≥ 4.5:1, large text and UI components ≥ 3:1, placeholders ≥ 4.5:1 (use `--ink-muted`, never a lighter gray). Verified for every pair in the tables above.

## Hand-off to proto-design
Token layer: Tailwind v4 with shadcn custom properties in `src/index.css` (`:root` and `.dark`). The highest-leverage first step is replacing the neutral shadcn palette there with the tables above, mapping `--canvas` → `--background`, `--surface-1` → `--card`/`--popover`, `--surface-2` → `--secondary`/`--accent`/`--muted`, `--ink` → `--foreground`, `--ink-muted` → `--muted-foreground`, `--brand-500` → `--primary`/`--ring`, `--on-brand` → `--primary-foreground`, `--error` → `--destructive`, and adding `--alert` and `--success` as new tokens.

Dark becomes the default theme (Settings > Theme "System" still follows the OS, but a first visit without a preference should render dark).

Per-module order: shell and stage first (`timer-engine`, then the header and drawers), then `end-alerts` finished state, `timer-queue`, `templates`, `music`, `settings-data`.

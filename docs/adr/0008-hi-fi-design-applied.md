# 0008 - Hi-fi design applied to all modules

**Date**: 2026-10-01
**Module**: all
**Status**: Accepted

## Context
The modules were neutral lo-fi. docs/DESIGN.md defined the visual direction (product register, Restrained, seed hue 190).

## Decision
Applied the OKLCH token layer in src/index.css (Tailwind v4 + shadcn base-nova semantic tokens, light in :root and dark in .dark), with dark as the default theme (index.html class and the Settings default). Added alert and success tokens plus a brand-300/600 scale. Typography stays on Geist Variable with a single display utility, text-countdown, for the timer numerals (tabular figures, weight 500). Removed the blurred overlay backdrops (glassmorphism ban), added a brand focus ring that beats the components' own outline-none, form-control borders at 3:1, a three-pulse "Time's up" cue, and a global reduced-motion fallback. Hardcoded emerald/amber colors and monospace were replaced by tokens and Geist.

## Impact
Every shadcn component restyles through the tokens. proto-polish is the final pass.

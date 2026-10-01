# 0009 - Polish pass on all modules

**Date**: 2026-10-01
**Module**: all
**Status**: Accepted

## Context
The modules were designed (proto-design) and functionally complete (proto-harden). A pre-ship pass was needed.

## Decision
Aligned to the design system and resolved drift by root cause. One-off implementation: the drawer section heading existed only in Settings, so it became the shared DrawerSection used by Settings and Music. Missing token: the mini timer needed to stay above the drawer scrim, so a --z-pinned layer token was added. Leftovers from the template were removed (placeholder component, no-op prop, "P" favicon, template README, generic page description). Contrast was computed for all 46 text and UI token pairs in both themes from the real index.css, with no failures (text 4.5:1, controls and focus ring 3:1). Quality bar: MVP+, with details that could not be verified without a browser deferred (below).

## Impact
Behavior is unchanged. Deferred: visual review in a real browser (screenshots, spacing and alignment at zoom), Storybook a11y panel runs, and a real-device check of notifications and audio, because the build environment had no browser.

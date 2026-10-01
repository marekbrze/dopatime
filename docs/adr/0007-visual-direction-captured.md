# 0007 - Visual direction captured

**Date**: 2026-10-01
**Status**: Accepted

## Context
The prototype was a neutral lo-fi (shadcn defaults). A visual direction was needed before hi-fi implementation.

## Decision
Captured register, scene, color strategy with an OKLCH palette, typography and motion in docs/DESIGN.md. Register: product. Strategy: Restrained, dark by default (a dim-room evening scene). Seed hue: oklch(0.80 0.105 190), a dim aqua-teal. Type: Geist Variable, with the countdown as the only large display element. Because the designer wasn't interviewed in this pass (the session goal was to proceed through all proto steps), the choices were derived from the product docs and are easy to revisit by re-running proto-brand.

## Impact
proto-design implements this per module. proto-polish is the final pass.

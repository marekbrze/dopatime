# 0003 - YouTube streams via a hidden iframe

**Date**: 2026-10-01
**Module**: music
**Status**: Accepted

## Context
Open question from proto-init: embed YouTube streams or just link out.

## Decision
Embed through a persistent, visually hidden YouTube iframe controlled with the iframe API messages (play, pause, volume). It stays mounted outside the drawer so music keeps playing when the drawer closes. An "Open on YouTube" link is the fallback when embedding fails.

## Impact
No audio assets or API keys are needed. Playback starts only after a user click (autoplay policy).

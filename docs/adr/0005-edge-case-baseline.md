# 0005 - Edge-case baseline for all modules

**Date**: 2026-10-01
**Module**: all
**Status**: Accepted

## Context
All six modules had working happy paths but had not been stress-tested.

## Decision
Audited into docs/modules/*-edgecases.md (one file per module plus app-shell-edgecases.md): 29 gaps (3 high, 17 medium, 9 low). Top priorities: a queue item re-queued by "Done", silent storage write failures, no error boundary, silently replacing a running timer, player errors.

## Impact
proto-harden implements the priority lists. Re-run proto-edgecases after the prototype changes to get a fresh baseline.

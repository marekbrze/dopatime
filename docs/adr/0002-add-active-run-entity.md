# 0002 - Add ActiveRun entity

**Date**: 2026-10-01
**Module**: timer-engine
**Status**: Accepted

## Context
While detailing timer-engine, the engine needs a single owner of the running state (current phase, cycle, end timestamp) shared by the stage, the mini timer, end-alerts and the queue.

## Decision
Added the ActiveRun entity to ENTITY_MAP.md and a glossary row. Added actions Add phase, Set cycles and Done to ACTIONS.md.

## Impact
One run at a time; it is persisted so reloads keep the countdown. Queue and alerts react to it instead of owning timers themselves.

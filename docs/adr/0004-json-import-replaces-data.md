# 0004 - JSON import replaces data

**Date**: 2026-10-01
**Module**: settings-data
**Status**: Accepted

## Context
Open question from proto-deepen: does import replace or merge existing data.

## Decision
Import replaces all stored data after an explicit confirmation. Merging has too many ambiguous cases (duplicate templates, queue order) for a prototype; users can export first as a backup.

## Impact
Simple and predictable. Missing sections in the file fall back to defaults.

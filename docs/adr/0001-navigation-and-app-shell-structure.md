# 0001 - Navigation and app shell structure

**Date**: 2026-10-01
**Module**: app-shell
**Status**: Accepted

## Context
Need to define how users reach the six modules and what the overall app frame looks like. Dopatime is a desktop-only, single-page timer, and the timer must stay visible while the user works.

## Decision
Desktop only, single page with no routing. The large timer sits centered on the stage. Queue, Templates, Music and Settings open as right-side drawers from header buttons. A compact mini timer in the header keeps the countdown visible while a drawer is open. Content is contained (max width ~768px), with no breadcrumbs, footer or notifications area.

## Impact
All proto-lofi modules render inside this shell: `timer-engine` on the stage and the mini timer slot, the other modules as drawer content. React Router was not installed, because there are no routes.

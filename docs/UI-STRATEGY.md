# UI Strategy

## Platform
Desktop only.

## Navigation
- Type: none between pages. Dopatime is a single page with no routing.
- Panels: the secondary modules open as right-side drawers (a sheet over the content) from header buttons. Esc or a click outside closes the drawer.
- Mobile: not supported.

## Home page
The page itself is the app: a large timer centered on the stage (`timer-engine`, with `end-alerts` working in the background through the tab title and alarm). There is no separate landing screen.

## Module navigation
| Module (code) | Label (display) | Order |
|---|---|---|
| timer-engine | (none, main stage) | n/a |
| end-alerts | (none, runs in the background) | n/a |
| timer-queue | Queue | 1 |
| templates | Templates | 2 |
| music | Music | 3 |
| settings-data | Settings | 4 |

## Content layout
- Container: contained, centered, max width ~768px.
- Breadcrumbs: no

## Shared elements
- Header: yes. App name on the left, a compact mini timer in the center (keeps the countdown visible while a drawer is open), drawer buttons (Queue, Templates, Music, Settings) on the right.
- Footer: no
- Notifications: no. End-of-timer alerts are handled by `end-alerts` (sound, browser notification, tab title).

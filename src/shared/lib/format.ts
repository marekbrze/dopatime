export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
/** Longest duration a timer can be built to: 99:59:59. */
export const MAX_DURATION_MS = 99 * HOUR + 59 * MINUTE + 59 * SECOND;

/** 65000 -> "01:05", 3_725_000 -> "1:02:05" */
export function formatClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / SECOND));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** 5_400_000 -> "1 h 30 min", 600_000 -> "10 min", 45_000 -> "45 s" */
export function formatHuman(ms: number): string {
  const total = Math.round(ms / SECOND);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const parts: string[] = [];
  if (h) parts.push(`${h} h`);
  if (m) parts.push(`${m} min`);
  if (s && !h) parts.push(`${s} s`);
  return parts.join(' ') || '0 min';
}

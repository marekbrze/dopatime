import { useTimerRunner, useRemainingMs } from '../hooks/use-timer-runner';
import { formatClock } from '@/shared/lib/format';

/** Compact countdown for the header, so the run stays visible while a drawer is open. */
export function MiniTimer() {
  const { run } = useTimerRunner();
  const remaining = useRemainingMs();
  if (!run) return null;

  const label = run.status === 'finished' ? "Time's up" : formatClock(remaining);
  const icon = run.status === 'running' ? '⏳' : run.status === 'paused' ? '⏸' : '🔔';
  return (
    <p className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm tabular-nums">
      <span aria-hidden="true">{icon}</span>
      <span className="font-mono font-medium">{label}</span>
      {run.name && <span className="max-w-32 truncate text-muted-foreground">{run.name}</span>}
    </p>
  );
}

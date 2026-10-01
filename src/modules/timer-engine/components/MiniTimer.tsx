import { useTimerRunner, useRemainingMs } from '../hooks/use-timer-runner';
import { formatClock } from '@/shared/lib/format';

/** Compact countdown for the header, so the run stays visible while a drawer is open. */
export function MiniTimer() {
  const { run } = useTimerRunner();
  const remaining = useRemainingMs();
  if (!run) return null;

  const label = run.status === 'finished' ? "Time's up" : formatClock(remaining);
  const icon = run.status === 'running' ? '▶' : run.status === 'paused' ? '❚❚' : '●';
  const tone = run.status === 'running' ? 'text-primary' : run.status === 'paused' ? 'text-muted-foreground' : 'animate-alert text-alert';
  return (
    <p className="flex items-center gap-2 rounded-lg border bg-card px-3 py-1 text-sm tabular-nums">
      <span aria-hidden="true" className={`text-xs ${tone}`}>
        {icon}
      </span>
      <span className="font-medium">{label}</span>
      {run.name && <span className="max-w-32 truncate text-muted-foreground">{run.name}</span>}
    </p>
  );
}

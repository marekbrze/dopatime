import { useRemainingMs, useTimerRunner } from '../hooks/use-timer-runner';
import { formatClock } from '@/shared/lib/format';
import { cn } from '@/lib/utils';

export function CountdownDisplay({ className }: { className?: string }) {
  const remaining = useRemainingMs();
  const { run } = useTimerRunner();
  return (
    <p
      role="timer"
      aria-live="off"
      className={cn('text-countdown transition-colors duration-200', run?.status === 'paused' && 'text-muted-foreground', className)}
    >
      {formatClock(remaining)}
    </p>
  );
}

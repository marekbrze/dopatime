import { useRemainingMs } from '../hooks/use-timer-runner';
import { formatClock } from '@/shared/lib/format';
import { cn } from '@/lib/utils';

export function CountdownDisplay({ className }: { className?: string }) {
  const remaining = useRemainingMs();
  return (
    <p role="timer" aria-live="off" className={cn('font-mono text-7xl font-semibold tabular-nums sm:text-8xl', className)}>
      {formatClock(remaining)}
    </p>
  );
}

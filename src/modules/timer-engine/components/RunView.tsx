import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useEndAlerts } from '@/modules/end-alerts/hooks/use-end-alerts';
import { useQueue } from '@/modules/timer-queue/hooks/use-queue';
import { useArmed } from '../hooks/use-armed';
import { useTimerRunner, useRemainingMs } from '../hooks/use-timer-runner';
import { currentPhaseMs, cycleCount, phaseDurations } from '../lib/timer';
import { CountdownDisplay } from './CountdownDisplay';

function Progress({ phaseMs }: { phaseMs: number }) {
  const remaining = useRemainingMs();
  const pct = phaseMs > 0 ? Math.min(100, Math.max(0, ((phaseMs - remaining) / phaseMs) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-label="Phase progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      className="h-2 w-full max-w-md overflow-hidden rounded-full bg-muted"
    >
      <div className="h-full bg-primary transition-[width] duration-200 ease-out" style={{ width: `${pct}%` }} />
    </div>
  );
}

/** The stage while a run is active: countdown plus run controls. */
export function RunView() {
  const runner = useTimerRunner();
  const queue = useQueue();
  const alerts = useEndAlerts();
  const { run } = runner;
  const primary = useRef<HTMLButtonElement>(null);
  const armed = useArmed(run?.status);

  // Keep keyboard focus on the main control as the stage swaps buttons.
  useEffect(() => {
    primary.current?.focus();
  }, [run?.status]);

  if (!run) return null;

  const phases = phaseDurations(run.def).length;
  const cycles = cycleCount(run.def);
  const alternating = run.def.kind === 'alternating';
  const finished = run.status === 'finished';
  const nextItem = run.source === 'queue' ? queue.nextItem : null;

  return (
    <section aria-label="Running timer" className="flex w-full flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="max-w-md truncate text-xl font-medium" title={run.name || undefined}>
          {run.name || 'Timer'}
        </h2>
        {alternating && !finished && (
          <p className="text-sm text-muted-foreground">
            Phase {run.phaseIndex + 1} of {phases} · Cycle {run.cycleIndex + 1}
            {cycles !== null && ` of ${cycles}`}
          </p>
        )}
      </div>

      {finished ? (
        <p className="animate-alert text-5xl font-medium tracking-tight text-alert sm:text-6xl">Time's up</p>
      ) : (
        <>
          <CountdownDisplay />
          <Progress phaseMs={currentPhaseMs(run)} />
        </>
      )}

      <p className="sr-only" role="status">
        {finished ? `${run.name || 'Timer'} finished.` : run.status === 'paused' ? 'Timer paused.' : 'Timer running.'}
      </p>

      {finished ? (
        <div className="flex flex-wrap justify-center gap-2">
          {alerts.alerting && (
            <Button variant="outline" onClick={alerts.dismiss}>
              Silence alarm
            </Button>
          )}
          {nextItem && (
            <Button ref={primary} size="lg" onClick={queue.startNext}>
              Start next: {nextItem.name}
            </Button>
          )}
          <Button ref={nextItem ? undefined : primary} size="lg" variant={nextItem ? 'outline' : 'default'} onClick={runner.restart}>
            Restart
          </Button>
          <Button size="lg" variant="outline" onClick={runner.stop}>
            Done
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-2">
          {run.status === 'running' ? (
            <Button ref={primary} size="lg" disabled={!armed} onClick={runner.pause}>
              Pause
            </Button>
          ) : (
            <Button ref={primary} size="lg" disabled={!armed} onClick={runner.resume}>
              Resume
            </Button>
          )}
          <Button size="lg" variant="outline" onClick={runner.addMinute}>
            +1 min
          </Button>
          <Button size="lg" variant="outline" onClick={runner.skip}>
            Skip
          </Button>
          <Button size="lg" variant="outline" onClick={runner.reset}>
            Reset
          </Button>
          <Button size="lg" variant="ghost" onClick={runner.stop}>
            Stop
          </Button>
        </div>
      )}
    </section>
  );
}

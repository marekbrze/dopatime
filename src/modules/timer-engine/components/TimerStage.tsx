import { useEffect, useRef } from 'react';
import { useTimerRunner } from '../hooks/use-timer-runner';
import { RunView } from './RunView';
import { TimerBuilder } from './TimerBuilder';

/** The main stage: the builder when idle, the run view otherwise. */
export function TimerStage() {
  const { run } = useTimerRunner();
  const container = useRef<HTMLDivElement>(null);
  const hadRun = useRef(run !== null);

  // When a run ends, send keyboard focus to the Start button instead of losing it.
  useEffect(() => {
    if (hadRun.current && run === null) {
      container.current?.querySelector<HTMLButtonElement>('[data-start]')?.focus();
    }
    hadRun.current = run !== null;
  }, [run]);

  return <div ref={container} className="w-full">{run ? <RunView /> : <TimerBuilder />}</div>;
}

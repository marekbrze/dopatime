import { useTimerRunner } from '../hooks/use-timer-runner';
import { RunView } from './RunView';
import { TimerBuilder } from './TimerBuilder';

/** The main stage: the builder when idle, the run view otherwise. */
export function TimerStage() {
  const { run } = useTimerRunner();
  return run ? <RunView /> : <TimerBuilder />;
}

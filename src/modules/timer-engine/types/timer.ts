export interface Phase {
  id: string;
  durationMs: number;
}

export type TimerDef =
  | { kind: 'simple'; durationMs: number }
  /** `cycles: null` means the phases repeat until the user stops the run. */
  | { kind: 'alternating'; phases: Phase[]; cycles: number | null };

export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

export type RunSource = 'adhoc' | 'queue';

export interface ActiveRun {
  def: TimerDef;
  name: string;
  status: Exclude<TimerStatus, 'idle'>;
  phaseIndex: number;
  cycleIndex: number;
  /** Epoch ms when the current phase ends; only meaningful while running. */
  endsAt: number;
  /** Time left in the current phase; only meaningful while paused. */
  remainingMs: number;
  source: RunSource;
  queueItemId: string | null;
}

export type RunEventType = 'started' | 'phase-end' | 'finished' | 'stopped';

export interface RunEvent {
  seq: number;
  type: RunEventType;
  /** Snapshot of the run at the time of the event (the run that was stopped, for 'stopped'). */
  run: ActiveRun | null;
  /** True when the user caused it (skip), so no alarm should sound. */
  silent: boolean;
}

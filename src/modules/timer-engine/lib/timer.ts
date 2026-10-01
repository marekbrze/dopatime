import { formatHuman, MAX_DURATION_MS, MINUTE } from '@/shared/lib/format';
import type { ActiveRun, TimerDef } from '../types/timer';

export function phaseDurations(def: TimerDef): number[] {
  return def.kind === 'simple' ? [def.durationMs] : def.phases.map((p) => p.durationMs);
}

export function cycleCount(def: TimerDef): number | null {
  return def.kind === 'simple' ? 1 : def.cycles;
}

/** Total length in ms, or null when the timer never finishes by itself. */
export function totalDuration(def: TimerDef): number | null {
  const cycles = cycleCount(def);
  if (cycles === null) return null;
  return phaseDurations(def).reduce((sum, d) => sum + d, 0) * cycles;
}

export function isValidDef(def: TimerDef): boolean {
  const durations = phaseDurations(def);
  return durations.length > 0 && durations.every((d) => d > 0);
}

function minutesLabel(ms: number): string {
  return ms % MINUTE === 0 ? String(ms / MINUTE) : formatHuman(ms);
}

/** "10 min", "25/5 × 4", "25/5 × ∞" */
export function describeTimer(def: TimerDef): string {
  if (def.kind === 'simple') return formatHuman(def.durationMs);
  return `${def.phases.map((p) => minutesLabel(p.durationMs)).join('/')} × ${def.cycles ?? '∞'}`;
}

export function clampDuration(ms: number): number {
  return Math.min(Math.max(0, ms), MAX_DURATION_MS);
}

/** Position after the current phase, or null when the timer is done. */
export function nextPosition(
  def: TimerDef,
  phaseIndex: number,
  cycleIndex: number,
): { phaseIndex: number; cycleIndex: number } | null {
  const count = phaseDurations(def).length;
  if (phaseIndex + 1 < count) return { phaseIndex: phaseIndex + 1, cycleIndex };
  const cycles = cycleCount(def);
  if (cycles === null || cycleIndex + 1 < cycles) return { phaseIndex: 0, cycleIndex: cycleIndex + 1 };
  return null;
}

export function currentPhaseMs(run: ActiveRun): number {
  return phaseDurations(run.def)[run.phaseIndex] ?? 0;
}

/**
 * Moves a running run forward to `now`, crossing every phase boundary that has passed.
 * Returns the new run and whether a phase ended or the whole timer finished.
 */
export function advanceRun(
  run: ActiveRun,
  now: number,
): { run: ActiveRun; event: 'none' | 'phase-end' | 'finished' } {
  if (run.status !== 'running' || run.endsAt > now) return { run, event: 'none' };
  let { phaseIndex, cycleIndex, endsAt } = run;
  let crossed = false;
  // Catch up after a long suspension of the page (e.g. a sleeping laptop).
  for (let guard = 0; endsAt <= now && guard < 10000; guard++) {
    const next = nextPosition(run.def, phaseIndex, cycleIndex);
    if (!next) {
      return {
        run: { ...run, status: 'finished', phaseIndex, cycleIndex, endsAt, remainingMs: 0 },
        event: 'finished',
      };
    }
    phaseIndex = next.phaseIndex;
    cycleIndex = next.cycleIndex;
    endsAt += phaseDurations(run.def)[phaseIndex];
    crossed = true;
  }
  return { run: { ...run, phaseIndex, cycleIndex, endsAt }, event: crossed ? 'phase-end' : 'none' };
}

export function remainingFor(run: ActiveRun | null, now: number): number {
  if (!run) return 0;
  if (run.status === 'running') return Math.max(0, run.endsAt - now);
  if (run.status === 'paused') return run.remainingMs;
  return 0;
}

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

export function parseTimerDef(raw: unknown): TimerDef | null {
  const d = raw as Partial<TimerDef> | null;
  if (!d || typeof d !== 'object') return null;
  if (d.kind === 'simple' && isNum(d.durationMs)) {
    const def: TimerDef = { kind: 'simple', durationMs: clampDuration(d.durationMs) };
    return isValidDef(def) ? def : null;
  }
  if (d.kind === 'alternating' && Array.isArray(d.phases) && (d.cycles === null || isNum(d.cycles))) {
    const phases = d.phases
      .filter((p) => p && typeof p.id === 'string' && isNum(p.durationMs))
      .map((p) => ({ id: p.id, durationMs: clampDuration(p.durationMs) }));
    const def: TimerDef = { kind: 'alternating', phases, cycles: d.cycles === null ? null : Math.max(1, Math.floor(d.cycles)) };
    return isValidDef(def) ? def : null;
  }
  return null;
}

/** Validates a stored run; anything unexpected resets to idle instead of crashing the stage. */
export function parseActiveRun(raw: unknown): ActiveRun | null {
  const r = raw as Partial<ActiveRun> | null;
  if (!r || typeof r !== 'object') return null;
  const def = parseTimerDef(r.def);
  const status = r.status;
  if (!def || (status !== 'running' && status !== 'paused' && status !== 'finished')) return null;
  const count = phaseDurations(def).length;
  if (!isNum(r.phaseIndex) || r.phaseIndex < 0 || r.phaseIndex >= count) return null;
  if (!isNum(r.cycleIndex) || r.cycleIndex < 0 || !isNum(r.endsAt) || !isNum(r.remainingMs)) return null;
  return {
    def,
    name: typeof r.name === 'string' ? r.name : '',
    status,
    phaseIndex: r.phaseIndex,
    cycleIndex: r.cycleIndex,
    endsAt: r.endsAt,
    remainingMs: r.remainingMs,
    source: r.source === 'queue' ? 'queue' : 'adhoc',
    queueItemId: typeof r.queueItemId === 'string' ? r.queueItemId : null,
  };
}

import { useCallback, useMemo } from 'react';
import { useStoredState } from '@/shared/hooks/use-stored-state';
import { generateId } from '@/shared/types';
import { clampDuration, isValidDef } from '../lib/timer';
import type { Phase, TimerDef } from '../types/timer';

export type BuilderMode = 'simple' | 'alternating';

interface BuilderState {
  mode: BuilderMode;
  /** Duration being built with the DurationButtons. */
  durationMs: number;
  phases: Phase[];
  /** null = infinite */
  cycles: number | null;
  name: string;
}

const INITIAL: BuilderState = { mode: 'simple', durationMs: 0, phases: [], cycles: 4, name: '' };

export const MAX_CYCLES = 99;

/** The timer being defined on the stage. Persisted, so it survives a reload. */
export function useBuilder(storageName = 'builder') {
  const [state, setState] = useStoredState<BuilderState>(storageName, INITIAL, (raw) => ({
    ...INITIAL,
    ...(raw as Partial<BuilderState>),
  }));

  const def = useMemo<TimerDef>(
    () =>
      state.mode === 'simple'
        ? { kind: 'simple', durationMs: state.durationMs }
        : { kind: 'alternating', phases: state.phases, cycles: state.cycles },
    [state],
  );

  const setMode = useCallback((mode: BuilderMode) => setState((s) => ({ ...s, mode })), [setState]);
  const setName = useCallback((name: string) => setState((s) => ({ ...s, name })), [setState]);
  const addTime = useCallback(
    (ms: number) => setState((s) => ({ ...s, durationMs: clampDuration(s.durationMs + ms) })),
    [setState],
  );
  const clearTime = useCallback(() => setState((s) => ({ ...s, durationMs: 0 })), [setState]);
  const addPhase = useCallback(
    () =>
      setState((s) =>
        s.durationMs > 0
          ? { ...s, phases: [...s.phases, { id: generateId(), durationMs: s.durationMs }], durationMs: 0 }
          : s,
      ),
    [setState],
  );
  const removePhase = useCallback(
    (id: string) => setState((s) => ({ ...s, phases: s.phases.filter((p) => p.id !== id) })),
    [setState],
  );
  const setCycles = useCallback(
    (cycles: number | null) =>
      setState((s) => ({ ...s, cycles: cycles === null ? null : Math.min(MAX_CYCLES, Math.max(1, cycles)) })),
    [setState],
  );
  const reset = useCallback(() => setState((s) => ({ ...INITIAL, mode: s.mode })), [setState]);

  return {
    ...state,
    def,
    isValid: isValidDef(def),
    setMode,
    setName,
    addTime,
    clearTime,
    addPhase,
    removePhase,
    setCycles,
    reset,
  };
}

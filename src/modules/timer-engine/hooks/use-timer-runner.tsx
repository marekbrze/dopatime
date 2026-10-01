import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useStoredState } from '@/shared/hooks/use-stored-state';
import { useTicker } from '@/shared/hooks/use-ticker';
import { MINUTE } from '@/shared/lib/format';
import { advanceRun, isValidDef, nextPosition, parseActiveRun, phaseDurations, remainingFor } from '../lib/timer';
import type { ActiveRun, RunEvent, RunEventType, RunSource, TimerDef } from '../types/timer';

interface RunnerApi {
  /** The current run, or null when idle. */
  run: ActiveRun | null;
  /** The latest thing that happened to the run; `seq` changes on every event. */
  event: RunEvent;
  start: (def: TimerDef, name: string, source?: RunSource, queueItemId?: string | null) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skip: () => void;
  addMinute: () => void;
  stop: () => void;
  restart: () => void;
}

const RunnerContext = createContext<RunnerApi | null>(null);
const NowContext = createContext<number>(0);

const NO_EVENT: RunEvent = { seq: 0, type: 'stopped', run: null, silent: true };

export function TimerRunnerProvider({ children }: { children: ReactNode }) {
  const [run, setRun] = useStoredState<ActiveRun | null>('active-run', null, parseActiveRun);
  const [event, setEvent] = useState<RunEvent>(NO_EVENT);
  const [now, setNow] = useState(() => Date.now());
  const runRef = useRef(run);

  const commit = useCallback(
    (next: ActiveRun | null, type?: RunEventType, opts?: { silent?: boolean; eventRun?: ActiveRun | null }) => {
      runRef.current = next;
      setRun(next);
      if (type) {
        setEvent((e) => ({
          seq: e.seq + 1,
          type,
          run: opts?.eventRun !== undefined ? opts.eventRun : next,
          silent: opts?.silent ?? false,
        }));
      }
    },
    [setRun],
  );

  const sync = useCallback(() => {
    const t = Date.now();
    setNow(t);
    const cur = runRef.current;
    if (cur?.status !== 'running') return;
    const { run: next, event: ev } = advanceRun(cur, t);
    if (ev !== 'none') commit(next, ev);
  }, [commit]);

  useTicker(sync, 250, run?.status === 'running');

  // Resolve a run that ended while the page was closed or the tab was frozen.
  useEffect(() => {
    sync();
    const onVisible = () => document.visibilityState === 'visible' && sync();
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [sync]);

  const api = useMemo<RunnerApi>(() => {
    const start: RunnerApi['start'] = (def, name, source = 'adhoc', queueItemId = null) => {
      if (!isValidDef(def)) return;
      const t = Date.now();
      setNow(t);
      commit(
        {
          def,
          name,
          status: 'running',
          phaseIndex: 0,
          cycleIndex: 0,
          endsAt: t + phaseDurations(def)[0],
          remainingMs: 0,
          source,
          queueItemId,
        },
        'started',
      );
    };
    return {
      run,
      event,
      start,
      pause: () => {
        const cur = runRef.current;
        if (cur?.status !== 'running') return;
        commit({ ...cur, status: 'paused', remainingMs: Math.max(0, cur.endsAt - Date.now()) });
      },
      resume: () => {
        const cur = runRef.current;
        if (cur?.status !== 'paused') return;
        commit({ ...cur, status: 'running', endsAt: Date.now() + cur.remainingMs });
      },
      reset: () => {
        const cur = runRef.current;
        if (!cur) return;
        commit({
          ...cur,
          status: 'paused',
          phaseIndex: 0,
          cycleIndex: 0,
          remainingMs: phaseDurations(cur.def)[0],
        });
      },
      skip: () => {
        const cur = runRef.current;
        if (!cur || cur.status === 'finished') return;
        const next = nextPosition(cur.def, cur.phaseIndex, cur.cycleIndex);
        if (!next) {
          commit({ ...cur, status: 'finished', remainingMs: 0 }, 'finished', { silent: true });
          return;
        }
        commit({
          ...cur,
          ...next,
          status: 'running',
          endsAt: Date.now() + phaseDurations(cur.def)[next.phaseIndex],
        });
      },
      addMinute: () => {
        const cur = runRef.current;
        if (!cur || cur.status === 'finished') return;
        commit(
          cur.status === 'running'
            ? { ...cur, endsAt: cur.endsAt + MINUTE }
            : { ...cur, remainingMs: cur.remainingMs + MINUTE },
        );
      },
      stop: () => {
        const cur = runRef.current;
        if (!cur) return;
        commit(null, 'stopped', { eventRun: cur, silent: true });
      },
      restart: () => {
        const cur = runRef.current;
        if (cur) start(cur.def, cur.name, cur.source, cur.queueItemId);
      },
    };
  }, [run, event, commit]);

  return (
    <RunnerContext.Provider value={api}>
      <NowContext.Provider value={now}>{children}</NowContext.Provider>
    </RunnerContext.Provider>
  );
}

export function useTimerRunner(): RunnerApi {
  const ctx = useContext(RunnerContext);
  if (!ctx) throw new Error('useTimerRunner must be used inside TimerRunnerProvider');
  return ctx;
}

/** Live remaining time of the current phase. Re-renders every tick, so use it in small leaf components. */
export function useRemainingMs(): number {
  const { run } = useTimerRunner();
  const now = useContext(NowContext);
  return remainingFor(run, now);
}

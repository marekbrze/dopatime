import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { useSettings } from '@/modules/settings-data/hooks/use-settings';
import { useTimerRunner } from '@/modules/timer-engine/hooks/use-timer-runner';
import { totalDuration } from '@/modules/timer-engine/lib/timer';
import { useStoredState } from '@/shared/hooks/use-stored-state';
import { generateId } from '@/shared/types';
import type { QueueItem, QueueItemDraft, QueueItemStatus, QueueState } from '../types/queue';

interface QueueApi {
  items: QueueItem[];
  autoAdvance: boolean;
  setAutoAdvance: (value: boolean) => void;
  /** First item still waiting to run. */
  nextItem: QueueItem | null;
  /** Total length of the not-yet-done items in ms; null if any of them never ends. */
  remainingTotalMs: number | null;
  addItem: (draft: QueueItemDraft) => void;
  addItems: (drafts: QueueItemDraft[]) => void;
  updateItem: (id: string, patch: Partial<QueueItemDraft>) => void;
  removeItem: (id: string) => void;
  duplicateItem: (id: string) => void;
  moveItem: (id: string, delta: -1 | 1) => void;
  reorder: (fromId: string, toId: string) => void;
  clear: () => void;
  startQueue: () => void;
  startNext: () => void;
}

const QueueContext = createContext<QueueApi | null>(null);

function makeItem(draft: QueueItemDraft, fallbackName: string): QueueItem {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    name: draft.name.trim() || fallbackName,
    def: draft.def,
    status: 'queued',
  };
}

export function QueueProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  const runner = useTimerRunner();
  const [state, setState] = useStoredState<QueueState>(
    'queue',
    { items: [], autoAdvance: settings.autoAdvanceDefault },
    (raw) => {
      const r = raw as Partial<QueueState>;
      return {
        items: Array.isArray(r.items) ? r.items.filter((i) => i && i.def && typeof i.name === 'string') : [],
        autoAdvance: typeof r.autoAdvance === 'boolean' ? r.autoAdvance : settings.autoAdvanceDefault,
      };
    },
  );
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });

  const setStatus = useCallback(
    (id: string, status: QueueItemStatus) =>
      setState((s) => ({
        ...s,
        items: s.items.map((i) => (i.id === id && i.status !== status ? { ...i, status } : i)),
      })),
    [setState],
  );

  const startItem = useCallback(
    (item: QueueItem) => runner.start(item.def, item.name, 'queue', item.id),
    [runner],
  );

  // React to the run's lifecycle: mark items and advance the queue.
  const handledSeq = useRef(runner.event.seq);
  useEffect(() => {
    const ev = runner.event;
    if (ev.seq === handledSeq.current) return;
    handledSeq.current = ev.seq;
    const r = ev.run;
    if (!r || r.source !== 'queue' || !r.queueItemId) return;

    if (ev.type === 'started') setStatus(r.queueItemId, 'running');
    else if (ev.type === 'stopped') setStatus(r.queueItemId, 'queued');
    else if (ev.type === 'finished') {
      setStatus(r.queueItemId, 'done');
      const next = stateRef.current.items.find((i) => i.status === 'queued' && i.id !== r.queueItemId);
      if (next && stateRef.current.autoAdvance) startItem(next);
    }
  }, [runner.event, setStatus, startItem]);

  const api = useMemo<QueueApi>(() => {
    const nextItem = state.items.find((i) => i.status === 'queued') ?? null;
    const pending = state.items.filter((i) => i.status !== 'done');
    const totals = pending.map((i) => totalDuration(i.def));
    const remainingTotalMs = totals.some((t) => t === null) ? null : totals.reduce<number>((a, t) => a + (t ?? 0), 0);
    const nameFor = (n: number) => `Timer ${n}`;

    return {
      items: state.items,
      autoAdvance: state.autoAdvance,
      setAutoAdvance: (autoAdvance) => setState((s) => ({ ...s, autoAdvance })),
      nextItem,
      remainingTotalMs,
      addItem: (draft) =>
        setState((s) => ({ ...s, items: [...s.items, makeItem(draft, nameFor(s.items.length + 1))] })),
      addItems: (drafts) =>
        setState((s) => ({
          ...s,
          items: [...s.items, ...drafts.map((d, n) => makeItem(d, nameFor(s.items.length + n + 1)))],
        })),
      updateItem: (id, patch) =>
        setState((s) => ({
          ...s,
          items: s.items.map((i) =>
            i.id === id
              ? { ...i, ...patch, name: patch.name !== undefined ? patch.name.trim() || i.name : i.name, updatedAt: new Date().toISOString() }
              : i,
          ),
        })),
      removeItem: (id) => {
        if (state.items.find((i) => i.id === id)?.status === 'running') runner.stop();
        setState((s) => ({ ...s, items: s.items.filter((i) => i.id !== id) }));
      },
      duplicateItem: (id) =>
        setState((s) => {
          const index = s.items.findIndex((i) => i.id === id);
          if (index < 0) return s;
          const copy = makeItem({ name: `${s.items[index].name} (copy)`, def: s.items[index].def }, 'Timer');
          const items = [...s.items];
          items.splice(index + 1, 0, copy);
          return { ...s, items };
        }),
      moveItem: (id, delta) =>
        setState((s) => {
          const from = s.items.findIndex((i) => i.id === id);
          const to = from + delta;
          if (from < 0 || to < 0 || to >= s.items.length) return s;
          const items = [...s.items];
          [items[from], items[to]] = [items[to], items[from]];
          return { ...s, items };
        }),
      reorder: (fromId, toId) =>
        setState((s) => {
          const from = s.items.findIndex((i) => i.id === fromId);
          const to = s.items.findIndex((i) => i.id === toId);
          if (from < 0 || to < 0 || from === to) return s;
          const items = [...s.items];
          const [moved] = items.splice(from, 1);
          items.splice(to, 0, moved);
          return { ...s, items };
        }),
      clear: () => {
        if (runner.run?.source === 'queue') runner.stop();
        setState({ items: [], autoAdvance: settings.autoAdvanceDefault });
      },
      startNext: () => {
        if (nextItem) startItem(nextItem);
      },
      startQueue: () => {
        if (nextItem) return startItem(nextItem);
        // Everything is done: run the whole queue again.
        const reset = state.items.map((i) => ({ ...i, status: 'queued' as const }));
        setState((s) => ({ ...s, items: reset }));
        if (reset[0]) startItem(reset[0]);
      },
    };
  }, [state, setState, runner, startItem, settings.autoAdvanceDefault]);

  return <QueueContext.Provider value={api}>{children}</QueueContext.Provider>;
}

export function useQueue(): QueueApi {
  const ctx = useContext(QueueContext);
  if (!ctx) throw new Error('useQueue must be used inside QueueProvider');
  return ctx;
}

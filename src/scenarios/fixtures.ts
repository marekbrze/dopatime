import { storageKey } from '@/shared/storage';
import type { QueueItem } from '@/modules/timer-queue/types/queue';
import type { Template } from '@/modules/templates/types/template';
import type { TimerDef } from '@/modules/timer-engine/types/timer';
import { MINUTE } from '@/shared/lib/format';

const AT = '2026-01-05T09:00:00.000Z';
const base = (id: string) => ({ id, createdAt: AT, updatedAt: AT });

export const simple = (minutes: number): TimerDef => ({ kind: 'simple', durationMs: minutes * MINUTE });
export const alternating = (minutes: number[], cycles: number | null): TimerDef => ({
  kind: 'alternating',
  phases: minutes.map((m, i) => ({ id: `p${i}-${m}`, durationMs: m * MINUTE })),
  cycles,
});

export const queueItem = (id: string, name: string, def: TimerDef): QueueItem => ({
  ...base(id),
  name,
  def,
  status: 'queued',
});

export const timerTemplate = (id: string, name: string, def: TimerDef): Template => ({ ...base(id), name, kind: 'timer', def });
export const setTemplate = (id: string, name: string, items: { name: string; def: TimerDef }[]): Template => ({
  ...base(id),
  name,
  kind: 'set',
  items,
});

export const key = storageKey;

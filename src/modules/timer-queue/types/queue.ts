import type { BaseEntity } from '@/shared/types';
import type { TimerDef } from '@/modules/timer-engine/types/timer';

export type QueueItemStatus = 'queued' | 'running' | 'done';

export interface QueueItem extends BaseEntity {
  name: string;
  def: TimerDef;
  status: QueueItemStatus;
}

export interface QueueState {
  items: QueueItem[];
  autoAdvance: boolean;
}

/** An item without identity, as stored in templates and used when adding to the queue. */
export interface QueueItemDraft {
  name: string;
  def: TimerDef;
}

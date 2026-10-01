import type { BaseEntity } from '@/shared/types';
import type { TimerDef } from '@/modules/timer-engine/types/timer';
import type { QueueItemDraft } from '@/modules/timer-queue/types/queue';

/** A saved single timer (`timer`) or a whole queue (`set`). */
export interface Template extends BaseEntity {
  name: string;
  kind: 'timer' | 'set';
  def?: TimerDef;
  items?: QueueItemDraft[];
}

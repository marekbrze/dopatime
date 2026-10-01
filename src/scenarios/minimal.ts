import type { AppData } from './types';
import { key, queueItem, simple, timerTemplate } from './fixtures';

export function minimalScenario(): AppData {
  return {
    [key('queue')]: {
      autoAdvance: true,
      items: [queueItem('q1', 'Plan tasks', simple(10)), queueItem('q2', 'Deep work', simple(30))],
    },
    [key('templates')]: [timerTemplate('t1', 'Turbo focus', simple(10))],
  };
}

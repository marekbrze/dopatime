import type { AppData } from './types';
import { alternating, key, queueItem, setTemplate, simple, timerTemplate } from './fixtures';

export function fullScenario(): AppData {
  return {
    [key('queue')]: {
      autoAdvance: false,
      items: [
        queueItem('q1', 'Plan tasks', simple(10)),
        queueItem('q2', 'Work on task 1', alternating([25, 5], 3)),
        queueItem('q3', 'Review emails', simple(15)),
        queueItem('q4', 'Wrap up the day', simple(5)),
      ],
    },
    [key('templates')]: [
      timerTemplate('t1', 'Turbo focus', simple(10)),
      timerTemplate('t2', 'Pomodoro', alternating([25, 5], 4)),
      timerTemplate('t3', 'Stretch cycle', alternating([5, 10, 15], 2)),
      setTemplate('t4', 'Morning routine', [
        { name: 'Plan tasks', def: simple(10) },
        { name: 'Deep work', def: alternating([50, 10], 2) },
        { name: 'Email', def: simple(15) },
      ]),
    ],
    [key('music')]: {
      customStations: [{ id: 's1', name: 'Jazzhop Cafe', videoId: 'Dx5qFachd3A', builtin: false }],
      favoriteIds: ['lofi-girl', 's1'],
      selectedId: 'lofi-girl',
      volume: 40,
    },
    [key('settings')]: {
      alarmSound: 'bell',
      alarmVolume: 0.6,
      repeatUntilDismissed: true,
      theme: 'system',
      autoAdvanceDefault: false,
    },
  };
}

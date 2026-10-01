import { useState, type ReactNode } from 'react';
import type { Decorator } from '@storybook/react';
import { EndAlertsProvider } from '@/modules/end-alerts';
import { MusicProvider } from '@/modules/music';
import { SettingsProvider } from '@/modules/settings-data';
import { TemplatesProvider } from '@/modules/templates';
import { TimerRunnerProvider } from '@/modules/timer-engine';
import { QueueProvider } from '@/modules/timer-queue';
import { STORAGE_PREFIX } from '@/shared/storage';
import { getScenario } from '@/scenarios';

/** Replaces all Dopatime data in LocalStorage with the named scenario, once per story mount. */
function Seed({ scenario, children }: { scenario: string; children: ReactNode }) {
  const [ready] = useState(() => {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k?.startsWith(STORAGE_PREFIX)) localStorage.removeItem(k);
    }
    for (const [k, v] of Object.entries(getScenario(scenario))) localStorage.setItem(k, JSON.stringify(v));
    return true;
  });
  return ready ? <>{children}</> : null;
}

/** Wraps a story in every provider, seeded from a data scenario (`empty`, `minimal` or `full`). */
export const withApp =
  (scenario: 'empty' | 'minimal' | 'full' = 'empty'): Decorator =>
  (Story) => (
    <Seed scenario={scenario}>
      <SettingsProvider>
        <TimerRunnerProvider>
          <EndAlertsProvider>
            <TemplatesProvider>
              <QueueProvider>
                <MusicProvider>
                  <div className="max-w-md p-4">
                    <Story />
                  </div>
                </MusicProvider>
              </QueueProvider>
            </TemplatesProvider>
          </EndAlertsProvider>
        </TimerRunnerProvider>
      </SettingsProvider>
    </Seed>
  );

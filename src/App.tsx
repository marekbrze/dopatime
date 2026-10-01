import type { ReactNode } from 'react';
import { EndAlertsProvider } from '@/modules/end-alerts';
import { MusicDrawer, MusicProvider } from '@/modules/music';
import { SettingsDrawer, SettingsProvider } from '@/modules/settings-data';
import { TemplatesDrawer, TemplatesProvider } from '@/modules/templates';
import { MiniTimer, TimerRunnerProvider, TimerStage } from '@/modules/timer-engine';
import { QueueDrawer, QueueProvider } from '@/modules/timer-queue';
import { AppShell } from './shared/components/AppShell';
import { DevToolbar } from './shared/components/DevToolbar';

// Order matters: later providers read the earlier ones.
function Providers({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <TimerRunnerProvider>
        <EndAlertsProvider>
          <TemplatesProvider>
            <QueueProvider>
              <MusicProvider>{children}</MusicProvider>
            </QueueProvider>
          </TemplatesProvider>
        </EndAlertsProvider>
      </TimerRunnerProvider>
    </SettingsProvider>
  );
}

function App() {
  return (
    <Providers>
      <AppShell
        miniTimer={<MiniTimer />}
        drawers={{
          'timer-queue': <QueueDrawer />,
          templates: <TemplatesDrawer />,
          music: <MusicDrawer />,
          'settings-data': <SettingsDrawer />,
        }}
      >
        <TimerStage />
      </AppShell>
      <DevToolbar />
    </Providers>
  );
}

export default App;

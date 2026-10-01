import { AppShell } from './shared/components/AppShell';
import { DevToolbar } from './shared/components/DevToolbar';
import { ModulePlaceholder } from './shared/components/ModulePlaceholder';

function App() {
  return (
    <>
      <AppShell
        miniTimer={<span className="text-sm text-muted-foreground tabular-nums">00:00</span>}
        drawers={{
          'timer-queue': <ModulePlaceholder module="timer-queue" />,
          templates: <ModulePlaceholder module="templates" />,
          music: <ModulePlaceholder module="music" />,
          'settings-data': <ModulePlaceholder module="settings-data" />,
        }}
      >
        <ModulePlaceholder module="timer-engine" />
      </AppShell>
      <DevToolbar />
    </>
  );
}

export default App;

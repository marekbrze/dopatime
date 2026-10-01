import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useSettings } from '@/modules/settings-data/hooks/use-settings';
import { useTimerRunner, useRemainingMs } from '@/modules/timer-engine/hooks/use-timer-runner';
import { formatClock } from '@/shared/lib/format';
import { playSound, unlockAudio } from '../lib/sounds';
import { notificationState, requestNotifications, showNotification, type NotificationState } from '../lib/notifications';

const APP_TITLE = 'Dopatime';
const REPEAT_EVERY_MS = 5000;

interface EndAlertsApi {
  /** True from the moment a timer finishes until the user dismisses the alarm. */
  alerting: boolean;
  dismiss: () => void;
  permission: NotificationState;
  enableNotifications: () => Promise<void>;
}

const EndAlertsContext = createContext<EndAlertsApi | null>(null);

function TabTitle({ alerting }: { alerting: boolean }) {
  const { run } = useTimerRunner();
  const remaining = useRemainingMs();
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (!alerting) return;
    const id = window.setInterval(() => setFlash((f) => !f), 800);
    return () => window.clearInterval(id);
  }, [alerting]);

  useEffect(() => {
    const name = run?.name ? ` · ${run.name}` : '';
    let title = APP_TITLE;
    if (alerting) title = flash ? `🔔 Time's up!${name}` : APP_TITLE;
    else if (run?.status === 'running') title = `⏳ ${formatClock(remaining)}${name}`;
    else if (run?.status === 'paused') title = `⏸ ${formatClock(remaining)}${name}`;
    document.title = title;
  }, [run, remaining, alerting, flash]);

  useEffect(() => () => void (document.title = APP_TITLE), []);
  return null;
}

export function EndAlertsProvider({ children }: { children: ReactNode }) {
  const { run, event } = useTimerRunner();
  const { settings } = useSettings();
  const [alerting, setAlerting] = useState(false);
  const [permission, setPermission] = useState<NotificationState>(notificationState);
  const notificationRef = useRef<Notification | null>(null);
  const settingsRef = useRef(settings);
  const handledSeq = useRef(event.seq);

  useEffect(() => {
    settingsRef.current = settings;
  });

  // Browsers only allow audio after a user gesture; unlock on the first interaction.
  useEffect(() => {
    const unlock = () => unlockAudio();
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  const closeNotification = useCallback(() => {
    notificationRef.current?.close();
    notificationRef.current = null;
  }, []);

  const dismiss = useCallback(() => {
    setAlerting(false);
    closeNotification();
  }, [closeNotification]);

  const enableNotifications = useCallback(async () => {
    setPermission(await requestNotifications());
  }, []);

  useEffect(() => {
    if (event.seq === handledSeq.current) return;
    handledSeq.current = event.seq;
    const s = settingsRef.current;

    if (event.type === 'started') {
      dismiss();
      if (notificationState() === 'default') void enableNotifications();
      return;
    }
    if (event.type === 'stopped') {
      dismiss();
      return;
    }
    if (event.silent) return;

    const name = event.run?.name || 'Timer';
    closeNotification();
    if (event.type === 'phase-end') {
      playSound(s.alarmSound, s.alarmVolume, true);
      notificationRef.current = showNotification(`${name}: next phase`, `Phase ${(event.run?.phaseIndex ?? 0) + 1} has started.`);
    } else if (event.type === 'finished') {
      playSound(s.alarmSound, s.alarmVolume);
      notificationRef.current = showNotification("Time's up!", name);
      setAlerting(true);
    }
  }, [event, dismiss, closeNotification, enableNotifications]);

  // Dismiss the alarm as soon as the finished run is restarted or cleared.
  useEffect(() => {
    if (run?.status !== 'finished') dismiss();
  }, [run?.status, dismiss]);

  // Repeat the alarm until dismissed, if enabled.
  useEffect(() => {
    if (!alerting || !settings.repeatUntilDismissed) return;
    const id = window.setInterval(() => {
      const s = settingsRef.current;
      playSound(s.alarmSound, s.alarmVolume);
    }, REPEAT_EVERY_MS);
    return () => window.clearInterval(id);
  }, [alerting, settings.repeatUntilDismissed]);

  const value = useMemo(
    () => ({ alerting, dismiss, permission, enableNotifications }),
    [alerting, dismiss, permission, enableNotifications],
  );

  return (
    <EndAlertsContext.Provider value={value}>
      <TabTitle alerting={alerting} />
      {children}
    </EndAlertsContext.Provider>
  );
}

export function useEndAlerts(): EndAlertsApi {
  const ctx = useContext(EndAlertsContext);
  if (!ctx) throw new Error('useEndAlerts must be used inside EndAlertsProvider');
  return ctx;
}

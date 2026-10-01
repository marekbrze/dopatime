import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { useStoredState } from '@/shared/hooks/use-stored-state';
import { DEFAULT_SETTINGS, type Settings } from '../types/settings';

interface SettingsApi {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsApi | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useStoredState<Settings>('settings', DEFAULT_SETTINGS, (raw) => ({
    ...DEFAULT_SETTINGS,
    ...(raw as Partial<Settings>),
  }));

  const update = useCallback(
    (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch })),
    [setSettings],
  );

  // Apply the theme to <html>; "system" follows the OS preference live.
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = settings.theme === 'dark' || (settings.theme === 'system' && media.matches);
      document.documentElement.classList.toggle('dark', dark);
    };
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [settings.theme]);

  const value = useMemo(() => ({ settings, update }), [settings, update]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsApi {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}

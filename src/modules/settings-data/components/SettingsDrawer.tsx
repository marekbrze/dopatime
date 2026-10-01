import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useEndAlerts } from '@/modules/end-alerts/hooks/use-end-alerts';
import { audioState, playSound, unlockAudio } from '@/modules/end-alerts/lib/sounds';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { DrawerSection } from '@/shared/components/DrawerSection';
import { useNotice } from '@/shared/hooks/use-notice';
import { SliderRow } from '@/shared/components/SliderRow';
import { SwitchRow } from '@/shared/components/SwitchRow';
import { useSettings } from '../hooks/use-settings';
import { applyBackup, downloadBackup, parseBackupFile } from '../lib/backup';
import { ALARM_SOUNDS, type AlarmSoundId, type ThemePreference } from '../types/settings';

const THEMES: { id: ThemePreference; label: string }[] = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
];

function NotificationsStatus() {
  const { permission, enableNotifications } = useEndAlerts();
  if (permission === 'unsupported') {
    return <p className="text-sm text-muted-foreground">This browser doesn't support notifications. Sound and the tab title still alert you.</p>;
  }
  if (permission === 'granted') return <p className="text-sm text-muted-foreground">Notifications are on.</p>;
  if (permission === 'denied') {
    return (
      <p className="text-sm text-muted-foreground">
        Notifications are blocked. Allow them for this site in your browser's site settings, then reload the page.
      </p>
    );
  }
  return (
    <Button variant="outline" onClick={enableNotifications}>
      Enable notifications
    </Button>
  );
}

export function SettingsDrawer() {
  const { settings, update } = useSettings();
  const fileInput = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [notice, showNotice] = useNotice();
  const [pendingImport, setPendingImport] = useState<Awaited<ReturnType<typeof parseBackupFile>> | null>(null);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    const result = await parseBackupFile(file);
    if (result.ok) {
      setImportError(null);
      setPendingImport(result);
    } else setImportError(result.error);
    if (fileInput.current) fileInput.current.value = '';
  };

  return (
    <div className="space-y-6">
      <DrawerSection title="Alarm">
        <div className="space-y-2">
          <p id="alarm-sound-label" className="text-sm font-medium">
            Sound
          </p>
          <div role="group" aria-labelledby="alarm-sound-label" className="flex flex-wrap gap-2">
            {ALARM_SOUNDS.map((s) => (
              <Button
                key={s.id}
                variant={settings.alarmSound === s.id ? 'secondary' : 'outline'}
                aria-pressed={settings.alarmSound === s.id}
                onClick={() => {
                  update({ alarmSound: s.id as AlarmSoundId });
                  unlockAudio();
                  playSound(s.id, settings.alarmVolume);
                }}
              >
                {s.label}
              </Button>
            ))}
            <Button
              variant="ghost"
              onClick={() => {
                unlockAudio();
                playSound(settings.alarmSound, settings.alarmVolume);
                // Resuming audio is asynchronous; check shortly after.
                window.setTimeout(() => setAudioBlocked(audioState() !== 'running'), 150);
              }}
            >
              Preview
            </Button>
          </div>
        </div>
        {audioBlocked && (
          <p role="alert" className="text-sm text-destructive">
            Your browser is blocking sound. Click anywhere on the page and try Preview again. The alert will still show in the tab title.
          </p>
        )}
        <SliderRow
          label="Volume"
          value={Math.round(settings.alarmVolume * 100)}
          format={(v) => `${v}%`}
          onChange={(v) => update({ alarmVolume: v / 100 })}
        />
        <SwitchRow
          label="Repeat until dismissed"
          hint="Keeps sounding every few seconds until you silence it."
          checked={settings.repeatUntilDismissed}
          onCheckedChange={(repeatUntilDismissed) => update({ repeatUntilDismissed })}
        />
      </DrawerSection>

      <DrawerSection title="Queue">
        <SwitchRow
          label="Auto-start next timer"
          hint="Default for a new or cleared queue."
          checked={settings.autoAdvanceDefault}
          onCheckedChange={(autoAdvanceDefault) => update({ autoAdvanceDefault })}
        />
      </DrawerSection>

      <DrawerSection title="Notifications">
        <NotificationsStatus />
      </DrawerSection>

      <DrawerSection title="Appearance">
        <div role="group" aria-label="Theme" className="flex gap-2">
          {THEMES.map((t) => (
            <Button
              key={t.id}
              variant={settings.theme === t.id ? 'secondary' : 'outline'}
              aria-pressed={settings.theme === t.id}
              onClick={() => update({ theme: t.id })}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </DrawerSection>

      <DrawerSection title="Data">
        <p className="text-sm text-muted-foreground">
          Everything is stored only in this browser. Export a backup to move it elsewhere.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => {
              downloadBackup();
              showNotice('Backup downloaded.');
            }}
          >
            Export JSON
          </Button>
          <Button variant="outline" onClick={() => fileInput.current?.click()}>
            Import JSON
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            tabIndex={-1}
            aria-label="Backup file"
            onChange={(e) => void onFile(e.target.files?.[0])}
          />
        </div>
        <p role="status" className="min-h-5 text-sm text-muted-foreground">
          {notice}
        </p>
        {importError && (
          <p role="alert" className="text-sm text-destructive">
            {importError}
          </p>
        )}
      </DrawerSection>

      <ConfirmDialog
        open={pendingImport?.ok === true}
        title="Replace your data?"
        description="Importing replaces your current queue, templates, stations and settings with the contents of the file. Export first if you want to keep a copy. A running timer will be stopped."
        confirmLabel="Replace data"
        onCancel={() => setPendingImport(null)}
        onConfirm={() => pendingImport?.ok && applyBackup(pendingImport.backup)}
      />
    </div>
  );
}

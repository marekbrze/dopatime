export type AlarmSoundId = 'chime' | 'bell' | 'beep';
export type ThemePreference = 'system' | 'light' | 'dark';

export interface Settings {
  alarmSound: AlarmSoundId;
  /** 0..1 */
  alarmVolume: number;
  repeatUntilDismissed: boolean;
  theme: ThemePreference;
  autoAdvanceDefault: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  alarmSound: 'chime',
  alarmVolume: 0.7,
  repeatUntilDismissed: true,
  // Dark is the designed-first theme (docs/DESIGN.md); "system" is still an option.
  theme: 'dark',
  autoAdvanceDefault: true,
};

export const ALARM_SOUNDS: { id: AlarmSoundId; label: string }[] = [
  { id: 'chime', label: 'Chime' },
  { id: 'bell', label: 'Bell' },
  { id: 'beep', label: 'Beep' },
];

import { ListOrderedIcon, BookmarkIcon, MusicIcon, SettingsIcon } from 'lucide-react';
import type { ComponentType } from 'react';

export type DrawerId = 'timer-queue' | 'templates' | 'music' | 'settings-data';

export interface DrawerConfig {
  /** Module code name from docs/MODULES.md */
  id: DrawerId;
  /** Display label on the header button and drawer title */
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}

/** Order here is the order of the header buttons. */
export const DRAWERS: DrawerConfig[] = [
  { id: 'timer-queue', label: 'Queue', description: 'Timers that run one after another.', icon: ListOrderedIcon },
  { id: 'templates', label: 'Templates', description: 'Saved timers and sets of timers.', icon: BookmarkIcon },
  { id: 'music', label: 'Music', description: 'Background music streams.', icon: MusicIcon },
  { id: 'settings-data', label: 'Settings', description: 'Preferences, export and import.', icon: SettingsIcon },
];

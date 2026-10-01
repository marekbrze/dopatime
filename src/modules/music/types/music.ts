export interface MusicStation {
  id: string;
  name: string;
  /** YouTube video id (a live stream for the built-in stations). */
  videoId?: string;
  /** YouTube playlist id, for playlist-only links. */
  listId?: string;
  builtin: boolean;
}

export interface MusicPrefs {
  customStations: MusicStation[];
  favoriteIds: string[];
  selectedId: string | null;
  /** 0..100 */
  volume: number;
}

export const BUILTIN_STATIONS: MusicStation[] = [
  { id: 'lofi-girl', name: 'Lofi Girl', videoId: 'jfKfPfyJRdk', builtin: true },
  { id: 'chillhop-radio', name: 'Chillhop Radio', videoId: '5yx6BWlEVcY', builtin: true },
];

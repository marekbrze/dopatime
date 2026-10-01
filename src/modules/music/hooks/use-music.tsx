import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useStoredState } from '@/shared/hooks/use-stored-state';
import { generateId } from '@/shared/types';
import { embedUrl, parseYouTubeLink, playerCommand } from '../lib/youtube';
import { BUILTIN_STATIONS, type MusicPrefs, type MusicStation } from '../types/music';

const INITIAL: MusicPrefs = { customStations: [], favoriteIds: [], selectedId: null, volume: 50 };

interface MusicApi {
  /** Favorites first, then the rest; built-ins before custom within each group. */
  stations: MusicStation[];
  favoriteIds: string[];
  selected: MusicStation | null;
  playing: boolean;
  volume: number;
  select: (id: string) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleFavorite: (id: string) => void;
  addStation: (link: string, name: string) => { ok: true } | { ok: false; error: string };
  removeStation: (id: string) => void;
}

const MusicContext = createContext<MusicApi | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useStoredState<MusicPrefs>('music', INITIAL, (raw) => ({
    ...INITIAL,
    ...(raw as Partial<MusicPrefs>),
  }));
  // Playback never resumes by itself after a reload: browsers require a click to start audio.
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const prefsRef = useRef(prefs);
  useEffect(() => {
    prefsRef.current = prefs;
  });

  const all = useMemo(() => [...BUILTIN_STATIONS, ...prefs.customStations], [prefs.customStations]);
  const stations = useMemo(
    () => [...all.filter((s) => prefs.favoriteIds.includes(s.id)), ...all.filter((s) => !prefs.favoriteIds.includes(s.id))],
    [all, prefs.favoriteIds],
  );
  const selected = all.find((s) => s.id === prefs.selectedId) ?? null;

  const api = useMemo<MusicApi>(
    () => ({
      stations,
      favoriteIds: prefs.favoriteIds,
      selected,
      playing,
      volume: prefs.volume,
      select: (id) => {
        setPrefs((p) => ({ ...p, selectedId: id }));
        // A new station replaces the iframe, which autoplays, so we are playing from here on.
        if (started) setPlaying(true);
      },
      togglePlay: () => {
        if (!selected) return;
        if (!started) {
          setStarted(true);
          setPlaying(true);
        } else if (playing) {
          playerCommand(frameRef.current, 'pauseVideo');
          setPlaying(false);
        } else {
          playerCommand(frameRef.current, 'playVideo');
          setPlaying(true);
        }
      },
      setVolume: (volume) => {
        setPrefs((p) => ({ ...p, volume }));
        playerCommand(frameRef.current, 'setVolume', [volume]);
      },
      toggleFavorite: (id) =>
        setPrefs((p) => ({
          ...p,
          favoriteIds: p.favoriteIds.includes(id) ? p.favoriteIds.filter((f) => f !== id) : [...p.favoriteIds, id],
        })),
      addStation: (link, name) => {
        const parsed = parseYouTubeLink(link);
        if (!parsed) return { ok: false, error: "That doesn't look like a YouTube link." };
        const duplicate = all.some((s) => s.videoId === parsed.videoId && s.listId === parsed.listId);
        if (duplicate) return { ok: false, error: 'That station is already in your list.' };
        const station: MusicStation = {
          id: generateId(),
          name: name.trim() || `Custom station ${prefsRef.current.customStations.length + 1}`,
          builtin: false,
          ...parsed,
        };
        setPrefs((p) => ({ ...p, customStations: [...p.customStations, station] }));
        return { ok: true };
      },
      removeStation: (id) => {
        if (prefsRef.current.selectedId === id) {
          setStarted(false);
          setPlaying(false);
        }
        setPrefs((p) => ({
          ...p,
          customStations: p.customStations.filter((s) => s.id !== id),
          favoriteIds: p.favoriteIds.filter((f) => f !== id),
          selectedId: p.selectedId === id ? null : p.selectedId,
        }));
      },
    }),
    [stations, all, prefs.favoriteIds, prefs.volume, selected, playing, started, setPrefs],
  );

  const onFrameLoad = useCallback(() => {
    playerCommand(frameRef.current, 'setVolume', [prefsRef.current.volume]);
  }, []);

  return (
    <MusicContext.Provider value={api}>
      {children}
      {/* Mounted outside the drawer so playback survives closing it. Visually hidden, not display:none. */}
      {started && selected && (
        <iframe
          key={selected.id}
          ref={frameRef}
          title={`Audio player: ${selected.name}`}
          src={embedUrl(selected)}
          allow="autoplay; encrypted-media"
          onLoad={onFrameLoad}
          className="pointer-events-none fixed right-0 bottom-0 size-px opacity-0"
        />
      )}
    </MusicContext.Provider>
  );
}

export function useMusic(): MusicApi {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used inside MusicProvider');
  return ctx;
}

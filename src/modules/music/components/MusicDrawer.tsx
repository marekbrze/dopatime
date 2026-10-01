import { useEffect, useState, type FormEvent } from 'react';
import { ExternalLinkIcon, PauseIcon, PlayIcon, StarIcon, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SliderRow } from '@/shared/components/SliderRow';
import { useMusic } from '../hooks/use-music';
import { watchUrl } from '../lib/youtube';

function useOnline(): boolean {
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return online;
}

export function MusicDrawer() {
  const music = useMusic();
  const online = useOnline();
  const [link, setLink] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const result = music.addStation(link, name);
    if (result.ok) {
      setLink('');
      setName('');
      setError(null);
    } else setError(result.error);
  };

  return (
    <div className="space-y-5">
      <section aria-label="Now playing" className="space-y-3 rounded-lg border p-3">
        <div className="flex items-center gap-3">
          <Button
            size="icon-lg"
            aria-label={music.playing ? 'Pause music' : 'Play music'}
            disabled={!music.selected}
            onClick={music.togglePlay}
          >
            {music.playing ? <PauseIcon aria-hidden="true" /> : <PlayIcon aria-hidden="true" />}
          </Button>
          <div className="min-w-0">
            <p className="truncate font-medium">{music.selected?.name ?? 'No station selected'}</p>
            <p className="text-sm text-muted-foreground">
              {music.selected ? (music.playing ? 'Playing' : 'Paused') : 'Pick a station below.'}
            </p>
          </div>
        </div>
        {!online && (
          <p role="status" className="text-sm text-muted-foreground">
            You're offline. Music needs an internet connection.
          </p>
        )}
        {music.error && (
          <p role="alert" className="text-sm text-destructive">
            This stream can't be played here. Press play to retry, or open it on YouTube.
          </p>
        )}
        <SliderRow label="Volume" value={music.volume} format={(v) => `${v}%`} onChange={music.setVolume} />
        {music.selected && (
          <a
            href={watchUrl(music.selected)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground underline underline-offset-4"
          >
            Not playing? Open on YouTube
            <ExternalLinkIcon className="size-3.5" aria-hidden="true" />
          </a>
        )}
      </section>

      <ul aria-label="Stations" className="space-y-2">
        {music.stations.map((s) => {
          const isSelected = music.selected?.id === s.id;
          const favorite = music.favoriteIds.includes(s.id);
          return (
            <li key={s.id} className="flex items-center gap-1 rounded-lg border p-1 pl-2">
              <Button
                variant={isSelected ? 'secondary' : 'ghost'}
                className="min-w-0 flex-1 justify-start"
                aria-pressed={isSelected}
                onClick={() => music.select(s.id)}
              >
                <span className="truncate">{s.name}</span>
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={favorite ? `Remove ${s.name} from favorites` : `Add ${s.name} to favorites`}
                aria-pressed={favorite}
                onClick={() => music.toggleFavorite(s.id)}
              >
                <StarIcon aria-hidden="true" className={favorite ? 'fill-current' : ''} />
              </Button>
              {!s.builtin && (
                <Button variant="ghost" size="icon-sm" aria-label={`Remove ${s.name}`} onClick={() => music.removeStation(s.id)}>
                  <Trash2Icon aria-hidden="true" />
                </Button>
              )}
            </li>
          );
        })}
      </ul>

      <form onSubmit={submit} noValidate className="space-y-2" aria-label="Add a station">
        <p className="text-sm font-medium">Add your own station</p>
        <Input
          type="url"
          aria-label="YouTube link"
          placeholder="Paste a YouTube link"
          value={link}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'station-error' : undefined}
          onChange={(e) => {
            setLink(e.target.value);
            setError(null);
          }}
        />
        <Input aria-label="Station name (optional)" placeholder="Name (optional)" maxLength={60} value={name} onChange={(e) => setName(e.target.value)} />
        {error && (
          <p id="station-error" role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" variant="outline" disabled={!link.trim()}>
          Add station
        </Button>
      </form>
    </div>
  );
}

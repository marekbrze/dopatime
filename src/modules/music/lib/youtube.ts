import type { MusicStation } from '../types/music';

const VIDEO_ID = /^[\w-]{11}$/;
const LIST_ID = /^[\w-]{10,}$/;

/** Extracts a video and/or playlist id from the usual YouTube link shapes. Returns null if it isn't one. */
export function parseYouTubeLink(input: string): Pick<MusicStation, 'videoId' | 'listId'> | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www\.|m\.|music\.)/, '');
  let videoId: string | undefined;

  if (host === 'youtu.be') videoId = url.pathname.slice(1).split('/')[0];
  else if (host === 'youtube.com') {
    const [, kind, id] = url.pathname.split('/');
    if (url.pathname === '/watch') videoId = url.searchParams.get('v') ?? undefined;
    else if (kind === 'live' || kind === 'embed' || kind === 'shorts') videoId = id;
  } else return null;

  const list = url.searchParams.get('list') ?? undefined;
  const valid = videoId && VIDEO_ID.test(videoId) ? videoId : undefined;
  const listId = list && LIST_ID.test(list) ? list : undefined;
  return valid || listId ? { videoId: valid, listId } : null;
}

export function embedUrl(station: MusicStation): string {
  const params = new URLSearchParams({ enablejsapi: '1', autoplay: '1', playsinline: '1', origin: window.location.origin });
  if (station.videoId) {
    if (station.listId) params.set('list', station.listId);
    return `https://www.youtube-nocookie.com/embed/${station.videoId}?${params}`;
  }
  params.set('listType', 'playlist');
  params.set('list', station.listId ?? '');
  return `https://www.youtube-nocookie.com/embed/videoseries?${params}`;
}

export function watchUrl(station: MusicStation): string {
  return station.videoId
    ? `https://www.youtube.com/watch?v=${station.videoId}`
    : `https://www.youtube.com/playlist?list=${station.listId}`;
}

/** Sends a command to a player embedded with enablejsapi=1. */
export function playerCommand(frame: HTMLIFrameElement | null, func: string, args: unknown[] = []): void {
  frame?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args }), '*');
}

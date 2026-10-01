import type { AlarmSoundId } from '@/modules/settings-data/types/settings';

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (ctx) return ctx;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();
  return ctx;
}

/** Whether sound can currently play. `suspended` means the browser is blocking audio until a user gesture. */
export function audioState(): 'running' | 'suspended' | 'unsupported' {
  const c = getContext();
  if (!c) return 'unsupported';
  return c.state === 'running' ? 'running' : 'suspended';
}

/** Browsers only allow audio after a user gesture, so call this from a click or key handler. */
export function unlockAudio(): void {
  const c = getContext();
  if (c && c.state === 'suspended') void c.resume();
}

interface Note {
  freq: number;
  at: number;
  length: number;
  type?: OscillatorType;
}

const SOUNDS: Record<AlarmSoundId, Note[]> = {
  chime: [
    { freq: 659, at: 0, length: 0.7 },
    { freq: 880, at: 0.18, length: 0.9 },
    { freq: 1318, at: 0.36, length: 1.2 },
  ],
  bell: [
    { freq: 880, at: 0, length: 1.6 },
    { freq: 1760, at: 0, length: 1.2 },
    { freq: 2637, at: 0, length: 0.8 },
  ],
  beep: [0, 0.25, 0.5].map((at) => ({ freq: 880, at, length: 0.15, type: 'square' as const })),
};

/** Plays an alarm sound. `volume` is 0..1. `short` plays only the first note (used for phase changes). */
export function playSound(id: AlarmSoundId, volume: number, short = false): void {
  const c = getContext();
  if (!c || c.state === 'closed') return;
  const notes = short ? SOUNDS[id].slice(0, 1) : SOUNDS[id];
  const start = c.currentTime + 0.02;
  for (const note of notes) {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = note.type ?? 'sine';
    osc.frequency.value = note.freq;
    const peak = Math.max(0.0001, volume * (note.type === 'square' ? 0.25 : 0.5));
    gain.gain.setValueAtTime(0.0001, start + note.at);
    gain.gain.exponentialRampToValueAtTime(peak, start + note.at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + note.at + note.length);
    osc.connect(gain).connect(c.destination);
    osc.start(start + note.at);
    osc.stop(start + note.at + note.length + 0.05);
  }
}

import { useSyncExternalStore } from 'react';

export interface StorageStatus {
  /** The last attempt to save to LocalStorage failed (quota, private mode, blocked). */
  writeFailed: boolean;
  /** Keys whose stored data couldn't be read and were reset to defaults. */
  corrupted: string[];
}

let status: StorageStatus = { writeFailed: false, corrupted: [] };
const listeners = new Set<() => void>();

function set(next: StorageStatus) {
  status = next;
  // Deferred: reports can happen while a component is rendering.
  queueMicrotask(() => listeners.forEach((l) => l()));
}

export function reportWriteResult(ok: boolean): void {
  if (status.writeFailed === !ok) return;
  set({ ...status, writeFailed: !ok });
}

export function reportCorrupted(key: string): void {
  if (status.corrupted.includes(key)) return;
  set({ ...status, corrupted: [...status.corrupted, key] });
}

export function dismissCorrupted(): void {
  set({ ...status, corrupted: [] });
}

export function useStorageStatus(): StorageStatus {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => status,
  );
}

import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';
import { storageKey } from '@/shared/storage';
import { reportCorrupted, reportWriteResult } from '@/shared/storage-status';

/**
 * Like useState, but persisted to LocalStorage under `dopatime:<name>`.
 * Unlike useLocalStorage, functional updates are safe to chain within one tick.
 * `normalize` lets callers merge stored data with defaults (e.g. after an import).
 */
export function useStoredState<T>(
  name: string,
  initialValue: T,
  normalize: (raw: unknown) => T = (raw) => raw as T,
): [T, Dispatch<SetStateAction<T>>] {
  const key = storageKey(name);
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? normalize(JSON.parse(item)) : initialValue;
    } catch {
      // Unreadable or malformed data: carry on with defaults, but tell the user.
      reportCorrupted(name);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      reportWriteResult(true);
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error);
      reportWriteResult(false);
    }
  }, [key, value]);

  return [value, setValue];
}

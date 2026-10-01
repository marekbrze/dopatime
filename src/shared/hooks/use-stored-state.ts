import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';
import { storageKey } from '@/shared/storage';

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
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

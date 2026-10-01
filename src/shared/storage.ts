export const STORAGE_PREFIX = 'dopatime:';

export function storageKey(name: string): string {
  return `${STORAGE_PREFIX}${name}`;
}

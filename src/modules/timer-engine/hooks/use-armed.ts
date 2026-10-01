import { useEffect, useState } from 'react';

/**
 * False for a moment after `key` changes. Used to ignore a double-click whose second
 * click would land on the button that replaced the first (Start -> Pause).
 */
export function useArmed(key: unknown, delayMs = 400): boolean {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    setArmed(false);
    const id = window.setTimeout(() => setArmed(true), delayMs);
    return () => window.clearTimeout(id);
  }, [key, delayMs]);
  return armed;
}

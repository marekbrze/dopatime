import { useCallback, useEffect, useRef, useState } from 'react';

/** A short-lived confirmation message ("Added to queue"), cleared after a few seconds. */
export function useNotice(durationMs = 3000) {
  const [notice, setNotice] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const show = useCallback(
    (message: string) => {
      setNotice(message);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setNotice(null), durationMs);
    },
    [durationMs],
  );

  useEffect(() => () => window.clearTimeout(timer.current), []);
  return [notice, show] as const;
}

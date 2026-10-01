import { useEffect, useRef } from 'react';

/**
 * Calls `callback` every `intervalMs` while `active`.
 * Runs in a Web Worker because browsers throttle timers on the main thread of
 * background tabs (down to once a minute), which would delay timer alarms.
 * Falls back to setInterval when workers are unavailable.
 */
export function useTicker(callback: () => void, intervalMs: number, active: boolean) {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    if (!active) return;
    const tick = () => callbackRef.current();

    let worker: Worker | null = null;
    let url: string | null = null;
    let fallback: number | undefined;
    try {
      const source = `setInterval(() => postMessage(0), ${intervalMs});`;
      url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
      worker = new Worker(url);
      worker.onmessage = tick;
      worker.onerror = () => {
        worker?.terminate();
        worker = null;
        fallback = window.setInterval(tick, intervalMs);
      };
    } catch {
      fallback = window.setInterval(tick, intervalMs);
    }

    return () => {
      worker?.terminate();
      if (url) URL.revokeObjectURL(url);
      if (fallback !== undefined) window.clearInterval(fallback);
    };
  }, [active, intervalMs]);
}

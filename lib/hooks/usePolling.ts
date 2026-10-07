"use client";

import { useEffect, useRef } from "react";

interface PollingOptions {
  intervalMs?: number;
  enabled?: boolean;
  immediate?: boolean;
}

/**
 * Visibility-aware polling hook.
 * Automatically pauses when the browser tab is hidden or minimized,
 * and refreshes immediately when the user returns to the tab.
 */
export function usePolling(
  callback: () => void | Promise<unknown>,
  options: PollingOptions = {}
) {
  const { intervalMs = 15_000, enabled = true, immediate = false } = options;
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    if (immediate && typeof document !== "undefined" && document.visibilityState === "visible") {
      void savedCallback.current();
    }

    let timer: number | null = null;

    const startTimer = () => {
      if (timer !== null) return;
      timer = window.setInterval(() => {
        if (document.visibilityState === "visible") {
          void savedCallback.current();
        }
      }, intervalMs);
    };

    const stopTimer = () => {
      if (timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void savedCallback.current();
        startTimer();
      } else {
        stopTimer();
      }
    };

    startTimer();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, intervalMs, immediate]);
}

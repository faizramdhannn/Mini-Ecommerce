// frontend/src/lib/hooks/useAutoRefresh.ts
import { useEffect, useRef, useCallback } from 'react';

interface UseAutoRefreshOptions {
  interval?: number; // in milliseconds
  enabled?: boolean;
  onRefresh?: () => Promise<void> | void;
}

export const useAutoRefresh = ({
  interval = 5000,
  enabled = true,
  onRefresh,
}: UseAutoRefreshOptions) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  const refresh = useCallback(async () => {
    if (!isMountedRef.current || !enabled || !onRefresh) return;
    
    try {
      await onRefresh();
    } catch (error) {
      console.error('Auto-refresh error:', error);
    }
  }, [enabled, onRefresh]);

  useEffect(() => {
    isMountedRef.current = true;

    if (enabled && onRefresh) {
      // Initial refresh
      refresh();

      // Setup interval
      intervalRef.current = setInterval(refresh, interval);
    }

    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, interval, refresh]);

  return { refresh };
};
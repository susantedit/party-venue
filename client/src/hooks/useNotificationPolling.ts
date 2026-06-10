import { useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '@/lib/axiosInstance';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import type { Notification } from '@/types';

const POLL_INTERVAL_MS = 30_000;

/**
 * Custom hook that polls GET /api/v1/notifications every 30 seconds
 * while the user is authenticated. Polling is gated on `isAuthenticated`
 * from authStore and stops automatically on logout or 401 responses.
 *
 * Requirements: 4.6, 11.1, 11.2, 11.3, 11.4, 11.5
 */
export function useNotificationPolling(): void {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setNotifications = useNotificationStore((state) => state.setNotifications);

  useEffect(() => {
    // Requirement 11.1 — do nothing if not authenticated
    if (!isAuthenticated) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;
    let controller = new AbortController();

    const fetchNotifications = async (): Promise<void> => {
      try {
        const response = await axiosInstance.get<{ success: boolean; data: Notification[] }>(
          '/api/v1/notifications',
          { signal: controller.signal },
        );
        // Requirement 11.4 — setNotifications auto-calculates unreadCount from isRead flags
        setNotifications(response.data.data);
      } catch (err) {
        // Ignore AbortError — this is expected on cleanup
        if (axios.isCancel(err)) return;

        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            // Requirement 11.3 — clear interval silently on 401, do not surface error
            // Note: axiosInstance already redirects to /admin/login on 401
            if (intervalId !== null) {
              clearInterval(intervalId);
              intervalId = null;
            }
            return;
          }
        }

        // Requirement 11.5 — log silently for any other error, retry on next tick
        console.error('[useNotificationPolling] fetch error:', err);
      }
    };

    // Requirement 11.4 — initial fetch on mount
    void fetchNotifications();

    // Requirement 4.6 — poll every 30 seconds after the initial fetch
    intervalId = setInterval(() => {
      controller = new AbortController();
      void fetchNotifications();
    }, POLL_INTERVAL_MS);

    // Cleanup: Requirement 11.2 — clear interval and abort in-flight request
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
      controller.abort();
    };
  }, [isAuthenticated, setNotifications]);
}

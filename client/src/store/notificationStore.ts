import { create } from 'zustand';
import type { Notification } from '@/types';

interface NotificationState {
  unreadCount: number;
  notifications: Notification[];
  setUnreadCount: (count: number) => void;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (n: Notification) => void;
  markAllRead: () => void;
  markOneRead: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  notifications: [],

  setUnreadCount: (count) => set({ unreadCount: count }),

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),

  addNotification: (n) =>
    set((state) => ({
      notifications: [n, ...state.notifications].slice(0, 20),
      unreadCount: state.unreadCount + 1,
    })),

  markAllRead: () =>
    set((state) => ({
      unreadCount: 0,
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    })),

  markOneRead: (id) =>
    set((state) => {
      const idx = state.notifications.findIndex((n) => n._id === id);
      if (idx === -1) return state;
      const notifications = state.notifications.map((n, i) =>
        i === idx ? { ...n, isRead: true } : n,
      );
      return {
        notifications,
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    }),
}));

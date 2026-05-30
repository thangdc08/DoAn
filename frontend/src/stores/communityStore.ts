import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { MatchPost } from '../types/community.types';
import type { Notification } from '../types/notification.types';
import { mockNotifications } from '../data/mockNotifications';
import { notificationApi } from '../services/notificationApi';
import dayjs from 'dayjs';

export type SelectedMatchStatus = 'today' | 'upcoming' | 'pending' | 'joined' | 'deselected';

export interface SelectedMatch {
  match: MatchPost;
  selectedStatus: SelectedMatchStatus;
  joinedAt: string;
}

interface CommunityState {
  favorites: MatchPost[];
  selectedMatches: SelectedMatch[];
  notifications: Notification[];

  // Favorites Actions
  toggleFavorite: (match: MatchPost) => void;
  isFavorite: (matchId: string) => boolean;

  // Selected Matches Actions
  joinMatch: (match: MatchPost) => void;
  cancelJoin: (matchId: string) => void;
  updateMatchStatus: (matchId: string, status: SelectedMatchStatus) => void;
  removeSelectedMatch: (matchId: string) => void;

  // Notifications Actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      favorites: [],
      selectedMatches: [],
      // Initialize with mock notifications
      notifications: mockNotifications,

      // Favorites Actions
      toggleFavorite: (match) => {
        const { favorites } = get();
        const exists = favorites.some((m) => m.id === match.id);
        if (exists) {
          set({ favorites: favorites.filter((m) => m.id !== match.id) });
        } else {
          set({ favorites: [...favorites, match] });
        }
      },

      isFavorite: (matchId) => {
        return get().favorites.some((m) => m.id === matchId);
      },

      // Selected Matches Actions
      joinMatch: (match) => {
        const { selectedMatches } = get();
        const exists = selectedMatches.some((sm) => sm.match.id === match.id);
        if (exists) return;

        // Determine default status
        let selectedStatus: SelectedMatchStatus = 'upcoming';
        const matchStart = dayjs(match.startTime);
        const isToday = matchStart.isValid() && matchStart.isSame(dayjs(), 'day');

        if (match.joinMode === 'APPROVE' || match.joinMode === 'APPROVAL') {
          selectedStatus = 'pending';
        } else if (isToday) {
          selectedStatus = 'today';
        }

        const newSelected: SelectedMatch = {
          match,
          selectedStatus,
          joinedAt: new Date().toISOString(),
        };

        set({
          selectedMatches: [...selectedMatches, newSelected],
        });
      },

      cancelJoin: (matchId) => {
        const { selectedMatches } = get();
        // Transition status to deselected
        set({
          selectedMatches: selectedMatches.map((sm) =>
            sm.match.id === matchId
              ? { ...sm, selectedStatus: 'deselected' as const }
              : sm
          ),
        });
      },

      updateMatchStatus: (matchId, status) => {
        const { selectedMatches } = get();
        set({
          selectedMatches: selectedMatches.map((sm) =>
            sm.match.id === matchId
              ? { ...sm, selectedStatus: status }
              : sm
          ),
        });
      },

      removeSelectedMatch: (matchId) => {
        const { selectedMatches } = get();
        set({
          selectedMatches: selectedMatches.filter((sm) => sm.match.id !== matchId),
        });
      },

      // Notifications Actions
      addNotification: (notification) => {
        const { notifications } = get();
        const newNotif: Notification = {
          ...notification,
          id: `notif-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set({
          notifications: [newNotif, ...notifications],
        });
      },

      fetchNotifications: async () => {
        try {
          const res = await notificationApi.getMyNotifications({ page: 0, size: 20 });
          set({ notifications: res?.content || [] });
        } catch (err) {
          console.error('Failed to fetch real notifications', err);
        }
      },

      markNotificationAsRead: async (id) => {
        const { notifications } = get();
        try {
          await notificationApi.markAsRead(id);
          set({
            notifications: notifications.map((n) =>
              n.id === id ? { ...n, readAt: new Date().toISOString() } : n
            ),
          });
        } catch (err) {
          console.error('Failed to mark notification as read', err);
          set({
            notifications: notifications.map((n) =>
              n.id === id ? { ...n, readAt: new Date().toISOString() } : n
            ),
          });
        }
      },

      markAllNotificationsAsRead: async () => {
        const { notifications } = get();
        try {
          await notificationApi.markAllAsRead();
          set({
            notifications: notifications.map((n) =>
              n.readAt ? n : { ...n, readAt: new Date().toISOString() }
            ),
          });
        } catch (err) {
          console.error('Failed to mark all as read', err);
          set({
            notifications: notifications.map((n) =>
              n.readAt ? n : { ...n, readAt: new Date().toISOString() }
            ),
          });
        }
      },
    }),
    {
      name: 'community-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

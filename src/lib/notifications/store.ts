import { create } from 'zustand';
import { supabase } from '../supabase';
import { useAuthStore } from '../auth/store';
import { isGuestUser } from '../auth/guest';
import type { Notification, NotificationDTO } from './types';
import { mapNotificationFromDTO } from './types';

interface NotificationsState {
  notifications: Notification[];
  loading: boolean;
  markAllAsRead: () => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

export const useNotifications = create<NotificationsState>((set) => ({
  notifications: [],
  loading: false,
  
  markAllAsRead: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id);

    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true }))
    }));
  },

  removeNotification: async (id: string) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },

  fetchNotifications: async () => {
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ notifications: [], loading: false });
      return;
    }

    // Retornar lista vacía para usuarios invitados
    if (isGuestUser(user.id)) {
      set({ notifications: [], loading: false });
      return;
    }

    set({ loading: true });

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const notifications = (data as NotificationDTO[]).map(mapNotificationFromDTO);
        set({ notifications });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      set({ notifications: [] });
    } finally {
      set({ loading: false });
    }
  }
}));
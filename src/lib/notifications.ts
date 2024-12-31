import { create } from 'zustand';
import { supabase } from './supabase';
import { useAuthStore } from './auth/store';

export interface Notification {
  id: string;
  type: 'voicemail' | 'voicemail_abandoned';
  contact: {
    name: string;
    number: string;
  };
  timestamp: Date;
  read: boolean;
}

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
    const user = useAuth.getState().user;
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
    const user = useAuth.getState().user;
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

    set({ loading: true });

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        set({
          notifications: data.map(n => ({
            ...n,
            timestamp: new Date(n.created_at)
          }))
        });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      set({ loading: false });
    }
  }
}));
import { create } from 'zustand';
import { supabase } from './supabase';
import { useAuthStore } from './auth/store';
import { isGuestUser } from './auth/guest';


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
    
    if (isGuestUser(user.id)) {
      const guestNotifications: Notification[] = [
        {
          id: 'guest-notif-1',
          type: 'voicemail',
          contact: {
            name: 'Registro Necesario',
            number: 'Crea una cuenta para recibir notificaciones reales'
          },
          timestamp: new Date(),
          read: false
        },
        {
          id: 'guest-notif-2',
          type: 'voicemail',
          contact: {
            name: 'Crear Empresa',
            number: 'Para habilitar paneles de empresa y estadísticas'
          },
          timestamp: new Date(),
          read: false
        },
        {
          id: 'guest-notif-3',
          type: 'voicemail',
          contact: {
            name: 'Crear Tu Usuario',
            number: 'Usa tu propio usuario en vez de modo invitado'
          },
          timestamp: new Date(),
          read: false
        }
      ];
      set({ notifications: guestNotifications, loading: false });
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
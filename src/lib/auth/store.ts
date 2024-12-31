import { create } from 'zustand';
import { supabase } from '../supabase';
import { signInWithEmail } from './api';
import { createGuestSession, isGuestUser } from './guest';
import type { AuthState } from './types';
import { AuthLogger } from './logger';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,

  initialize: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      set({ user, initialized: true });
      
      if (user) {
        await get().fetchProfile();
      }
    } catch (error) {
      AuthLogger.error('Error initializing auth:', error);
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true });
      const { user } = await signInWithEmail(email, password);
      set({ user });
      await get().fetchProfile();
      return { user };
    } catch (error: any) {
      AuthLogger.error('Sign in failed:', error);
      return { 
        error: error.message === 'Invalid login credentials'
          ? 'Email o contraseña incorrectos'
          : 'Error al iniciar sesión'
      };
    } finally {
      set({ loading: false });
    }
  },

  signInAsGuest: () => {
    const { user, profile } = createGuestSession();
    set({ user, profile, loading: false });
    AuthLogger.info('Guest session created', { user });
    return { user };
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
      get().reset();
    } catch (error) {
      AuthLogger.error('Error signing out:', error);
    }
  },

  fetchProfile: async () => {
    const { user } = get();
    if (!user) return null;
    
    // Si es usuario invitado, retornar el perfil de invitado
    if (isGuestUser(user.id)) {
      const { profile } = createGuestSession();
      set({ profile });
      return profile;
    }

    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          company:companies (
            id,
            name,
            tax_id
          )
        `)
        .eq('id', user.id)
        .single();

      if (error) throw error;
      set({ profile: data });
      return data;
    } catch (error) {
      AuthLogger.error('Error fetching profile:', error);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) return;

    try {
      set({ loading: true });
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      await get().fetchProfile();
    } catch (error) {
      AuthLogger.error('Error updating profile:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),
  reset: () => set({ user: null, profile: null, loading: false, initialized: false })
}));
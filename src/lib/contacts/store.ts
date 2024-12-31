import { create } from 'zustand';
import { supabase } from '../supabase';
import { useAuthStore } from '../auth/store';
import { isGuestUser } from '../auth/guest';
import { useAuthStore } from '../auth/store';

interface ContactsState {
  contacts: Contact[];
  selectedContact: Contact | null;
  selectedContacts: Set<string>;
  filters: ContactFilters;
  loading: boolean;
  error: string | null;
  fetchContacts: () => Promise<void>;
  createContact: (data: CreateContactInput) => Promise<void>;
  updateContact: (id: string, data: Partial<CreateContactInput>) => Promise<void>;
  deleteContacts: (ids: string[]) => Promise<void>;
  updateAvatar: (id: string, file: File) => Promise<void>;
  setSelectedContact: (contact: Contact | null) => void;
  toggleContactSelection: (id: string) => void;
  clearSelectedContacts: () => void;
  setFilters: (filters: ContactFilters) => void;
}

export const useContacts = create<ContactsState>((set, get) => ({
  contacts: [],
  selectedContact: null,
  selectedContacts: new Set(),
  filters: {},
  loading: false,
  error: null,

  setSelectedContact: (contact) => {
    set({ selectedContact: contact });
  },

  toggleContactSelection: (id) => {
    set(state => {
      const newSelection = new Set(state.selectedContacts);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return { selectedContacts: newSelection };
    });
  },

  clearSelectedContacts: () => {
    set({ selectedContacts: new Set() });
  },

  setFilters: (filters) => {
    set({ filters });
    get().fetchContacts();
  },

  fetchContacts: async () => {
    const { filters } = get();
    const { user } = useAuthStore.getState();
    if (!user) return;
    
    // Retornar lista vacía para usuarios invitados
    if (isGuestUser(user.id)) {
      set({ contacts: [], loading: false });
      return;
    }
    
    set({ loading: true, error: null });
    
    try {
      let query = supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id);

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
      }

      if (filters.company) {
        query = query.eq('company', filters.company);
      }

      if (filters.dateRange) {
        query = query
          .gte('created_at', filters.dateRange.start.toISOString())
          .lte('created_at', filters.dateRange.end.toISOString());
      }

      if (filters.sortBy) {
        query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      set({ contacts: data || [] });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  createContact: async (data) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('contacts')
        .insert([{
          ...data,
          user_id: user.id
        }]);

      if (error) throw error;
      get().fetchContacts();
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  updateContact: async (id, data) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('contacts')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      get().fetchContacts();
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  deleteContacts: async (ids) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .in('id', ids)
        .eq('user_id', user.id);

      if (error) throw error;
      set(state => ({
        selectedContacts: new Set(),
        selectedContact: null
      }));
      get().fetchContacts();
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  updateAvatar: async (id, file) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      // First, create the bucket if it doesn't exist
      const { error: bucketError } = await supabase.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2 // 2MB limit
      });

      // Ignore bucket already exists error
      if (bucketError && !bucketError.message.includes('already exists')) {
        throw bucketError;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${id}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await get().updateContact(id, { avatar_url: publicUrl });
    } catch (error: any) {
      set({ error: error.message });
    }
  }
}));
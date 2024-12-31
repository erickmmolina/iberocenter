import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../supabase';
import { useAuthStore } from '../auth/store';
import { isGuestUser } from '../auth/guest';
import type { Company, CompaniesState } from './types';

export const useCompanies = create<CompaniesState>()(
  persist(
    (set, get) => ({
      companies: [],
      selectedCompany: null,
      loading: false,
      error: null,

      fetchCompanies: async () => {
        const { user } = useAuthStore.getState();
        if (!user) {
          set({ companies: [], selectedCompany: null });
          return;
        }

        // Si es usuario invitado, mostrar empresa demo
        if (isGuestUser(user.id)) {
          const guestCompany = {
            id: GUEST_ID,
            name: 'Crear empresa',
            created_at: new Date().toISOString()
          };
          set({ 
            companies: [guestCompany],
            selectedCompany: guestCompany,
            loading: false 
          });
          return;
        }

        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('companies')
            .select('*')
            .order('name');

          if (error) throw error;

          set({ companies: data });
          
          // Select first company if none selected
          if (!get().selectedCompany && data.length > 0) {
            set({ selectedCompany: data[0] });
          }
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      setSelectedCompany: (company) => {
        set({ selectedCompany: company });
      },
    }),
    {
      name: 'companies-storage',
      partialize: (state) => ({ selectedCompany: state.selectedCompany }),
    }
  )
);
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../auth';
import { isGuestUser, GUEST_ID } from '../auth/guest';
import type { Company, CompanyContextType, CompanyFormData } from './types';

export const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCompany = async () => {
    if (!user) {
      setCompany(null);
      setLoading(false);
      return;
    }

    // Manejar usuario invitado
    if (isGuestUser(user.id)) {
      setCompany({
        id: GUEST_ID,
        name: 'Modo Invitado',
        created_at: new Date().toISOString()
      });
      setLoading(false);
      return;
    }

    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (profileError) {
        // Si el perfil no existe, no lo consideramos un error
        if (profileError.code === 'PGRST116') {
          setCompany(null);
          setError(null);
          setLoading(false);
          return;
        }
        throw profileError;
      }

      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profile.company_id)
        .single();

      if (companyError) {
        // Si la empresa no existe, no lo consideramos un error
        if (companyError.code === 'PGRST116') {
          setCompany(null);
          setError(null);
          return;
        }
        throw companyError;
      }

      setCompany(companyData);
      setError(null);
    } catch (err) {
      console.error('Error fetching company:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const updateCompany = async (updates: CompanyFormData) => {
    if (!company) return;

    try {
      const { data, error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', company.id)
        .select()
        .single();

      if (error) throw error;

      setCompany(data);
      setError(null);
    } catch (err) {
      console.error('Error updating company:', err);
      setError(err as Error);
      throw err;
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchCompany();
    } else {
      setCompany(null);
      setLoading(false);
    }
  }, [user?.id]);

  return (
    <CompanyContext.Provider value={{
      company,
      loading,
      error,
      updateCompany,
      refreshCompany: fetchCompany
    }}>
      {children}
    </CompanyContext.Provider>
  );
}
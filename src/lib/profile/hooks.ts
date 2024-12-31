import { useEffect } from 'react';
import { useAuthStore } from '../auth/store';
import { supabase } from '../supabase';
import { isGuestUser } from '../auth/guest';


export function useProfile() {
  const { user, setProfile } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    if (isGuestUser(user.id)) {
     const fakeProfile = {
       id: 'guest-fake-id',
       name: 'Invitado de Demostración',
       email: 'invitado-demo@example.com',
       avatar_url: '',
       company_id: 'guest-fake-company',
       role: 'guest',
       company: {
         id: 'guest-fake-company',
         name: 'Mi Empresa de Invitado',
         tax_id: '00000000-0'
       }
     };
   
     setProfile(fakeProfile);
     return;
  }
    const fetchProfile = async () => {
      const { data } = await supabase
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
        .maybeSingle();

      setProfile(data);
    };

    fetchProfile();

    // Subscribe to profile changes
    const channel = supabase
      .channel('profile-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${user.id}`
      }, () => {
        fetchProfile();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  return useAuthStore(state => ({
    profile: state.profile,
    loading: state.loading
  }));
}
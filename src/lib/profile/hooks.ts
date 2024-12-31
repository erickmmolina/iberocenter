import { useEffect } from 'react';
import { useAuthStore } from '../auth/store';
import { supabase } from '../supabase';

export function useProfile() {
  const { user, setProfile } = useAuthStore();

  useEffect(() => {
    if (!user) return;

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
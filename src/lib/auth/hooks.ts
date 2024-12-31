import { useEffect } from 'react';
import { useAuthStore } from './store';

export function useAuth() {
  const store = useAuthStore();
  
  useEffect(() => {
    if (!store.initialized) {
      store.initialize();
    }
  }, [store.initialized]);

  return store;
}

export function useProfile() {
  const { profile, loading, updateProfile } = useAuthStore();
  return { profile, loading, updateProfile };
}
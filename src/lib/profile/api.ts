import { supabase } from '../supabase';
import type { ProfileData } from './types';

export async function fetchUserProfile(userId: string): Promise<ProfileData | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        name,
        email,
        avatar_url,
        company_id,
        role,
        company:company_id (
          id,
          name,
          tax_id
        )
      `)
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Profile not found
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
}

export async function updateUserProfile(userId: string, updates: Partial<ProfileData>) {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;
}
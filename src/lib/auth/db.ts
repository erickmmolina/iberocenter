import { supabase } from '../supabase';
import { AuthLogger } from './logger';
import type { Company, Profile } from './types';

export async function createCompany(data: Pick<Company, 'name' | 'tax_id'>) {
  AuthLogger.debug('Creating company', { name: data.name });
  
  const { data: company, error } = await supabase
    .from('companies')
    .insert(data)
    .select()
    .single();

  if (error) {
    AuthLogger.error('Company creation failed', error);
    throw error;
  }

  return company;
}

export async function createProfile(data: Omit<Profile, 'created_at'>) {
  AuthLogger.debug('Creating profile', { id: data.id });
  
  const { error } = await supabase
    .from('profiles')
    .insert(data);

  if (error) {
    AuthLogger.error('Profile creation failed', error);
    throw error;
  }
}
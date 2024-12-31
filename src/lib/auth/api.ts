import { supabase } from '../supabase';
import { AuthLogger } from './logger';
import type { SignUpData } from './types';

export async function signInWithEmail(email: string, password: string) {
  AuthLogger.debug('Signing in user with email', { email });
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    AuthLogger.error('Email sign in failed', error);
    throw error;
  }

  return data;
}

export async function signUpWithEmail(data: SignUpData) {
  AuthLogger.debug('Signing up user with email', { email: data.email });
  
  try {
    // 1. Create auth user with email confirmation disabled
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          name: data.name
        }
      }
    });

    // Manejo explícito de error si signUpError existe
    if (signUpError) {
      // Si el mensaje contiene 'Anonymous sign-ins are disabled', forzamos una excepción custom
      if (
        signUpError.message?.includes('Anonymous sign-ins are disabled') ||
        signUpError.message?.includes('anonymous_provider_disabled')
      ) {
        const customError = new Error(
          'El registro de usuarios está deshabilitado en este proyecto de Supabase. ' +
          'Contacta al administrador o habilita los registros en la configuración del proyecto.'
        );
        customError.name = 'anonymous_provider_disabled';
        throw customError;
      }
      throw signUpError;
    }

    if (!authData.user) {
      throw new Error('No user data returned from signup');
    }

    // 2. Create company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: data.company_name,
        tax_id: data.company_tax_id
      })
      .select()
      .single();

    if (companyError) throw companyError;

    // 3. Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        name: data.name,
        email: data.email,
        company_id: company.id,
        role: 'admin'
      });

    if (profileError) throw profileError;

    return { user: authData.user };
  } catch (error: any) {
    AuthLogger.error('Signup failed', error);
    throw error;
  }
}
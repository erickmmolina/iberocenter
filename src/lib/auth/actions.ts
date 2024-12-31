import { supabase } from '../supabase';
import { useAuthStore } from './store';
import { AuthLogger } from './logger';
import type { AuthResponse, SignUpData } from './types';

export async function signUp(data: SignUpData): Promise<AuthResponse> {
  AuthLogger.info('Starting signup process', { email: data.email });
  
  try {
    // 1. Create auth user first
    AuthLogger.debug('Creating auth user');
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password
    });

    if (signUpError) {
      AuthLogger.error('Auth signup failed', signUpError);
      return {
        error: {
          message: signUpError.message.includes('already registered')
            ? 'Este correo ya está registrado'
            : signUpError.message,
          code: signUpError.message
        }
      };
    }

    if (!authData.user) {
      AuthLogger.error('No user data returned from signup');
      return {
        error: {
          message: 'Error al crear la cuenta',
          code: 'signup_failed'
        }
      };
    }

    // 2. Create company
    AuthLogger.debug('Creating company');
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: data.company_name,
        tax_id: data.company_tax_id
      })
      .select()
      .single();

    if (companyError) {
      AuthLogger.error('Company creation failed', companyError);
      return {
        error: {
          message: 'Error al crear la empresa',
          code: companyError.code
        }
      };
    }

    // 3. Create profile
    AuthLogger.debug('Creating profile');
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        name: data.name,
        email: data.email,
        company_id: company.id,
        role: 'admin'
      });

    if (profileError) {
      AuthLogger.error('Profile creation failed', profileError);
      return {
        error: {
          message: 'Error al crear el perfil',
          code: profileError.code
        }
      };
    }

    // 4. Update user metadata
    AuthLogger.debug('Updating user metadata');
    await supabase.auth.updateUser({
      data: { 
        name: data.name,
        company_id: company.id,
        role: 'admin'
      }
    });

    AuthLogger.info('Registration completed successfully');

    const user = {
      id: authData.user.id,
      email: data.email,
      name: data.name,
      company_id: company.id,
      role: 'admin'
    };

    useAuthStore.getState().setUser(user);
    return { user };
  } catch (error) {
    AuthLogger.error('Unexpected error during signup', error);
    return {
      error: {
        message: 'Error inesperado al crear la cuenta',
        code: 'unexpected_error'
      }
    };
  }
}
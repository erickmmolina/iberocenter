import { AuthLogger } from './logger';
import { signUpWithEmail } from './api';
import { createCompany, createProfile } from './db';
import type { SignUpData, AuthResponse } from './types';

export async function registerUser(data: SignUpData): Promise<AuthResponse> {
  try {
    // 1. Create auth user
    const { user } = await signUpWithEmail(data.email, data.password);
    
    if (!user) {
      throw new Error('No user data returned from signup');
    }

    // 2. Create company
    const company = await createCompany({
      name: data.company_name,
      tax_id: data.company_tax_id
    });

    // 3. Create profile with all required fields
    await createProfile({
      id: user.id,
      name: data.name,
      email: data.email,
      company_id: company.id,
      role: 'admin',
      avatar_url: null // Explicitly set to null
    });

    AuthLogger.info('Registration completed successfully');

    return {
      user: {
        id: user.id,
        email: data.email,
        name: data.name,
        company_id: company.id,
        role: 'admin'
      }
    };
  } catch (error: any) {
    AuthLogger.error('Registration failed', error);
    
    if (error.message?.includes('already registered')) {
      return {
        error: {
          message: 'Este correo ya está registrado',
          code: 'email_taken'
        }
      };
    }
    
    return {
      error: {
        message: 'Error al crear la cuenta',
        code: error.code || 'registration_failed'
      }
    };
  }
}
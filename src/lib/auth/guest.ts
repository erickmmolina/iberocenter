import { AuthLogger } from './logger';
import type { Profile } from './types';

export const GUEST_ID = 'guest';

export const GUEST_USER = {
  id: GUEST_ID,
  email: 'correo@ejemplo.com',
  name: 'Invitado'
};

export const GUEST_PROFILE: Profile = {
  id: GUEST_ID,
  name: GUEST_USER.name,
  email: GUEST_USER.email,
  role: 'guest',
  company_id: GUEST_ID,
  company: {
    id: GUEST_ID,
    name: 'Crear empresa',
    tax_id: ''
  }
};

export function createGuestSession() {
  AuthLogger.info('Creating guest session');
  return {
    user: GUEST_USER,
    profile: GUEST_PROFILE
  };
}

export function isGuestUser(userId?: string | null) {
  return userId === GUEST_ID;
}
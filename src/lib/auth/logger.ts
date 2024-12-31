import { AuthError } from '@supabase/supabase-js';

export const AuthLogger = {
  debug: (message: string, data?: any) => {
    console.debug('[Auth Debug]:', message, data || '');
  },
  
  info: (message: string, data?: any) => {
    console.info('[Auth Info]:', message, data || '');
  },
  
  error: (message: string, error?: Error | AuthError | unknown) => {
    console.error('[Auth Error]:', message);
    if (error) {
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      } else {
        console.error('Raw error:', error);
      }
    }
  }
};
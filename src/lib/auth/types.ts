export type Role = 'admin' | 'agent' | 'guest';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  company_name: string;
  company_tax_id: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  company_id: string;
  role: Role;
  company?: {
    id: string;
    name: string;
    tax_id?: string;
  };
}

export interface AuthState {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ user?: any; error?: string }>;
  signInAsGuest: () => { user: any };
  signOut: () => Promise<void>;
  setUser: (user: any) => void;
  setProfile: (profile: Profile | null) => void;
  fetchProfile: () => Promise<Profile | null>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  reset: () => void;
}
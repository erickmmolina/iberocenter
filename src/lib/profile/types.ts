import type { Role } from '../auth/types';

export interface ProfileData {
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

export interface ProfileContextType {
  profile: ProfileData | null;
  loading: boolean;
  error: Error | null;
  updateProfile: (data: Partial<ProfileData>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}
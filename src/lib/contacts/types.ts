export interface Contact {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  city?: string;
  notes?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateContactInput {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  city?: string;
  notes?: string;
  avatar_url?: string;
}

export interface ContactFilters {
  search?: string;
  company?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: 'name' | 'company' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}
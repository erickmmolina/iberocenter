export interface Company {
  id: string;
  name: string;
  tax_id?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  created_at: string;
}

export interface CompanyFormData {
  name: string;
  tax_id: string;
  address: string;
  phone: string;
  email: string;
  website: string;
}

export interface CompanyContextType {
  company: Company | null;
  loading: boolean;
  error: Error | null;
  updateCompany: (data: CompanyFormData) => Promise<void>;
  refreshCompany: () => Promise<void>;
}
export interface Company {
  id: string;
  name: string;
  created_at: string;
}

export interface CompaniesState {
  companies: Company[];
  selectedCompany: Company | null;
  loading: boolean;
  error: string | null;
  fetchCompanies: () => Promise<void>;
  setSelectedCompany: (company: Company) => void;
}
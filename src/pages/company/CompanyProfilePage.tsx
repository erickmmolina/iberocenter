import { CompanyForm } from './CompanyForm';
import { CompanyHeader } from './CompanyHeader';
import { useCompany } from '../../lib/company/hooks';

export function CompanyProfilePage() {
  const { company, loading } = useCompany();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <CompanyHeader company={company} />
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <CompanyForm company={company} />
      </div>
    </div>
  );
}
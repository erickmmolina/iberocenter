import { Building2 } from 'lucide-react';
import type { Company } from '../../lib/company/types';

interface CompanyHeaderProps {
  company: Company | null;
}

export function CompanyHeader({ company }: CompanyHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
        <Building2 className="w-8 h-8 text-blue-600" />
      </div>
      <div>
        <h1 className="text-2xl font-bold">Perfil de la Empresa</h1>
        <p className="text-gray-500">
          {company?.name || 'Configura los datos de tu empresa'}
        </p>
      </div>
    </div>
  );
}
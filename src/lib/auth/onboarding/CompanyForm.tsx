import { useState } from 'react';
import { Building2, FileText, AlertCircle, ArrowLeft } from 'lucide-react';
import { CompanyFormData } from './types';
import { validateCompanyName, validateTaxId } from '../validation';

interface CompanyFormProps {
  data: CompanyFormData;
  onChange: (data: CompanyFormData) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading?: boolean;
  error?: string;
}

export function CompanyForm({ 
  data, 
  onChange, 
  onSubmit, 
  onBack,
  loading, 
  error 
}: CompanyFormProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof CompanyFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CompanyFormData, string>> = {};
    
    const nameError = validateCompanyName(data.name);
    if (nameError) newErrors.name = nameError;

    const taxIdError = validateTaxId(data.tax_id);
    if (taxIdError) newErrors.tax_id = taxIdError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="company-name" className="block text-sm font-medium text-gray-700">
          Nombre de la empresa
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Building2 className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="company-name"
            type="text"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="tax-id" className="block text-sm font-medium text-gray-700">
          RUT/NIF
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="tax-id"
            type="text"
            value={data.tax_id}
            onChange={(e) => onChange({ ...data, tax_id: e.target.value })}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        {errors.tax_id && (
          <p className="mt-1 text-sm text-red-500">{errors.tax_id}</p>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </div>
    </form>
  );
}
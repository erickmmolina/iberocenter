import { useState } from 'react';
import { Filter, SortAsc, SortDesc } from 'lucide-react';
import { useContacts } from '../../lib/contacts/store';
import type { ContactFilters as FilterType } from '../../lib/contacts/types';

export function ContactFilters() {
  const [isOpen, setIsOpen] = useState(false);
  const { filters, setFilters } = useContacts();
  const [localFilters, setLocalFilters] = useState<FilterType>(filters);

  const handleApplyFilters = () => {
    setFilters(localFilters);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <Filter className="w-4 h-4" />
        Filtrar
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border p-4 z-10">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Empresa
              </label>
              <input
                type="text"
                value={localFilters.company || ''}
                onChange={(e) => setLocalFilters({ ...localFilters, company: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ordenar por
              </label>
              <select
                value={localFilters.sortBy || 'created_at'}
                onChange={(e) => setLocalFilters({ 
                  ...localFilters, 
                  sortBy: e.target.value as FilterType['sortBy']
                })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Nombre</option>
                <option value="company">Empresa</option>
                <option value="created_at">Fecha de creación</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLocalFilters({
                  ...localFilters,
                  sortOrder: localFilters.sortOrder === 'asc' ? 'desc' : 'asc'
                })}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {localFilters.sortOrder === 'asc' ? (
                  <SortAsc className="w-4 h-4" />
                ) : (
                  <SortDesc className="w-4 h-4" />
                )}
                {localFilters.sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                onClick={() => {
                  setLocalFilters({});
                  setFilters({});
                  setIsOpen(false);
                }}
                className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Limpiar
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
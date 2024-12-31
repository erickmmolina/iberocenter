import { useState, useEffect } from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';
import { ContactList } from '../../components/contacts/ContactList';
import { ContactDetails } from '../../components/contacts/ContactDetails';
import { ContactForm } from '../../components/contacts/ContactForm';
import { ContactFilters } from '../../components/contacts/ContactFilters';
import { ImportExportButtons } from '../../components/contacts/ImportExportButtons';
import { useContacts } from '../../lib/contacts/store';
import { useCompanies } from '../../lib/companies/store';

export function ContactsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { 
    fetchContacts, 
    createContact, 
    deleteContacts,
    selectedContacts,
    clearSelectedContacts,
    setFilters 
  } = useContacts();
  const { fetchCompanies } = useCompanies();

  useEffect(() => {
    fetchCompanies();
    fetchContacts();
  }, [fetchCompanies, fetchContacts]);

  const handleSearch = (query: string) => {
    setFilters({ search: query });
  };

  const handleDeleteSelected = async () => {
    if (selectedContacts.size === 0) return;
    
    if (confirm(`¿Estás seguro de que deseas eliminar ${selectedContacts.size} contactos?`)) {
      await deleteContacts(Array.from(selectedContacts));
      clearSelectedContacts();
    }
  };

  return (
    <div className="flex h-full">
      {/* Left Panel - Contact List */}
      <div className="w-96 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-xl font-bold">Contactos</h1>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="ml-auto p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Nuevo contacto"
            >
              <Plus className="w-5 h-5" />
            </button>
            {selectedContacts.size > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar seleccionados"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar contactos..."
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <ContactFilters />
            <ImportExportButtons onImportComplete={fetchContacts} />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <ContactList />
        </div>
      </div>

      {/* Right Panel - Contact Details */}
      <div className="flex-1 bg-white overflow-auto">
        <ContactDetails />
      </div>

      {isFormOpen && (
        <ContactForm
          onSubmit={createContact}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
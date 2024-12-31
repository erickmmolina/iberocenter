import { useContacts } from '../../lib/contacts/store';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Phone, Mail, Building2, MapPin } from 'lucide-react';
import { clsx } from 'clsx';

export function ContactList() {
  const { 
    contacts, 
    selectedContact, 
    selectedContacts,
    setSelectedContact, 
    toggleContactSelection,
    loading 
  } = useContacts();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p>No hay contactos</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className={clsx(
            'p-4 cursor-pointer transition-colors',
            selectedContact?.id === contact.id ? 'bg-blue-50' : 'hover:bg-gray-50',
            selectedContacts.has(contact.id) && 'bg-blue-50/50'
          )}
          onClick={() => setSelectedContact(contact)}
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedContacts.has(contact.id)}
              onChange={(e) => {
                e.stopPropagation();
                toggleContactSelection(contact.id);
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                  {contact.avatar_url ? (
                    <img 
                      src={contact.avatar_url} 
                      alt={contact.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    contact.name.charAt(0).toUpperCase()
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">{contact.name}</h3>
                  <p className="text-sm text-gray-500">
                    {format(new Date(contact.created_at), 'PPP', { locale: es })}
                  </p>
                </div>
              </div>
              
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Phone className="w-4 h-4" />
                  <span>{contact.phone}</span>
                </div>
                
                {contact.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail className="w-4 h-4" />
                    <span>{contact.email}</span>
                  </div>
                )}
                
                {contact.company && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Building2 className="w-4 h-4" />
                    <span>{contact.company}</span>
                  </div>
                )}
                
                {contact.city && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{contact.city}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
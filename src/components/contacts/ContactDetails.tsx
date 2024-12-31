import { useState } from 'react';
import { Phone, MessageSquare, Mail, Building2, MapPin, Trash2, Edit2, Upload } from 'lucide-react';
import { useContacts } from '../../lib/contacts/store';
import { ContactForm } from './ContactForm';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function ContactDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const { selectedContact, updateContact, deleteContacts, updateAvatar } = useContacts();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedContact) return;
    await updateAvatar(selectedContact.id, file);
  };

  if (!selectedContact) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Selecciona un contacto para ver sus detalles
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-medium overflow-hidden">
                {selectedContact.avatar_url ? (
                  <img 
                    src={selectedContact.avatar_url} 
                    alt={selectedContact.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  selectedContact.name.charAt(0).toUpperCase()
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 cursor-pointer rounded-full transition-opacity">
                <Upload className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedContact.name}</h2>
              {selectedContact.company && (
                <p className="text-gray-500">{selectedContact.company}</p>
              )}
              <p className="text-sm text-gray-500">
                Creado el {format(new Date(selectedContact.created_at), 'PPP', { locale: es })}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar contacto"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                if (confirm('¿Estás seguro de que deseas eliminar este contacto?')) {
                  deleteContacts([selectedContact.id]);
                }
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar contacto"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 text-gray-600">
              <Phone className="w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="font-medium">{selectedContact.phone}</p>
              </div>
            </div>
          </div>

          {selectedContact.email && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedContact.email}</p>
                </div>
              </div>
            </div>
          )}

          {selectedContact.company && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 text-gray-600">
                <Building2 className="w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Empresa</p>
                  <p className="font-medium">{selectedContact.company}</p>
                </div>
              </div>
            </div>
          )}

          {selectedContact.city && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Ciudad</p>
                  <p className="font-medium">{selectedContact.city}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {selectedContact.notes && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Notas</h3>
            <p className="text-gray-500 whitespace-pre-line bg-gray-50 p-4 rounded-lg">
              {selectedContact.notes}
            </p>
          </div>
        )}
      </div>

      {isEditing && (
        <ContactForm
          contact={selectedContact}
          onSubmit={async (data) => {
            await updateContact(selectedContact.id, data);
            setIsEditing(false);
          }}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}
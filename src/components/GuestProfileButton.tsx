import { useState } from 'react';
import { UserCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GUEST_USER } from '../lib/auth/guest';

export function GuestProfileButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1 hover:bg-gray-100 rounded-lg"
      >
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <UserCircle2 className="w-5 h-5 text-gray-600" />
        </div>
        <div className="text-left">
          <p className="text-sm font-medium">{GUEST_USER.name}</p>
          <p className="text-xs text-gray-500">{GUEST_USER.email}</p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border animate-in fade-in-0 slide-in-from-top-5">
          <div className="p-4 border-b">
            <p className="text-sm text-gray-500">
              Para guardar tu perfil y acceder a todas las funcionalidades, crea una cuenta.
            </p>
          </div>
          <div className="p-2">
            <Link
              to="/auth/register"
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2 flex items-center gap-3 text-left hover:bg-gray-50 rounded-lg"
            >
              <UserCircle2 className="w-4 h-4" />
              <span className="text-sm">Crear cuenta</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
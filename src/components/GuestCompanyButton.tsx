import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function GuestCompanyButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm hover:bg-slate-800 p-2 rounded-lg transition-colors w-full"
      >
        <Building2 className="w-5 h-5 flex-shrink-0" />
        <span className="truncate">Crear empresa</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-slate-800 rounded-lg shadow-lg py-4 z-50">
          <div className="px-4 mb-3">
            <p className="text-sm text-slate-300">
              Para crear una empresa y acceder a todas las funcionalidades, necesitas una cuenta.
            </p>
          </div>
          <div className="border-t border-slate-700 pt-3 px-2">
            <Link
              to="/auth/register"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg"
            >
              <Building2 className="w-4 h-4" />
              <span>Registrarse y crear empresa</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
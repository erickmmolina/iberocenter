import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function GuestBanner() {
  return (
    <div className="bg-blue-50 border-b border-blue-100">
      <div className="max-w-7xl mx-auto py-3 px-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-blue-700">
              Estás usando la aplicación en modo invitado. Para acceder a todas las funcionalidades, crea una cuenta.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/auth/register"
              className="text-sm font-medium text-blue-700 hover:text-blue-800"
            >
              Registrarse
            </Link>
            <Link
              to="/auth/login"
              className="text-sm font-medium text-white bg-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-700"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
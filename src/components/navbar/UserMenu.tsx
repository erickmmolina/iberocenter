import { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, User, Building2, Volume2, Key, Gift, CreditCard, EyeOff, LogOut } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { isGuestUser } from '../../lib/auth/guest';
import { GuestProfileButton } from '../GuestProfileButton';
import { useProfile } from '../../lib/profile/hooks';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { profile, loading } = useProfile();
  const isGuest = user ? isGuestUser(user.id) : false;

  const menuItems = [
    { icon: User, label: 'Mi Cuenta', to: '/account' },
    { icon: Building2, label: 'Perfil de la Empresa', to: '/company' },
    { icon: Volume2, label: 'Configuración de Sonido', to: '/sound-settings' },
    { icon: Key, label: 'Cambiar Contraseña', to: '/change-password' },
    { icon: Key, label: 'API Key', to: '/api-key' },
    { icon: Gift, label: 'Recomendar App', to: '/recommend' },
    { icon: CreditCard, label: 'Panel de Pagos', to: '/billing', highlight: true },
    { icon: EyeOff, label: 'Hacerme Invisible', danger: true },
    { icon: LogOut, label: 'Cerrar Sesión', separator: true, onClick: signOut }
  ];

  if (loading) {
    return (
      <div className="h-8 w-8 animate-pulse bg-gray-200 rounded-full" />
    );
  }

  if (!profile) return null;

  return (
    <div className="relative">
      {isGuest ? (
        <GuestProfileButton />
      ) : (
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 p-1 hover:bg-gray-100 rounded-lg"
        >
          <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
            {profile.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-sm font-medium">
                {profile.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="text-left">
            <p className="text-sm font-medium">{profile.name}</p>
            <p className="text-xs text-gray-500">{profile.email}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      )}

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border animate-in fade-in-0 slide-in-from-top-5">
          {menuItems.map((item) => (
            <Fragment key={item.label}>
              {item.separator && <div className="border-t my-1" />}
              {item.to ? (
                <Link
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={`
                    w-full px-4 py-2 flex items-center gap-3 text-left
                    ${item.highlight ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}
                    ${item.danger ? 'text-red-500' : 'text-gray-700'}
                  `}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                  className={`
                    w-full px-4 py-2 flex items-center gap-3 text-left
                    ${item.highlight ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}
                    ${item.danger ? 'text-red-500' : 'text-gray-700'}
                  `}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </button>
              )}
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
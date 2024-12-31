import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, PhoneCall, Mic, MessageSquare, Users2,
  BarChart3, Settings, ChevronLeft, ChevronRight,
  Building2, User
} from 'lucide-react';
import { useCompanies } from '../lib/companies/store';
import { useDialer } from '../lib/dialer/store';
import { useLayout } from '../lib/layout/store';
import { useAuth } from '../lib/auth';
import { isGuestUser } from '../lib/auth/guest';
import { GuestCompanyButton } from './GuestCompanyButton';
import { clsx } from 'clsx';

interface MenuItem {
  icon: any;
  label: string;
  path?: string;
  subItems?: MenuItem[];
}

/**
 * Definimos una sola sección de menú 'Principal' que incluye todos los items,
 * y un item 'Configuración' que despliega un submenú con 'Mi Perfil' y 'Empresa'.
 */
const sections = [
  {
    title: 'Principal',
    items: [
      { icon: Home, label: 'Inicio', path: '/' },
      { icon: Mic, label: 'Grabaciones', path: '/recordings' },
      { icon: MessageSquare, label: 'Mensajes', path: '/messages' },
      { icon: Users2, label: 'Contactos', path: '/contacts' },
      { icon: BarChart3, label: 'Reportes', path: '/reports' },
      {
        icon: Settings,
        label: 'Configuración',
        subItems: [
          { icon: User, label: 'Mi Perfil', path: '/profile' },
          { icon: Building2, label: 'Empresa', path: '/company' },
        ],
      },
    ],
  },
];

export function Sidebar() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

  // Control individual para el submenú "Configuración"
  const [openSubmenu, setOpenSubmenu] = useState(false);

  const { companies, selectedCompany, setSelectedCompany } = useCompanies();
  const { open: openDialer } = useDialer();
  const { sidebarCollapsed, toggleSidebar } = useLayout();
  const { user } = useAuth();
  const isGuest = user ? isGuestUser(user.id) : false;
  const location = useLocation();

  return (
    <div
      className={clsx(
        'bg-slate-900 text-slate-200 h-screen flex flex-col transition-all duration-200 relative',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Company Selector */}
      <div className="p-4 border-b border-slate-800">
        <div className="relative">
          {isGuest ? (
            <GuestCompanyButton />
          ) : (
            <button
              onClick={() => !sidebarCollapsed && setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
              onMouseEnter={() => sidebarCollapsed && setHoveredItem('company')}
              onMouseLeave={() => setHoveredItem(null)}
              className={clsx(
                'flex items-center gap-2 text-sm hover:bg-slate-800 p-2 rounded-lg transition-colors w-full',
                sidebarCollapsed ? 'justify-center' : ''
              )}
            >
              <Building2 className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="truncate">{selectedCompany?.name || 'Seleccionar empresa'}</span>
              )}
            </button>
          )}

          {/* Tooltip para modo colapsado */}
          {sidebarCollapsed && hoveredItem === 'company' && (
            <div className="absolute left-full top-0 ml-2 px-3 py-2 bg-slate-800 rounded-lg whitespace-nowrap z-50">
              {selectedCompany?.name || 'Seleccionar empresa'}
            </div>
          )}

          {/* Dropdown en modo expandido */}
          {!sidebarCollapsed && isCompanyDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-slate-800 rounded-lg shadow-lg py-1 z-50">
              {companies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => {
                    setSelectedCompany(company);
                    setIsCompanyDropdownOpen(false);
                  }}
                  className={clsx(
                    'w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition-colors',
                    selectedCompany?.id === company.id && 'bg-slate-700'
                  )}
                >
                  {company.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
        {/* Call Button */}
        <div className="p-4">
          <button
            onClick={openDialer}
            onMouseEnter={() => sidebarCollapsed && setHoveredItem('call')}
            onMouseLeave={() => setHoveredItem(null)}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
          >
            <PhoneCall className="w-5 h-5" />
            {!sidebarCollapsed && <span>Llamar</span>}
          </button>
          {sidebarCollapsed && hoveredItem === 'call' && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 rounded-lg whitespace-nowrap z-50">
              Llamar
            </div>
          )}
        </div>

        {/* Menu Sections */}
        <nav className="px-2">
          {sections.map((section, sectionIdx) => (
            <div key={section.title} className={clsx(sectionIdx > 0 && 'mt-6')}>
              {!sidebarCollapsed && (
                <h3 className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-1">
                {section.items.map((item: MenuItem) => {
                  // Item con submenú
                  if (item.subItems) {
                    return (
                      <li key={item.label} className="relative">
                        <button
                          onClick={() => {
                            if (!sidebarCollapsed) {
                              setOpenSubmenu((prev) => !prev);
                            }
                          }}
                          onMouseEnter={() => sidebarCollapsed && setHoveredItem(item.label)}
                          onMouseLeave={() => setHoveredItem(null)}
                          className={clsx(
                            'flex items-center gap-3 px-3 py-2 rounded-lg transition-all relative w-full text-left',
                            // si ALGUNO de los subItems está activo, marcamos "bg-slate-800 text-white"
                            item.subItems.some((sub) => sub.path === location.pathname)
                              ? 'bg-slate-800 text-white'
                              : 'text-slate-300 hover:bg-slate-800/50 hover:text-white',
                            sidebarCollapsed && 'justify-center'
                          )}
                        >
                          <item.icon className="w-5 h-5" />
                          {!sidebarCollapsed && <span>{item.label}</span>}
                          {/* Indicador si un subItem está activo */}
                          {item.subItems.some((sub) => sub.path === location.pathname) && (
                            <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500 rounded-r-full" />
                          )}
                        </button>
                        {/* Tooltip para modo colapsado */}
                        {sidebarCollapsed && hoveredItem === item.label && (
                          <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 rounded-lg whitespace-nowrap z-50">
                            {item.label}
                          </div>
                        )}
                        {/* Submenú expandido solo si el sidebar no está colapsado y el submenú está abierto */}
                        {!sidebarCollapsed && openSubmenu && (
                          <div className="mt-1 ml-6 border-l border-slate-700 pl-4">
                            {item.subItems.map((sub) => (
                              <Link
                                key={sub.label}
                                to={sub.path!}
                                className={clsx(
                                  'flex items-center gap-2 py-1 text-sm rounded-lg transition-colors mt-1',
                                  location.pathname === sub.path
                                    ? 'text-white'
                                    : 'text-slate-300 hover:text-white'
                                )}
                              >
                                <sub.icon className="w-4 h-4" />
                                <span>{sub.label}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </li>
                    );
                  }

                  // Item normal sin submenú
                  return (
                    <li key={item.label} className="relative">
                      <Link
                        to={item.path!}
                        onMouseEnter={() => sidebarCollapsed && setHoveredItem(item.label)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={clsx(
                          'flex items-center gap-3 px-3 py-2 rounded-lg transition-all relative',
                          location.pathname === item.path
                            ? 'bg-slate-800 text-white'
                            : 'text-slate-300 hover:bg-slate-800/50 hover:text-white',
                          sidebarCollapsed && 'justify-center'
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        {!sidebarCollapsed && <span>{item.label}</span>}
                        {location.pathname === item.path && (
                          <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500 rounded-r-full" />
                        )}
                      </Link>
                      {/* Tooltip para modo colapsado */}
                      {sidebarCollapsed && hoveredItem === item.label && (
                        <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 rounded-lg whitespace-nowrap z-50">
                          {item.label}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Botón para colapsar/expandir el sidebar */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white border border-slate-700 shadow-lg"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

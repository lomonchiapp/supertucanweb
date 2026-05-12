import { useState, useEffect } from 'react';
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/admin/hooks/useAuth';
import { signOut } from '@/admin/services/authService';

const navItems = [
  {
    to: '/admin/models',
    label: 'Modelos',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
      </svg>
    ),
  },
  {
    to: '/admin/parts',
    label: 'Repuestos',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.049.58.025 1.193-.14 1.743" />
      </svg>
    ),
  },
  {
    to: '/admin/categories',
    label: 'Categorías',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
      </svg>
    ),
  },
  {
    to: '/admin/news',
    label: 'Noticias',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
      </svg>
    ),
  },
];

function pageTitleFromPath(pathname: string): string {
  if (pathname.startsWith('/admin/models/')) return 'Editor de Modelo';
  if (pathname.startsWith('/admin/models')) return 'Modelos';
  if (pathname.startsWith('/admin/parts')) return 'Repuestos';
  if (pathname.startsWith('/admin/categories')) return 'Categorías';
  if (pathname.startsWith('/admin/news/')) return 'Editor de Noticia';
  if (pathname.startsWith('/admin/news')) return 'Noticias';
  return 'Panel de Administración';
}

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Cierra el drawer en cada navegación (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Bloquea scroll del body cuando el drawer está abierto
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [sidebarOpen]);

  if (loading) {
    return (
      <div className="font-[system-ui] min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Cargando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  const pageTitle = pageTitleFromPath(location.pathname);

  const sidebarContent = (
    <>
      <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100 shrink-0">
        <img src="/logo-full.png" alt="SuperTucan" className="h-8 object-contain" />
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500"
          aria-label="Cerrar menú"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-red-50 text-red-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-3 shrink-0">
        <div className="px-3 py-1.5 mb-2">
          <p className="text-xs text-gray-400 truncate">{user.email}</p>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <div className="font-[system-ui] min-h-screen bg-gray-50">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-[250px] bg-white border-r border-gray-200 flex-col z-30">
        {sidebarContent}
      </aside>

      {/* Drawer mobile */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setSidebarOpen(false)}
        />
        <aside
          className={`absolute top-0 left-0 h-full w-[260px] max-w-[80vw] bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {sidebarContent}
        </aside>
      </div>

      {/* Main content */}
      <div className="lg:ml-[250px] flex flex-col min-h-screen min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-14 lg:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-700 shrink-0"
              aria-label="Abrir menú"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-base lg:text-lg font-semibold text-gray-800 truncate">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 shrink-0">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold">
              {user.email?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <span className="hidden sm:inline truncate max-w-[180px]">{user.email}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

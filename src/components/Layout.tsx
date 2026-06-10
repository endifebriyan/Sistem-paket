import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, PlusCircle, List, BarChart3, Menu, X, Package } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/input', icon: PlusCircle, label: 'Input Paket' },
  { to: '/manajemen', icon: List, label: 'Manajemen Status' },
  { to: '/laporan', icon: BarChart3, label: 'Laporan' },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-primary-100 flex flex-col transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-primary-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary-700">SiPaket</h1>
              <p className="text-xs text-gray-500 leading-tight">Pesantren Sekolah Alam Al-Karim</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                    : 'text-gray-600 hover:bg-primary-50 hover:text-primary-700'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-primary-100">
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            &copy; 2025 Sekolah Alam Al-Karim<br />Sistem Informasi Penerimaan Paket
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-white border-b border-primary-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-primary-50 transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-primary-600" />
            <span className="font-bold text-primary-700">SiPaket</span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Tag, 
  Settings, 
  LogOut, 
  Store, 
  ShieldAlert 
} from 'lucide-react';

export default function AdminLayout() {
  const { user, isAdmin, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  // If not admin, restrict access
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#141416] text-[#EFECE6] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-[#C5A880]" />
        <h1 className="font-serif text-2xl font-bold">Restricted Administrative Atelier</h1>
        <p className="text-xs text-[#A1A1AA] max-w-sm">
          Elevated administrator credentials are required to access this control suite.
        </p>
        <Link
          to="/auth"
          className="px-6 py-2.5 bg-[#C5A880] text-[#141416] text-xs font-semibold uppercase tracking-widest hover:bg-white"
        >
          Sign In with Admin Account
        </Link>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Products & Inventory', path: '/admin/products', icon: Package },
    { label: 'Orders & Fulfillment', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Patrons & Accounts', path: '/admin/customers', icon: Users },
    { label: 'Privilege Vouchers', path: '/admin/coupons', icon: Tag },
    { label: 'Store Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] flex">
      {/* Dark Luxury Sidebar */}
      <aside className="w-64 bg-[#141416] text-[#EFECE6] flex flex-col justify-between p-6 border-r border-[#2A2A2E] flex-shrink-0 hidden md:flex">
        <div className="space-y-8">
          {/* Brand header */}
          <div className="space-y-1">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-[0.2em] text-white">
                MODÉRA
              </span>
              <span className="block text-[8px] font-sans tracking-[0.3em] uppercase text-[#C5A880]">
                ADMIN CONTROL ATELIER
              </span>
            </Link>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1.5 text-xs font-medium tracking-wider">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded transition-all ${
                    isActive
                      ? 'bg-[#222225] text-[#C5A880] font-semibold border-l-2 border-[#C5A880]'
                      : 'text-[#A1A1AA] hover:bg-[#1C1C20] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="pt-6 border-t border-[#2A2A2E] space-y-2 text-xs">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-[#A1A1AA] hover:text-white hover:bg-[#1C1C20] rounded transition-colors"
          >
            <Store className="w-4 h-4 text-[#C5A880]" />
            <span>Storefront View</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-950/30 rounded transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Administrative Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar */}
        <header className="bg-white border-b border-[#EAE6DF] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-[#A58256] font-semibold">
              Live Console
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-[#71717A]">Signed in as:</span>
            <span className="font-bold text-[#141416]">{user?.firstName} {user?.lastName} (Admin)</span>
            <Link
              to="/"
              className="md:hidden text-xs text-[#A58256] font-semibold"
            >
              Storefront
            </Link>
          </div>
        </header>

        <main className="p-6 sm:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


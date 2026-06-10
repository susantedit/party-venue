import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { NotificationBell } from '@/components/shared/NotificationDropdown';
import {
  LayoutDashboard, Calendar, BookOpen, Image, Package,
  FileText, Star, MessageSquare, UtensilsCrossed, LogOut, Menu, HelpCircle, Home, ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/bookings', label: 'Bookings', icon: BookOpen },
  { to: '/admin/packages', label: 'Packages', icon: Package },
  { to: '/admin/gallery', label: 'Gallery', icon: Image },
  { to: '/admin/menu', label: 'Menu', icon: UtensilsCrossed },
  { to: '/admin/blogs', label: 'Blogs', icon: FileText },
  { to: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { to: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
  { to: '/admin/calendar', label: 'Calendar', icon: Calendar },
  { to: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
];

export default function AdminLayout() {
  const { logOut } = useFirebaseAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logOut();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="px-4 py-5 border-b border-white/10">
        <Link
          to="/"
          aria-label="Go to home page"
          className="group flex items-center gap-2 rounded-lg transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold min-h-[44px]"
        >
          <Home className="h-4 w-4 text-gold" aria-hidden="true" />
          <div>
            <p className="font-serif text-lg font-bold text-white group-hover:text-gold transition-colors">Shree Ganesh</p>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to} to={to} end={exact}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive ? 'bg-gold-500 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <button onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 flex-shrink-0 bg-charcoal lg:flex flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-10 w-56 bg-charcoal flex-shrink-0">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 items-center justify-between border-b bg-white px-4 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-gold/40 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold min-h-[44px]"
              aria-label="View public website"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">View Site</span>
              <span className="sm:hidden">Home</span>
            </Link>
            <NotificationBell />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

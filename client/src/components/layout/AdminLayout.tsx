import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { NotificationBell } from '@/components/shared/NotificationDropdown';
import {
  LayoutDashboard, Calendar, BookOpen, Image, Package,
  FileText, Star, MessageSquare, UtensilsCrossed, LogOut,
  Menu, HelpCircle, ExternalLink, X, ChevronRight,
} from 'lucide-react';

const navItems = [
  { to: '/admin',              label: 'Dashboard',    icon: LayoutDashboard, exact: true },
  { to: '/admin/bookings',     label: 'Bookings',     icon: BookOpen },
  { to: '/admin/inquiries',    label: 'Inquiries',    icon: MessageSquare },
  { to: '/admin/calendar',     label: 'Calendar',     icon: Calendar },
  { to: '/admin/packages',     label: 'Packages',     icon: Package },
  { to: '/admin/gallery',      label: 'Gallery',      icon: Image },
  { to: '/admin/menu',         label: 'Menu',         icon: UtensilsCrossed },
  { to: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { to: '/admin/blogs',        label: 'Blogs',        icon: FileText },
  { to: '/admin/faqs',         label: 'FAQs',         icon: HelpCircle },
];

// Split into primary (frequent) and secondary groups
const primaryNav = navItems.slice(0, 4);
const secondaryNav = navItems.slice(4);

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { logOut, user } = useFirebaseAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate('/admin/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 text-sm transition-all duration-150 rounded-sm group ${
      isActive
        ? 'bg-gold/10 text-gold'
        : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200'
    }`;

  return (
    <div className="flex h-full flex-col bg-[#0d0d0d] border-r border-white/[0.06]">

      {/* Brand header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.06]">
        <Link to="/" className="flex items-center gap-2.5 group min-h-[40px]" aria-label="Go to home page">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-gold/30 bg-gold/10 font-serif font-bold text-gold text-xs">
            SG
          </div>
          <div>
            <p className="font-serif text-[13px] font-bold text-white tracking-wider leading-tight group-hover:text-gold transition-colors duration-150">
              Shree Ganesh
            </p>
            <p className="text-[9px] text-zinc-700 uppercase tracking-[0.18em]">Admin Panel</p>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-zinc-600 hover:text-white transition-colors rounded-sm"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {/* Primary group */}
        <div className="mb-1">
          <p className="px-3 mb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-700">Main</p>
          {primaryNav.map(({ to, label, icon: Icon, exact }) => (
            <NavLink key={to} to={to} end={exact} onClick={onClose} className={linkClass}>
              {({ isActive }) => (
                <>
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-gold' : 'text-zinc-600 group-hover:text-zinc-400'}`} aria-hidden="true" />
                  <span className="text-xs font-medium tracking-wide flex-1">{label}</span>
                  {isActive && <ChevronRight className="h-3 w-3 text-gold/60" aria-hidden="true" />}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Secondary group */}
        <div className="pt-2 border-t border-white/[0.04]">
          <p className="px-3 mb-1 mt-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-700">Content</p>
          {secondaryNav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={onClose} className={linkClass}>
              {({ isActive }) => (
                <>
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-gold' : 'text-zinc-600 group-hover:text-zinc-400'}`} aria-hidden="true" />
                  <span className="text-xs font-medium tracking-wide flex-1">{label}</span>
                  {isActive && <ChevronRight className="h-3 w-3 text-gold/60" aria-hidden="true" />}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer: user info + logout */}
      <div className="border-t border-white/[0.06] p-3 space-y-2">
        {user && (
          <div className="flex items-center gap-2.5 px-2 py-2 border border-white/[0.04] bg-white/[0.02] rounded-sm">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/15 border border-gold/25 font-serif text-xs font-bold text-gold">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-zinc-300 font-medium truncate">{user.email}</p>
              <p className="text-[9px] text-gold uppercase tracking-[0.15em]">Super Admin</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-zinc-600 hover:text-red-400 hover:bg-red-500/[0.06] rounded-sm transition-all duration-150 group"
        >
          <LogOut className="h-3.5 w-3.5 shrink-0 group-hover:text-red-400 transition-colors" aria-hidden="true" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0f0f0f] overflow-hidden">

      {/* Desktop sidebar */}
      <aside className="hidden w-52 shrink-0 lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-10 w-52 h-full shadow-2xl">
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top bar */}
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#0d0d0d] px-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 text-zinc-600 hover:text-white transition-colors rounded-sm"
            aria-label="Open sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Mobile brand */}
          <span className="lg:hidden font-serif text-sm font-bold text-white tracking-widest uppercase">
            Shree Ganesh
          </span>

          <div className="flex-1" />

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 border border-white/[0.07] bg-white/[0.02] px-2.5 py-1.5 text-[11px] text-zinc-500 hover:border-gold/25 hover:text-gold transition-all duration-150 rounded-sm"
              aria-label="View public website"
            >
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
              <span className="hidden sm:inline">View Site</span>
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

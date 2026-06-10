import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { HomeLink } from '@/components/ui/HomeLink';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/packages', label: 'Packages' },
  { to: '/menu', label: 'Menu' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled 
        ? 'bg-zinc-950/75 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/10' 
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo + Home */}
        <div className="flex items-center gap-1">
          <HomeLink
            variant="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <Link
            to="/"
            aria-label="Shree Ganesh — go to home page"
            className="flex items-center gap-2 group min-h-[44px]"
            onClick={() => setMobileOpen(false)}
          >
            <span className="font-serif text-xl font-bold tracking-tight text-white group-hover:text-gold transition-colors duration-150">
              Shree Ganesh
            </span>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 lg:flex">
          <HomeLink variant="icon" />
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to} to={to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-150 relative py-1 hover:text-gold ${
                  isActive ? 'text-gold' : 'text-zinc-300'
                }`
              }
            >
              {({ isActive }) => (
                <span className="relative z-10 px-1 py-1">
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </span>
              )}
            </NavLink>
          ))}
          <Link
            to="/booking"
            className="rounded-lg bg-gold hover:bg-gold/90 active:scale-95 px-4 py-2 text-sm font-semibold text-zinc-950 shadow-md transition-all duration-120 ease-out focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            Book Now
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-zinc-950"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden bg-zinc-950/95 backdrop-blur-lg border-b border-white/5 lg:hidden"
          >
            <nav className="flex flex-col px-4 py-4 gap-2">
              {navLinks.map(({ to, label }) => (
                <NavLink key={to} to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `text-sm font-medium py-2.5 px-4 rounded-lg transition-colors hover:bg-white/5 ${
                      isActive ? 'text-gold bg-white/5' : 'text-zinc-300'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <Link
                to="/booking"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-lg bg-gold px-4 py-3 text-center text-sm font-semibold text-zinc-950 shadow-md transition hover:bg-gold/90"
              >
                Book Now
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

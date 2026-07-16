import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/packages', label: 'Packages' },
  { to: '/menu', label: 'Menu' },
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
        ? 'bg-[#0a0a0a]/90 backdrop-blur-md border-b border-gold/10 shadow-[0_2px_20px_rgba(0,0,0,0.4)]'
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" aria-label="Shree Ganesh Party Venue And Catering Service — go to home page"
          className="flex items-center group min-h-[44px]"
          onClick={() => setMobileOpen(false)}>
          <img
            src="/shreeganeshpartyvenue-without-bg.png"
            alt="Shree Ganesh Party Venue And Catering Service"
            width={140}
            height={56}
            loading="eager"
            decoding="async"
            className="h-12 w-auto object-contain transition-opacity duration-150 group-hover:opacity-85"
          />
        </Link>

        {/* Desktop nav — Cinzel tracking */}
        <nav className="hidden items-center gap-5 lg:flex">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `font-serif text-xs tracking-[0.12em] uppercase transition-colors duration-150 relative py-1 ${
                  isActive ? 'text-gold' : 'text-zinc-400 hover:text-white'
                }`
              }>
              {({ isActive }) => (
                <span className="relative">
                  {label}
                  {isActive && (
                    <motion.span layoutId="navUnderline"
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-gold"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                  )}
                </span>
              )}
            </NavLink>
          ))}
          <Link to="/booking"
            className="font-serif tracking-[0.14em] uppercase text-xs px-5 py-2.5 bg-gold hover:bg-gold/90 active:scale-95 text-zinc-950 font-semibold shadow-[0_0_16px_rgba(201,168,76,0.2)] transition-all duration-150 focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
            style={{ borderRadius: '2px' }}>
            Book Now
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 text-zinc-300 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden bg-[#0a0a0a]/98 backdrop-blur-lg border-b border-gold/10 lg:hidden">
            <nav className="flex flex-col px-4 py-6 gap-1">
              {navLinks.map(({ to, label }) => (
                <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `font-serif text-xs tracking-[0.14em] uppercase py-3 px-4 border-b border-white/[0.04] transition-colors ${
                      isActive ? 'text-gold' : 'text-zinc-400 hover:text-white'
                    }`
                  }>
                  {label}
                </NavLink>
              ))}
              <Link to="/booking" onClick={() => setMobileOpen(false)}
                className="mt-4 font-serif tracking-[0.14em] uppercase text-xs px-4 py-3.5 text-center bg-gold text-zinc-950 font-semibold shadow-md transition hover:bg-gold/90"
                style={{ borderRadius: '2px' }}>
                Book Now
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

import { Link, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HomeLinkProps {
  variant?: 'icon' | 'text' | 'button';
  className?: string;
  onClick?: () => void;
}

export function HomeLink({ variant = 'icon', className, onClick }: HomeLinkProps) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  if (isHome && variant === 'icon') return null;

  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-120 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950';

  if (variant === 'text') {
    return (
      <Link
        to="/"
        onClick={onClick}
        aria-label="Go to home page"
        className={cn(
          base,
          'text-sm font-medium text-zinc-300 hover:text-gold min-h-[44px] px-2',
          className,
        )}
      >
        <Home className="h-4 w-4" aria-hidden="true" />
        Home
      </Link>
    );
  }

  if (variant === 'button') {
    return (
      <Link
        to="/"
        onClick={onClick}
        aria-label="Go to home page"
        className={cn(
          base,
          'border border-white/10 hover:border-gold/30 hover:bg-white/5 text-zinc-300 hover:text-gold min-h-[44px] min-w-[44px] px-3 py-2 text-sm font-medium',
          className,
        )}
      >
        <Home className="h-4 w-4" aria-hidden="true" />
        <span>Home</span>
      </Link>
    );
  }

  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="Go to home page"
      title="Home"
      className={cn(
        base,
        'min-h-[44px] min-w-[44px] text-zinc-400 hover:text-gold hover:bg-white/5',
        className,
      )}
    >
      <Home className="h-5 w-5" aria-hidden="true" />
    </Link>
  );
}

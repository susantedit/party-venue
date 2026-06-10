import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { SectionReveal } from './SectionReveal';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: string;
  className?: string;
}

export function PageHeader({ title, description, breadcrumb, className }: PageHeaderProps) {
  return (
    <SectionReveal className={cn('mb-10', className)}>
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-zinc-500">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-md px-1 py-1 text-zinc-400 transition-colors duration-120 ease-out hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold min-h-[44px]"
          aria-label="Go to home page"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          <span>Home</span>
        </Link>
        {breadcrumb && (
          <>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-600" aria-hidden="true" />
            <span className="text-zinc-400" aria-current="page">{breadcrumb}</span>
          </>
        )}
      </nav>
      <h1 className="font-serif text-4xl font-bold text-white tracking-tight">{title}</h1>
      {description && (
        <p className="mt-3 max-w-2xl text-lg text-zinc-400">{description}</p>
      )}
    </SectionReveal>
  );
}

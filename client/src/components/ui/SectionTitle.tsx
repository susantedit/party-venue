/**
 * SectionTitle — Queens Palace-style 3-layer heading:
 *  1. Great Vibes script accent (optional)
 *  2. Cinzel all-caps main title
 *  3. Cormorant Garamond italic subtitle
 * With decorative gold rule dividers.
 */
interface SectionTitleProps {
  script?: string;      // Great Vibes accent line e.g. "Welcome to"
  title: string;        // Cinzel heading
  subtitle?: string;    // Italic body subtitle
  className?: string;
  align?: 'left' | 'center';
}

export function SectionTitle({ script, title, subtitle, className = '', align = 'center' }: SectionTitleProps) {
  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <div className={`flex flex-col gap-3 ${alignClass} ${className}`}>
      {/* Decorative top rule */}
      <div className="flex items-center gap-3">
        <span className="block h-px w-12 bg-gold/50" />
        {script && (
          <span className="font-script text-2xl text-gold/80 leading-none" aria-hidden="true">
            {script}
          </span>
        )}
        <span className="block h-px w-12 bg-gold/50" />
      </div>

      {/* Main Cinzel title */}
      <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white tracking-[0.12em] uppercase">
        {title}
      </h2>

      {/* Italic Cormorant Garamond subtitle */}
      {subtitle && (
        <p className="font-sans italic text-lg text-zinc-400 max-w-xl leading-relaxed" style={{ letterSpacing: '0.02em' }}>
          {subtitle}
        </p>
      )}

      {/* Decorative bottom rule */}
      <div className="flex items-center gap-1">
        <span className="block h-px w-8 bg-gold/30" />
        <span className="block h-1 w-1 rounded-full bg-gold/60" />
        <span className="block h-px w-8 bg-gold/30" />
      </div>
    </div>
  );
}

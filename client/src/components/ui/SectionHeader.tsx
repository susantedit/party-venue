import { motion, useReducedMotion } from 'framer-motion';

interface SectionHeaderProps {
  /** Great Vibes script label above the title (optional) */
  scriptLabel?: string;
  /** Cinzel bold main title */
  title: string;
  /** Cormorant Garamond italic subtitle */
  subtitle?: string;
  className?: string;
  align?: 'center' | 'left';
}

/**
 * Reusable luxury section header.
 * Pattern: gold rule → Great Vibes script → Cinzel title → Cormorant italic subtitle → gold rule
 */
export function SectionHeader({
  scriptLabel,
  title,
  subtitle,
  className = '',
  align = 'center',
}: SectionHeaderProps) {
  const shouldReduceMotion = useReducedMotion();
  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: shouldReduceMotion ? 0.1 : 0.28, ease: [0.2, 0.8, 0.2, 1] }}
      className={`flex flex-col ${alignClass} gap-2 mb-14 ${className}`}
    >
      {/* Top gold rule */}
      <span className="block h-px w-16 bg-gold/60" aria-hidden="true" />

      {/* Script accent (Great Vibes) */}
      {scriptLabel && (
        <p className="font-script text-2xl text-gold/80 leading-tight mt-1">{scriptLabel}</p>
      )}

      {/* Main title (Cinzel) */}
      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-[0.08em] uppercase leading-tight">
        {title}
      </h2>

      {/* Subtitle (Cormorant Garamond italic) */}
      {subtitle && (
        <p className="font-sans italic text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed mt-1">
          {subtitle}
        </p>
      )}

      {/* Bottom gold rule */}
      <span className="block h-px w-16 bg-gold/60 mt-1" aria-hidden="true" />
    </motion.div>
  );
}

import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { getCardHoverProps } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = true, ...props }: GlassCardProps) {
  const reduced = useReducedMotion() ?? false;
  const hoverProps = hover ? getCardHoverProps(reduced) : {};

  return (
    <motion.div
      {...hoverProps}
      {...props}
      className={cn(
        'rounded-xl bg-zinc-900/30 p-6 border border-white/5',
        'hover:border-gold/30 hover:shadow-[0_0_20px_rgba(201,162,39,0.04)]',
        'transition-[border-color,box-shadow] duration-140 ease-out',
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { getSectionRevealProps } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface SectionRevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
}

export function SectionReveal({ children, className, ...props }: SectionRevealProps) {
  const reduced = useReducedMotion() ?? false;
  const reveal = getSectionRevealProps(reduced);

  return (
    <motion.div {...reveal} {...props} className={cn(className)}>
      {children}
    </motion.div>
  );
}

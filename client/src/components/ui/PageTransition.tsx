import { motion, useReducedMotion } from 'framer-motion';
import { getPageVariants } from '@/lib/motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const reduced = useReducedMotion() ?? false;
  const variants = getPageVariants(reduced);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      className="min-h-full"
    >
      {children}
    </motion.div>
  );
}

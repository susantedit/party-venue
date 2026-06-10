/**
 * Token-driven motion system — original values, premium restrained feel.
 * Replicate interaction principles, not reference-site choreography.
 */

export const EASE = {
  enter: [0.2, 0.8, 0.2, 1] as const,
  out: 'easeOut' as const,
} as const;

export const DURATION = {
  pageEnter: 0.22,
  cardHover: 0.14,
  buttonHover: 0.12,
  modalOpen: 0.18,
  accordion: 0.2,
  reduced: 0.1,
} as const;

export const STAGGER = 0.04;

export function getEnterTransition(reduced: boolean) {
  return {
    duration: reduced ? DURATION.reduced : DURATION.pageEnter,
    ease: reduced ? 'linear' : EASE.enter,
  };
}

export function getPageVariants(reduced: boolean) {
  return {
    initial: { opacity: 0, y: reduced ? 0 : 12 },
    animate: {
      opacity: 1,
      y: 0,
      transition: getEnterTransition(reduced),
    },
    exit: {
      opacity: 0,
      y: reduced ? 0 : -8,
      transition: { duration: reduced ? 0.1 : 0.15, ease: EASE.out },
    },
  };
}

export function getSectionRevealProps(reduced: boolean) {
  return {
    initial: { opacity: 0, y: reduced ? 0 : 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' as const },
    transition: getEnterTransition(reduced),
  };
}

export function getStaggerContainer(reduced: boolean) {
  return {
    initial: {},
    animate: {
      transition: { staggerChildren: reduced ? 0 : STAGGER },
    },
  };
}

export function getStaggerItem(reduced: boolean) {
  return {
    initial: { opacity: 0, y: reduced ? 0 : 12 },
    animate: {
      opacity: 1,
      y: 0,
      transition: getEnterTransition(reduced),
    },
  };
}

export function getCardHoverProps(reduced: boolean) {
  return {
    whileHover: { y: reduced ? 0 : -2 },
    transition: { duration: DURATION.cardHover, ease: EASE.out },
  };
}

export function getModalVariants(reduced: boolean) {
  return {
    initial: { opacity: 0, scale: reduced ? 1 : 0.98 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: reduced ? DURATION.reduced : DURATION.modalOpen,
        ease: reduced ? 'linear' : EASE.enter,
      },
    },
    exit: {
      opacity: 0,
      scale: reduced ? 1 : 0.98,
      transition: { duration: reduced ? 0.1 : 0.15 },
    },
  };
}

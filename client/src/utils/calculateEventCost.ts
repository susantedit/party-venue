import type { Package } from '@/types';

export interface CostInput {
  guestCount: number;
  selectedPackage: Package;
}

export interface CostResult {
  basePrice: number;
  estimatedMin: number;
  estimatedMax: number;
  capacityWarning: boolean;
  perHeadRate: number;
}

/**
 * Pure client-side cost estimate — no API call needed.
 * Property 4: For any valid input, estimatedMin > 0, estimatedMax > 0,
 * and estimatedMin <= estimatedMax.
 */
export function calculateEventCost({ guestCount, selectedPackage }: CostInput): CostResult {
  const perHeadRate = selectedPackage.price / selectedPackage.capacity;
  const estimatedMin = Math.round(perHeadRate * guestCount * 0.9);
  const estimatedMax = Math.round(perHeadRate * guestCount * 1.1);

  return {
    basePrice: selectedPackage.price,
    estimatedMin,
    estimatedMax,
    capacityWarning: guestCount > selectedPackage.capacity,
    perHeadRate,
  };
}

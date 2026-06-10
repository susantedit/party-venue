import * as fc from 'fast-check';
import { calculateEventCost } from '../../utils/calculateEventCost';
import type { Package } from '../../types';

// Feature: shree-ganesh-party-venue
// Property 4: calculateEventCost returns valid positive estimates for any valid input

function makePackage(price: number, capacity: number): Package {
  return {
    _id: 'test', name: 'Test Package', slug: 'test',
    description: 'Test', category: 'gold',
    price, capacity, features: ['Feature 1'],
    isPopular: false, isActive: true,
  };
}

describe('calculateEventCost', () => {
  it('Property 4: estimatedMin > 0, estimatedMax > 0, estimatedMin <= estimatedMax for any valid input', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 5000 }),          // guestCount
        fc.float({ min: 1000, max: 10_000_000, noNaN: true }), // price
        fc.integer({ min: 1, max: 5000 }),          // capacity
        (guestCount, price, capacity) => {
          const pkg = makePackage(price, capacity);
          const result = calculateEventCost({ guestCount, selectedPackage: pkg });
          return (
            result.estimatedMin > 0 &&
            result.estimatedMax > 0 &&
            result.estimatedMin <= result.estimatedMax
          );
        },
      ),
      { numRuns: 100 },
    );
  });

  it('capacityWarning is true when guestCount > package capacity', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 5000 }),
        fc.integer({ min: 1 }).map((n) => n),
        (capacity, extra) => {
          const guestCount = capacity + extra;
          const pkg = makePackage(100000, capacity);
          const result = calculateEventCost({ guestCount, selectedPackage: pkg });
          return result.capacityWarning === true;
        },
      ),
      { numRuns: 100 },
    );
  });

  it('capacityWarning is false when guestCount <= capacity', () => {
    const pkg = makePackage(100000, 500);
    expect(calculateEventCost({ guestCount: 500, selectedPackage: pkg }).capacityWarning).toBe(false);
    expect(calculateEventCost({ guestCount: 1, selectedPackage: pkg }).capacityWarning).toBe(false);
  });

  it('boundary: guestCount=1 returns positive estimate', () => {
    const pkg = makePackage(50000, 100);
    const result = calculateEventCost({ guestCount: 1, selectedPackage: pkg });
    expect(result.estimatedMin).toBeGreaterThan(0);
    expect(result.estimatedMax).toBeGreaterThanOrEqual(result.estimatedMin);
  });
});

import * as fc from 'fast-check';
import { bookingSchema } from '../../src/validators/bookingSchema';
import { testimonialSchema } from '../../src/validators/testimonialSchema';

// Feature: shree-ganesh-party-venue
// Property 16: Zod validation rejects malformed request bodies with 400 and structured errors

describe('bookingSchema', () => {
  it('Property 16: rejects guestCount <= 0', () => {
    fc.assert(
      fc.property(
        fc.integer({ max: 0 }),
        (guestCount) => {
          const result = bookingSchema.safeParse({
            customerName: 'Test User',
            phone: '9800000000',
            email: 'test@test.com',
            eventType: 'Wedding',
            eventDate: '2030-01-01',
            guestCount,
          });
          return !result.success && result.error.errors.length > 0;
        },
      ),
      { numRuns: 100 },
    );
  });

  it('Property 16: rejects missing required fields', () => {
    fc.assert(
      fc.property(
        fc.record({
          customerName: fc.constant(''),
          phone: fc.constant(''),
          email: fc.constant('not-an-email'),
          eventType: fc.constant('InvalidType'),
          eventDate: fc.constant(''),
          guestCount: fc.integer({ max: 0 }),
        }),
        (body) => {
          const result = bookingSchema.safeParse(body);
          return !result.success;
        },
      ),
      { numRuns: 100 },
    );
  });

  it('accepts valid booking payload', () => {
    const result = bookingSchema.safeParse({
      customerName: 'Ram Bahadur',
      phone: '9800000000',
      email: 'ram@test.com',
      eventType: 'Wedding',
      eventDate: '2030-06-15',
      guestCount: 300,
    });
    expect(result.success).toBe(true);
  });
});

describe('testimonialSchema', () => {
  it('Property 16: rejects rating outside 1–5', () => {
    fc.assert(
      fc.property(
        fc.integer().filter((n) => n < 1 || n > 5),
        (rating) => {
          const result = testimonialSchema.safeParse({
            customerName: 'Test',
            rating,
            review: 'Great!',
          });
          return !result.success;
        },
      ),
      { numRuns: 100 },
    );
  });
});

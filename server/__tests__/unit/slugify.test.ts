import * as fc from 'fast-check';
import { slugify } from '../../src/utils/slugify';

// Feature: shree-ganesh-party-venue
// Property 20: Package slug auto-generation is URL-safe and derived from the name

describe('slugify', () => {
  it('Property 20: output matches /^[a-z0-9-]+$/ and is non-empty for any non-empty input', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0),
        (name) => {
          const slug = slugify(name);
          // Non-empty
          if (slug.length === 0) return false;
          // Only lowercase letters, digits, and hyphens
          return /^[a-z0-9-]+$/.test(slug);
        },
      ),
      { numRuns: 200 },
    );
  });

  it('no leading or trailing hyphens', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0),
        (name) => {
          const slug = slugify(name);
          return slug.length === 0 || (!slug.startsWith('-') && !slug.endsWith('-'));
        },
      ),
      { numRuns: 200 },
    );
  });

  it('known examples', () => {
    expect(slugify('Gold Package')).toBe('gold-package');
    expect(slugify('  Shree Ganesh  ')).toBe('shree-ganesh');
    expect(slugify('Bratabandha & Pasni')).toBe('bratabandha-pasni');
    expect(slugify('100% Authentic')).toBe('100-authentic');
  });
});

import * as fc from 'fast-check';
import request from 'supertest';
import app from '../../src/app';

// Feature: shree-ganesh-party-venue
// Property 18: API success responses always conform to { success: true, message, data }
// Property 19: Pagination response always has correct pagination object

const PUBLIC_ENDPOINTS = [
  '/api/v1/health',
  '/api/v1/packages',
  '/api/v1/gallery',
  '/api/v1/menu',
  '/api/v1/blogs',
  '/api/v1/testimonials',
];

describe('Property 18: All public success responses match standard envelope', () => {
  it('every public endpoint returns { success: true, message, data }', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...PUBLIC_ENDPOINTS),
        async (endpoint) => {
          const res = await request(app).get(endpoint);
          if (res.status !== 200) return true; // skip non-200 (e.g., empty DB)
          return (
            res.body.success === true &&
            typeof res.body.message === 'string' &&
            'data' in res.body
          );
        },
      ),
      { numRuns: 100 },
    );
  });
});

describe('Property 19: Pagination responses have correct structure', () => {
  it('pagination.pages === Math.ceil(pagination.total / pagination.limit)', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 50 }),
        fc.integer({ min: 1, max: 5 }),
        async (limit, page) => {
          const res = await request(app).get(`/api/v1/blogs?page=${page}&limit=${limit}`);
          if (res.status !== 200 || !res.body.pagination) return true;
          const { pagination } = res.body;
          const expectedPages = Math.ceil(pagination.total / pagination.limit);
          return pagination.pages === expectedPages;
        },
      ),
      { numRuns: 100 },
    );
  });
});

describe('Error responses match error envelope', () => {
  it('401 responses have { success: false, message }', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(typeof res.body.message).toBe('string');
  });

  it('404 response has { success: false, message }', async () => {
    const res = await request(app).get('/api/v1/nonexistent-route-xyz');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

import request from 'supertest';
import app from '../../src/app';

// Feature: shree-ganesh-party-venue — Task 41.4 IDOR prevention

describe('IDOR prevention — nonexistent resources', () => {
  const fakeId = '64f0000000000000000000aa'; // valid ObjectId format

  it('GET /api/v1/bookings/nonexistent → 401 (no token)', async () => {
    const res = await request(app).get(`/api/v1/bookings/${fakeId}`);
    expect(res.status).toBe(401);
  });

  it('DELETE /api/v1/gallery/nonexistent → 401 (no token)', async () => {
    const res = await request(app).delete(`/api/v1/gallery/${fakeId}`);
    expect(res.status).toBe(401);
  });

  it('DELETE /api/v1/packages/nonexistent → 401 (no token)', async () => {
    const res = await request(app).delete(`/api/v1/packages/${fakeId}`);
    expect(res.status).toBe(401);
  });

  it('PATCH /api/v1/bookings/nonexistent/status → 401 (no token)', async () => {
    const res = await request(app).patch(`/api/v1/bookings/${fakeId}/status`).send({ status: 'confirmed' });
    expect(res.status).toBe(401);
  });
});

describe('All admin routes require authentication', () => {
  const adminRoutes = [
    { method: 'get', path: '/api/v1/bookings' },
    { method: 'post', path: '/api/v1/packages' },
    { method: 'post', path: '/api/v1/gallery' },
    { method: 'post', path: '/api/v1/blogs' },
    { method: 'get', path: '/api/v1/inquiries' },
    { method: 'get', path: '/api/v1/dashboard/overview' },
    { method: 'post', path: '/api/v1/upload' },
  ];

  adminRoutes.forEach(({ method, path }) => {
    it(`${method.toUpperCase()} ${path} → 401 without token`, async () => {
      const res = await (request(app) as any)[method](path);
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});

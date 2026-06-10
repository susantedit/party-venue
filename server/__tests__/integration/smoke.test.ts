import request from 'supertest';
import app from '../../src/app';

// Feature: shree-ganesh-party-venue — Smoke tests

describe('Public API smoke tests', () => {
  it('GET /api/v1/health → 200', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/v1/packages → 200', async () => {
    const res = await request(app).get('/api/v1/packages');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/gallery → 200', async () => {
    const res = await request(app).get('/api/v1/gallery');
    expect(res.status).toBe(200);
  });

  it('GET /api/v1/menu → 200', async () => {
    const res = await request(app).get('/api/v1/menu');
    expect(res.status).toBe(200);
  });

  it('GET /api/v1/blogs → 200', async () => {
    const res = await request(app).get('/api/v1/blogs');
    expect(res.status).toBe(200);
  });

  it('GET /api/v1/availability?date=2030-01-01 → 200', async () => {
    const res = await request(app).get('/api/v1/availability?date=2030-01-01');
    expect(res.status).toBe(200);
    expect(['available', 'reserved', 'booked']).toContain(res.body.data?.status);
  });
});

describe('Protected routes return 401 without token', () => {
  it('GET /api/v1/auth/me → 401', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/packages → 401', async () => {
    const res = await request(app).post('/api/v1/packages').send({ name: 'Test' });
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/bookings → 401', async () => {
    const res = await request(app).get('/api/v1/bookings');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/dashboard/overview → 401', async () => {
    const res = await request(app).get('/api/v1/dashboard/overview');
    expect(res.status).toBe(401);
  });
});

describe('API response envelope format', () => {
  // Property 18: All success responses have { success: true, message, data }
  it('GET /api/v1/health response matches envelope', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message');
  });

  // 404 returns envelope
  it('GET /nonexistent → 404 with envelope', async () => {
    const res = await request(app).get('/api/v1/nonexistent-endpoint');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

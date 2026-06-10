import { logAuditEvent } from '../../src/utils/auditLog';

// Feature: shree-ganesh-party-venue — Task 41.3

describe('logAuditEvent', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('logs an audit event with required fields', () => {
    logAuditEvent('booking.deleted', 'user123', 'Booking', 'SGP-20260101-0001');
    expect(consoleSpy).toHaveBeenCalled();

    const logArg = consoleSpy.mock.calls[0][0];
    const entry = JSON.parse(logArg);

    expect(entry.level).toBe('INFO');
    expect(entry.message).toBe('AUDIT_EVENT');
    expect(entry.meta.action).toBe('booking.deleted');
    expect(entry.meta.userId).toBe('user123');
    expect(entry.meta.resourceType).toBe('Booking');
    expect(entry.meta.resourceId).toBe('SGP-20260101-0001');
    expect(entry.timestamp).toBeDefined();
  });

  it('uses anonymous when userId is undefined', () => {
    logAuditEvent('gallery.deleted', undefined, 'Gallery', 'img123');
    const entry = JSON.parse(consoleSpy.mock.calls[0][0]);
    expect(entry.meta.userId).toBe('anonymous');
  });

  it('includes metadata when provided', () => {
    logAuditEvent('booking.status_changed', 'admin1', 'Booking', 'id1', { from: 'pending', to: 'confirmed' });
    const entry = JSON.parse(consoleSpy.mock.calls[0][0]);
    expect(entry.meta.metadata).toEqual({ from: 'pending', to: 'confirmed' });
  });
});

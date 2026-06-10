import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export type AvailabilityStatus = 'available' | 'reserved' | 'booked' | null;

export function useAvailability(date: string): { status: AvailabilityStatus; loading: boolean } {
  const [status, setStatus] = useState<AvailabilityStatus>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date) {
      setStatus(null);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/api/v1/availability', { params: { date } });
        setStatus(res.data.data.status);
      } catch {
        setStatus(null);
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [date]);

  return { status, loading };
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import type { Inquiry } from '@/types';

export default function AdminInquiriesPage() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ['admin-inquiries'],
    queryFn: () => axiosInstance.get('/api/v1/inquiries').then(r => r.data.data as Inquiry[]),
  });

  const markRead = useMutation({
    mutationFn: (id: string) => axiosInstance.patch(`/api/v1/inquiries/${id}`, { status: 'read' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-inquiries'] }),
  });

  return (
    <>
      <SEOHead title="Inquiries" noIndex />
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="mb-4 font-serif text-2xl font-bold text-charcoal">Inquiries</h1>
        <div className="space-y-3">
          {data?.map(inquiry => (
            <div key={inquiry._id}
              className={`rounded-xl bg-white p-4 shadow-sm cursor-pointer ${inquiry.status === 'unread' ? 'border-l-4 border-gold-500' : ''}`}
              onClick={() => inquiry.status === 'unread' && markRead.mutate(inquiry._id)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{inquiry.name}</p>
                  <p className="text-sm text-gray-500">{inquiry.email} · {inquiry.phone}</p>
                  <p className="mt-1 text-sm text-gray-700">{inquiry.message}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs ${
                  inquiry.status === 'unread' ? 'bg-red-100 text-red-600' :
                  inquiry.status === 'replied' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                }`}>{inquiry.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

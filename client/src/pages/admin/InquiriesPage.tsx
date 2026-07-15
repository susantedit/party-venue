import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { Search, Filter, Mail, Phone, MessageSquare, ExternalLink } from 'lucide-react';
import type { Inquiry } from '@/types';

const STATUS_STYLES: Record<string, string> = {
  unread:  'bg-red-500/10 text-red-400 border border-red-500/20',
  read:    'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20',
  replied: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
};

function RowSkeleton() {
  return (
    <div className="border-b border-white/[0.04] px-5 py-4 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-zinc-800 rounded w-32" />
          <div className="h-2.5 bg-zinc-800 rounded w-48" />
          <div className="h-2.5 bg-zinc-800 rounded w-64" />
        </div>
        <div className="h-5 w-14 bg-zinc-800 rounded-full" />
      </div>
    </div>
  );
}

export default function AdminInquiriesPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<Inquiry | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-inquiries', statusFilter],
    queryFn: () =>
      axiosInstance
        .get('/api/v1/inquiries', { params: { status: statusFilter || undefined, limit: 50 } })
        .then(r => r.data.data as Inquiry[]),
  });

  const markRead = useMutation({
    mutationFn: (id: string) => axiosInstance.patch(`/api/v1/inquiries/${id}`, { status: 'read' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-inquiries'] }),
  });

  const markReplied = useMutation({
    mutationFn: (id: string) => axiosInstance.patch(`/api/v1/inquiries/${id}`, { status: 'replied' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-inquiries'] });
      setSelected(s => s ? { ...s, status: 'replied' } : s);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/api/v1/inquiries/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-inquiries'] });
      setSelected(null);
    },
  });

  const handleOpen = (inquiry: Inquiry) => {
    setSelected(inquiry);
    if (inquiry.status === 'unread') markRead.mutate(inquiry._id);
  };

  const filtered = (data ?? []).filter(i =>
    !search ||
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.email.toLowerCase().includes(search.toLowerCase()) ||
    i.phone?.includes(search)
  );

  return (
    <>
      <SEOHead title="Inquiries — Admin" noIndex />
      <div className="min-h-screen bg-[#0f0f0f]">

        {/* Page header */}
        <div className="border-b border-white/[0.06] bg-[#111111] px-6 py-5">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="block h-px w-5 bg-gold/50" />
            <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-semibold">CRM</span>
          </div>
          <div className="flex items-end justify-between">
            <h1 className="font-serif text-xl font-bold text-white tracking-widest uppercase">Inquiries</h1>
            {!isLoading && (
              <span className="text-[11px] text-zinc-600">
                {filtered.length} entr{filtered.length !== 1 ? 'ies' : 'y'}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-81px)]">

          {/* Left: list */}
          <div className="lg:w-[420px] xl:w-[480px] shrink-0 border-r border-white/[0.06] flex flex-col">

            {/* Filters */}
            <div className="flex gap-2 p-4 border-b border-white/[0.06]">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
                <input
                  placeholder="Search name, email, phone..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="h-9 w-full pl-8 pr-3 bg-[#161616] border border-white/[0.06] text-xs text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-gold/30 transition-colors"
                  style={{ borderRadius: '4px' }}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="h-9 pl-8 pr-6 bg-[#161616] border border-white/[0.06] text-xs text-zinc-300 focus:outline-none focus:border-gold/30 transition-colors appearance-none"
                  style={{ borderRadius: '4px' }}
                >
                  <option value="">All</option>
                  <option value="unread" className="bg-[#1a1a1a]">Unread</option>
                  <option value="read" className="bg-[#1a1a1a]">Read</option>
                  <option value="replied" className="bg-[#1a1a1a]">Replied</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)
                : filtered.length === 0
                  ? (
                    <div className="flex flex-col items-center justify-center py-16 text-zinc-700">
                      <MessageSquare className="h-8 w-8 mb-2" />
                      <p className="text-sm">No inquiries found</p>
                    </div>
                  )
                  : filtered.map(inquiry => (
                    <button
                      key={inquiry._id}
                      onClick={() => handleOpen(inquiry)}
                      className={`w-full text-left border-b border-white/[0.04] px-5 py-4 transition-colors hover:bg-white/[0.02] ${
                        selected?._id === inquiry._id ? 'bg-white/[0.03] border-l-2 border-l-gold/40' : ''
                      } ${inquiry.status === 'unread' ? 'border-l-2 border-l-red-500/50' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className={`text-sm font-semibold truncate ${inquiry.status === 'unread' ? 'text-white' : 'text-zinc-300'}`}>
                              {inquiry.name}
                            </p>
                            {inquiry.status === 'unread' && (
                              <span className="shrink-0 h-1.5 w-1.5 rounded-full bg-red-400" />
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-600 truncate mb-1.5">{inquiry.email} · {inquiry.phone}</p>
                          <p className="text-xs text-zinc-500 line-clamp-2">{inquiry.message}</p>
                        </div>
                        <span className={`shrink-0 inline-block px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide ${STATUS_STYLES[inquiry.status]}`}>
                          {inquiry.status}
                        </span>
                      </div>
                    </button>
                  ))
              }
            </div>
          </div>

          {/* Right: detail panel */}
          <div className="flex-1 overflow-y-auto">
            {!selected ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-zinc-700">
                <MessageSquare className="h-10 w-10 mb-3" />
                <p className="text-sm">Select an inquiry to view details</p>
              </div>
            ) : (
              <div className="p-6 max-w-2xl space-y-5">

                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-lg font-bold text-white">{selected.name}</h2>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      {new Date(selected.createdAt ?? '').toLocaleString()}
                    </p>
                  </div>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLES[selected.status]}`}>
                    {selected.status}
                  </span>
                </div>

                {/* Contact info */}
                <div className="border border-white/[0.06] bg-[#111111] p-4 space-y-3" style={{ borderRadius: '4px' }}>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-[0.15em] font-semibold">Contact</p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`tel:${selected.phone}`}
                      className="inline-flex items-center gap-1.5 border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-300 hover:border-blue-500/30 hover:text-blue-400 transition-all"
                      style={{ borderRadius: '4px' }}
                    >
                      <Phone className="h-3 w-3" /> {selected.phone}
                    </a>
                    <a
                      href={`mailto:${selected.email}`}
                      className="inline-flex items-center gap-1.5 border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-300 hover:border-gold/30 hover:text-gold transition-all"
                      style={{ borderRadius: '4px' }}
                    >
                      <Mail className="h-3 w-3" /> {selected.email}
                    </a>
                    <a
                      href={`https://wa.me/977${selected.phone?.replace(/^0/, '').replace(/\D/g, '')}?text=${encodeURIComponent('Re: Your inquiry')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-300 hover:border-emerald-500/30 hover:text-emerald-400 transition-all"
                      style={{ borderRadius: '4px' }}
                    >
                      <MessageSquare className="h-3 w-3" /> WhatsApp
                    </a>
                  </div>
                </div>

                {/* Message */}
                {selected.subject && (
                  <div>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-[0.15em] font-semibold mb-1.5">Subject</p>
                    <p className="text-sm text-zinc-300">{selected.subject}</p>
                  </div>
                )}
                <div className="border border-white/[0.06] bg-[#111111] p-4" style={{ borderRadius: '4px' }}>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-[0.15em] font-semibold mb-2">Message</p>
                  <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {selected.status !== 'replied' && (
                    <button
                      onClick={() => markReplied.mutate(selected._id)}
                      disabled={markReplied.isPending}
                      className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition disabled:opacity-40"
                      style={{ borderRadius: '4px' }}
                    >
                      ✓ Mark Replied
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/admin/bookings/new?name=${encodeURIComponent(selected.name)}&email=${encodeURIComponent(selected.email)}&phone=${encodeURIComponent(selected.phone ?? '')}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold/10 border border-gold/20 text-gold text-xs font-medium hover:bg-gold/20 transition"
                    style={{ borderRadius: '4px' }}
                  >
                    <ExternalLink className="h-3 w-3" /> Convert to Booking
                  </button>
                  <button
                    onClick={() => { if (confirm('Delete this inquiry?')) deleteMutation.mutate(selected._id); }}
                    disabled={deleteMutation.isPending}
                    className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition disabled:opacity-40 ml-auto"
                    style={{ borderRadius: '4px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

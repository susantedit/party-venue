import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { HelpCircle, Plus, X } from 'lucide-react';

interface FAQ { _id: string; question: string; answer: string; order: number; isPublished: boolean; }
const empty = { question: '', answer: '', order: 0, isPublished: true };

function RowSkeleton() {
  return (
    <div className="border border-white/[0.04] bg-[#111111] p-4 animate-pulse space-y-2" style={{ borderRadius: '4px' }}>
      <div className="h-3 bg-zinc-800 rounded w-3/4" />
      <div className="h-2.5 bg-zinc-800 rounded w-1/2" />
    </div>
  );
}

const inputClass = 'w-full bg-[#161616] border border-white/[0.08] px-3 py-2 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-gold/30 transition-colors';
const labelClass = 'text-[11px] text-zinc-500 uppercase tracking-[0.12em] font-semibold mb-1.5 block';

export default function AdminFAQsPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);

  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ['admin-faqs'],
    queryFn: () => axiosInstance.get('/api/v1/faqs/all').then(r => r.data.data as FAQ[]),
  });

  const saveMutation = useMutation({
    mutationFn: (data: typeof empty) =>
      editing
        ? axiosInstance.put(`/api/v1/faqs/${editing._id}`, data)
        : axiosInstance.post('/api/v1/faqs', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-faqs'] }); resetForm(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/api/v1/faqs/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-faqs'] }),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      axiosInstance.put(`/api/v1/faqs/${id}`, { isPublished }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-faqs'] }),
  });

  function resetForm() { setEditing(null); setForm(empty); setShowForm(false); }

  function handleEdit(faq: FAQ) {
    setEditing(faq);
    setForm({ question: faq.question, answer: faq.answer, order: faq.order, isPublished: faq.isPublished });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <>
      <SEOHead title="FAQs — Admin" noIndex />
      <div className="min-h-screen bg-[#0f0f0f]">

        {/* Page header */}
        <div className="border-b border-white/[0.06] bg-[#111111] px-6 py-5">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="block h-px w-5 bg-gold/50" />
            <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-semibold">Content</span>
          </div>
          <div className="flex items-end justify-between">
            <h1 className="font-serif text-xl font-bold text-white tracking-widest uppercase">FAQs</h1>
            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="inline-flex items-center gap-1.5 border border-gold/25 bg-gold/10 px-3 py-1.5 text-xs text-gold font-medium hover:bg-gold/15 transition"
              style={{ borderRadius: '4px' }}
            >
              <Plus className="h-3.5 w-3.5" /> Add FAQ
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5 max-w-3xl">

          {/* Form */}
          {showForm && (
            <div className="border border-gold/15 bg-[#111111] p-5" style={{ borderRadius: '4px' }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] text-gold uppercase tracking-[0.2em] font-semibold">{editing ? 'Edit FAQ' : 'New FAQ'}</p>
                <button onClick={resetForm} className="text-zinc-600 hover:text-zinc-300 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Question *</label>
                  <input
                    value={form.question}
                    onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
                    className={inputClass}
                    placeholder="Enter question…"
                    style={{ borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label className={labelClass}>Answer *</label>
                  <textarea
                    value={form.answer}
                    onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
                    rows={4}
                    className={`${inputClass} resize-none`}
                    placeholder="Enter answer…"
                    style={{ borderRadius: '4px' }}
                  />
                </div>
                <div className="flex items-end gap-4">
                  <div>
                    <label className={labelClass}>Order</label>
                    <input
                      type="number"
                      value={form.order}
                      onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))}
                      className={`${inputClass} w-20`}
                      style={{ borderRadius: '4px' }}
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer pb-2">
                    <div
                      onClick={() => setForm(f => ({ ...f, isPublished: !f.isPublished }))}
                      className={`relative h-5 w-9 rounded-full transition-colors ${form.isPublished ? 'bg-gold/70' : 'bg-zinc-700'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${form.isPublished ? 'translate-x-4' : ''}`} />
                    </div>
                    <span className="text-xs text-zinc-400">Published</span>
                  </label>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => saveMutation.mutate(form)}
                    disabled={saveMutation.isPending || !form.question || !form.answer}
                    className="px-4 py-2 bg-gold/15 border border-gold/25 text-gold text-xs font-semibold hover:bg-gold/20 transition disabled:opacity-40"
                    style={{ borderRadius: '4px' }}
                  >
                    {saveMutation.isPending ? 'Saving…' : editing ? 'Update' : 'Create'}
                  </button>
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 border border-white/[0.06] bg-white/[0.02] text-zinc-500 text-xs hover:text-zinc-200 transition"
                    style={{ borderRadius: '4px' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FAQ list */}
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)}
            </div>
          ) : faqs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-700">
              <HelpCircle className="h-10 w-10 mb-3" />
              <p className="text-sm">No FAQs yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {faqs.map((faq, idx) => (
                <div
                  key={faq._id}
                  className="group border border-white/[0.06] bg-[#111111] px-4 py-4 hover:border-white/[0.1] transition flex items-start gap-3"
                  style={{ borderRadius: '4px' }}
                >
                  {/* Index */}
                  <span className="shrink-0 flex h-6 w-6 items-center justify-center border border-white/[0.06] bg-white/[0.03] text-[10px] font-bold text-zinc-600 mt-0.5" style={{ borderRadius: '4px' }}>
                    {idx + 1}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-200">{faq.question}</p>
                    <p className="text-xs text-zinc-600 mt-1 line-clamp-2 leading-relaxed">{faq.answer}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleMutation.mutate({ id: faq._id, isPublished: !faq.isPublished })}
                      className={`px-2 py-0.5 text-[10px] font-medium rounded-full transition ${
                        faq.isPublished
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                          : 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20 hover:bg-zinc-500/20'
                      }`}
                    >
                      {faq.isPublished ? 'Published' : 'Draft'}
                    </button>
                    <button
                      onClick={() => handleEdit(faq)}
                      className="text-[11px] text-gold/60 hover:text-gold transition-colors font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirm('Delete this FAQ?') && deleteMutation.mutate(faq._id)}
                      disabled={deleteMutation.isPending}
                      className="text-[11px] text-zinc-700 hover:text-red-400 transition-colors disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

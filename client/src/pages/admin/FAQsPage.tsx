import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { SkeletonLoader } from '@/components/shared/SkeletonLoader';

interface FAQ { _id: string; question: string; answer: string; order: number; isPublished: boolean; }
const empty = { question: '', answer: '', order: 0, isPublished: true };

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
    mutationFn: (data: any) =>
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
  }

  return (
    <>
      <SEOHead title="FAQ Management" noIndex />
      <div className="p-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-2xl font-bold text-charcoal">FAQ Management</h1>
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gold-600">
            + Add FAQ
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-6 rounded-xl bg-white p-5 shadow-sm border border-gold-100">
            <h2 className="font-semibold mb-4">{editing ? 'Edit FAQ' : 'New FAQ'}</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Question *</label>
                <input value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" placeholder="Enter question..." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Answer *</label>
                <textarea value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
                  rows={4} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" placeholder="Enter answer..." />
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Order</label>
                  <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))}
                    className="mt-1 w-20 rounded-lg border px-3 py-2 text-sm" />
                </div>
                <label className="flex items-center gap-2 text-sm mt-4">
                  <input type="checkbox" checked={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} />
                  Published
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending}
                  className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                  {saveMutation.isPending ? 'Saving...' : (editing ? 'Update' : 'Create')}
                </button>
                <button onClick={resetForm} className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* FAQ list */}
        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <SkeletonLoader key={i} className="h-16 rounded-xl" />)}</div>
        ) : (
          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <div key={faq._id} className="rounded-xl bg-white p-4 shadow-sm flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-50 text-gold-600 text-xs font-bold flex items-center justify-center mt-0.5">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-charcoal">{faq.question}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggleMutation.mutate({ id: faq._id, isPublished: !faq.isPublished })}
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${faq.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {faq.isPublished ? 'Published' : 'Draft'}
                  </button>
                  <button onClick={() => handleEdit(faq)} className="text-xs text-gold-600 hover:underline">Edit</button>
                  <button onClick={() => confirm('Delete this FAQ?') && deleteMutation.mutate(faq._id)}
                    className="text-xs text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

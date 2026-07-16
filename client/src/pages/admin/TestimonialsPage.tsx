import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { Star, Quote, Plus, X, Edit2, Upload } from 'lucide-react';
import type { Testimonial } from '@/types';

const inputCls = 'w-full bg-[#161616] border border-white/[0.08] px-3 py-2 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-gold/30 transition-colors';
const labelCls = 'text-[11px] text-zinc-500 uppercase tracking-[0.12em] font-semibold mb-1.5 block';

type FormState = {
  customerName: string; designation: string; rating: number; review: string; featured: boolean;
};

const emptyForm: FormState = {
  customerName: '', designation: '', rating: 5, review: '', featured: false,
};

function StarRating({ rating, interactive = false, onChange }: { rating: number; interactive?: boolean; onChange?: (r: number) => void }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 transition-colors ${i < rating ? 'fill-gold text-gold' : 'text-zinc-700'} ${interactive ? 'cursor-pointer hover:text-gold' : ''}`}
          onClick={() => interactive && onChange?.(i + 1)}
        />
      ))}
    </div>
  );
}

function TestimonialSkeleton() {
  return (
    <div className="border border-white/[0.06] bg-[#111111] p-5 animate-pulse space-y-3" style={{ borderRadius: '4px' }}>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-zinc-800" />
        <div className="space-y-1.5"><div className="h-3 bg-zinc-800 rounded w-24" /><div className="h-2.5 bg-zinc-800 rounded w-16" /></div>
      </div>
      <div className="h-2.5 bg-zinc-800 rounded w-full" />
      <div className="h-2.5 bg-zinc-800 rounded w-4/5" />
    </div>
  );
}

export default function AdminTestimonialsPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => axiosInstance.get('/api/v1/testimonials').then(r => r.data.data as Testimonial[]),
  });

  const saveMutation = useMutation({
    mutationFn: (fd: FormData) =>
      editing
        ? axiosInstance.put(`/api/v1/testimonials/${editing._id}`, Object.fromEntries(fd))
        : axiosInstance.post('/api/v1/testimonials', fd),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-testimonials'] }); resetForm(); },
    onError: (e: any) => setError(e?.response?.data?.message ?? 'Save failed'),
  });

  const toggleFeatured = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      axiosInstance.put(`/api/v1/testimonials/${id}`, { featured }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-testimonials'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/api/v1/testimonials/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-testimonials'] }),
    onError: (e: any) => alert(e?.response?.data?.message ?? 'Delete failed'),
  });

  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 5 * 1024 * 1024, maxFiles: 1,
  });

  function resetForm() {
    setEditing(null); setForm(emptyForm); setShowForm(false);
    setImageFile(null); setImagePreview(null); setError('');
  }

  function handleEdit(t: Testimonial) {
    setEditing(t);
    setForm({ customerName: t.customerName, designation: t.designation ?? '', rating: t.rating, review: t.review, featured: t.featured });
    setImagePreview(t.image ?? null);
    setImageFile(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSave() {
    setError('');
    if (!form.customerName.trim()) { setError('Customer name is required.'); return; }
    if (!form.review.trim()) { setError('Review text is required.'); return; }
    const fd = new FormData();
    fd.append('customerName', form.customerName.trim());
    fd.append('rating', String(form.rating));
    fd.append('review', form.review.trim());
    fd.append('featured', String(form.featured));
    if (form.designation.trim()) fd.append('designation', form.designation.trim());
    if (imageFile) fd.append('image', imageFile);
    saveMutation.mutate(fd);
  }

  return (
    <>
      <SEOHead title="Testimonials — Admin" noIndex />
      <div className="min-h-screen bg-[#0f0f0f]">

        {/* Page header */}
        <div className="border-b border-white/[0.06] bg-[#111111] px-6 py-5">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="block h-px w-5 bg-gold/50" />
            <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-semibold">Content</span>
          </div>
          <div className="flex items-end justify-between">
            <h1 className="font-serif text-xl font-bold text-white tracking-widest uppercase">Testimonials</h1>
            <div className="flex items-center gap-3">
              {!isLoading && <span className="text-[11px] text-zinc-600">{data?.length ?? 0} review{(data?.length ?? 0) !== 1 ? 's' : ''}</span>}
              <button
                onClick={() => { resetForm(); setShowForm(true); }}
                className="inline-flex items-center gap-1.5 border border-gold/25 bg-gold/10 px-3 py-1.5 text-xs text-gold font-medium hover:bg-gold/15 transition"
                style={{ borderRadius: '4px' }}
              >
                <Plus className="h-3.5 w-3.5" /> Add Review
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5 max-w-4xl">

          {/* Form */}
          {showForm && (
            <div className="border border-gold/15 bg-[#111111] p-5" style={{ borderRadius: '4px' }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] text-gold uppercase tracking-[0.2em] font-semibold">{editing ? 'Edit Testimonial' : 'New Testimonial'}</p>
                <button onClick={resetForm}><X className="h-4 w-4 text-zinc-600 hover:text-zinc-300" /></button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Customer Name *</label>
                  <input value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
                    placeholder="e.g. Sita Sharma" className={inputCls} style={{ borderRadius: '4px' }} />
                </div>
                <div>
                  <label className={labelCls}>Designation / Event</label>
                  <input value={form.designation} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))}
                    placeholder="e.g. Wedding – April 2025" className={inputCls} style={{ borderRadius: '4px' }} />
                </div>
                <div>
                  <label className={labelCls}>Rating *</label>
                  <div className="pt-1">
                    <StarRating rating={form.rating} interactive onChange={r => setForm(f => ({ ...f, rating: r }))} />
                    <p className="text-[11px] text-zinc-600 mt-1">{form.rating} / 5 stars</p>
                  </div>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                      className={`relative h-5 w-9 rounded-full transition-colors ${form.featured ? 'bg-gold/70' : 'bg-zinc-700'}`}>
                      <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${form.featured ? 'translate-x-4' : ''}`} />
                    </div>
                    <span className="text-xs text-zinc-400">Featured on site</span>
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Review *</label>
                  <textarea value={form.review} onChange={e => setForm(f => ({ ...f, review: e.target.value }))}
                    rows={4} className={`${inputCls} resize-none`} placeholder="Customer's review text…"
                    style={{ borderRadius: '4px' }} />
                </div>

                {/* Photo upload */}
                <div className="sm:col-span-2">
                  <label className={labelCls}>Photo (optional)</label>
                  <div className="flex items-start gap-4">
                    {imagePreview && (
                      <div className="relative shrink-0">
                        <img src={imagePreview} alt="preview" className="h-16 w-16 object-cover rounded-full border border-white/[0.08]" />
                        <button onClick={() => { setImageFile(null); setImagePreview(null); }}
                          className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
                          <X className="h-2.5 w-2.5 text-white" />
                        </button>
                      </div>
                    )}
                    <div {...getRootProps()} className={`flex-1 border-2 border-dashed p-4 text-center cursor-pointer transition-colors ${isDragActive ? 'border-gold/50 bg-gold/[0.03]' : 'border-white/[0.08] hover:border-white/[0.18]'}`} style={{ borderRadius: '4px' }}>
                      <input {...getInputProps()} />
                      <Upload className={`h-4 w-4 mx-auto mb-1 ${isDragActive ? 'text-gold' : 'text-zinc-700'}`} />
                      <p className="text-[11px] text-zinc-600">{isDragActive ? 'Drop here…' : 'Drag or click · max 5 MB'}</p>
                    </div>
                  </div>
                </div>
              </div>
              {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
              <div className="flex gap-2 mt-4">
                <button onClick={handleSave} disabled={saveMutation.isPending}
                  className="px-4 py-2 bg-gold/15 border border-gold/25 text-gold text-xs font-semibold hover:bg-gold/20 transition disabled:opacity-40"
                  style={{ borderRadius: '4px' }}>
                  {saveMutation.isPending ? 'Saving…' : editing ? 'Update' : 'Create'}
                </button>
                <button onClick={resetForm}
                  className="px-4 py-2 border border-white/[0.06] bg-white/[0.02] text-zinc-500 text-xs hover:text-zinc-200 transition"
                  style={{ borderRadius: '4px' }}>Cancel</button>
              </div>
            </div>
          )}

          {/* List */}
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <TestimonialSkeleton key={i} />)}
            </div>
          ) : (data ?? []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-700">
              <Star className="h-10 w-10 mb-3" />
              <p className="text-sm">No testimonials yet. Add one above.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(data ?? []).map(t => (
                <div key={t._id}
                  className={`border border-white/[0.06] bg-[#111111] p-5 transition hover:border-white/[0.12] ${t.featured ? 'ring-1 ring-gold/15' : ''}`}
                  style={{ borderRadius: '4px' }}
                >
                  {t.featured && (
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="h-3 w-3 fill-gold text-gold" />
                      <span className="text-[10px] text-gold uppercase tracking-[0.15em] font-semibold">Featured</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    {t.image ? (
                      <img src={t.image} alt={t.customerName} className="h-10 w-10 rounded-full object-cover border border-white/[0.08]" />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] font-serif font-bold text-zinc-400 text-sm">
                        {t.customerName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{t.customerName}</p>
                      {t.designation && <p className="text-[11px] text-zinc-600 truncate">{t.designation}</p>}
                    </div>
                    <div className="ml-auto shrink-0"><StarRating rating={t.rating} /></div>
                  </div>

                  <div className="relative mb-4">
                    <Quote className="absolute -top-1 -left-0.5 h-4 w-4 text-gold/20" />
                    <p className="text-xs text-zinc-400 leading-relaxed pl-4 line-clamp-4">{t.review}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-white/[0.04]">
                    <button onClick={() => handleEdit(t)}
                      className="inline-flex items-center gap-1 text-[11px] text-gold/60 hover:text-gold transition-colors font-medium">
                      <Edit2 className="h-3 w-3" /> Edit
                    </button>
                    <button onClick={() => toggleFeatured.mutate({ id: t._id, featured: !t.featured })}
                      className={`text-[11px] px-2 py-0.5 rounded-full transition ml-1 ${t.featured ? 'bg-zinc-700/50 text-zinc-400 hover:bg-zinc-700' : 'bg-gold/10 text-gold hover:bg-gold/20'}`}>
                      {t.featured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button
                      onClick={() => { if (confirm('Delete this review?')) deleteMutation.mutate(t._id); }}
                      disabled={deleteMutation.isPending}
                      className="text-[11px] text-zinc-700 hover:text-red-400 transition-colors disabled:opacity-40 ml-auto">
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

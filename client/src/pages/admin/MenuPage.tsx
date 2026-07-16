import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { UtensilsCrossed, Plus, X, Edit2, Upload } from 'lucide-react';
import type { MenuItem } from '@/types';
import { MENU_CATEGORIES } from '@/constants';

const CAT_COLORS: Record<string, string> = {
  nepali:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  newari:   'bg-orange-500/10 text-orange-400 border-orange-500/20',
  indian:   'bg-red-500/10 text-red-400 border-red-500/20',
  chinese:  'bg-rose-500/10 text-rose-400 border-rose-500/20',
  bbq:      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  dessert:  'bg-pink-500/10 text-pink-400 border-pink-500/20',
  beverage: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const inputCls = 'w-full bg-[#161616] border border-white/[0.08] px-3 py-2 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-gold/30 transition-colors';
const labelCls = 'text-[11px] text-zinc-500 uppercase tracking-[0.12em] font-semibold mb-1.5 block';

type FormState = {
  name: string; description: string;
  category: typeof MENU_CATEGORIES[number];
  price: string; available: boolean;
};

const emptyForm: FormState = {
  name: '', description: '', category: 'nepali', price: '', available: true,
};

function ItemSkeleton() {
  return (
    <div className="flex items-center gap-3 border border-white/[0.04] bg-[#161616] p-3 animate-pulse" style={{ borderRadius: '4px' }}>
      <div className="h-12 w-12 shrink-0 bg-zinc-800 rounded" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-zinc-800 rounded w-32" />
        <div className="h-2.5 bg-zinc-800 rounded w-16" />
      </div>
    </div>
  );
}

export default function AdminMenuPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-menu'],
    queryFn: () => axiosInstance.get('/api/v1/menu').then(r => r.data.data as MenuItem[]),
  });

  const saveMutation = useMutation({
    mutationFn: (fd: FormData) =>
      editing
        ? axiosInstance.put(`/api/v1/menu/${editing._id}`, Object.fromEntries(fd))
        : axiosInstance.post('/api/v1/menu', fd),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-menu'] }); resetForm(); },
    onError: (e: any) => setError(e?.response?.data?.message ?? 'Save failed'),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, available }: { id: string; available: boolean }) =>
      axiosInstance.put(`/api/v1/menu/${id}`, { available }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-menu'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/api/v1/menu/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-menu'] }),
    onError: (e: any) => alert(e?.response?.data?.message ?? 'Delete failed'),
  });

  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 10 * 1024 * 1024, maxFiles: 1,
  });

  function resetForm() {
    setEditing(null); setForm(emptyForm); setShowForm(false);
    setImageFile(null); setImagePreview(null); setError('');
  }

  function handleEdit(item: MenuItem) {
    setEditing(item);
    setForm({
      name: item.name, description: item.description ?? '',
      category: item.category as typeof MENU_CATEGORIES[number],
      price: item.price != null ? String(item.price) : '',
      available: item.available !== false,
    });
    setImagePreview(item.image ?? null);
    setImageFile(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSave() {
    setError('');
    if (!form.name.trim()) { setError('Name is required.'); return; }
    const fd = new FormData();
    fd.append('name', form.name.trim());
    fd.append('category', form.category);
    fd.append('available', String(form.available));
    if (form.description.trim()) fd.append('description', form.description.trim());
    if (form.price) fd.append('price', form.price);
    if (imageFile) fd.append('image', imageFile);
    saveMutation.mutate(fd);
  }

  const totalItems = data?.length ?? 0;

  return (
    <>
      <SEOHead title="Menu — Admin" noIndex />
      <div className="min-h-screen bg-[#0f0f0f]">

        {/* Page header */}
        <div className="border-b border-white/[0.06] bg-[#111111] px-6 py-5">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="block h-px w-5 bg-gold/50" />
            <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-semibold">Content</span>
          </div>
          <div className="flex items-end justify-between">
            <h1 className="font-serif text-xl font-bold text-white tracking-widest uppercase">Menu</h1>
            <div className="flex items-center gap-3">
              {!isLoading && <span className="text-[11px] text-zinc-600">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>}
              <button
                onClick={() => { resetForm(); setShowForm(true); }}
                className="inline-flex items-center gap-1.5 border border-gold/25 bg-gold/10 px-3 py-1.5 text-xs text-gold font-medium hover:bg-gold/15 transition"
                style={{ borderRadius: '4px' }}
              >
                <Plus className="h-3.5 w-3.5" /> Add Item
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 max-w-4xl">

          {/* Form */}
          {showForm && (
            <div className="border border-gold/15 bg-[#111111] p-5" style={{ borderRadius: '4px' }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] text-gold uppercase tracking-[0.2em] font-semibold">{editing ? 'Edit Item' : 'New Menu Item'}</p>
                <button onClick={resetForm}><X className="h-4 w-4 text-zinc-600 hover:text-zinc-300" /></button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Dal Bhat" className={inputCls} style={{ borderRadius: '4px' }} />
                </div>
                <div>
                  <label className={labelCls}>Category *</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as typeof MENU_CATEGORIES[number] }))}
                    className={`${inputCls} capitalize`} style={{ borderRadius: '4px' }}>
                    {MENU_CATEGORIES.map(c => <option key={c} value={c} className="bg-[#1a1a1a] capitalize">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Price (NPR)</label>
                  <input type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="Optional" className={inputCls} style={{ borderRadius: '4px' }} />
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div onClick={() => setForm(f => ({ ...f, available: !f.available }))}
                      className={`relative h-5 w-9 rounded-full transition-colors ${form.available ? 'bg-gold/70' : 'bg-zinc-700'}`}>
                      <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${form.available ? 'translate-x-4' : ''}`} />
                    </div>
                    <span className="text-xs text-zinc-400">Available</span>
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={2} className={`${inputCls} resize-none`} placeholder="Optional description"
                    style={{ borderRadius: '4px' }} />
                </div>

                {/* Image upload */}
                <div className="sm:col-span-2">
                  <label className={labelCls}>Image</label>
                  <div className="flex items-start gap-4">
                    {imagePreview && (
                      <div className="relative shrink-0">
                        <img src={imagePreview} alt="preview" className="h-20 w-20 object-cover border border-white/[0.08]" style={{ borderRadius: '4px' }} />
                        <button onClick={() => { setImageFile(null); setImagePreview(null); }}
                          className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
                          <X className="h-2.5 w-2.5 text-white" />
                        </button>
                      </div>
                    )}
                    <div {...getRootProps()} className={`flex-1 border-2 border-dashed p-4 text-center cursor-pointer transition-colors ${isDragActive ? 'border-gold/50 bg-gold/[0.03]' : 'border-white/[0.08] hover:border-white/[0.18]'}`} style={{ borderRadius: '4px' }}>
                      <input {...getInputProps()} />
                      <Upload className={`h-4 w-4 mx-auto mb-1 ${isDragActive ? 'text-gold' : 'text-zinc-700'}`} />
                      <p className="text-[11px] text-zinc-600">{isDragActive ? 'Drop here…' : 'Drag or click · JPG, PNG, WebP'}</p>
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

          {/* Items grouped by category */}
          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, gi) => (
                <div key={gi}>
                  <div className="h-3 bg-zinc-800 rounded w-24 mb-3 animate-pulse" />
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => <ItemSkeleton key={i} />)}
                  </div>
                </div>
              ))}
            </div>
          ) : totalItems === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-700">
              <UtensilsCrossed className="h-10 w-10 mb-3" />
              <p className="text-sm">No menu items yet. Add one above.</p>
            </div>
          ) : (
            MENU_CATEGORIES.map(cat => {
              const items = (data ?? []).filter(i => i.category === cat);
              if (items.length === 0) return null;
              const catStyle = CAT_COLORS[cat] ?? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
              return (
                <div key={cat}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full ${catStyle}`}>{cat}</span>
                    <span className="text-[11px] text-zinc-700">{items.length} item{items.length !== 1 ? 's' : ''}</span>
                    <span className="flex-1 h-px bg-white/[0.04]" />
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map(item => (
                      <div key={item._id}
                        className="flex items-center gap-3 border border-white/[0.06] bg-[#111111] p-3 hover:border-white/[0.1] transition group"
                        style={{ borderRadius: '4px' }}
                      >
                        {item.image ? (
                          <img src={item.image} alt={item.name}
                            className="h-12 w-12 shrink-0 object-cover border border-white/[0.04]"
                            style={{ borderRadius: '4px' }} loading="lazy" />
                        ) : (
                          <div className="h-12 w-12 shrink-0 flex items-center justify-center border border-white/[0.04] bg-white/[0.02]" style={{ borderRadius: '4px' }}>
                            <UtensilsCrossed className="h-4 w-4 text-zinc-700" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-zinc-200 truncate">{item.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {item.price != null && <p className="text-xs text-gold/80">NPR {item.price.toLocaleString()}</p>}
                            <button
                              onClick={() => toggleMutation.mutate({ id: item._id, available: !(item.available !== false) })}
                              className={`text-[10px] px-1.5 py-0.5 rounded-full transition ${item.available !== false ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'}`}>
                              {item.available !== false ? 'Available' : 'Unavailable'}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button onClick={() => handleEdit(item)} className="text-[11px] text-gold/60 hover:text-gold transition-colors">
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => { if (confirm(`Delete "${item.name}"?`)) deleteMutation.mutate(item._id); }}
                            disabled={deleteMutation.isPending}
                            className="text-[11px] text-zinc-700 hover:text-red-400 transition-colors disabled:opacity-40">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

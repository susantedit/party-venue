import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { Package as PackageIcon, Plus, X, Users, Sparkles, Edit2 } from 'lucide-react';
import type { Package } from '@/types';

const CATEGORIES = ['silver', 'gold', 'platinum', 'custom'] as const;

const CAT_STYLES: Record<string, string> = {
  silver:   'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  gold:     'bg-gold/10 text-gold border-gold/20',
  platinum: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  custom:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const inputCls = 'w-full bg-[#161616] border border-white/[0.08] px-3 py-2 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-gold/30 transition-colors';
const labelCls = 'text-[11px] text-zinc-500 uppercase tracking-[0.12em] font-semibold mb-1.5 block';

type FormState = {
  name: string; description: string; category: typeof CATEGORIES[number];
  price: string; capacity: string; features: string;
  isPopular: boolean; isActive: boolean;
};

const emptyForm: FormState = {
  name: '', description: '', category: 'gold',
  price: '', capacity: '', features: '',
  isPopular: false, isActive: true,
};

function PackageSkeleton() {
  return (
    <div className="border border-white/[0.06] bg-[#111111] p-5 animate-pulse space-y-3" style={{ borderRadius: '4px' }}>
      <div className="h-3 bg-zinc-800 rounded w-20" />
      <div className="h-5 bg-zinc-800 rounded w-36" />
      <div className="h-3 bg-zinc-800 rounded w-full" />
      <div className="h-6 bg-zinc-800 rounded w-28" />
    </div>
  );
}

export default function AdminPackagesPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Package | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-packages'],
    queryFn: () => axiosInstance.get('/api/v1/packages').then(r => r.data.data as Package[]),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: object) =>
      editing
        ? axiosInstance.put(`/api/v1/packages/${editing._id}`, payload)
        : axiosInstance.post('/api/v1/packages', payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-packages'] }); resetForm(); },
    onError: (e: any) => setError(e?.response?.data?.message ?? 'Save failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/api/v1/packages/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-packages'] }),
    onError: (e: any) => alert(e?.response?.data?.message ?? 'Delete failed'),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      axiosInstance.put(`/api/v1/packages/${id}`, { isActive }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-packages'] }),
  });

  function resetForm() { setEditing(null); setForm(emptyForm); setShowForm(false); setError(''); }

  function handleEdit(pkg: Package) {
    setEditing(pkg);
    setForm({
      name: pkg.name, description: pkg.description,
      category: pkg.category as typeof CATEGORIES[number],
      price: String(pkg.price), capacity: String(pkg.capacity),
      features: pkg.features.join('\n'),
      isPopular: pkg.isPopular, isActive: pkg.isActive,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSave() {
    setError('');
    if (!form.name.trim() || !form.description.trim() || !form.price || !form.capacity) {
      setError('Name, description, price, and capacity are required.'); return;
    }
    const features = form.features.split('\n').map(f => f.trim()).filter(Boolean);
    if (features.length === 0) { setError('At least one feature is required.'); return; }
    saveMutation.mutate({
      name: form.name.trim(), description: form.description.trim(),
      category: form.category, price: Number(form.price),
      capacity: Number(form.capacity), features,
      isPopular: form.isPopular, isActive: form.isActive,
    });
  }

  return (
    <>
      <SEOHead title="Packages — Admin" noIndex />
      <div className="min-h-screen bg-[#0f0f0f]">

        {/* Page header */}
        <div className="border-b border-white/[0.06] bg-[#111111] px-6 py-5">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="block h-px w-5 bg-gold/50" />
            <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-semibold">Content</span>
          </div>
          <div className="flex items-end justify-between">
            <h1 className="font-serif text-xl font-bold text-white tracking-widest uppercase">Packages</h1>
            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="inline-flex items-center gap-1.5 border border-gold/25 bg-gold/10 px-3 py-1.5 text-xs text-gold font-medium hover:bg-gold/15 transition"
              style={{ borderRadius: '4px' }}
            >
              <Plus className="h-3.5 w-3.5" /> Add Package
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5 max-w-4xl">

          {/* Form */}
          {showForm && (
            <div className="border border-gold/15 bg-[#111111] p-5" style={{ borderRadius: '4px' }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] text-gold uppercase tracking-[0.2em] font-semibold">{editing ? 'Edit Package' : 'New Package'}</p>
                <button onClick={resetForm}><X className="h-4 w-4 text-zinc-600 hover:text-zinc-300" /></button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Gold Package" className={inputCls} style={{ borderRadius: '4px' }} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Description *</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={2} className={`${inputCls} resize-none`} placeholder="Package description" style={{ borderRadius: '4px' }} />
                </div>
                <div>
                  <label className={labelCls}>Category *</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as typeof CATEGORIES[number] }))}
                    className={inputCls} style={{ borderRadius: '4px' }}>
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#1a1a1a] capitalize">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Price (NPR) *</label>
                  <input type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="e.g. 150000" className={inputCls} style={{ borderRadius: '4px' }} />
                </div>
                <div>
                  <label className={labelCls}>Capacity (guests) *</label>
                  <input type="number" min="1" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))}
                    placeholder="e.g. 500" className={inputCls} style={{ borderRadius: '4px' }} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Features (one per line) *</label>
                  <textarea value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))}
                    rows={4} className={`${inputCls} resize-none`} placeholder={"Venue setup\nCatering included\nParking for 100 cars"}
                    style={{ borderRadius: '4px' }} />
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div onClick={() => setForm(f => ({ ...f, isPopular: !f.isPopular }))}
                      className={`relative h-5 w-9 rounded-full transition-colors ${form.isPopular ? 'bg-gold/70' : 'bg-zinc-700'}`}>
                      <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${form.isPopular ? 'translate-x-4' : ''}`} />
                    </div>
                    <span className="text-xs text-zinc-400">Popular</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                      className={`relative h-5 w-9 rounded-full transition-colors ${form.isActive ? 'bg-gold/70' : 'bg-zinc-700'}`}>
                      <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${form.isActive ? 'translate-x-4' : ''}`} />
                    </div>
                    <span className="text-xs text-zinc-400">Active</span>
                  </label>
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

          {/* Package list */}
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => <PackageSkeleton key={i} />)}
            </div>
          ) : (data ?? []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-700">
              <PackageIcon className="h-10 w-10 mb-3" />
              <p className="text-sm">No packages yet</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {(data ?? []).map(pkg => (
                <div key={pkg._id} className={`relative border border-white/[0.06] bg-[#111111] p-5 hover:border-white/[0.12] transition ${pkg.isPopular ? 'ring-1 ring-gold/20' : ''}`} style={{ borderRadius: '4px' }}>
                  {pkg.isPopular && (
                    <div className="absolute -top-px left-4 inline-flex items-center gap-1 bg-gold/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0d0d0d]" style={{ borderRadius: '0 0 4px 4px' }}>
                      <Sparkles className="h-2.5 w-2.5" /> Most Popular
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-3 mt-1">
                    <span className={`border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide rounded-full ${CAT_STYLES[pkg.category] ?? CAT_STYLES.custom}`}>{pkg.category}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${pkg.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {pkg.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <div className="ml-auto flex items-center gap-2">
                      <button onClick={() => handleEdit(pkg)} className="text-[11px] text-gold/60 hover:text-gold transition-colors font-medium inline-flex items-center gap-1">
                        <Edit2 className="h-3 w-3" /> Edit
                      </button>
                      <button onClick={() => toggleMutation.mutate({ id: pkg._id, isActive: !pkg.isActive })}
                        className="text-[11px] text-zinc-600 hover:text-zinc-300 transition-colors">
                        {pkg.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => { if (confirm('Delete this package?')) deleteMutation.mutate(pkg._id); }}
                        disabled={deleteMutation.isPending}
                        className="text-[11px] text-zinc-700 hover:text-red-400 transition-colors disabled:opacity-40">Delete</button>
                    </div>
                  </div>
                  <h2 className="font-serif font-bold text-white text-base mb-1">{pkg.name}</h2>
                  <p className="text-xs text-zinc-500 mb-3 leading-relaxed line-clamp-2">{pkg.description}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="font-serif text-xl font-bold text-gold">NPR {pkg.price.toLocaleString()}</p>
                      <p className="flex items-center gap-1 text-[11px] text-zinc-600 mt-0.5"><Users className="h-3 w-3" /> {pkg.capacity} guests</p>
                    </div>
                  </div>
                  {pkg.features && pkg.features.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/[0.04]">
                      <ul className="space-y-1">
                        {pkg.features.slice(0, 3).map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-xs text-zinc-500"><span className="text-gold/60">✓</span>{f}</li>
                        ))}
                        {pkg.features.length > 3 && <li className="text-xs text-zinc-700">+{pkg.features.length - 3} more</li>}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

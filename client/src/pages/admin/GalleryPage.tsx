import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { Upload, Trash2, Image as ImageIcon, Star, Edit2, X, Check } from 'lucide-react';
import type { GalleryImage } from '@/types';

const CATEGORIES = ['venue', 'wedding', 'reception', 'birthday', 'catering', 'decoration'];

const CAT_STYLES: Record<string, string> = {
  venue:       'bg-blue-500/10 text-blue-400',
  wedding:     'bg-pink-500/10 text-pink-400',
  reception:   'bg-violet-500/10 text-violet-400',
  birthday:    'bg-amber-500/10 text-amber-400',
  catering:    'bg-emerald-500/10 text-emerald-400',
  decoration:  'bg-rose-500/10 text-rose-400',
};

const inputClass = 'w-full bg-[#161616] border border-white/[0.08] px-3 py-2 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-gold/30 transition-colors';

function ImageSkeleton() {
  return <div className="aspect-square bg-zinc-900 border border-white/[0.04] animate-pulse" style={{ borderRadius: '4px' }} />;
}

interface EditState { altText: string; category: string; featured: boolean; }

export default function AdminGalleryPage() {
  const qc = useQueryClient();
  const [uploadCategory, setUploadCategory] = useState('venue');
  const [uploadAltText, setUploadAltText] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [editing, setEditing] = useState<{ id: string; state: EditState } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: () => axiosInstance.get('/api/v1/gallery').then(r => r.data.data as GalleryImage[]),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/api/v1/gallery/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-gallery'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EditState> }) =>
      axiosInstance.put(`/api/v1/gallery/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-gallery'] }); setEditing(null); },
  });

  const uploadMutation = useMutation({
    mutationFn: (form: FormData) => axiosInstance.post('/api/v1/gallery', form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-gallery'] }); setUploadAltText(''); },
  });

  const onDrop = useCallback((files: File[]) => {
    files.forEach(file => {
      const form = new FormData();
      form.append('image', file);
      form.append('category', uploadCategory);
      if (uploadAltText.trim()) form.append('altText', uploadAltText.trim());
      uploadMutation.mutate(form);
    });
  }, [uploadMutation, uploadCategory, uploadAltText]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 10 * 1024 * 1024,
  });

  const filtered = filterCat ? (data ?? []).filter(i => i.category === filterCat) : (data ?? []);

  return (
    <>
      <SEOHead title="Gallery — Admin" noIndex />
      <div className="min-h-screen bg-[#0f0f0f]">

        {/* Page header */}
        <div className="border-b border-white/[0.06] bg-[#111111] px-6 py-5">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="block h-px w-5 bg-gold/50" />
            <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-semibold">Media</span>
          </div>
          <div className="flex items-end justify-between">
            <h1 className="font-serif text-xl font-bold text-white tracking-widest uppercase">Gallery</h1>
            {!isLoading && (
              <span className="text-[11px] text-zinc-600">{filtered.length} image{filtered.length !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>

        <div className="p-6 space-y-5">

          {/* Upload zone */}
          <div className="border border-white/[0.06] bg-[#111111] p-5" style={{ borderRadius: '4px' }}>
            <p className="text-[10px] text-zinc-600 uppercase tracking-[0.15em] font-semibold mb-3">Upload Images</p>

            {/* Category + alt text */}
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-zinc-600">Category:</span>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setUploadCategory(cat)}
                    className={`px-3 py-1 text-xs font-medium capitalize transition ${
                      uploadCategory === cat
                        ? 'bg-gold/15 border border-gold/30 text-gold'
                        : 'bg-white/[0.02] border border-white/[0.06] text-zinc-500 hover:text-zinc-300'
                    }`}
                    style={{ borderRadius: '4px' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex-1 min-w-[200px]">
                <input
                  value={uploadAltText}
                  onChange={e => setUploadAltText(e.target.value)}
                  placeholder="Alt text (optional but recommended for SEO)"
                  className={`${inputClass} text-xs`}
                  style={{ borderRadius: '4px' }}
                />
              </div>
            </div>

            {/* Drop zone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-gold/50 bg-gold/[0.03]' : 'border-white/[0.08] hover:border-white/[0.15]'
              }`}
              style={{ borderRadius: '4px' }}
            >
              <input {...getInputProps()} />
              <Upload className={`h-6 w-6 mx-auto mb-2 transition-colors ${isDragActive ? 'text-gold' : 'text-zinc-700'}`} />
              <p className="text-xs text-zinc-600">
                {isDragActive
                  ? <span className="text-gold">Drop images here…</span>
                  : 'Drag & drop or click to upload · JPG, PNG, WebP · max 10 MB'
                }
              </p>
              {uploadMutation.isPending && <p className="mt-2 text-xs text-gold animate-pulse">Uploading…</p>}
              {uploadMutation.isError && <p className="mt-2 text-xs text-red-400">Upload failed. Check file type and size.</p>}
            </div>
          </div>

          {/* Category filter tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCat('')}
              className={`px-3 py-1 text-xs font-medium capitalize transition ${
                filterCat === '' ? 'bg-gold/15 border border-gold/30 text-gold' : 'bg-white/[0.02] border border-white/[0.06] text-zinc-500 hover:text-zinc-300'
              }`}
              style={{ borderRadius: '4px' }}
            >
              All ({data?.length ?? 0})
            </button>
            {CATEGORIES.map(cat => {
              const count = (data ?? []).filter(i => i.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCat(cat)}
                  className={`px-3 py-1 text-xs font-medium capitalize transition ${
                    filterCat === cat ? 'bg-gold/15 border border-gold/30 text-gold' : 'bg-white/[0.02] border border-white/[0.06] text-zinc-500 hover:text-zinc-300'
                  }`}
                  style={{ borderRadius: '4px' }}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => <ImageSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-700">
              <ImageIcon className="h-10 w-10 mb-3" />
              <p className="text-sm">No images {filterCat ? `in "${filterCat}"` : 'yet'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filtered.map(img => {
                const isEditing = editing?.id === img._id;
                return (
                  <div key={img._id} className="group relative overflow-hidden border border-white/[0.04] bg-zinc-900" style={{ borderRadius: '4px' }}>
                    <div className="aspect-square">
                      <img
                        src={img.imageUrl}
                        alt={img.altText ?? img.category}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    {/* Featured star */}
                    {img.featured && (
                      <span className="absolute top-2 left-2 flex h-5 w-5 items-center justify-center bg-gold/80 rounded-full">
                        <Star className="h-2.5 w-2.5 fill-white text-white" />
                      </span>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-2">
                      <button
                        onClick={() => setEditing({ id: img._id, state: { altText: img.altText ?? '', category: img.category, featured: img.featured ?? false } })}
                        className="inline-flex items-center gap-1 bg-gold/80 hover:bg-gold px-3 py-1.5 text-xs text-[#0a0a0a] font-medium transition w-full justify-center"
                        style={{ borderRadius: '4px' }}
                      >
                        <Edit2 className="h-3 w-3" /> Edit
                      </button>
                      <button
                        onClick={() => updateMutation.mutate({ id: img._id, data: { featured: !img.featured } })}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition w-full justify-center ${
                          img.featured ? 'bg-zinc-700/80 hover:bg-zinc-700 text-zinc-300' : 'bg-amber-500/20 hover:bg-amber-500/40 text-amber-400'
                        }`}
                        style={{ borderRadius: '4px' }}
                      >
                        <Star className="h-3 w-3" /> {img.featured ? 'Unfeature' : 'Feature'}
                      </button>
                      <button
                        onClick={() => { if (confirm('Delete this image?')) deleteMutation.mutate(img._id); }}
                        disabled={deleteMutation.isPending}
                        className="inline-flex items-center gap-1 bg-red-500/80 hover:bg-red-500 px-3 py-1.5 text-xs text-white font-medium transition disabled:opacity-40 w-full justify-center"
                        style={{ borderRadius: '4px' }}
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>

                    {/* Category badge */}
                    <span className={`absolute bottom-2 left-2 px-1.5 py-0.5 text-[10px] font-medium rounded ${CAT_STYLES[img.category] ?? 'bg-zinc-700/80 text-zinc-300'}`}>
                      {img.category}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Edit panel (slide-in modal) */}
        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setEditing(null)}>
            <div
              className="w-full max-w-sm bg-[#161616] border border-white/[0.1] p-5 space-y-4"
              style={{ borderRadius: '6px' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-gold uppercase tracking-[0.2em] font-semibold">Edit Image</p>
                <button onClick={() => setEditing(null)}><X className="h-4 w-4 text-zinc-500 hover:text-zinc-200" /></button>
              </div>

              <div>
                <label className="text-[11px] text-zinc-500 uppercase tracking-[0.12em] font-semibold mb-1.5 block">Alt Text (SEO)</label>
                <input
                  value={editing.state.altText}
                  onChange={e => setEditing(prev => prev && ({ ...prev, state: { ...prev.state, altText: e.target.value } }))}
                  placeholder="Describe the image for search engines"
                  className={inputClass}
                  style={{ borderRadius: '4px' }}
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-500 uppercase tracking-[0.12em] font-semibold mb-1.5 block">Category</label>
                <select
                  value={editing.state.category}
                  onChange={e => setEditing(prev => prev && ({ ...prev, state: { ...prev.state, category: e.target.value } }))}
                  className={`${inputClass} capitalize`}
                  style={{ borderRadius: '4px' }}
                >
                  {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#1a1a1a] capitalize">{c}</option>)}
                </select>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setEditing(prev => prev && ({ ...prev, state: { ...prev.state, featured: !prev.state.featured } }))}
                  className={`relative h-5 w-9 rounded-full transition-colors ${editing.state.featured ? 'bg-gold/70' : 'bg-zinc-700'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${editing.state.featured ? 'translate-x-4' : ''}`} />
                </div>
                <span className="text-xs text-zinc-400">Featured (shown on homepage)</span>
              </label>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => updateMutation.mutate({ id: editing.id, data: editing.state })}
                  disabled={updateMutation.isPending}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-gold/15 border border-gold/25 text-gold text-xs font-semibold hover:bg-gold/20 transition disabled:opacity-40"
                  style={{ borderRadius: '4px' }}
                >
                  <Check className="h-3.5 w-3.5" /> {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 border border-white/[0.06] bg-white/[0.02] text-zinc-500 text-xs hover:text-zinc-200 transition"
                  style={{ borderRadius: '4px' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

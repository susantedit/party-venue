import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';
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

function ImageSkeleton() {
  return (
    <div className="aspect-square bg-zinc-900 border border-white/[0.04] animate-pulse" style={{ borderRadius: '4px' }} />
  );
}

export default function AdminGalleryPage() {
  const qc = useQueryClient();
  const [category, setCategory] = useState('venue');
  const [filterCat, setFilterCat] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: () => axiosInstance.get('/api/v1/gallery').then(r => r.data.data as GalleryImage[]),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/api/v1/gallery/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-gallery'] }),
  });

  const uploadMutation = useMutation({
    mutationFn: (form: FormData) => axiosInstance.post('/api/v1/gallery', form),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-gallery'] }),
  });

  const onDrop = useCallback((files: File[]) => {
    files.forEach(file => {
      const form = new FormData();
      form.append('image', file);
      form.append('category', category);
      uploadMutation.mutate(form);
    });
  }, [uploadMutation, category]);

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

            {/* Category select */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs text-zinc-600 self-center mr-1">Upload to:</span>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 text-xs font-medium capitalize transition ${
                    category === cat
                      ? 'bg-gold/15 border border-gold/30 text-gold'
                      : 'bg-white/[0.02] border border-white/[0.06] text-zinc-500 hover:text-zinc-300'
                  }`}
                  style={{ borderRadius: '4px' }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Drop zone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-gold/50 bg-gold/[0.03]'
                  : 'border-white/[0.08] hover:border-white/[0.15]'
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
              {uploadMutation.isPending && (
                <p className="mt-2 text-xs text-gold animate-pulse">Uploading…</p>
              )}
            </div>
          </div>

          {/* Category filter tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCat('')}
              className={`px-3 py-1 text-xs font-medium capitalize transition ${
                filterCat === ''
                  ? 'bg-gold/15 border border-gold/30 text-gold'
                  : 'bg-white/[0.02] border border-white/[0.06] text-zinc-500 hover:text-zinc-300'
              }`}
              style={{ borderRadius: '4px' }}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-3 py-1 text-xs font-medium capitalize transition ${
                  filterCat === cat
                    ? 'bg-gold/15 border border-gold/30 text-gold'
                    : 'bg-white/[0.02] border border-white/[0.06] text-zinc-500 hover:text-zinc-300'
                }`}
                style={{ borderRadius: '4px' }}
              >
                {cat}
              </button>
            ))}
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
              {filtered.map(img => (
                <div key={img._id} className="group relative overflow-hidden border border-white/[0.04] bg-zinc-900 aspect-square" style={{ borderRadius: '4px' }}>
                  <img
                    src={img.imageUrl}
                    alt={img.altText ?? img.category}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                    <button
                      onClick={() => { if (confirm('Delete this image?')) deleteMutation.mutate(img._id); }}
                      disabled={deleteMutation.isPending}
                      className="inline-flex items-center gap-1.5 bg-red-500/80 hover:bg-red-500 px-3 py-1.5 text-xs text-white font-medium transition disabled:opacity-40"
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
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

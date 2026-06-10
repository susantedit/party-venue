import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { SkeletonLoader } from '@/components/shared/SkeletonLoader';
import type { GalleryImage } from '@/types';

export default function AdminGalleryPage() {
  const qc = useQueryClient();
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
      form.append('category', 'venue');
      uploadMutation.mutate(form);
    });
  }, [uploadMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 10 * 1024 * 1024,
  });

  return (
    <>
      <SEOHead title="Gallery Management" noIndex />
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="mb-4 font-serif text-2xl font-bold text-charcoal">Gallery</h1>
        <div {...getRootProps()} className={`mb-6 rounded-xl border-2 border-dashed p-8 text-center cursor-pointer ${isDragActive ? 'border-gold-500 bg-gold-50' : 'border-gray-300'}`}>
          <input {...getInputProps()} />
          <p className="text-gray-500">{isDragActive ? 'Drop images here...' : 'Drag & drop or click to upload images (JPG, PNG, WebP, max 10MB)'}</p>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({length:8}).map((_,i) => <SkeletonLoader key={i} className="h-40 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data?.map(img => (
              <div key={img._id} className="group relative overflow-hidden rounded-xl">
                <img src={img.imageUrl} alt={img.altText ?? img.category} className="h-40 w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                  <button onClick={() => { if (confirm('Delete this image?')) deleteMutation.mutate(img._id); }}
                    className="rounded-lg bg-red-500 px-3 py-1 text-sm text-white">Delete</button>
                </div>
                <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">{img.category}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

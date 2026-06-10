import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { SkeletonLoader } from '@/components/shared/SkeletonLoader';
import { Lightbox } from '@/components/shared/Lightbox';
import { GALLERY_CATEGORIES } from '@/constants';
import type { GalleryImage } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['gallery', activeCategory],
    queryFn: () =>
      axiosInstance
        .get('/api/v1/gallery', { params: activeCategory !== 'all' ? { category: activeCategory } : {} })
        .then((r) => r.data.data as GalleryImage[]),
  });

  const lightboxImages = images.map((img) => ({ src: img.imageUrl, alt: img.altText ?? img.category }));

  return (
    <>
      <SEOHead
        title="Event Gallery"
        description="Browse photos from weddings, receptions, birthdays, and more at Shree Ganesh Party Venue, Bhaktapur."
        canonicalUrl="https://shreeganeshsharma.com/gallery"
      />

      {lightboxIndex !== null && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => Math.max(0, (i ?? 0) - 1))}
          onNext={() => setLightboxIndex((i) => Math.min(images.length - 1, (i ?? 0) + 1))}
        />
      )}

      <div className="bg-zinc-950 pt-24 pb-16 px-4">
        <div className="relative z-10 mx-auto max-w-7xl">
          <PageHeader
            title="Event Gallery"
            description="Relive the magic of past celebrations."
            breadcrumb="Gallery"
          />

          {/* Category filters */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                activeCategory === 'all' ? 'bg-gold-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
                  activeCategory === cat ? 'bg-gold-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry grid */}
          {isLoading ? (
            <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonLoader key={i} className={`mb-3 w-full rounded-xl ${i % 3 === 0 ? 'h-60' : 'h-40'}`} />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="py-16 text-center text-gray-400">No images found for this category.</div>
          ) : (
            <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
              {images.map((img, idx) => (
                <div
                  key={img._id}
                  className="mb-3 cursor-pointer overflow-hidden rounded-xl"
                  onClick={() => setLightboxIndex(idx)}
                >
                  <img
                    src={img.imageUrl}
                    alt={img.altText ?? img.category}
                    loading="lazy"
                    className="w-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

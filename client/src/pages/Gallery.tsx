import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { SkeletonLoader } from '@/components/shared/SkeletonLoader';
import { Lightbox } from '@/components/shared/Lightbox';
import { GALLERY_CATEGORIES } from '@/constants';
import type { GalleryImage } from '@/types';

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  wedding: 'Wedding',
  reception: 'Reception',
  birthday: 'Birthday',
  catering: 'Catering',
  decoration: 'Decoration',
  venue: 'Venue',
};

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['gallery', activeCategory],
    queryFn: () =>
      axiosInstance
        .get('/api/v1/gallery', {
          params: activeCategory !== 'all' ? { category: activeCategory } : {},
        })
        .then((r) => r.data.data as GalleryImage[]),
  });

  const lightboxImages = images.map((img) => ({
    src: img.imageUrl,
    alt: img.altText ?? img.category,
  }));

  const tabs = ['all', ...GALLERY_CATEGORIES];

  return (
    <>
      <SEOHead
        title="Event Gallery — Shree Ganesh Party Venue"
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

      <div className="bg-[#0a0a0a] pt-28 pb-20 px-4">
        <div className="mx-auto max-w-7xl">

          {/* Section header */}
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-1">
              <span className="block h-px w-14 bg-gradient-to-r from-transparent to-gold/60" />
              <span className="font-script text-gold text-2xl leading-none">Moments Captured</span>
              <span className="block h-px w-14 bg-gradient-to-l from-transparent to-gold/60" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-widest uppercase mt-2">
              Event Gallery
            </h1>
            <p className="mt-4 font-sans text-lg italic text-zinc-400 max-w-xl mx-auto">
              A glimpse inside the weddings, ceremonies, and grand celebrations hosted at Shree Ganesh.
            </p>
          </div>

          {/* Category filter tabs */}
          <div className="overflow-x-auto pb-1 mb-8 -mx-4 px-4">
            <div className="flex gap-px border border-gold/10 min-w-max">
              {tabs.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`font-serif text-[10px] sm:text-xs tracking-[0.12em] uppercase px-5 py-3 whitespace-nowrap transition-all duration-150 ${
                    activeCategory === cat
                      ? 'bg-gold text-zinc-950 font-semibold'
                      : 'bg-[rgba(255,255,255,0.02)] text-zinc-400 hover:text-white hover:bg-[rgba(201,168,76,0.05)]'
                  }`}
                >
                  {CATEGORY_LABELS[cat] ?? cat}
                </button>
              ))}
            </div>
          </div>

          {/* Masonry grid */}
          {isLoading ? (
            <div className="columns-2 gap-1 sm:columns-3 lg:columns-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonLoader
                  key={i}
                  className={`mb-1 w-full ${i % 3 === 0 ? 'h-64' : 'h-44'}`}
                />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="py-20 text-center border border-gold/10">
              <p className="font-sans text-zinc-500 italic">No images found for this category.</p>
            </div>
          ) : (
            <div className="columns-2 gap-1 sm:columns-3 lg:columns-4">
              {images.map((img, idx) => (
                <button
                  key={img._id}
                  className="mb-1 w-full relative block overflow-hidden border border-gold/[0.06] group cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  onClick={() => setLightboxIndex(idx)}
                  aria-label={`View ${img.altText ?? img.category} photo`}
                >
                  <img
                    src={img.imageUrl}
                    alt={img.altText ?? `${img.category} at Shree Ganesh Party Venue`}
                    loading="lazy"
                    decoding="async"
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3 pointer-events-none">
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-widest text-white capitalize">
                      {img.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Image count */}
          {!isLoading && images.length > 0 && (
            <p className="mt-4 text-xs font-sans text-zinc-600 text-right">
              {images.length} photo{images.length !== 1 ? 's' : ''} shown
            </p>
          )}

        </div>
      </div>
    </>
  );
}

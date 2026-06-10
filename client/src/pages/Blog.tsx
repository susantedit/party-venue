import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { SkeletonLoader } from '@/components/shared/SkeletonLoader';
import type { Blog, PaginatedApiResponse } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';

export default function BlogList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['blogs', page, search],
    queryFn: () =>
      axiosInstance
        .get('/api/v1/blogs', {
          params: { page, limit: 9, search: search || undefined },
        })
        .then((r) => r.data as PaginatedApiResponse<Blog>),
    staleTime: 30_000,
  });

  const blogs = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <>
      <SEOHead
        title="Blog"
        description="Event planning tips, venue guides, and celebration inspiration from Shree Ganesh Party Venue, Bhaktapur."
        canonicalUrl="https://shreeganeshsharma.com/blog"
      />
      <div className="bg-zinc-950 pt-24 pb-16 px-4">
        <div className="relative z-10 mx-auto max-w-6xl">
          <PageHeader
            title="Blog & Tips"
            description="Event planning guides, ceremony tips, and inspiration for your celebrations."
            breadcrumb="Blog"
          />

          {/* Search */}
          <div className="mb-8 flex gap-3">
            <input
              type="search" placeholder="Search articles..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="flex-1 max-w-xs rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          {/* Blog grid */}
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonLoader key={i} className="h-64 rounded-xl" />)}
            </div>
          ) : blogs.length === 0 ? (
            <div className="py-16 text-center text-gray-400">No articles found.</div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <Link key={blog._id} to={`/blog/${blog.slug}`} className="group rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition border border-gray-50">
                  {blog.featuredImage && (
                    <img src={blog.featuredImage} alt={blog.title} loading="lazy"
                      className="h-44 w-full object-cover transition group-hover:scale-105" />
                  )}
                  <div className="p-5">
                    <span className="rounded-full bg-gold-50 px-2 py-0.5 text-xs font-medium text-gold-700">{blog.category}</span>
                    <h2 className="mt-2 font-serif text-lg font-bold text-charcoal group-hover:text-gold-600 transition line-clamp-2">{blog.title}</h2>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{blog.excerpt}</p>
                    <p className="mt-3 text-xs text-gray-400">{new Date(blog.createdAt).toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40 hover:bg-gray-50">
                ← Previous
              </button>
              <span className="text-sm text-gray-500">Page {page} of {pagination.pages}</span>
              <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}
                className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40 hover:bg-gray-50">
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

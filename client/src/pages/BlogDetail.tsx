import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { SkeletonLoader } from '@/components/shared/SkeletonLoader';
import { SITE_URL } from '@/constants';
import type { Blog } from '@/types';
import { HomeLink } from '@/components/ui/HomeLink';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: blog, isLoading, isError } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () =>
      axiosInstance.get(`/api/v1/blogs/${slug}`).then((r) => r.data.data as Blog),
    enabled: !!slug,
  });

  if (isLoading) return (
    <div className="pt-24 px-4 max-w-3xl mx-auto">
      <SkeletonLoader className="mb-4 h-8 w-2/3" />
      <SkeletonLoader className="mb-2 h-4 w-full" />
      <SkeletonLoader className="h-4 w-3/4" />
    </div>
  );

  if (isError || !blog) return (
    <div className="pt-24 px-4 text-center">
      <p className="text-gray-500">Blog post not found.</p>
      <Link to="/blog" className="mt-4 inline-block text-gold-600 underline">← Back to Blog</Link>
    </div>
  );

  const safeContent = DOMPurify.sanitize(blog.content);

  return (
    <>
      <SEOHead
        title={blog.seoTitle ?? blog.title}
        description={blog.seoDescription ?? blog.excerpt}
        ogImage={blog.featuredImage}
        canonicalUrl={`${SITE_URL}/blog/${blog.slug}`}
      />
      <div className="bg-zinc-950 pt-24 pb-16 px-4">
        <div className="relative z-10 mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-3 text-sm">
            <HomeLink variant="text" />
            <Link to="/blog" className="text-zinc-400 transition-colors duration-120 ease-out hover:text-gold min-h-[44px] inline-flex items-center">
              ← Blog
            </Link>
          </nav>

          <h1 className="mt-4 font-serif text-3xl font-bold text-charcoal sm:text-4xl">{blog.title}</h1>

          <div className="mt-3 flex items-center gap-3 text-sm text-gray-400">
            <span>{blog.author}</span>
            <span>·</span>
            <span>{new Date(blog.createdAt).toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>·</span>
            <span className="capitalize">{blog.category}</span>
          </div>

          {blog.featuredImage && (
            <img src={blog.featuredImage} alt={blog.title} loading="lazy"
              className="mt-6 w-full rounded-xl object-cover max-h-80" />
          )}

          <div
            className="prose prose-lg mt-8 max-w-none text-gray-700 prose-headings:font-serif prose-a:text-gold-600"
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />

          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

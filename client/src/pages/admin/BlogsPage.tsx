import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import type { Blog } from '@/types';

export default function AdminBlogsPage() {
  const { data } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: () => axiosInstance.get('/api/v1/blogs').then(r => r.data.data as Blog[]),
  });

  return (
    <>
      <SEOHead title="Blog Management" noIndex />
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="mb-4 font-serif text-2xl font-bold text-charcoal">Blogs</h1>
        <div className="space-y-3">
          {data?.map(blog => (
            <div key={blog._id} className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
              <div>
                <p className="font-medium text-charcoal">{blog.title}</p>
                <p className="text-sm text-gray-400">{blog.category} · {new Date(blog.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs ${blog.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {blog.published ? 'Published' : 'Draft'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

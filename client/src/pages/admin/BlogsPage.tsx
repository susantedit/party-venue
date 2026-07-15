import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { FileText, Plus, Eye, Send } from 'lucide-react';
import type { Blog } from '@/types';

function RowSkeleton() {
  return (
    <tr className="border-b border-white/[0.04] animate-pulse">
      <td className="px-4 py-3.5"><div className="h-3 bg-zinc-800 rounded w-48" /></td>
      <td className="px-4 py-3.5"><div className="h-3 bg-zinc-800 rounded w-20" /></td>
      <td className="px-4 py-3.5"><div className="h-3 bg-zinc-800 rounded w-16" /></td>
      <td className="px-4 py-3.5"><div className="h-5 bg-zinc-800 rounded-full w-16" /></td>
      <td className="px-4 py-3.5"><div className="h-3 bg-zinc-800 rounded w-20" /></td>
    </tr>
  );
}

export default function AdminBlogsPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: () => axiosInstance.get('/api/v1/blogs').then(r => r.data.data as Blog[]),
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => axiosInstance.put(`/api/v1/blogs/${id}`, { published: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-blogs'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/api/v1/blogs/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-blogs'] }),
  });

  return (
    <>
      <SEOHead title="Blogs — Admin" noIndex />
      <div className="min-h-screen bg-[#0f0f0f]">

        {/* Page header */}
        <div className="border-b border-white/[0.06] bg-[#111111] px-6 py-5">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="block h-px w-5 bg-gold/50" />
            <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-semibold">Content</span>
          </div>
          <div className="flex items-end justify-between">
            <h1 className="font-serif text-xl font-bold text-white tracking-widest uppercase">Blogs</h1>
            <Link
              to="/admin/blogs/new"
              className="inline-flex items-center gap-1.5 border border-gold/25 bg-gold/10 px-3 py-1.5 text-xs text-gold font-medium hover:bg-gold/15 transition"
              style={{ borderRadius: '4px' }}
            >
              <Plus className="h-3.5 w-3.5" /> New Post
            </Link>
          </div>
        </div>

        <div className="p-6">
          <div className="border border-white/[0.06] bg-[#111111] overflow-hidden" style={{ borderRadius: '4px' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {['Title', 'Category', 'Views', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.12em] text-zinc-600 font-semibold whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
                    : (data ?? []).length === 0
                      ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-16 text-center">
                            <div className="flex flex-col items-center text-zinc-700">
                              <FileText className="h-8 w-8 mb-2" />
                              <p className="text-sm">No blog posts yet</p>
                            </div>
                          </td>
                        </tr>
                      )
                      : (data ?? []).map(blog => (
                          <tr key={blog._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                            <td className="px-4 py-3.5 max-w-xs">
                              <p className="text-zinc-200 font-medium truncate">{blog.title}</p>
                              {blog.excerpt && (
                                <p className="text-[11px] text-zinc-600 truncate mt-0.5">{blog.excerpt}</p>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-zinc-500 whitespace-nowrap capitalize">{blog.category}</td>
                            <td className="px-4 py-3.5">
                              <span className="flex items-center gap-1 text-zinc-500 text-xs">
                                <Eye className="h-3 w-3" /> {blog.views ?? 0}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                                blog.published
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20'
                              }`}>
                                {blog.published ? 'Published' : 'Draft'}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-zinc-600 whitespace-nowrap text-xs">
                              {new Date(blog.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <Link
                                  to={`/admin/blogs/edit/${blog._id}`}
                                  className="text-[11px] text-gold/70 hover:text-gold transition-colors font-medium"
                                >
                                  Edit
                                </Link>
                                {!blog.published && (
                                  <button
                                    onClick={() => publishMutation.mutate(blog._id)}
                                    disabled={publishMutation.isPending}
                                    className="inline-flex items-center gap-1 text-[11px] text-emerald-600/70 hover:text-emerald-400 transition-colors font-medium disabled:opacity-40"
                                  >
                                    <Send className="h-2.5 w-2.5" /> Publish
                                  </button>
                                )}
                                <button
                                  onClick={() => confirm('Delete this post?') && deleteMutation.mutate(blog._id)}
                                  disabled={deleteMutation.isPending}
                                  className="text-[11px] text-zinc-700 hover:text-red-400 transition-colors disabled:opacity-40"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

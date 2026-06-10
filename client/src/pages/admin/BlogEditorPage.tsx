import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import type { Blog } from '@/types';

export default function BlogEditorPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '', excerpt: '', featuredImage: '',
    category: '', author: '', tags: '',
    seoTitle: '', seoDescription: '',
    published: false,
  });

  const { data: existingBlog } = useQuery({
    queryKey: ['blog-edit', id],
    queryFn: () => axiosInstance.get(`/api/v1/blogs/${id}`).then(r => r.data.data as Blog),
    enabled: isEdit,
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: existingBlog?.content ?? '',
  });

  useEffect(() => {
    if (existingBlog) {
      setForm({
        title: existingBlog.title,
        excerpt: existingBlog.excerpt,
        featuredImage: existingBlog.featuredImage,
        category: existingBlog.category,
        author: existingBlog.author,
        tags: existingBlog.tags.join(', '),
        seoTitle: existingBlog.seoTitle ?? '',
        seoDescription: existingBlog.seoDescription ?? '',
        published: existingBlog.published,
      });
      editor?.commands.setContent(existingBlog.content);
    }
  }, [existingBlog, editor]);

  const saveMutation = useMutation({
    mutationFn: (data: any) =>
      isEdit
        ? axiosInstance.put(`/api/v1/blogs/${id}`, data)
        : axiosInstance.post('/api/v1/blogs', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-blogs'] });
      navigate('/admin/blogs');
    },
  });

  const handleSave = (publish: boolean) => {
    saveMutation.mutate({
      ...form,
      content: editor?.getHTML() ?? '',
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      published: publish,
    });
  };

  return (
    <>
      <SEOHead title={isEdit ? 'Edit Blog' : 'New Blog Post'} noIndex />
      <div className="p-6 max-w-4xl">
        <h1 className="mb-6 font-serif text-2xl font-bold text-charcoal">
          {isEdit ? 'Edit Blog Post' : 'New Blog Post'}
        </h1>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Title *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Blog title" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Content *</label>
            <div className="rounded-lg border min-h-48 p-3 bg-white">
              <EditorContent editor={editor} className="prose max-w-none" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Excerpt * <span className="text-gray-400">({form.excerpt.length}/300)</span>
            </label>
            <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              maxLength={300} rows={3}
              className="w-full rounded-lg border px-3 py-2 text-sm" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Featured Image URL *</label>
              <input value={form.featuredImage} onChange={e => setForm(f => ({ ...f, featuredImage: e.target.value }))}
                className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="https://..." />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Category *</label>
              <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full rounded-lg border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Author *</label>
              <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                className="w-full rounded-lg border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Tags (comma-separated)</label>
              <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="wedding, venue, tips" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                SEO Title <span className="text-gray-400">({form.seoTitle.length}/60)</span>
              </label>
              <input value={form.seoTitle} onChange={e => setForm(f => ({ ...f, seoTitle: e.target.value }))}
                maxLength={60} className="w-full rounded-lg border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                SEO Description <span className="text-gray-400">({form.seoDescription.length}/160)</span>
              </label>
              <input value={form.seoDescription} onChange={e => setForm(f => ({ ...f, seoDescription: e.target.value }))}
                maxLength={160} className="w-full rounded-lg border px-3 py-2 text-sm" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => handleSave(false)} disabled={saveMutation.isPending}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
              Save Draft
            </button>
            <button onClick={() => handleSave(true)} disabled={saveMutation.isPending}
              className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gold-600 disabled:opacity-50">
              {saveMutation.isPending ? 'Saving...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

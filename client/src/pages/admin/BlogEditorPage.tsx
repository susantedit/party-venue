import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import axiosInstance from '@/lib/axiosInstance';
import { SEOHead } from '@/components/shared/SEOHead';
import { ArrowLeft, Save, Send } from 'lucide-react';
import type { Blog } from '@/types';

const inputClass = 'w-full bg-[#161616] border border-white/[0.08] px-3 py-2 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-gold/30 transition-colors';
const labelClass = 'text-[11px] text-zinc-500 uppercase tracking-[0.12em] font-semibold mb-1.5 block';

export default function BlogEditorPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '', excerpt: '', featuredImage: '',
    category: '', author: '', tags: '',
    seoTitle: '', seoDescription: '', published: false,
  });

  const { data: existingBlog } = useQuery({
    queryKey: ['blog-edit', id],
    queryFn: () => axiosInstance.get(`/api/v1/blogs/${id}`).then(r => r.data.data as Blog),
    enabled: isEdit,
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: existingBlog?.content ?? '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-3',
      },
    },
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
      <SEOHead title={isEdit ? 'Edit Blog Post — Admin' : 'New Blog Post — Admin'} noIndex />
      <div className="min-h-screen bg-[#0f0f0f]">

        {/* Page header */}
        <div className="border-b border-white/[0.06] bg-[#111111] px-6 py-5">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="block h-px w-5 bg-gold/50" />
            <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-semibold">Content</span>
          </div>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Link to="/admin/blogs" className="text-zinc-600 hover:text-zinc-300 transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <h1 className="font-serif text-xl font-bold text-white tracking-widest uppercase">
                {isEdit ? 'Edit Post' : 'New Post'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSave(false)}
                disabled={saveMutation.isPending}
                className="inline-flex items-center gap-1.5 border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-400 font-medium hover:text-zinc-200 hover:border-white/[0.15] transition disabled:opacity-40"
                style={{ borderRadius: '4px' }}
              >
                <Save className="h-3.5 w-3.5" /> Save Draft
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={saveMutation.isPending}
                className="inline-flex items-center gap-1.5 border border-gold/25 bg-gold/10 px-3 py-1.5 text-xs text-gold font-semibold hover:bg-gold/15 transition disabled:opacity-40"
                style={{ borderRadius: '4px' }}
              >
                <Send className="h-3.5 w-3.5" />
                {saveMutation.isPending ? 'Saving…' : 'Publish'}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-4xl space-y-5">

          {/* Title */}
          <div>
            <label className={labelClass}>Title *</label>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className={`${inputClass} text-base font-semibold`}
              placeholder="Blog post title…"
              style={{ borderRadius: '4px' }}
            />
          </div>

          {/* Content editor */}
          <div>
            <label className={labelClass}>Content *</label>
            <div className="border border-white/[0.08] bg-[#161616] overflow-hidden" style={{ borderRadius: '4px' }}>
              {/* Toolbar */}
              <div className="flex items-center gap-1 border-b border-white/[0.06] px-2 py-1.5">
                {[
                  { label: 'B', action: () => editor?.chain().focus().toggleBold().run(), isActive: editor?.isActive('bold') },
                  { label: 'I', action: () => editor?.chain().focus().toggleItalic().run(), isActive: editor?.isActive('italic') },
                  { label: 'H2', action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), isActive: editor?.isActive('heading', { level: 2 }) },
                  { label: 'H3', action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), isActive: editor?.isActive('heading', { level: 3 }) },
                  { label: '•', action: () => editor?.chain().focus().toggleBulletList().run(), isActive: editor?.isActive('bulletList') },
                  { label: '1.', action: () => editor?.chain().focus().toggleOrderedList().run(), isActive: editor?.isActive('orderedList') },
                ].map(btn => (
                  <button
                    key={btn.label}
                    onClick={btn.action}
                    className={`px-2 py-1 text-xs font-medium transition ${btn.isActive ? 'bg-gold/15 text-gold' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]'}`}
                    style={{ borderRadius: '4px' }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className={labelClass}>
              Excerpt * <span className="normal-case text-zinc-700">({form.excerpt.length}/300)</span>
            </label>
            <textarea
              value={form.excerpt}
              onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              maxLength={300}
              rows={3}
              className={`${inputClass} resize-none`}
              style={{ borderRadius: '4px' }}
              placeholder="Short description for the blog listing…"
            />
          </div>

          {/* 2-col fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Featured Image URL *</label>
              <input
                value={form.featuredImage}
                onChange={e => setForm(f => ({ ...f, featuredImage: e.target.value }))}
                className={inputClass}
                placeholder="https://res.cloudinary.com/…"
                style={{ borderRadius: '4px' }}
              />
            </div>
            <div>
              <label className={labelClass}>Category *</label>
              <input
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className={inputClass}
                placeholder="e.g. wedding, tips, catering"
                style={{ borderRadius: '4px' }}
              />
            </div>
            <div>
              <label className={labelClass}>Author *</label>
              <input
                value={form.author}
                onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                className={inputClass}
                placeholder="Author name"
                style={{ borderRadius: '4px' }}
              />
            </div>
            <div>
              <label className={labelClass}>Tags (comma-separated)</label>
              <input
                value={form.tags}
                onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                className={inputClass}
                placeholder="wedding, venue, Bhaktapur"
                style={{ borderRadius: '4px' }}
              />
            </div>
          </div>

          {/* SEO */}
          <div className="border border-white/[0.06] bg-[#111111] p-4 space-y-4" style={{ borderRadius: '4px' }}>
            <p className="text-[10px] text-zinc-600 uppercase tracking-[0.18em] font-semibold">SEO</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  SEO Title <span className="normal-case text-zinc-700">({form.seoTitle.length}/60)</span>
                </label>
                <input
                  value={form.seoTitle}
                  onChange={e => setForm(f => ({ ...f, seoTitle: e.target.value }))}
                  maxLength={60}
                  className={inputClass}
                  placeholder="Search engine title…"
                  style={{ borderRadius: '4px' }}
                />
              </div>
              <div>
                <label className={labelClass}>
                  SEO Description <span className="normal-case text-zinc-700">({form.seoDescription.length}/160)</span>
                </label>
                <input
                  value={form.seoDescription}
                  onChange={e => setForm(f => ({ ...f, seoDescription: e.target.value }))}
                  maxLength={160}
                  className={inputClass}
                  placeholder="Meta description for search results…"
                  style={{ borderRadius: '4px' }}
                />
              </div>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="flex items-center gap-3 pt-2 border-t border-white/[0.04]">
            <button
              onClick={() => handleSave(false)}
              disabled={saveMutation.isPending}
              className="inline-flex items-center gap-1.5 border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-sm text-zinc-400 font-medium hover:text-zinc-200 hover:border-white/[0.15] transition disabled:opacity-40"
              style={{ borderRadius: '4px' }}
            >
              <Save className="h-3.5 w-3.5" /> Save Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saveMutation.isPending}
              className="inline-flex items-center gap-1.5 border border-gold/25 bg-gold/10 px-4 py-2 text-sm text-gold font-semibold hover:bg-gold/15 transition disabled:opacity-40"
              style={{ borderRadius: '4px' }}
            >
              <Send className="h-3.5 w-3.5" />
              {saveMutation.isPending ? 'Saving…' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

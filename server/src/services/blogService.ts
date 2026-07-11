import { BlogModel } from '../models/Blog';
import { slugify } from '../utils/slugify';
import { logAuditEvent } from '../utils/auditLog';
import { AppError } from '../utils/AppError';

export async function createBlog(data: any, _adminUid: string) {
  const slug = data.slug || slugify(data.title);
  const blog = await BlogModel.create({ ...data, slug });
  return blog;
}

export async function getPublishedBlogs(query: { page?: number; limit?: number; category?: string; search?: string }) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 9;
  const skip = (page - 1) * limit;
  const filter: Record<string, any> = { published: true };
  if (query.category) filter.category = query.category;
  if (query.search) filter.$text = { $search: query.search };
  const [docs, total] = await Promise.all([
    BlogModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    BlogModel.countDocuments(filter),
  ]);
  return { docs, total, page, limit, pages: Math.ceil(total / limit) };
}

export async function getBlogBySlug(slug: string) {
  const blog = await BlogModel.findOneAndUpdate({ slug, published: true }, { $inc: { views: 1 } }, { new: true }).lean();
  if (!blog) throw new AppError(404, 'Blog post not found');
  return blog;
}

export async function updateBlog(id: string, data: any) {
  if (data.published === true && !data.publishedAt) data.publishedAt = new Date();
  const blog = await BlogModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!blog) throw new AppError(404, 'Blog post not found');
  return blog;
}

export async function deleteBlog(id: string, adminUid: string) {
  const blog = await BlogModel.findByIdAndDelete(id);
  if (!blog) throw new AppError(404, 'Blog post not found');
  logAuditEvent('blog.deleted', adminUid, 'Blog', id);
}

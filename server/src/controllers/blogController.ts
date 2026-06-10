import { Request, Response, NextFunction } from 'express';
import { blogSchema } from '../validators/blogSchema';
import * as blogService from '../services/blogService';
import { sendSuccess, sendPaginated } from '../utils/apiResponse';

export async function listBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await blogService.getPublishedBlogs({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 9,
      category: req.query.category as string,
      search: req.query.search as string,
    });
    sendPaginated(res, result.docs, { page: result.page, limit: result.limit, total: result.total });
  } catch (err) { next(err); }
}

export async function getBlogBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const blog = await blogService.getBlogBySlug(req.params.slug);
    sendSuccess(res, blog);
  } catch (err) { next(err); }
}

export async function createBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = blogSchema.parse(req.body);
    const blog = await blogService.createBlog(data, req.user?.uid ?? 'unknown');
    sendSuccess(res, blog, 'Blog created', 201);
  } catch (err) { next(err); }
}

export async function updateBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const blog = await blogService.updateBlog(req.params.id, req.body);
    sendSuccess(res, blog, 'Blog updated');
  } catch (err) { next(err); }
}

export async function deleteBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await blogService.deleteBlog(req.params.id, req.user?.uid ?? 'unknown');
    sendSuccess(res, null, 'Blog deleted');
  } catch (err) { next(err); }
}

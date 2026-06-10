import { Router } from 'express';
import { listBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } from '../controllers/blogController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { globalLimiter } from '../middleware/rateLimiter';

const router = Router();
const editorOrAbove = [authenticate, authorize(['super-admin', 'admin', 'editor'])];

router.get('/', globalLimiter, listBlogs);
router.get('/:slug', globalLimiter, getBlogBySlug);
router.post('/', ...editorOrAbove, createBlog);
router.put('/:id', ...editorOrAbove, updateBlog);
router.delete('/:id', ...editorOrAbove, deleteBlog);

export default router;

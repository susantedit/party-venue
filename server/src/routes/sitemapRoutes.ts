import { Router, Request, Response } from 'express';
import { BlogModel } from '../models/Blog';

const router = Router();

router.get('/sitemap.xml', async (_req: Request, res: Response) => {
  try {
    const blogs = await BlogModel.find({ published: true }, 'slug updatedAt').lean();

    const publicPages = [
      '/', '/about', '/services', '/gallery', '/packages', '/menu', '/blog', '/contact', '/booking',
    ];

    const baseUrl = process.env.FRONTEND_URL ?? 'https://shreeganeshsharma.com';

    const urls = [
      ...publicPages.map((p) => `
  <url>
    <loc>${baseUrl}${p}</loc>
    <changefreq>weekly</changefreq>
    <priority>${p === '/' ? '1.0' : '0.8'}</priority>
  </url>`),
      ...blogs.map((b) => `
  <url>
    <loc>${baseUrl}/blog/${b.slug}</loc>
    <lastmod>${new Date(b.updatedAt as Date).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`;

    res.header('Content-Type', 'application/xml').send(xml);
  } catch {
    res.status(500).send('Failed to generate sitemap');
  }
});

export default router;

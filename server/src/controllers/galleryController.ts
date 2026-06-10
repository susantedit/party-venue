import { Request, Response, NextFunction } from 'express';
import * as galleryService from '../services/galleryService';
import { sendSuccess } from '../utils/apiResponse';

export async function listGallery(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = req.query.category as string | undefined;
    const images = await galleryService.listGallery(category);
    sendSuccess(res, images);
  } catch (err) { next(err); }
}

export async function uploadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded', errors: [] });
      return;
    }
    const { category, title, altText, featured } = req.body;
    const image = await galleryService.uploadImage(
      req.file,
      category,
      { title, altText, featured: featured === 'true' },
      req.user?.uid ?? 'unknown',
    );
    sendSuccess(res, image, 'Image uploaded', 201);
  } catch (err) { next(err); }
}

export async function deleteImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await galleryService.deleteImage(req.params.id, req.user?.uid ?? 'unknown');
    sendSuccess(res, null, 'Image deleted');
  } catch (err) { next(err); }
}

export async function bulkUpload(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ success: false, message: 'No files uploaded', errors: [] });
      return;
    }
    const { category } = req.body;
    const results = await Promise.all(
      files.map((file) => galleryService.uploadImage(file, category, {}, req.user?.uid ?? 'unknown')),
    );
    sendSuccess(res, results, `${results.length} images uploaded`, 201);
  } catch (err) { next(err); }
}

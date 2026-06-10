import { Request, Response, NextFunction } from 'express';
import { uploadToCloudinary } from '../config/cloudinary';
import { validateMagicBytes } from '../middleware/uploadMiddleware';
import { AppError } from '../utils/AppError';
import { sendSuccess } from '../utils/apiResponse';

export async function uploadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) throw new AppError(400, 'No file uploaded');

    if (!validateMagicBytes(req.file.buffer, req.file.mimetype)) {
      throw new AppError(422, 'File content does not match declared MIME type');
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'shree-ganesh/uploads',
    });

    sendSuccess(res, { imageUrl: result.secure_url, cloudinaryId: result.public_id }, 'Uploaded', 201);
  } catch (err) {
    next(err);
  }
}

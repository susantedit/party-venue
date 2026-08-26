import { GalleryModel, GALLERY_CATEGORIES } from '../models/Gallery';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary';
import { validateMagicBytes } from '../middleware/uploadMiddleware';
import { AppError } from '../utils/AppError';
import { logAuditEvent } from '../utils/auditLog';

export async function uploadImage(
  file: Express.Multer.File,
  category: string,
  meta: { title?: string; altText?: string; featured?: boolean },
  _adminUid: string,
) {
  const targetCategory = (GALLERY_CATEGORIES as readonly string[]).includes(category)
    ? category
    : 'venue';

  // Secondary MIME validation via magic bytes
  if (!validateMagicBytes(file.buffer, file.mimetype)) {
    throw new AppError(422, 'File content does not match its declared MIME type');
  }

  const result = await uploadToCloudinary(file.buffer, {
    folder: 'shree-ganesh/gallery',
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  });

  const image = await GalleryModel.create({
    imageUrl: result.secure_url,
    cloudinaryId: result.public_id,
    category: targetCategory,
    title: meta.title,
    altText: meta.altText,
    featured: meta.featured ?? false,
  });

  return image;
}

export async function listGallery(category?: string) {
  const filter: Record<string, any> = {};
  if (category) filter.category = category;
  return GalleryModel.find(filter).sort({ createdAt: -1 }).lean();
}

export async function updateImage(
  id: string,
  data: { category?: string; title?: string; altText?: string; featured?: boolean },
  adminUid: string,
) {
  const image = await GalleryModel.findById(id);
  if (!image) throw new AppError(404, 'Gallery image not found');

  if (data.category && !(GALLERY_CATEGORIES as readonly string[]).includes(data.category)) {
    throw new AppError(400, `Invalid category. Allowed: ${GALLERY_CATEGORIES.join(', ')}`);
  }

  const updated = await GalleryModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  logAuditEvent('gallery.updated', adminUid, 'Gallery', id);
  return updated;
}

export async function deleteImage(id: string, adminUid: string) {
  const image = await GalleryModel.findById(id);
  if (!image) throw new AppError(404, 'Gallery image not found');

  if (image.cloudinaryId) {
    await deleteFromCloudinary(image.cloudinaryId);
  }
  await GalleryModel.findByIdAndDelete(id);
  logAuditEvent('gallery.deleted', adminUid, 'Gallery', id);
}

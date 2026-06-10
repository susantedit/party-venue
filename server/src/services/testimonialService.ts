import { TestimonialModel } from '../models/Testimonial';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary';
import { logAuditEvent } from '../utils/auditLog';
import { AppError } from '../utils/AppError';

export async function listTestimonials(featured?: boolean) {
  const filter: Record<string, any> = {};
  if (featured) filter.featured = true;
  return TestimonialModel.find(filter).sort({ createdAt: -1 }).lean();
}

export async function createTestimonial(data: any, file?: Express.Multer.File) {
  let image: string | undefined;
  let cloudinaryId: string | undefined;

  if (file) {
    const result = await uploadToCloudinary(file.buffer, { folder: 'shree-ganesh/testimonials' });
    image = result.secure_url;
    cloudinaryId = result.public_id;
  }

  return TestimonialModel.create({ ...data, image, cloudinaryId });
}

export async function updateTestimonial(id: string, data: any) {
  const doc = await TestimonialModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!doc) throw new AppError(404, 'Testimonial not found');
  return doc;
}

export async function deleteTestimonial(id: string, adminUid: string) {
  const doc = await TestimonialModel.findById(id);
  if (!doc) throw new AppError(404, 'Testimonial not found');
  if (doc.cloudinaryId) await deleteFromCloudinary(doc.cloudinaryId);
  await TestimonialModel.findByIdAndDelete(id);
  logAuditEvent('testimonial.deleted', adminUid, 'Testimonial', id);
}

import { MenuItemModel } from '../models/MenuItem';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary';
import { logAuditEvent } from '../utils/auditLog';
import { AppError } from '../utils/AppError';

export async function listMenuItems(category?: string) {
  const filter: Record<string, any> = { available: true };
  if (category) filter.category = category;
  return MenuItemModel.find(filter).sort({ category: 1, name: 1 }).lean();
}

export async function createMenuItem(data: any, file?: Express.Multer.File) {
  let image: string | undefined;
  let cloudinaryId: string | undefined;
  if (file) {
    const result = await uploadToCloudinary(file.buffer, { folder: 'shree-ganesh/menu' });
    image = result.secure_url;
    cloudinaryId = result.public_id;
  }
  return MenuItemModel.create({ ...data, image, cloudinaryId });
}

export async function updateMenuItem(id: string, data: any) {
  const item = await MenuItemModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!item) throw new AppError(404, 'Menu item not found');
  return item;
}

export async function deleteMenuItem(id: string, adminUid: string) {
  const item = await MenuItemModel.findById(id);
  if (!item) throw new AppError(404, 'Menu item not found');
  if (item.cloudinaryId) await deleteFromCloudinary(item.cloudinaryId);
  await MenuItemModel.findByIdAndDelete(id);
  logAuditEvent('menu.deleted', adminUid, 'MenuItem', id);
}

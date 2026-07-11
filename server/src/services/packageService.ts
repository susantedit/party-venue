import { PackageModel } from '../models/Package';
import { BookingModel } from '../models/Booking';
import { slugify } from '../utils/slugify';
import { logAuditEvent } from '../utils/auditLog';
import { AppError } from '../utils/AppError';

export async function createPackage(data: any, _adminUid: string) {
  const slug = data.slug || slugify(data.name);
  const existing = await PackageModel.findOne({ slug });
  if (existing) throw new AppError(409, 'A package with this name already exists');
  const pkg = await PackageModel.create({ ...data, slug });
  return pkg;
}

export async function listActivePackages() {
  return PackageModel.find({ isActive: true }).lean();
}

export async function getPackageBySlug(slug: string) {
  const pkg = await PackageModel.findOne({ slug }).lean();
  if (!pkg) throw new AppError(404, 'Package not found');
  return pkg;
}

export async function updatePackage(id: string, data: any) {
  if (data.name && !data.slug) data.slug = slugify(data.name);
  const pkg = await PackageModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!pkg) throw new AppError(404, 'Package not found');
  return pkg;
}

export async function deletePackage(id: string, adminUid: string) {
  // IDOR + conflict protection: check if any booking references this package
  const referenced = await BookingModel.findOne({ packageId: id }).lean();
  if (referenced) throw new AppError(409, 'Package has associated bookings and cannot be deleted');

  const pkg = await PackageModel.findByIdAndDelete(id);
  if (!pkg) throw new AppError(404, 'Package not found');

  logAuditEvent('package.deleted', adminUid, 'Package', id);
}

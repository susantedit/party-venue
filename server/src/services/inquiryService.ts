import { InquiryModel } from '../models/Inquiry';
import { logAuditEvent } from '../utils/auditLog';
import { logError } from '../utils/logger';
import { AppError } from '../utils/AppError';
import { emailService } from './emailService';
import { notificationService } from './notificationService';

export async function createInquiry(data: any) {
  const inquiry = await InquiryModel.create({ ...data, status: 'unread' });
  // Non-blocking email
  emailService.sendInquiryNotification(inquiry).catch((err) =>
    logError('Inquiry email failed', { message: err.message }),
  );
  notificationService.createInquiryNotification(inquiry).catch((err) =>
    logError('Inquiry notification creation failed', { message: err.message }),
  );
  return inquiry;
}

export async function listInquiries(query: { page?: number; limit?: number; status?: string }) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const filter: Record<string, any> = {};
  if (query.status) filter.status = query.status;
  const [docs, total] = await Promise.all([
    InquiryModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    InquiryModel.countDocuments(filter),
  ]);
  return { docs, total, page, limit, pages: Math.ceil(total / limit) };
}

export async function updateInquiryStatus(id: string, status: string, _adminUid: string) {
  const inquiry = await InquiryModel.findByIdAndUpdate(id, { status }, { new: true });
  if (!inquiry) throw new AppError(404, 'Inquiry not found');
  return inquiry;
}

export async function deleteInquiry(id: string, adminUid: string) {
  const inquiry = await InquiryModel.findByIdAndDelete(id);
  if (!inquiry) throw new AppError(404, 'Inquiry not found');
  logAuditEvent('inquiry.deleted', adminUid, 'Inquiry', id);
}

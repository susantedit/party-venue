import { Request, Response, NextFunction } from 'express';
import { FAQModel } from '../models/FAQ';
import { faqSchema } from '../validators/faqSchema';
import { sendSuccess, sendPaginated } from '../utils/apiResponse';
import { logAuditEvent } from '../utils/auditLog';
import { AppError } from '../utils/AppError';

/** GET /api/v1/faqs — public, published only, sorted by order */
export async function listFAQs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const faqs = await FAQModel.find({ isPublished: true }).sort({ order: 1, createdAt: 1 }).lean();
    sendSuccess(res, faqs);
  } catch (err) { next(err); }
}

/** GET /api/v1/faqs/all — admin, all FAQs */
export async function listAllFAQs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const faqs = await FAQModel.find().sort({ order: 1, createdAt: 1 }).lean();
    sendSuccess(res, faqs);
  } catch (err) { next(err); }
}

/** POST /api/v1/faqs — admin */
export async function createFAQ(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = faqSchema.parse(req.body);
    // Auto-assign order as last position
    const count = await FAQModel.countDocuments();
    const faq = await FAQModel.create({ ...data, order: data.order ?? count });
    sendSuccess(res, faq, 'FAQ created', 201);
  } catch (err) { next(err); }
}

/** PUT /api/v1/faqs/:id — admin */
export async function updateFAQ(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const faq = await FAQModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!faq) throw new AppError(404, 'FAQ not found');
    sendSuccess(res, faq, 'FAQ updated');
  } catch (err) { next(err); }
}

/** DELETE /api/v1/faqs/:id — admin */
export async function deleteFAQ(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const faq = await FAQModel.findByIdAndDelete(req.params.id);
    if (!faq) throw new AppError(404, 'FAQ not found');
    logAuditEvent('faq.deleted', req.user?.uid, 'FAQ', req.params.id);
    sendSuccess(res, null, 'FAQ deleted');
  } catch (err) { next(err); }
}

/** PATCH /api/v1/faqs/reorder — admin: accepts [{ id, order }] */
export async function reorderFAQs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const items: { id: string; order: number }[] = req.body.items;
    await Promise.all(items.map(({ id, order }) => FAQModel.findByIdAndUpdate(id, { order })));
    sendSuccess(res, null, 'FAQs reordered');
  } catch (err) { next(err); }
}

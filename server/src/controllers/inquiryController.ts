import { Request, Response, NextFunction } from 'express';
import { inquirySchema } from '../validators/inquirySchema';
import * as inquiryService from '../services/inquiryService';
import { sendSuccess, sendPaginated } from '../utils/apiResponse';

export async function createInquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = inquirySchema.parse(req.body);
    const inquiry = await inquiryService.createInquiry(data);
    sendSuccess(res, inquiry, 'Inquiry submitted successfully', 201);
  } catch (err) { next(err); }
}

export async function listInquiries(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await inquiryService.listInquiries({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      status: req.query.status as string,
    });
    sendPaginated(res, result.docs, { page: result.page, limit: result.limit, total: result.total });
  } catch (err) { next(err); }
}

export async function updateInquiryStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const inquiry = await inquiryService.updateInquiryStatus(req.params.id, req.body.status, req.user?.uid ?? 'unknown');
    sendSuccess(res, inquiry, 'Inquiry updated');
  } catch (err) { next(err); }
}

export async function deleteInquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await inquiryService.deleteInquiry(req.params.id, req.user?.uid ?? 'unknown');
    sendSuccess(res, null, 'Inquiry deleted');
  } catch (err) { next(err); }
}

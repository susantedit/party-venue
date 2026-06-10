import { Request, Response, NextFunction } from 'express';
import { testimonialSchema } from '../validators/testimonialSchema';
import * as testimonialService from '../services/testimonialService';
import { sendSuccess } from '../utils/apiResponse';

export async function listTestimonials(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const featured = req.query.featured === 'true';
    const testimonials = await testimonialService.listTestimonials(featured);
    sendSuccess(res, testimonials);
  } catch (err) { next(err); }
}

export async function createTestimonial(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = testimonialSchema.parse(req.body);
    const t = await testimonialService.createTestimonial(data, req.file);
    sendSuccess(res, t, 'Testimonial created', 201);
  } catch (err) { next(err); }
}

export async function updateTestimonial(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const t = await testimonialService.updateTestimonial(req.params.id, req.body);
    sendSuccess(res, t, 'Testimonial updated');
  } catch (err) { next(err); }
}

export async function deleteTestimonial(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await testimonialService.deleteTestimonial(req.params.id, req.user?.uid ?? 'unknown');
    sendSuccess(res, null, 'Testimonial deleted');
  } catch (err) { next(err); }
}

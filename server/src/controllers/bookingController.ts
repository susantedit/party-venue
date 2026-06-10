import { Request, Response, NextFunction } from 'express';
import { bookingSchema } from '../validators/bookingSchema';
import * as bookingService from '../services/bookingService';
import { sendSuccess } from '../utils/apiResponse';

export async function createBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = bookingSchema.parse(req.body);
    const booking = await bookingService.createBooking(data, req.user?.uid);
    sendSuccess(res, booking, 'Booking created successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function listBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;

    const result = await bookingService.listBookings({ page, limit, status, search });
    sendSuccess(res, result.docs, 'Request successful', 200, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      pages: result.pages,
    });
  } catch (err) {
    next(err);
  }
}

export async function getBookingById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    sendSuccess(res, booking);
  } catch (err) {
    next(err);
  }
}

export async function updateBookingStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status } = req.body;
    const booking = await bookingService.updateBookingStatus(
      req.params.id,
      status,
      req.user?.uid ?? 'unknown',
    );
    sendSuccess(res, booking, 'Booking status updated');
  } catch (err) {
    next(err);
  }
}

export async function deleteBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await bookingService.deleteBooking(req.params.id, req.user?.uid ?? 'unknown');
    sendSuccess(res, null, 'Booking deleted');
  } catch (err) {
    next(err);
  }
}

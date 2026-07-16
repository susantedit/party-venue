import { Request, Response, NextFunction } from 'express';
import * as availabilityService from '../services/availabilityService';
import { sendSuccess } from '../utils/apiResponse';

export async function checkAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const date = req.query.date as string;
    if (!date) {
      res.status(400).json({ success: false, message: 'date query parameter is required', errors: [] });
      return;
    }
    const status = await availabilityService.checkDate(date);
    sendSuccess(res, { date, status });
  } catch (err) {
    next(err);
  }
}

export async function blockDate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { date } = req.body;
    if (!date) {
      res.status(400).json({ success: false, message: 'date is required', errors: [] });
      return;
    }
    await availabilityService.blockDate(date, req.user?.uid ?? 'unknown');
    sendSuccess(res, { date, status: 'reserved' }, 'Date blocked successfully');
  } catch (err) {
    next(err);
  }
}

export async function unblockDate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { date } = req.body;
    if (!date) {
      res.status(400).json({ success: false, message: 'date is required', errors: [] });
      return;
    }
    await availabilityService.unblockDate(date, req.user?.uid ?? 'unknown');
    sendSuccess(res, { date }, 'Date unblocked successfully');
  } catch (err) {
    next(err);
  }
}

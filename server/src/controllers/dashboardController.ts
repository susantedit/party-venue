import { Request, Response, NextFunction } from 'express';
import { getDashboardOverview } from '../services/dashboardService';
import { sendSuccess } from '../utils/apiResponse';

export async function getOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getDashboardOverview();
    sendSuccess(res, data);
  } catch (err) { next(err); }
}

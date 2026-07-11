import { Request, Response, NextFunction } from 'express';
import { menuSchema } from '../validators/menuSchema';
import * as menuService from '../services/menuService';
import { sendSuccess } from '../utils/apiResponse';

export async function listMenuItems(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const items = await menuService.listMenuItems(req.query.category as string);
    sendSuccess(res, items);
  } catch (err) { next(err); }
}

export async function createMenuItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = menuSchema.parse(req.body);
    const item = await menuService.createMenuItem(data, req.file);
    sendSuccess(res, item, 'Menu item created', 201);
  } catch (err) { next(err); }
}

export async function updateMenuItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await menuService.updateMenuItem(String(req.params.id), req.body);
    sendSuccess(res, item, 'Menu item updated');
  } catch (err) { next(err); }
}

export async function deleteMenuItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await menuService.deleteMenuItem(String(req.params.id), req.user?.uid ?? 'unknown');
    sendSuccess(res, null, 'Menu item deleted');
  } catch (err) { next(err); }
}

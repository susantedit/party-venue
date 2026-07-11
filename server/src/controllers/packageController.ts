import { Request, Response, NextFunction } from 'express';
import { packageSchema } from '../validators/packageSchema';
import * as packageService from '../services/packageService';
import { sendSuccess } from '../utils/apiResponse';

export async function listPackages(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const packages = await packageService.listActivePackages();
    sendSuccess(res, packages);
  } catch (err) { next(err); }
}

export async function getPackageBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const pkg = await packageService.getPackageBySlug(String(req.params.slug));
    sendSuccess(res, pkg);
  } catch (err) { next(err); }
}

export async function createPackage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = packageSchema.parse(req.body);
    const pkg = await packageService.createPackage(data, req.user?.uid ?? 'unknown');
    sendSuccess(res, pkg, 'Package created', 201);
  } catch (err) { next(err); }
}

export async function updatePackage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const pkg = await packageService.updatePackage(String(req.params.id), req.body);
    sendSuccess(res, pkg, 'Package updated');
  } catch (err) { next(err); }
}

export async function deletePackage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await packageService.deletePackage(String(req.params.id), req.user?.uid ?? 'unknown');
    sendSuccess(res, null, 'Package deleted');
  } catch (err) { next(err); }
}

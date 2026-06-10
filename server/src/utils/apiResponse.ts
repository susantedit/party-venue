import { Response } from 'express';

interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface ErrorResponse {
  success: false;
  message: string;
  errors: Array<{ field?: string; message: string }>;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Request successful',
  statusCode = 200,
  pagination?: SuccessResponse<T>['pagination'],
): Response {
  const body: SuccessResponse<T> = { success: true, message, data };
  if (pagination) body.pagination = pagination;
  return res.status(statusCode).json(body);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: { page: number; limit: number; total: number; pages?: number },
  message = 'Request successful',
  statusCode = 200,
): Response {
  return sendSuccess(res, data, message, statusCode, {
    page: pagination.page,
    limit: pagination.limit,
    total: pagination.total,
    pages: pagination.pages ?? Math.ceil(pagination.total / pagination.limit),
  });
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  errors: ErrorResponse['errors'] = [],
): Response {
  const body: ErrorResponse = { success: false, message, errors };
  return res.status(statusCode).json(body);
}

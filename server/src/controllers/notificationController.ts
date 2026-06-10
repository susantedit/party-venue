import { Request, Response, NextFunction } from 'express';
import { NotificationModel } from '../models/Notification';
import { notificationIdSchema } from '../validators/notificationSchema';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../utils/AppError';

// GET /api/v1/notifications
// Returns the 20 most recent notifications, newest first (Requirement 4.3)
export async function getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const notifications = await NotificationModel.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    sendSuccess(res, notifications);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/v1/notifications/read-all
// Marks all notifications as read (Requirement 4.4)
export async function markAllRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await NotificationModel.updateMany({}, { $set: { isRead: true } });
    sendSuccess(res, null, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
}

// PATCH /api/v1/notifications/:id/read
// Marks a single notification as read by ID (Requirement 4.5)
export async function markOneRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = notificationIdSchema.parse(req.params);
    const notification = await NotificationModel.findByIdAndUpdate(
      id,
      { $set: { isRead: true } },
      { new: true },
    );
    if (!notification) throw new AppError(404, 'Notification not found');
    sendSuccess(res, notification);
  } catch (err) {
    next(err);
  }
}

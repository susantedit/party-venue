import mongoose, { Schema, Document } from 'mongoose';

export type NotificationType = 'booking' | 'inquiry';

export interface INotification extends Document {
  type: NotificationType;
  title: string;
  message: string;
  link: string;
  whatsappAlertLink?: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    type:              { type: String, enum: ['booking', 'inquiry'], required: true },
    title:             { type: String, required: true },
    message:           { type: String, required: true },
    link:              { type: String, required: true },
    whatsappAlertLink: { type: String },
    isRead:            { type: Boolean, default: false },
    createdAt:         { type: Date, default: Date.now },
  },
  { timestamps: false }, // createdAt managed manually so TTL index name matches exactly
);

// TTL — auto-delete records older than 90 days (Requirement 5.3)
NotificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 7776000, name: 'ttl_createdAt' },
);

// Fast unread queries (Requirement 5.2)
NotificationSchema.index({ isRead: 1 }, { name: 'idx_isRead' });
NotificationSchema.index({ isRead: 1, createdAt: -1 }, { name: 'idx_isRead_createdAt' });

export const NotificationModel =
  (mongoose.models.Notification as mongoose.Model<INotification>) ||
  mongoose.model<INotification>('Notification', NotificationSchema);

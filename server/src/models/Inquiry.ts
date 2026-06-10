import mongoose, { Schema, Document } from 'mongoose';

export type InquiryStatus = 'unread' | 'read' | 'replied';

export interface IInquiry extends Document {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  status: InquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    subject: { type: String },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['unread', 'read', 'replied'],
      default: 'unread',
    },
  },
  { timestamps: true },
);

InquirySchema.index({ status: 1 });
InquirySchema.index({ createdAt: -1 });

export const InquiryModel =
  (mongoose.models.Inquiry as mongoose.Model<IInquiry>) ||
  mongoose.model<IInquiry>('Inquiry', InquirySchema);

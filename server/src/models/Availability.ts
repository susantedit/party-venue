import mongoose, { Schema, Document, Types } from 'mongoose';

export type AvailabilityStatus = 'available' | 'reserved' | 'booked';

export interface IAvailability extends Document {
  date: Date;
  status: AvailabilityStatus;
  bookingId?: Types.ObjectId;
  blockedBy?: string; // Firebase UID of admin who blocked the date
  createdAt: Date;
}

const AvailabilitySchema = new Schema<IAvailability>(
  {
    date: { type: Date, required: true, unique: true },
    status: {
      type: String,
      enum: ['available', 'reserved', 'booked'],
      required: true,
      default: 'available',
    },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
    blockedBy: { type: String }, // Firebase UID string
  },
  { timestamps: true },
);

AvailabilitySchema.index({ date: 1 }, { unique: true });

export const AvailabilityModel =
  (mongoose.models.Availability as mongoose.Model<IAvailability>) ||
  mongoose.model<IAvailability>('Availability', AvailabilitySchema);

import mongoose, { Schema, Document, Types } from 'mongoose';

const EVENT_TYPES = [
  'Wedding', 'Reception', 'Birthday', 'Bratabandha',
  'Pasni', 'Corporate', 'Catering', 'Decoration', 'Other',
] as const;

const BOOKING_STATUSES = ['pending', 'contacted', 'confirmed', 'completed', 'cancelled'] as const;
const BOOKING_SOURCES = ['website', 'whatsapp', 'phone', 'referral'] as const;
const BOOKING_SHIFTS = ['Morning', 'Evening', 'Whole_Day'] as const;

export type BookingShift = typeof BOOKING_SHIFTS[number];

export type EventType = typeof EVENT_TYPES[number];
export type BookingStatus = typeof BOOKING_STATUSES[number];
export type BookingSource = typeof BOOKING_SOURCES[number];

export interface IStatusHistory {
  status: BookingStatus;
  changedAt: Date;
  changedBy?: string; // Firebase UID of admin
}

export interface IBooking extends Document {
  bookingId: string;
  customerName: string;
  email: string;
  phone: string;
  eventType: EventType;
  eventDate: Date;
  shift: BookingShift;
  guestCount: number;
  packageId?: Types.ObjectId;
  cateringRequired: boolean;
  decorationRequired: boolean;
  notes?: string;
  estimatedPrice?: number;
  status: BookingStatus;
  source: BookingSource;
  statusHistory: IStatusHistory[];
  createdAt: Date;
  updatedAt: Date;
}

const StatusHistorySchema = new Schema<IStatusHistory>(
  {
    status: { type: String, enum: BOOKING_STATUSES, required: true },
    changedAt: { type: Date, required: true, default: Date.now },
    changedBy: { type: String },
  },
  { _id: false },
);

const BookingSchema = new Schema<IBooking>(
  {
    bookingId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    eventType: { type: String, required: true, enum: EVENT_TYPES },
    eventDate: { type: Date, required: true },
    shift: { type: String, required: true, enum: BOOKING_SHIFTS, default: 'Whole_Day' },
    guestCount: { type: Number, required: true, min: 1 },
    packageId: { type: Schema.Types.ObjectId, ref: 'Package' },
    cateringRequired: { type: Boolean, default: false },
    decorationRequired: { type: Boolean, default: false },
    notes: { type: String, maxlength: 1000 },
    estimatedPrice: { type: Number },
    status: { type: String, enum: BOOKING_STATUSES, default: 'pending' },
    source: { type: String, enum: BOOKING_SOURCES, default: 'website' },
    statusHistory: { type: [StatusHistorySchema], default: [] },
  },
  { timestamps: true },
);

// Indexes
BookingSchema.index({ eventDate: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ createdAt: -1 });
BookingSchema.index({ customerName: 'text', phone: 'text' });
// Prevent double-booking same shift on same date
BookingSchema.index(
  { eventDate: 1, shift: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ['pending', 'confirmed'] } },
    name: 'unique_event_slot',
  },
);

export const BookingModel =
  (mongoose.models.Booking as mongoose.Model<IBooking>) ||
  mongoose.model<IBooking>('Booking', BookingSchema);

export { EVENT_TYPES, BOOKING_STATUSES, BOOKING_SHIFTS };

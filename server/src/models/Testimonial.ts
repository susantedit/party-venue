import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  customerName: string;
  designation?: string;
  rating: number;
  review: string;
  image?: string;
  cloudinaryId?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    customerName: { type: String, required: true, trim: true },
    designation: { type: String },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer between 1 and 5',
      },
    },
    review: { type: String, required: true },
    image: { type: String },
    cloudinaryId: { type: String },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

TestimonialSchema.index({ featured: 1 });

export const TestimonialModel =
  (mongoose.models.Testimonial as mongoose.Model<ITestimonial>) ||
  mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

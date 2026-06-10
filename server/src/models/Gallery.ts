import mongoose, { Schema, Document } from 'mongoose';

export const GALLERY_CATEGORIES = [
  'wedding', 'reception', 'birthday', 'catering', 'decoration', 'venue',
] as const;
export type GalleryCategory = typeof GALLERY_CATEGORIES[number];

export interface IGallery extends Document {
  title?: string;
  imageUrl: string;
  cloudinaryId: string;
  category: GalleryCategory;
  eventType?: string;
  altText?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    title: { type: String, trim: true },
    imageUrl: { type: String, required: true },
    cloudinaryId: { type: String, required: true },
    category: { type: String, required: true, enum: GALLERY_CATEGORIES },
    eventType: { type: String },
    altText: { type: String },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

GallerySchema.index({ category: 1 });
GallerySchema.index({ featured: 1 });

export const GalleryModel =
  (mongoose.models.Gallery as mongoose.Model<IGallery>) ||
  mongoose.model<IGallery>('Gallery', GallerySchema);

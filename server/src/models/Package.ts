import mongoose, { Schema, Document } from 'mongoose';

const PACKAGE_CATEGORIES = ['silver', 'gold', 'platinum', 'custom'] as const;
export type PackageCategory = typeof PACKAGE_CATEGORIES[number];

export interface IPackage extends Document {
  name: string;
  slug: string;
  description: string;
  category: PackageCategory;
  price: number;
  capacity: number;
  features: string[];
  image?: string;
  isPopular: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, enum: PACKAGE_CATEGORIES, required: true },
    price: { type: Number, required: true, min: 0 },
    capacity: { type: Number, required: true, min: 1 },
    features: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one feature is required',
      },
    },
    image: { type: String },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

PackageSchema.index({ slug: 1 }, { unique: true });
PackageSchema.index({ isActive: 1 });
PackageSchema.index({ category: 1 });

export const PackageModel =
  (mongoose.models.Package as mongoose.Model<IPackage>) ||
  mongoose.model<IPackage>('Package', PackageSchema);

import mongoose, { Schema, Document } from 'mongoose';

export const MENU_CATEGORIES = [
  'nepali', 'newari', 'indian', 'chinese', 'bbq', 'dessert', 'beverage',
] as const;
export type MenuCategory = typeof MENU_CATEGORIES[number];

export interface IMenuItem extends Document {
  name: string;
  description?: string;
  category: MenuCategory;
  image?: string;
  cloudinaryId?: string;
  price?: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    category: { type: String, required: true, enum: MENU_CATEGORIES },
    image: { type: String },
    cloudinaryId: { type: String },
    price: { type: Number },
    available: { type: Boolean, default: true },
  },
  { timestamps: true },
);

MenuItemSchema.index({ category: 1 });
MenuItemSchema.index({ available: 1 });

export const MenuItemModel =
  (mongoose.models.MenuItem as mongoose.Model<IMenuItem>) ||
  mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);

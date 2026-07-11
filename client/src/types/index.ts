// ─── Booking ─────────────────────────────────────────────────────────────────
export type EventType =
  | 'Wedding' | 'Reception' | 'Birthday' | 'Bratabandha'
  | 'Pasni' | 'Corporate' | 'Catering' | 'Decoration' | 'Other';

export type BookingStatus = 'pending' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';
export type BookingSource = 'website' | 'whatsapp' | 'phone' | 'referral';
export type BookingShift = 'Morning' | 'Evening' | 'Whole_Day';

export interface StatusHistory {
  status: BookingStatus;
  changedAt: string;
  changedBy?: string;
}

export interface Booking {
  _id: string;
  bookingId: string;
  customerName: string;
  email: string;
  phone: string;
  eventType: EventType;
  eventDate: string;
  shift: BookingShift;
  guestCount: number;
  packageId?: string;
  cateringRequired: boolean;
  decorationRequired: boolean;
  notes?: string;
  estimatedPrice?: number;
  status: BookingStatus;
  source: BookingSource;
  statusHistory: StatusHistory[];
  createdAt: string;
  updatedAt: string;
}

// ─── Package ──────────────────────────────────────────────────────────────────
export type PackageCategory = 'silver' | 'gold' | 'platinum' | 'custom';

export interface Package {
  _id: string;
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
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
export type GalleryCategory = 'wedding' | 'reception' | 'birthday' | 'catering' | 'decoration' | 'venue';

export interface GalleryImage {
  _id: string;
  title?: string;
  imageUrl: string;
  cloudinaryId: string;
  category: GalleryCategory;
  altText?: string;
  featured: boolean;
  createdAt: string;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  author: string;
  seoTitle?: string;
  seoDescription?: string;
  published: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Testimonial ──────────────────────────────────────────────────────────────
export interface Testimonial {
  _id: string;
  customerName: string;
  designation?: string;
  rating: number;
  review: string;
  image?: string;
  featured: boolean;
  createdAt: string;
}

// ─── Inquiry ──────────────────────────────────────────────────────────────────
export type InquiryStatus = 'unread' | 'read' | 'replied';

export interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

// ─── MenuItem ─────────────────────────────────────────────────────────────────
export type MenuCategory = 'nepali' | 'newari' | 'indian' | 'chinese' | 'bbq' | 'dessert' | 'beverage';

export interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  category: MenuCategory;
  image?: string;
  price?: number;
  available: boolean;
}

// ─── Availability ─────────────────────────────────────────────────────────────
export type AvailabilityStatus = 'available' | 'reserved' | 'booked';

export interface AvailabilityResponse {
  date: string;
  status: AvailabilityStatus;
}

// ─── API Response ─────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: { page: number; limit: number; total: number; pages: number };
}

// ─── Notification ─────────────────────────────────────────────────────────────
export type NotificationType = 'booking' | 'inquiry';

export interface Notification {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string;
  whatsappAlertLink?: string;
  isRead: boolean;
  createdAt: string;
}

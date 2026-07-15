/**
 * Seed script: uploads local images from the assets folder to Cloudinary
 * and creates the corresponding MongoDB gallery records.
 *
 * Safe to re-run — skips any cloudinaryId that already exists in the DB.
 *
 * Run with:
 *   npx tsx src/scripts/seedGallery.ts
 *
 * Requires: MONGODB_URI, CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET in .env
 */
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import cloudinaryLib from 'cloudinary';
import type { UploadApiOptions } from 'cloudinary';
import { GalleryModel } from '../models/Gallery';
import type { GalleryCategory } from '../models/Gallery';

// Configure Cloudinary directly from process.env to avoid the strict env validator
// (which requires Firebase keys, Resend keys, etc. that are not needed here)
const cloudinaryV2 = cloudinaryLib.v2;
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key:    process.env.CLOUDINARY_KEY!,
  api_secret: process.env.CLOUDINARY_SECRET!,
  secure:     true,
});

function uploadToCloudinary(buffer: Buffer, options: UploadApiOptions = {}) {
  return new Promise<cloudinaryLib.UploadApiResponse>((resolve, reject) => {
    const stream = cloudinaryV2.uploader.upload_stream(
      { resource_type: 'image', format: 'auto', quality: 'auto', ...options },
      (error, result) => {
        if (error || !result) reject(error ?? new Error('Cloudinary upload failed'));
        else resolve(result);
      },
    );
    stream.end(buffer);
  });
}

const MONGO_URI = process.env.MONGODB_URI!;

// ─── Image manifest ───────────────────────────────────────────────────────────
// Path is relative to this script's location: server/src/scripts/
// The assets folder is at: client/src/assets/imagesandvedioes/
const ASSETS_DIR = path.resolve(
  __dirname,
  '../../../client/src/assets/imagesandvedioes',
);

interface ImageEntry {
  filename: string;          // file in ASSETS_DIR
  category: GalleryCategory;
  altText: string;
  title?: string;
  featured?: boolean;
}

const IMAGES: ImageEntry[] = [
  {
    filename: '1.webp',
    category: 'venue',
    altText: 'Shree Ganesh Party Venue banquet hall interior in Bhaktapur',
    title: 'Banquet Hall',
    featured: true,
  },
  {
    filename: '2.webp',
    category: 'venue',
    altText: 'Shree Ganesh Party Venue hall setup for events in Suryabinayak, Bhaktapur',
    title: 'Hall Setup',
    featured: false,
  },
  {
    filename: '2.png',
    category: 'decoration',
    altText: 'Event decoration setup at Shree Ganesh Party Venue, Bhaktapur',
    title: 'Decoration',
    featured: false,
  },
  {
    filename: '3.png',
    category: 'wedding',
    altText: 'Wedding ceremony setup at Shree Ganesh Party Venue near Suryabinayak Ganesh Mandir',
    title: 'Wedding Setup',
    featured: true,
  },
  {
    filename: '4.png',
    category: 'reception',
    altText: 'Reception event at Shree Ganesh Party Venue banquet hall, Bhaktapur',
    title: 'Reception',
    featured: false,
  },
  {
    filename: '5.jpg',
    category: 'catering',
    altText: 'Catering food buffet at Shree Ganesh Party Venue and Catering Service, Bhaktapur',
    title: 'Catering Buffet',
    featured: true,
  },
  {
    filename: '6.jpg',
    category: 'catering',
    altText: 'Nepali and Newari food catering at Shree Ganesh Party Venue in Bhaktapur',
    title: 'Nepali Catering',
    featured: false,
  },
  {
    filename: '7.jpg',
    category: 'venue',
    altText: 'Shree Ganesh Party Venue exterior and entrance in Suryabinayak, Bhaktapur',
    title: 'Venue Exterior',
    featured: false,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Derive a stable Cloudinary public_id from the filename so we can detect duplicates */
function getPublicId(filename: string): string {
  const base = path.basename(filename, path.extname(filename));
  return `shree-ganesh/gallery/seed-${base}`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  if (!MONGO_URI) {
    console.error('✗ MONGODB_URI is not set in .env');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log('✓ Connected to MongoDB\n');

  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (const entry of IMAGES) {
    const publicId = getPublicId(entry.filename);
    const filePath = path.join(ASSETS_DIR, entry.filename);

    // Skip if already in DB (idempotent)
    const exists = await GalleryModel.exists({ cloudinaryId: publicId });
    if (exists) {
      console.log(`  — skipped (already in DB): ${entry.filename}`);
      skipped++;
      continue;
    }

    // Check file exists on disk
    if (!fs.existsSync(filePath)) {
      console.warn(`  ⚠ file not found, skipping: ${filePath}`);
      failed++;
      continue;
    }

    try {
      const buffer = fs.readFileSync(filePath);

      console.log(`  ↑ uploading: ${entry.filename} → ${publicId}`);
      const result = await uploadToCloudinary(buffer, {
        folder: 'shree-ganesh/gallery',
        public_id: publicId,
        overwrite: false,          // don't overwrite if already on Cloudinary
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      });

      await GalleryModel.create({
        imageUrl: result.secure_url,
        cloudinaryId: result.public_id,
        category: entry.category,
        title: entry.title,
        altText: entry.altText,
        featured: entry.featured ?? false,
      });

      console.log(`  ✓ inserted: ${entry.filename} (${entry.category}) → ${result.secure_url}`);
      inserted++;
    } catch (err: any) {
      console.error(`  ✗ failed: ${entry.filename} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\n✓ Done. Inserted: ${inserted}, Skipped: ${skipped}, Failed: ${failed}`);
  await mongoose.disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

seed().catch((err) => {
  console.error('✗ Seed failed:', err.message);
  process.exit(1);
});

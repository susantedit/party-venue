import cloudinary from 'cloudinary';
import type { UploadApiResponse, UploadApiOptions } from 'cloudinary';
import { env } from './env';

const cloudinaryV2 = cloudinary.v2;

// Defer configuration — only configure when env vars are present.
// This prevents crashing at startup if Cloudinary vars are missing on the host.
function getConfiguredCloudinary() {
  cloudinaryV2.config({
    cloud_name: env.CLOUDINARY_NAME,
    api_key: env.CLOUDINARY_KEY,
    api_secret: env.CLOUDINARY_SECRET,
    secure: true,
  });
  return cloudinaryV2;
}

// Configure once at module load (safe — env.ts already validated these exist)
getConfiguredCloudinary();

/**
 * Upload a file buffer to Cloudinary.
 * @param buffer   - The file buffer (from Multer memoryStorage)
 * @param options  - Cloudinary upload options (folder, public_id, etc.)
 * @returns        - Cloudinary upload response with secure_url and public_id
 */
export function uploadToCloudinary(
  buffer: Buffer,
  options: UploadApiOptions = {},
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinaryV2.uploader.upload_stream(
      {
        resource_type: 'image',
        format: 'auto',        // auto-select best format (WebP when supported)
        quality: 'auto',       // auto-optimize quality
        ...options,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary upload failed: no result'));
        } else {
          resolve(result);
        }
      },
    );
    uploadStream.end(buffer);
  });
}

/**
 * Delete an image from Cloudinary by its public_id.
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinaryV2.uploader.destroy(publicId);
}

export { cloudinaryV2 as cloudinary };

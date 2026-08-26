import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';

// Allowed MIME types — accept all standard image types
const ALLOWED_MIME_PREFIX = 'image/';

// Magic byte signatures for buffer validation
export const MAGIC_BYTES: Record<string, Buffer[]> = {
  'image/jpeg': [Buffer.from([0xff, 0xd8, 0xff])],
  'image/jpg': [Buffer.from([0xff, 0xd8, 0xff])],
  'image/png': [Buffer.from([0x89, 0x50, 0x4e, 0x47])],
  'image/webp': [Buffer.from([0x52, 0x49, 0x46, 0x46])], // RIFF....WEBP
  'image/gif': [Buffer.from([0x47, 0x49, 0x46])], // GIF
  'image/bmp': [Buffer.from([0x42, 0x4d])], // BM
};

/**
 * Validates buffer magic bytes to prevent non-image spoofing.
 * Soft validation — returns true if no signature exists for given MIME type or matches.
 */
export function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (!buffer || buffer.length === 0) return false;
  const signatures = MAGIC_BYTES[mimeType.toLowerCase()];
  if (!signatures || signatures.length === 0) return true; // allow unknown image subtypes
  return signatures.some((sig) => buffer.subarray(0, sig.length).equals(sig));
}

// Multer file filter — checks MIME type starts with image/
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  if (file.mimetype && file.mimetype.startsWith(ALLOWED_MIME_PREFIX)) {
    cb(null, true);
  } else {
    const error: any = new Error('Unsupported file type. Please upload an image file (JPG, PNG, WebP, etc.).');
    error.statusCode = 422;
    cb(error, false);
  }
};

// Multer instance using memoryStorage (no disk writes)
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
    files: 20,
  },
  fileFilter,
});

/**
 * handleMulterError — catches Multer-specific errors.
 * Must be placed after upload middleware in the route chain.
 */
export function handleMulterError(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(422).json({
        success: false,
        message: 'File too large. Maximum allowed size is 10 MB.',
        errors: [],
      });
      return;
    }
    res.status(422).json({
      success: false,
      message: `Upload error: ${err.message}`,
      errors: [],
    });
    return;
  }

  if (err instanceof Error && (err as any).statusCode === 422) {
    res.status(422).json({
      success: false,
      message: err.message,
      errors: [],
    });
    return;
  }

  next(err);
}

/**
 * Quick Cloudinary connectivity test.
 * Uploads a tiny 1x1 pixel PNG to verify credentials work.
 *
 * Run from server/ directory:
 *   npx tsx src/scripts/testCloudinary.ts
 */
import dotenv from 'dotenv';
import path from 'node:path';

// Load .env — try cwd first (when run from server/), fallback to file-relative
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
if (!process.env.CLOUDINARY_NAME) {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

import cloudinaryLib from 'cloudinary';

const cloudinaryV2 = cloudinaryLib.v2;

const name   = process.env.CLOUDINARY_NAME;
const key    = process.env.CLOUDINARY_KEY;
const secret = process.env.CLOUDINARY_SECRET;

console.log('\n─── Cloudinary Credentials Check ───────────────────────────────');
console.log(`  CLOUDINARY_NAME:   ${name   ? `"${name}" ✓` : '❌ NOT SET'}`);
console.log(`  CLOUDINARY_KEY:    ${key    ? `${key.substring(0,6)}… ✓` : '❌ NOT SET'}`);
console.log(`  CLOUDINARY_SECRET: ${secret ? `${secret.substring(0,4)}… ✓` : '❌ NOT SET'}`);
console.log('─────────────────────────────────────────────────────────────────\n');

if (!name || !key || !secret) {
  console.error('✗ One or more Cloudinary env vars are missing. Check your .env file.');
  process.exit(1);
}

cloudinaryV2.config({ cloud_name: name, api_key: key, api_secret: secret, secure: true });

// 1×1 transparent PNG (base64) — smallest valid PNG
const TINY_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

async function testCloudinary() {
  console.log('Uploading 1×1 test image to Cloudinary...');

  try {
    const buffer = Buffer.from(TINY_PNG_BASE64, 'base64');

    const result = await new Promise<cloudinaryLib.UploadApiResponse>((resolve, reject) => {
      const stream = cloudinaryV2.uploader.upload_stream(
        {
          resource_type: 'image',
          public_id: 'shree-ganesh/test/connectivity-check',
          overwrite: true,
          format: 'png',
        },
        (error, result) => {
          if (error || !result) reject(error ?? new Error('No result'));
          else resolve(result);
        },
      );
      stream.end(buffer);
    });

    console.log('\n✓ Upload successful!');
    console.log(`  URL:       ${result.secure_url}`);
    console.log(`  Public ID: ${result.public_id}`);
    console.log(`  Format:    ${result.format}`);
    console.log(`  Size:      ${result.bytes} bytes`);

    // Clean up the test image
    await cloudinaryV2.uploader.destroy('shree-ganesh/test/connectivity-check');
    console.log('  ✓ Test image cleaned up from Cloudinary');
    console.log('\n✓ Cloudinary is working correctly!\n');

  } catch (err: any) {
    console.error('\n✗ Cloudinary upload FAILED:');
    console.error(`  Error: ${err.message}`);
    if (err.http_code) console.error(`  HTTP code: ${err.http_code}`);
    if (err.error?.message) console.error(`  Detail: ${err.error.message}`);
    console.error('\nPossible causes:');
    console.error('  - Wrong CLOUDINARY_NAME, CLOUDINARY_KEY, or CLOUDINARY_SECRET');
    console.error('  - Account suspended or free tier exhausted');
    console.error('  - Network connectivity issue from this machine\n');
    process.exit(1);
  }
}

testCloudinary().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});

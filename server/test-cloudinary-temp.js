require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const cloudinary = require('./node_modules/cloudinary');
const v2 = cloudinary.v2;

v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key:    process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure:     true,
});

console.log('\n─── Cloudinary Credentials ───────────────────────');
console.log('CLOUDINARY_NAME:  ', process.env.CLOUDINARY_NAME   || '❌ MISSING');
console.log('CLOUDINARY_KEY:   ', process.env.CLOUDINARY_KEY    ? process.env.CLOUDINARY_KEY.substring(0,6)+'...' : '❌ MISSING');
console.log('CLOUDINARY_SECRET:', process.env.CLOUDINARY_SECRET ? 'SET ✓' : '❌ MISSING');
console.log('──────────────────────────────────────────────────\n');

if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_KEY || !process.env.CLOUDINARY_SECRET) {
  console.error('✗ Missing credentials — check .env');
  process.exit(1);
}

// 1×1 transparent PNG
const buf = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64'
);

console.log('Uploading 1×1 test image...');
const stream = v2.uploader.upload_stream(
  { resource_type: 'image', public_id: 'shree-ganesh/test/ping', overwrite: true, format: 'png' },
  (err, res) => {
    if (err) {
      console.error('✗ UPLOAD FAILED');
      console.error('  Message:', err.message);
      console.error('  HTTP code:', err.http_code);
      console.error('  Detail:', JSON.stringify(err.error));
      process.exit(1);
    }
    console.log('✓ UPLOAD SUCCESS');
    console.log('  URL:', res.secure_url);
    console.log('  Public ID:', res.public_id);
    v2.uploader.destroy('shree-ganesh/test/ping').then(() => {
      console.log('✓ Test image cleaned up\n');
      process.exit(0);
    });
  }
);
stream.end(buf);

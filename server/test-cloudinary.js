const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dzvpie61n',
  api_key: '394916762724686',
  api_secret: 'DP9zP01RrFvyvpHtsRBCIyUdj5I',
  secure: true,
});

async function test() {
  console.log('Testing Cloudinary connection...\n');

  // 1. Ping test
  try {
    const ping = await cloudinary.api.ping();
    console.log('✅ Ping:', JSON.stringify(ping));
  } catch (e) {
    console.error('❌ Ping failed:', e.message);
    process.exit(1);
  }

  // 2. Account usage / info
  try {
    const usage = await cloudinary.api.usage();
    console.log('\n✅ Account usage:');
    console.log('  Plan:', usage.plan);
    console.log('  Credits used:', usage.credits?.usage, '/', usage.credits?.limit);
    console.log('  Storage (MB):', (usage.storage?.usage / 1024 / 1024).toFixed(2));
    console.log('  Transformations this month:', usage.transformations?.usage);
    console.log('  Bandwidth (MB):', (usage.bandwidth?.usage / 1024 / 1024).toFixed(2));
  } catch (e) {
    console.error('❌ Usage check failed:', e.message);
  }

  // 3. List folders
  try {
    const folders = await cloudinary.api.root_folders();
    console.log('\n✅ Root folders:', folders.folders.map(f => f.name).join(', ') || '(none)');
  } catch (e) {
    console.error('❌ Folder listing failed:', e.message);
  }

  // 4. Test upload with a tiny 1x1 PNG buffer
  try {
    const tiny1x1PNG = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'shree-ganesh/test', public_id: 'api-test-ping', overwrite: true, resource_type: 'image' },
        (err, res) => (err ? reject(err) : resolve(res))
      );
      stream.end(tiny1x1PNG);
    });

    console.log('\n✅ Upload test:');
    console.log('  URL:', result.secure_url);
    console.log('  Public ID:', result.public_id);
    console.log('  Format:', result.format);

    // 5. Cleanup the test image
    await cloudinary.uploader.destroy(result.public_id);
    console.log('✅ Test image deleted (cleanup done)');
  } catch (e) {
    console.error('❌ Upload test failed:', e.message);
  }

  console.log('\n--- Test complete ---');
}

test().catch(console.error);

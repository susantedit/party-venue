/**
 * One-time script: assigns super-admin custom claim to a Firebase user.
 * Run with: npx tsx src/scripts/setAdminRole.ts
 */
import 'dotenv/config';
import * as admin from 'firebase-admin';

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID!;
const CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL!;
const PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n');

// The UID to promote — change this if needed
const TARGET_UID = 'LlS3GOx92tSMTmsArOQgSzMXahD';
const TARGET_ROLE = 'super-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({ projectId: PROJECT_ID, clientEmail: CLIENT_EMAIL, privateKey: PRIVATE_KEY }),
  });
}

async function run() {
  await admin.auth().setCustomUserClaims(TARGET_UID, { role: TARGET_ROLE });
  const user = await admin.auth().getUser(TARGET_UID);
  console.log('✓ Custom claims set:', user.customClaims);
  console.log(`✓ User ${user.email} is now ${TARGET_ROLE}`);
  process.exit(0);
}

run().catch((err) => { console.error('✗ Failed:', err.message); process.exit(1); });

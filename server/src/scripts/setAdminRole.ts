/**
 * One-time script: assigns super-admin custom claim to a Firebase user by email
 * and marks their email as verified.
 * Run with: npx tsx src/scripts/setAdminRole.ts
 */
import 'dotenv/config';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID!;
const CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL!;
const PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n');

// Admin email to promote
const TARGET_EMAIL = 'susantedit@gmail.com';
const TARGET_ROLE = 'super-admin';

if (!getApps().length) {
  initializeApp({
    credential: cert({ projectId: PROJECT_ID, clientEmail: CLIENT_EMAIL, privateKey: PRIVATE_KEY }),
  });
}

async function run() {
  const auth = getAuth();
  const user = await auth.getUserByEmail(TARGET_EMAIL);

  // Set super-admin claim AND mark email as verified
  await auth.updateUser(user.uid, { emailVerified: true });
  await auth.setCustomUserClaims(user.uid, { role: TARGET_ROLE });

  const updated = await auth.getUser(user.uid);
  console.log('✓ emailVerified:', updated.emailVerified);
  console.log('✓ Custom claims set:', updated.customClaims);
  console.log(`✓ User ${updated.email} (uid: ${updated.uid}) is now ${TARGET_ROLE}`);
  process.exit(0);
}

run().catch((err) => { console.error('✗ Failed:', err.message); process.exit(1); });

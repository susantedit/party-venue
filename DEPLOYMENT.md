# Deployment Guide — Shree Ganesh Party Venue

## Architecture

```
client/  →  Vercel  (React SPA)
server/  →  Render  (Node.js API)
DB       →  MongoDB Atlas
Media    →  Cloudinary
Auth     →  Firebase Authentication
```

---

## 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication → Email/Password** sign-in provider
4. Enable **Email Verification** in Authentication settings
5. Go to **Project Settings → Service Accounts → Generate new private key**
6. Copy the values into `server/.env`:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY` (paste with `\n` for newlines)
7. Go to **Project Settings → General → Your apps → Web app**
8. Copy the Firebase config values into `client/.env`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - etc.
9. Add your Vercel production domain to **Authentication → Authorized domains**

### Creating Admin Users

1. Go to Firebase Console → Authentication → Users → Add user
2. Note the User UID
3. Call the set-role endpoint with a super-admin token:

```http
POST https://your-api.onrender.com/api/v1/auth/set-role
Authorization: Bearer <super-admin-id-token>
Content-Type: application/json

{
  "uid": "<firebase-user-uid>",
  "role": "admin"
}
```

Available roles: `super-admin`, `admin`, `editor`

---

## 2. MongoDB Atlas Setup

1. Create a cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user with read/write access
3. **IP Access List**: Add only Render's outbound IPs (not `0.0.0.0/0`)
4. Copy the connection string to `server/.env` as `MONGODB_URI`
5. Enable Atlas Backups (daily recommended)

---

## 3. Cloudinary Setup

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Copy Cloud name, API Key, API Secret to `server/.env`
3. Images will be stored under `shree-ganesh/` folder

---

## 4. Backend Deployment (Render)

1. Connect GitHub repo to Render
2. Create a new **Web Service**
3. Set:
   - Root directory: `server`
   - Build command: `npm run build`
   - Start command: `node dist/server.js`
   - Health check: `/api/v1/health`
4. Add all environment variables from `server/.env.example`
5. Deploy

---

## 5. Frontend Deployment (Vercel)

1. Connect GitHub repo to Vercel
2. Set:
   - Root directory: `client`
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add all environment variables from `client/.env.example`
   - Set `VITE_API_URL` to your Render backend URL
4. Deploy
5. Add custom domain if needed

---

## 6. Environment Variables Reference

### Backend (`server/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `CLOUDINARY_NAME` | Cloudinary cloud name |
| `CLOUDINARY_KEY` | Cloudinary API key |
| `CLOUDINARY_SECRET` | Cloudinary API secret |
| `EMAIL_USER` | Gmail SMTP user |
| `EMAIL_PASSWORD` | Gmail App Password |
| `EMAIL_TO` | Admin notification recipient |
| `FRONTEND_URL` | Vercel frontend URL (for CORS) |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email |
| `FIREBASE_PRIVATE_KEY` | Firebase private key (with `\n`) |

### Frontend (`client/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Render backend URL |
| `VITE_CLOUDINARY_NAME` | Cloudinary cloud name |
| `VITE_GOOGLE_MAPS_KEY` | Google Maps API key |
| `VITE_FIREBASE_API_KEY` | Firebase web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

---

## Security Checklist

- [ ] No `.env` files committed to Git
- [ ] Firebase service account JSON not committed
- [ ] MongoDB Atlas IP allowlist restricted to Render IPs
- [ ] HTTPS enforced on both Vercel and Render
- [ ] Rate limiting active on all public endpoints
- [ ] Helmet security headers verified in production response

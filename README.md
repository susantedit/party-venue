# Shree Ganesh Party Venue & Catering Service

A full production-grade MERN stack platform for a premium event venue and catering business located in Bhaktapur, Nepal.

## Repository Structure

```
shree-ganesh-party-venue/
├── client/          # React + Vite + TypeScript frontend (deployed to Vercel)
└── server/          # Node.js + Express REST API (deployed to Render)
```

## Tech Stack

| Layer      | Technology                                          |
| ---------- | --------------------------------------------------- |
| Frontend   | React 18, Vite, TypeScript, Tailwind CSS, Shadcn UI |
| State      | Zustand (UI/auth), TanStack Query (server state)    |
| Backend    | Node.js, Express, TypeScript                        |
| Database   | MongoDB Atlas (Mongoose)                            |
| Auth       | Firebase Authentication + Firebase Admin SDK        |
| Media      | Cloudinary (image upload, CDN delivery)             |
| Email      | Nodemailer (SMTP)                                   |
| Validation | Zod (frontend + backend)                            |
| Testing    | Jest + Supertest + fast-check (property-based)      |

## Prerequisites

- Node.js >= 18
- npm >= 9

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
# Frontend
cp client/.env.example client/.env.local

# Backend
cp server/.env.example server/.env
```

Fill in the required values in both `.env` files. See the `.env.example` files for all required variables.

### 3. Firebase Admin Setup

Admin users must be created in **Firebase Console → Authentication → Users**.

After creating a user in Firebase Console, assign their role by calling:

```http
POST /api/v1/auth/set-role
Authorization: Bearer <super-admin-id-token>
Content-Type: application/json

{
  "uid": "<firebase-user-uid>",
  "role": "admin"   // "super-admin" | "admin" | "editor"
}
```

> ⚠️ Never commit Firebase service account JSON files. Store credentials as environment variables only.

### 4. Run development servers

```bash
# Run frontend (http://localhost:5173)
npm run dev:client

# Run backend (http://localhost:5000)
npm run dev:server
```

## Available Scripts (root)

| Script              | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev:client` | Start Vite dev server               |
| `npm run dev:server` | Start Express dev server (ts-node-dev) |
| `npm run build`     | Build both client and server         |
| `npm run test`      | Run backend test suite               |
| `npm run lint`      | Lint client source                   |

## Environment Variables

### Frontend (`client/.env.local`)

| Variable                          | Description                        |
| --------------------------------- | ---------------------------------- |
| `VITE_API_URL`                    | Backend API base URL               |
| `VITE_CLOUDINARY_NAME`            | Cloudinary cloud name              |
| `VITE_GOOGLE_MAPS_KEY`            | Google Maps embed API key          |
| `VITE_FIREBASE_API_KEY`           | Firebase web API key               |
| `VITE_FIREBASE_AUTH_DOMAIN`       | Firebase auth domain               |
| `VITE_FIREBASE_PROJECT_ID`        | Firebase project ID                |
| `VITE_FIREBASE_STORAGE_BUCKET`    | Firebase storage bucket            |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID    |
| `VITE_FIREBASE_APP_ID`            | Firebase app ID                    |

### Backend (`server/.env`)

| Variable                | Description                              |
| ----------------------- | ---------------------------------------- |
| `PORT`                  | Server port (default: 5000)              |
| `NODE_ENV`              | Environment (`development`/`production`) |
| `MONGODB_URI`           | MongoDB Atlas connection string          |
| `CLOUDINARY_NAME`       | Cloudinary cloud name                    |
| `CLOUDINARY_KEY`        | Cloudinary API key                       |
| `CLOUDINARY_SECRET`     | Cloudinary API secret                    |
| `EMAIL_USER`            | SMTP email user                          |
| `EMAIL_PASSWORD`        | SMTP email password                      |
| `EMAIL_TO`              | Admin notification recipient             |
| `FRONTEND_URL`          | CORS allowed origin                      |
| `FIREBASE_PROJECT_ID`   | Firebase project ID                      |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account client email    |
| `FIREBASE_PRIVATE_KEY`  | Firebase service account private key     |

## Deployment

- **Frontend** → Vercel (connect GitHub repo, set root directory to `client`)
- **Backend** → Render (connect GitHub repo, set root directory to `server`, build command `npm run build`, start command `npm start`)
- **Database** → MongoDB Atlas (create cluster, whitelist Render IPs)
- **Media** → Cloudinary (create account, set environment variables)

## Security Notes

- Never commit `.env` files or Firebase service account JSON files
- Firebase handles all authentication — no passwords are stored in the application database
- All admin users are created via Firebase Console; roles are assigned via the API
- HTTP-only cookies and in-memory token storage prevent XSS-based token theft
- Rate limiting, input sanitization (mongo-sanitize + xss-clean), and Helmet headers are applied globally

## License

Private — All rights reserved.

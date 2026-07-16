import 'dotenv/config';
import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
// @ts-ignore
import xssClean from 'xss-clean';
import { env } from './config/env';

// Routes
import authRoutes from './routes/authRoutes';
import bookingRoutes from './routes/bookingRoutes';
import availabilityRoutes from './routes/availabilityRoutes';
import packageRoutes from './routes/packageRoutes';
import galleryRoutes from './routes/galleryRoutes';
import blogRoutes from './routes/blogRoutes';
import testimonialRoutes from './routes/testimonialRoutes';
import inquiryRoutes from './routes/inquiryRoutes';
import menuRoutes from './routes/menuRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import notificationRoutes from './routes/notificationRoutes';
import uploadRoutes from './routes/uploadRoutes';
import sitemapRoutes from './routes/sitemapRoutes';
import faqRoutes from './routes/faqRoutes';
import googleReviewsRoutes from './routes/googleReviewsRoutes';

// Error handler
import { globalErrorHandler } from './middleware/errorMiddleware';

const app: Application = express();

// ─── HTTPS redirect (production only) ────────────────────────────────────────
if (env.NODE_ENV === 'production') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, `https://${req.hostname}${req.url}`);
    }
    next();
  });
}

// ─── Security headers ─────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://apis.google.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
        connectSrc: [
          "'self'",
          env.FRONTEND_URL,
          'https://party-venue-zeta.vercel.app',
          'https://shreeganeshpartyvenue.com',
          'https://*.vercel.app',
        ],
        frameSrc: ["'none'"],
      },
    },
    hsts: env.NODE_ENV === 'production'
      ? { maxAge: 31536000, includeSubDomains: true, preload: true }
      : false,
    frameguard: { action: 'deny' },
    noSniff: true,
    referrerPolicy: { policy: 'same-origin' },
  }),
);

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Support multiple allowed origins: the configured FRONTEND_URL plus known
// production domains. Uses a function origin so credentials: true works safely.
const ALLOWED_ORIGINS = new Set([
  env.FRONTEND_URL,
  'https://party-venue-zeta.vercel.app',
  'https://shreeganeshpartyvenue.com',
  'https://www.shreeganeshpartyvenue.com',
  // Vercel preview deploy pattern — match any branch of this project
]);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no Origin header (server-to-server, Postman, etc.)
    if (!origin) return callback(null, true);
    // Allow any vercel.app preview deploy for this project
    if (origin.endsWith('.vercel.app') || ALLOWED_ORIGINS.has(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS: origin '${origin}' not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Logging + parsing + sanitization ────────────────────────────────────────
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize());
app.use(xssClean());

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/v1/health', (_req, res) => {
  res.json({ success: true, message: 'OK', timestamp: new Date().toISOString() });
});

// ─── Sitemap (no /api/v1 prefix) ─────────────────────────────────────────────
app.use('/', sitemapRoutes);

// ─── API routes ───────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/availability', availabilityRoutes);
app.use('/api/v1/packages', packageRoutes);
app.use('/api/v1/gallery', galleryRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/testimonials', testimonialRoutes);
app.use('/api/v1/inquiries', inquiryRoutes);
app.use('/api/v1/menu', menuRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/faqs', faqRoutes);
app.use('/api/v1/google-reviews', googleReviewsRoutes);

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', errors: [] });
});

// ─── Global error handler (must be last) ─────────────────────────────────────
app.use(globalErrorHandler);

export default app;

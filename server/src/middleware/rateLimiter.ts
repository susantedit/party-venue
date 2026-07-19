import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';

/**
 * Standard error response for rate limit exceeded.
 * Matches the platform's API envelope: { success, message, errors }.
 */
const rateLimitHandler = (_req: any, res: any) => {
  res.status(429).json({
    success: false,
    message: 'Too many requests. Please try again later.',
    errors: [],
  });
};

/**
 * globalLimiter — broad cap applied to the whole app in app.ts.
 * Protects unlisted/public routes (health, sitemap, packages, gallery, etc.)
 * 200 requests per 15 minutes per IP.
 */
export const globalLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  message: undefined,
});

/**
 * bookingLimiter — tight limit on the public booking creation endpoint.
 * 10 requests per 30 minutes per IP — prevents fake booking spam.
 */
export const bookingLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/**
 * authLimiter — applied to Firebase token verification / auth endpoints.
 * 10 requests per 15 minutes per IP.
 */
export const authLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/**
 * inquiryLimiter — applied to the public inquiry (contact form) endpoint.
 * 5 requests per 10 minutes per IP.
 */
export const inquiryLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/**
 * uploadLimiter — applied to image upload endpoints.
 * 20 requests per 1 hour per IP.
 */
export const uploadLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

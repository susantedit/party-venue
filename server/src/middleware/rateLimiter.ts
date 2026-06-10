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
 * globalLimiter — applied to all public API endpoints.
 * 100 requests per 15 minutes per IP.
 */
export const globalLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  message: undefined, // use handler instead
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
  windowMs: 10 * 60 * 1000, // 10 minutes
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
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

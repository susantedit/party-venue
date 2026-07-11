import { Router, Request, Response } from 'express';
import { env } from '../config/env';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../utils/AppError';

const router = Router();

const PLACE_ID = env.GOOGLE_PLACE_ID || 'ChIJ3d8nIs8RmzkVlZUH3V3MvH4';

/**
 * GET /api/v1/google-reviews
 * Public proxy — keeps the API key server-side only.
 */
router.get('/', async (_req: Request, res: Response, next: Function): Promise<void> => {
  try {
    if (!env.GOOGLE_PLACES_API_KEY) {
      throw new AppError(503, 'Google Reviews are not configured on this server.');
    }

    const fields = 'rating,user_ratings_total,reviews';
    const url =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${PLACE_ID}` +
      `&fields=${fields}` +
      `&reviews_sort=most_relevant` +
      `&key=${env.GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new AppError(502, 'Failed to fetch from Google Places API');
    }

    const json = (await response.json()) as {
      status: string;
      result?: {
        rating?: number;
        user_ratings_total?: number;
        reviews?: {
          author_name: string;
          profile_photo_url: string;
          rating: number;
          relative_time_description: string;
          text: string;
        }[];
      };
    };

    if (json.status !== 'OK' || !json.result) {
      throw new AppError(502, `Google Places API error: ${json.status}`);
    }

    const { rating, user_ratings_total, reviews = [] } = json.result;

    sendSuccess(res, {
      rating: rating ?? 0,
      userRatingsTotal: user_ratings_total ?? 0,
      reviews: reviews.slice(0, 5).map((r) => ({
        author: r.author_name,
        photo: r.profile_photo_url,
        rating: r.rating,
        relativeTime: r.relative_time_description,
        text: r.text,
      })),
      placeUrl: `https://www.google.com/maps/place/?q=place_id:${PLACE_ID}`,
    });
  } catch (err) {
    next(err);
  }
});

export default router;

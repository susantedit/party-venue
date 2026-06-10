import mongoose from 'mongoose';
import { env } from './env';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

export async function connectDB(): Promise<void> {
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      attempt++;
      // NOTE: Never log the MONGODB_URI value — only log connection events
      await mongoose.connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
      });
      // Connection events
      mongoose.connection.on('connected', () => {
        console.log('[db] MongoDB connected');
      });
      mongoose.connection.on('error', (err) => {
        // Log error type only, never the connection string
        console.error('[db] MongoDB error:', err.name);
      });
      mongoose.connection.on('disconnected', () => {
        console.warn('[db] MongoDB disconnected');
      });
      return;
    } catch (error) {
      const isLast = attempt >= MAX_RETRIES;
      console.error(
        `[db] Connection attempt ${attempt}/${MAX_RETRIES} failed.${isLast ? ' Giving up.' : ` Retrying in ${RETRY_DELAY_MS / 1000}s...`}`,
      );
      if (isLast) throw error;
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  console.log('[db] MongoDB disconnected (graceful)');
}

/**
 * NOTE: Use .lean() for all read-only queries to improve performance.
 * Example: Model.find({ ... }).lean()
 */

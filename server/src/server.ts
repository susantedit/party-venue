import 'dotenv/config';
import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

const PORT = Number(env.PORT) || 5000;

async function startServer(): Promise<void> {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[server] Running on port ${PORT} (${env.NODE_ENV})`);
    });
  } catch (error) {
    console.error('[server] Failed to start:', error);
    process.exit(1);
  }
}

startServer();

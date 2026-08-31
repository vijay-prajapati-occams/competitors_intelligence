import { env } from './config/env';
import { connectDB } from './config/db';
import { createApp } from './app';

async function start(): Promise<void> {
  await connectDB();

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

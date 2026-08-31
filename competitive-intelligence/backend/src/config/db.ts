import mongoose from 'mongoose';
import { env } from './env';

mongoose.set('strictQuery', true);

let connectPromise: Promise<typeof mongoose> | null = null;

export async function connectDB(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  if (!connectPromise) {
    connectPromise = mongoose.connect(env.MONGODB_URI).catch((error) => {
      connectPromise = null;
      throw error;
    });
  }
  await connectPromise;
}

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

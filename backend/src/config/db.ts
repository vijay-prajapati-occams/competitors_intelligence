import mongoose from 'mongoose';
import { env } from './env';

mongoose.set('strictQuery', true);

let connectPromise: Promise<typeof mongoose> | null = null;

export async function connectDB(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  if (!connectPromise) {
    connectPromise = mongoose
      .connect(env.MONGODB_URI, {
        // Every serverless instance opens its own pool, so a large per-instance
        // pool multiplies into Atlas connection-limit errors under load.
        maxPoolSize: 10,
        minPoolSize: 0,
        // Without this, queries issued before the handshake completes queue
        // indefinitely and the request burns its whole timeout with no error.
        bufferCommands: false,
        serverSelectionTimeoutMS: 10_000,
        socketTimeoutMS: 45_000,
      })
      .catch((error) => {
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

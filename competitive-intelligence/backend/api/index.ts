import type { IncomingMessage, ServerResponse } from 'http';
import { connectDB } from '../src/config/db';
import { createApp } from '../src/app';

const app = createApp();

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  await connectDB();
  app(req, res);
}

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { isOriginAllowed } from './utils/cors';
import { apiRateLimiter } from './middleware/rateLimit.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import { notFoundMiddleware } from './middleware/notFound.middleware';
import apiRoutes from './routes';

export function createApp(): Express {
  const app = express();

  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(
    cors({
      // Passing `false` rather than an Error omits the CORS headers, which is
      // what the browser blocks on. Returning an Error instead surfaced a 500
      // through the error middleware and echoed the origin back in the body.
      origin: (origin, callback) => {
        callback(null, !origin || isOriginAllowed(origin, env.FRONTEND_URL));
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(cookieParser());
  app.use('/api', apiRateLimiter);

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'OK', data: { uptime: process.uptime() } });
  });

  app.use('/api', apiRoutes);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}

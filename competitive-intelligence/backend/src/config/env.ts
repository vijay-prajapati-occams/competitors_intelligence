import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// dotenv turns `KEY=` into '' rather than leaving it unset, which would
// otherwise fail min(1)/coerce.number() checks on intentionally-blank
// optional vars (e.g. SERPAPI_API_KEY left empty to disable collection).
const emptyToUndefined = (value: unknown): unknown => (value === '' ? undefined : value);

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET must be at least 16 characters'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 characters'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  FRONTEND_URL: z
    .string()
    .min(1)
    .default('http://localhost:3000')
    .transform((value) => value.split(',').map((url) => url.trim()).filter(Boolean)),

  // Phase 2 — News & Mentions
  SERPAPI_API_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  SERPAPI_ESTIMATED_COST_PER_REQUEST: z.preprocess(emptyToUndefined, z.coerce.number().nonnegative().optional()),
  NEWS_MIN_RELEVANCE_SCORE: z.coerce.number().min(0).max(100).default(60),
  NEWS_REFRESH_COOLDOWN_MINUTES: z.coerce.number().min(0).default(5),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error('Environment variable validation failed. Check your .env file against .env.example.');
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === 'production';

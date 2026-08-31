import { z } from 'zod';
import { objectIdSchema } from './common.validator';

export const newsCategoryEnum = z.enum([
  'funding',
  'partnership',
  'acquisition',
  'product_launch',
  'leadership',
  'award',
  'expansion',
  'customer_win',
  'legal',
  'security',
  'pricing',
  'marketing',
  'research',
  'general',
]);

export const newsSentimentEnum = z.enum(['positive', 'neutral', 'negative']);

const boolQueryParam = z
  .enum(['true', 'false'])
  .optional()
  .transform((value) => (value === undefined ? undefined : value === 'true'));

const baseNewsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().max(200).optional().or(z.literal('')),
  category: newsCategoryEnum.optional(),
  sentiment: newsSentimentEnum.optional(),
  source: z.string().trim().max(200).optional().or(z.literal('')),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  isRead: boolQueryParam,
  isBookmarked: boolQueryParam,
  sort: z.enum(['newest', 'oldest']).default('newest'),
});

export const listCompetitorNewsQuerySchema = baseNewsQuerySchema;

export const listNewsQuerySchema = baseNewsQuerySchema.extend({
  competitorId: objectIdSchema.optional(),
});

export const updateNewsMentionSchema = z
  .object({
    isRead: z.boolean().optional(),
    isBookmarked: z.boolean().optional(),
    isArchived: z.boolean().optional(),
    category: newsCategoryEnum.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, { message: 'No updatable fields provided' });

export type ListNewsQuery = z.infer<typeof listNewsQuerySchema>;
export type ListCompetitorNewsQuery = z.infer<typeof listCompetitorNewsQuerySchema>;
export type UpdateNewsMentionInput = z.infer<typeof updateNewsMentionSchema>;

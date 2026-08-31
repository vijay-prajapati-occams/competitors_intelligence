import { z } from 'zod';

const competitorTypeEnum = z.enum(['direct', 'indirect', 'emerging', 'benchmark']);
const competitorStatusEnum = z.enum(['active', 'paused']);

export const createCompetitorSchema = z.object({
  name: z.string().trim().min(1, 'Company name is required').max(150),
  domain: z
    .string()
    .trim()
    .min(1, 'Domain is required')
    .max(255)
    .refine(
      (value) => {
        const cleaned = value.replace(/^https?:\/\//, '').replace(/^www\./, '');
        return /^[a-z0-9-]+(\.[a-z0-9-]+)+([/?#].*)?$/i.test(cleaned);
      },
      { message: 'Invalid domain' }
    ),
  industry: z.string().trim().max(100).optional().or(z.literal('')),
  country: z.string().trim().max(100).optional().or(z.literal('')),
  competitorType: competitorTypeEnum,
  description: z.string().trim().max(2000).optional().or(z.literal('')),
  notes: z.string().trim().max(2000).optional().or(z.literal('')),
});

export const updateCompetitorSchema = createCompetitorSchema.partial().extend({
  status: competitorStatusEnum.optional(),
});

export type CreateCompetitorInput = z.infer<typeof createCompetitorSchema>;
export type UpdateCompetitorInput = z.infer<typeof updateCompetitorSchema>;

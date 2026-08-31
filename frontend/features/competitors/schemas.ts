import { z } from 'zod';

export const competitorFormSchema = z.object({
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
      { message: 'Enter a valid domain, e.g. example.com' }
    ),
  industry: z.string().trim().max(100).optional().or(z.literal('')),
  country: z.string().trim().max(100).optional().or(z.literal('')),
  competitorType: z.enum(['direct', 'indirect', 'emerging', 'benchmark'], {
    message: 'Select a competitor type',
  }),
  description: z.string().trim().max(2000).optional().or(z.literal('')),
  notes: z.string().trim().max(2000).optional().or(z.literal('')),
});

export type CompetitorFormSchemaValues = z.infer<typeof competitorFormSchema>;

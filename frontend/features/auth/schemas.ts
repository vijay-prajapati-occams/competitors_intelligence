import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(100),
  lastName: z.string().trim().min(1, 'Last name is required').max(100),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long'),
  companyName: z.string().trim().min(1, 'Company name is required').max(150),
  companyWebsite: z
    .string()
    .trim()
    .min(1, 'Company website is required')
    .max(255)
    .refine(
      (value) => {
        const cleaned = value.replace(/^https?:\/\//, '').replace(/^www\./, '');
        return /^[a-z0-9-]+(\.[a-z0-9-]+)+([/?#].*)?$/i.test(cleaned);
      },
      { message: 'Enter a valid domain, e.g. acme.com' }
    ),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

import { z } from 'zod';
import { Types } from 'mongoose';

export const objectIdSchema = z
  .string()
  .refine((value) => Types.ObjectId.isValid(value), { message: 'Invalid identifier' });

export const paramsIdSchema = z.object({
  id: objectIdSchema,
});

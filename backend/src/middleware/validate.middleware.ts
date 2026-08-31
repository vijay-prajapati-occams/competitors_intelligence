import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodTypeAny } from 'zod';
import { sendError } from '../utils/apiResponse';

type RequestPart = 'body' | 'params' | 'query';

export function validate(schema: ZodTypeAny, part: RequestPart = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[part]);
      req[part] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string> = {};
        for (const issue of error.issues) {
          const key = issue.path.join('.') || part;
          if (!errors[key]) {
            errors[key] = issue.message;
          }
        }
        sendError(res, 'Validation failed', 422, errors);
        return;
      }
      next(error);
    }
  };
}

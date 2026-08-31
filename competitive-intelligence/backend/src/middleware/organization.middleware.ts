import { NextFunction, Request, Response } from 'express';
import { sendError } from '../utils/apiResponse';

/**
 * Runs after authMiddleware. Guarantees every downstream handler has an
 * organization scope to filter by, so a missing/forged token can never
 * fall through to an unscoped query.
 */
export function organizationMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!req.user?.organizationId) {
    sendError(res, 'Organization context is missing', 403);
    return;
  }

  next();
}

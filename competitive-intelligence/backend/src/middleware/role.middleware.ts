import { NextFunction, Request, Response } from 'express';
import { UserRole } from '../types';
import { sendError } from '../utils/apiResponse';

export function roleMiddleware(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required', 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(res, 'You do not have permission to perform this action', 403);
      return;
    }

    next();
  };
}

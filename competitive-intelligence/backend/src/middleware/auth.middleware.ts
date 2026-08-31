import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { verifyAccessToken } from '../utils/jwt';
import { sendError } from '../utils/apiResponse';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    sendError(res, 'Authentication required', 401);
    return;
  }

  const token = header.slice('Bearer '.length);

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      userId: new Types.ObjectId(payload.userId),
      organizationId: new Types.ObjectId(payload.organizationId),
      role: payload.role,
    };
    next();
  } catch {
    sendError(res, 'Invalid or expired access token', 401);
  }
}

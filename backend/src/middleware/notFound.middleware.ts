import { Request, Response } from 'express';
import { sendError } from '../utils/apiResponse';

export function notFoundMiddleware(req: Request, res: Response): void {
  sendError(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
}

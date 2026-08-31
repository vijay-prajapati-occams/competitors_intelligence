import { NextFunction, Request, Response } from 'express';
import { isProduction } from '../config/env';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/apiResponse';

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (!isProduction) {
    console.error(err);
  }

  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode, err.errors);
    return;
  }

  if (err && typeof err === 'object' && 'code' in err && (err as { code: number }).code === 11000) {
    sendError(res, 'A record with this value already exists', 409);
    return;
  }

  if (err instanceof Error && err.name === 'CastError') {
    sendError(res, 'Invalid identifier', 400);
    return;
  }

  const message = err instanceof Error ? err.message : 'Internal server error';
  sendError(res, isProduction ? 'Internal server error' : message, 500);
}

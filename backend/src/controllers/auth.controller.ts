import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AppError } from '../utils/AppError';
import {
  registerOrganization,
  loginUser,
  refreshAccessToken,
  getCurrentUser,
} from '../services/auth.service';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { user, tokens } = await registerOrganization(req.body);
  sendSuccess(res, 'Account created successfully', { user, ...tokens }, 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, tokens } = await loginUser(req.body);
  sendSuccess(res, 'Logged in successfully', { user, ...tokens });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.body?.refreshToken as string | undefined;

  if (!refreshToken) {
    throw new AppError('Refresh token is required', 400, { refreshToken: 'Refresh token is required' });
  }

  const tokens = await refreshAccessToken(refreshToken);
  sendSuccess(res, 'Token refreshed successfully', tokens);
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, 'Logged out successfully', null);
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    sendError(res, 'Authentication required', 401);
    return;
  }
  const user = await getCurrentUser(req.user.userId.toString());
  sendSuccess(res, 'Current user fetched successfully', user);
});

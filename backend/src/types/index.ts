import { Types } from 'mongoose';

export type UserRole = 'owner' | 'admin' | 'analyst' | 'viewer';

export type CompetitorType = 'direct' | 'indirect' | 'emerging' | 'benchmark';

export type CompetitorStatus = 'active' | 'paused';

export type NewsCategory =
  | 'funding'
  | 'partnership'
  | 'acquisition'
  | 'product_launch'
  | 'leadership'
  | 'award'
  | 'expansion'
  | 'customer_win'
  | 'legal'
  | 'security'
  | 'pricing'
  | 'marketing'
  | 'research'
  | 'general';

export type NewsSentiment = 'positive' | 'neutral' | 'negative';

export type SourceReliability = 'high' | 'medium' | 'unknown';

export interface AccessTokenPayload {
  userId: string;
  organizationId: string;
  role: UserRole;
}

export interface RefreshTokenPayload {
  userId: string;
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string>;
}

export interface AuthenticatedRequestUser {
  userId: Types.ObjectId;
  organizationId: Types.ObjectId;
  role: UserRole;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedRequestUser;
    }
  }
}

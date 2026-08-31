import { API_URL } from '@/lib/env';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '@/lib/token';
import { ApiErrorResponse } from '@/types/api';
import { AuthTokens } from '@/types/auth';

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string>;

  constructor(message: string, status: number, errors?: Record<string, string>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export const AUTH_LOGOUT_EVENT = 'ci:auth-logout';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  skipAuth?: boolean;
  skipRefreshOnError?: boolean;
}

let refreshPromise: Promise<AuthTokens> | null = null;

async function refreshTokens(): Promise<AuthTokens> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new ApiError('No refresh token available', 401);
  }

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  const json = (await response.json()) as { success: boolean; data?: AuthTokens; message: string };

  if (!response.ok || !json.success || !json.data) {
    throw new ApiError(json.message || 'Session expired', response.status);
  }

  setTokens(json.data);
  return json.data;
}

function notifyLogout(): void {
  clearTokens();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT));
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, skipAuth, skipRefreshOnError, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && !skipAuth && !skipRefreshOnError) {
    try {
      refreshPromise = refreshPromise ?? refreshTokens();
      await refreshPromise;
      refreshPromise = null;
      return request<T>(path, { ...options, skipRefreshOnError: true });
    } catch {
      refreshPromise = null;
      notifyLogout();
      throw new ApiError('Your session has expired. Please log in again.', 401);
    }
  }

  let json: ApiErrorResponse & { data?: T };
  try {
    json = await response.json();
  } catch {
    throw new ApiError('Unexpected server response', response.status);
  }

  if (!response.ok || !json.success) {
    throw new ApiError(json.message || 'Something went wrong', response.status, json.errors);
  }

  return (json as unknown as { data: T }).data;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'DELETE' }),
};

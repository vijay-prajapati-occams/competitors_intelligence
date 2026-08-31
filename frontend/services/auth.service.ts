import { api } from '@/services/api';
import { setTokens, clearTokens, getRefreshToken } from '@/lib/token';
import { AuthResponse, LoginPayload, RegisterPayload, User } from '@/types/auth';

export async function registerRequest(payload: RegisterPayload): Promise<User> {
  const data = await api.post<AuthResponse>('/auth/register', payload, { skipAuth: true });
  setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data.user;
}

export async function loginRequest(payload: LoginPayload): Promise<User> {
  const data = await api.post<AuthResponse>('/auth/login', payload, { skipAuth: true });
  setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data.user;
}

export async function logoutRequest(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } finally {
    clearTokens();
  }
}

export async function fetchCurrentUser(): Promise<User> {
  return api.get<User>('/auth/me');
}

export function hasStoredSession(): boolean {
  return Boolean(getRefreshToken());
}

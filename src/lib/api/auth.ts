import { appStore } from '../appStore';
import { mockApiCall, errorResponse } from './config';
import type { ApiResult } from './types';
import type { UserDto, LoginResponseDto } from '../../services/api';

export async function login(data: { username: string; password: string }): Promise<ApiResult<LoginResponseDto>> {
  if (!data.username.trim()) {
    return errorResponse('VALIDATION_ERROR', 'Username is required');
  }
  if (!data.password.trim()) {
    return errorResponse('VALIDATION_ERROR', 'Password is required');
  }

  return mockApiCall(() => {
    const user = appStore.login(data.username, data.password);
    if (!user) throw new Error('Invalid credentials');
    return {
      token: appStore.authToken!,
      userId: user.userId,
      username: user.username,
      email: user.email,
      role: user.role,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  });
}

export async function logout(): Promise<ApiResult<boolean>> {
  return mockApiCall(() => {
    appStore.logout();
    return true;
  });
}

export function isAuthenticated(): boolean {
  return !!appStore.authToken;
}

export function getCurrentUser(): UserDto | null {
  return appStore.currentUser;
}

export async function setCurrentUser(user: UserDto): Promise<ApiResult<UserDto>> {
  return mockApiCall(() => {
    appStore.setCurrentUser(user);
    return user;
  });
}
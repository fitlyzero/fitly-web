import type { AppLanguage } from '@/i18n/language';

export type AuthLanguage = AppLanguage;

export interface LoginPayload {
  password: string;
  username: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    displayName: string;
    role: string;
    userId: string;
    username: string;
  };
}

export interface UserSession {
  accessToken: string;
  email: string;
  id: string;
  name: string;
  refreshToken: string;
  role: string;
  userId: string;
  username: string;
}

export interface PasswordResetRequestInput {
  identifier: string;
}

export interface PasswordResetDispatch {
  identifier: string;
  resetLink: string;
  token: string;
}

export interface PasswordResetSession {
  identifier: string;
  token: string;
}

export interface ResetPasswordInput {
  password: string;
  token: string;
}

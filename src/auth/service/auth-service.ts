import { requestLogin } from '@/auth/api/auth.api';
import {
  loginWithDemoAccount,
  requestDemoPasswordReset,
  resetDemoPassword,
  verifyDemoPasswordResetToken,
} from '@/auth/demo/demo-auth-repository';
import type {
  LoginPayload,
  LoginResponse,
  PasswordResetDispatch,
  PasswordResetRequestInput,
  PasswordResetSession,
  ResetPasswordInput,
} from '@/auth/model/auth.types';

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const apiResponse = await requestLogin(payload);
  return apiResponse ?? loginWithDemoAccount(payload);
};

// Password reset is demo-only until backend endpoints are available.
export const requestPasswordReset = (
  input: PasswordResetRequestInput,
): Promise<PasswordResetDispatch> => requestDemoPasswordReset(input);

export const verifyPasswordResetToken = (
  token: string,
): Promise<PasswordResetSession> => verifyDemoPasswordResetToken(token);

export const resetPassword = (
  input: ResetPasswordInput,
): Promise<PasswordResetSession> => resetDemoPassword(input);

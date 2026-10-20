import { useMutation, useQuery } from '@tanstack/react-query';

import {
  requestPasswordReset,
  resetPassword,
  verifyPasswordResetToken,
} from '@/auth/service/auth-service';

export const useRequestPasswordResetMutation = () =>
  useMutation({ mutationFn: requestPasswordReset });

export const useResetPasswordMutation = () =>
  useMutation({ mutationFn: resetPassword });

export const usePasswordResetTokenQuery = (token: string | null) =>
  useQuery({
    enabled: Boolean(token),
    queryFn: () => verifyPasswordResetToken(token as string),
    queryKey: ['auth', 'password-reset-token', token],
    retry: false,
    staleTime: 0,
  });

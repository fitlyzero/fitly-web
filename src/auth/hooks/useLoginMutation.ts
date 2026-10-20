import { useMutation } from '@tanstack/react-query';

import type { LoginPayload, UserSession } from '@/auth/model/auth.types';
import { login } from '@/auth/service/auth-service';
import { useAuthStore } from '@/auth/store/useAuthStore';

const toUserSession = (
  response: Awaited<ReturnType<typeof login>>,
): UserSession => ({
  accessToken: response.accessToken,
  email: response.user.username,
  id: response.user.userId,
  name: response.user.displayName,
  refreshToken: response.refreshToken,
  role: response.user.role,
  userId: response.user.userId,
  username: response.user.username,
});

export const useLoginMutation = () => {
  const signIn = useAuthStore((state) => state.signIn);

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (response) => {
      signIn(toUserSession(response));
    },
  });
};

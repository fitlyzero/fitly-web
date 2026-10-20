import { postJson } from '@/api/http';
import type {
  LoginPayload,
  LoginResponse,
} from '@/auth/model/auth.types';

export const requestLogin = (
  payload: LoginPayload,
): Promise<LoginResponse | null> =>
  postJson<LoginResponse>('/api/auth/login', payload);

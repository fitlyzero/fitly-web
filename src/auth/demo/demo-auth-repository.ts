import type {
  LoginPayload,
  LoginResponse,
  PasswordResetDispatch,
  PasswordResetRequestInput,
  PasswordResetSession,
  ResetPasswordInput,
} from '@/auth/model/auth.types';

interface PasswordResetRecord extends PasswordResetSession {
  createdAt: number;
  usedAt: number | null;
}

interface DemoUser {
  displayName: string;
  role: string;
  userId: string;
  username: string;
}

const demoUsers: Record<string, DemoUser> = {
  admin: {
    displayName: 'Fitly Admin',
    role: 'Operations Director',
    userId: '100001',
    username: 'admin',
  },
  buyer: {
    displayName: 'Fitly Buyer',
    role: 'Procurement Lead',
    userId: '100002',
    username: 'buyer',
  },
  hr: {
    displayName: 'Fitly HR',
    role: 'People Operations',
    userId: '100003',
    username: 'hr',
  },
};

const defaultPassword = '123456';
const passwordStorageKey = 'fitly-auth-passwords';
const passwordResetStorageKey = 'fitly-password-reset-requests';
const passwordResetTtlMs = 1000 * 60 * 30;
const demoResetPasswordPath = '/reset-password';

const wait = async (durationMs: number): Promise<void> => {
  await new Promise((resolve) => window.setTimeout(resolve, durationMs));
};

const normalizeIdentifier = (identifier: string): string =>
  identifier.trim().toLowerCase().split('@')[0] ?? '';

const readStorageRecord = <TValue>(key: string): Record<string, TValue> => {
  const rawValue = window.localStorage.getItem(key);

  if (!rawValue) return {};

  try {
    return JSON.parse(rawValue) as Record<string, TValue>;
  } catch {
    return {};
  }
};

const writeStorageRecord = <TValue>(
  key: string,
  value: Record<string, TValue>,
): void => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

const createResetToken = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().replace(/-/g, '');
  }

  return `${Date.now()}${Math.random().toString(36).slice(2, 10)}`;
};

const getValidPasswordResetRecord = (token: string): PasswordResetRecord => {
  const requests = readStorageRecord<PasswordResetRecord>(passwordResetStorageKey);
  const record = requests[token];

  if (!record || record.usedAt) {
    throw new Error('This password reset link is invalid or has expired.');
  }

  if (Date.now() - record.createdAt > passwordResetTtlMs) {
    delete requests[token];
    writeStorageRecord(passwordResetStorageKey, requests);
    throw new Error('This password reset link is invalid or has expired.');
  }

  return record;
};

export const loginWithDemoAccount = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  await wait(350);
  const username = normalizeIdentifier(payload.username);
  const user = demoUsers[username];
  const passwords = readStorageRecord<string>(passwordStorageKey);

  if (!user || payload.password !== (passwords[username] ?? defaultPassword)) {
    throw new Error('Sai tài khoản hoặc mật khẩu.');
  }

  return {
    accessToken: `access_${user.username}`,
    refreshToken: `refresh_${user.username}`,
    user,
  };
};

export const requestDemoPasswordReset = async (
  input: PasswordResetRequestInput,
): Promise<PasswordResetDispatch> => {
  await wait(350);
  const identifier = normalizeIdentifier(input.identifier);

  if (!demoUsers[identifier]) {
    throw new Error('Không tìm thấy tài khoản.');
  }

  const token = createResetToken();
  const requests = readStorageRecord<PasswordResetRecord>(passwordResetStorageKey);
  requests[token] = { createdAt: Date.now(), identifier, token, usedAt: null };
  writeStorageRecord(passwordResetStorageKey, requests);

  return {
    identifier,
    resetLink: `${window.location.origin}${demoResetPasswordPath}?token=${encodeURIComponent(token)}`,
    token,
  };
};

export const verifyDemoPasswordResetToken = async (
  token: string,
): Promise<PasswordResetSession> => {
  await wait(200);
  const record = getValidPasswordResetRecord(token);
  return { identifier: record.identifier, token: record.token };
};

export const resetDemoPassword = async (
  input: ResetPasswordInput,
): Promise<PasswordResetSession> => {
  await wait(350);
  const record = getValidPasswordResetRecord(input.token);
  const passwords = readStorageRecord<string>(passwordStorageKey);
  const requests = readStorageRecord<PasswordResetRecord>(passwordResetStorageKey);
  passwords[record.identifier] = input.password;
  requests[record.token] = { ...record, usedAt: Date.now() };
  writeStorageRecord(passwordStorageKey, passwords);
  writeStorageRecord(passwordResetStorageKey, requests);
  return { identifier: record.identifier, token: record.token };
};

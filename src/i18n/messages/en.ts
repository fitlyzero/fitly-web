export const enFrontendMessages = {
  invalidStudioResponse: 'Invalid Studio API response.',
  requestFailed: 'Unable to complete the request.',
} as const;

export type FrontendMessageKey = keyof typeof enFrontendMessages;

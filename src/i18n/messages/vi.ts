import type { FrontendMessageKey } from '@/i18n/messages/en';

export const viFrontendMessages = {
  invalidStudioResponse: 'Phản hồi từ Studio API không hợp lệ.',
  requestFailed: 'Không thể hoàn tất yêu cầu.',
} satisfies Record<FrontendMessageKey, string>;

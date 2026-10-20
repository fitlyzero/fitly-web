import type { AppLanguage } from '@/i18n/language';
import { getCurrentLanguage } from '@/i18n/language';
import {
  enFrontendMessages,
  type FrontendMessageKey,
} from '@/i18n/messages/en';
import { viFrontendMessages } from '@/i18n/messages/vi';

const messagesByLanguage = {
  en_US: enFrontendMessages,
  vi_VN: viFrontendMessages,
} satisfies Record<AppLanguage, Record<FrontendMessageKey, string>>;

export const getFrontendMessage = (
  key: FrontendMessageKey,
  language: AppLanguage = getCurrentLanguage(),
): string => messagesByLanguage[language][key];

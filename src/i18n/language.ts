export type AppLanguage = 'en_US' | 'vi_VN';

export const defaultLanguage: AppLanguage = 'vi_VN';
export const languageStorageKey = 'fitly-auth-language';

export const isAppLanguage = (value: string | null): value is AppLanguage =>
  value === 'en_US' || value === 'vi_VN';

export const getCurrentLanguage = (): AppLanguage => {
  const storedLanguage = window.localStorage.getItem(languageStorageKey);
  return isAppLanguage(storedLanguage) ? storedLanguage : defaultLanguage;
};

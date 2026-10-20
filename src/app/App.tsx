import type { ReactElement } from 'react';
import { useEffect, useState, useSyncExternalStore } from 'react';

import {
  appRoutes,
  authRoutes,
  getCurrentAppLocation,
  normalizeAuthRoute,
  replaceRoute,
  subscribeToNavigation,
} from '@/app/router/app-router';
import { useAuthStore } from '@/auth/store/useAuthStore';
import type { AuthLanguage } from '@/auth/model/auth.types';
import { ForgotPasswordPage } from '@/auth/ui/ForgotPasswordPage';
import { LoginPage } from '@/auth/ui/LoginPage';
import { ResetPasswordPage } from '@/auth/ui/ResetPasswordPage';
import { getCurrentLanguage, languageStorageKey } from '@/i18n/language';
import { AppLayout } from '@/layout/AppLayout';

export const App = (): ReactElement => {
  const session = useAuthStore((state) => state.session);
  const location = useSyncExternalStore(
    subscribeToNavigation,
    getCurrentAppLocation,
    getCurrentAppLocation,
  );
  const [language, setLanguage] = useState<AuthLanguage>(getCurrentLanguage);

  useEffect(() => {
    window.localStorage.setItem(languageStorageKey, language);
  }, [language]);

  useEffect(() => {
    if (session && location.pathname !== appRoutes.workspace) {
      replaceRoute(appRoutes.workspace);
    } else if (
      !session &&
      !Object.values(authRoutes).some((route) => route === location.pathname)
    ) {
      replaceRoute(authRoutes.login);
    }
  }, [location.pathname, session]);

  if (session) {
    return <AppLayout language={language} onChangeLanguage={setLanguage} />;
  }

  const route = normalizeAuthRoute(location.pathname);

  if (route === authRoutes.forgotPassword) {
    return <ForgotPasswordPage language={language} onChangeLanguage={setLanguage} />;
  }

  if (route === authRoutes.resetPassword) {
    return <ResetPasswordPage language={language} onChangeLanguage={setLanguage} />;
  }

  return <LoginPage language={language} onChangeLanguage={setLanguage} />;
};

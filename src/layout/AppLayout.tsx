import { Box } from '@mui/material';
import { useState, type ReactElement } from 'react';

import { authRoutes, replaceRoute } from '@/app/router/app-router';
import type { AuthLanguage } from '@/auth/model/auth.types';
import { useAuthStore } from '@/auth/store/useAuthStore';
import { AppHeader } from '@/layout/AppHeader';
import { Navigation } from '@/studio/navigation/Navigation';
import { useNavigationQuery } from '@/studio/navigation/use-navigation-query';
import { resetWorkspaceStore, useWorkspaceStore } from '@/workspace/store/useWorkspaceStore';
import { WorkspaceRenderer } from '@/workspace/ui/WorkspaceRenderer';
import { WorkspaceTabs } from '@/workspace/ui/WorkspaceTabs';

interface AppLayoutProps {
  language: AuthLanguage;
  onChangeLanguage: (language: AuthLanguage) => void;
}

export const AppLayout = ({ language, onChangeLanguage }: AppLayoutProps): ReactElement => {
  const [isNavigationCollapsed, setNavigationCollapsed] = useState(false);
  const session = useAuthStore((state) => state.session);
  const signOut = useAuthStore((state) => state.signOut);
  const activeScreenId = useWorkspaceStore((state) => state.activeScreenId);
  const closeTarget = useWorkspaceStore((state) => state.closeTarget);
  const openTarget = useWorkspaceStore((state) => state.openTarget);
  const openTabs = useWorkspaceStore((state) => state.openTabs);
  const selectTarget = useWorkspaceStore((state) => state.selectTarget);
  const navigationQuery = useNavigationQuery();

  if (!session) {
    replaceRoute(authRoutes.login);
    return <Box />;
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {!isNavigationCollapsed ? (
        <Navigation
          activeScreenId={activeScreenId}
          isLoading={navigationQuery.isLoading}
          items={navigationQuery.data ?? []}
          onCollapse={() => setNavigationCollapsed(true)}
          onOpenTarget={openTarget}
        />
      ) : null}
      <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', minWidth: 0 }}>
        <AppHeader
          isNavigationCollapsed={isNavigationCollapsed}
          language={language}
          onChangeLanguage={onChangeLanguage}
          onOpenTarget={openTarget}
          onSignOut={() => {
            signOut();
            resetWorkspaceStore();
            replaceRoute(authRoutes.login);
          }}
          onToggleNavigation={() => setNavigationCollapsed(false)}
          session={session}
        />
        <WorkspaceTabs activeScreenId={activeScreenId} onClose={closeTarget} onSelect={selectTarget} tabs={openTabs} />
        <Box className="workspace-scrollbar" component="main" sx={{ bgcolor: 'background.default', flex: 1, minHeight: 0, overflow: 'auto' }}>
          <WorkspaceRenderer screenId={activeScreenId} />
        </Box>
      </Box>
    </Box>
  );
};

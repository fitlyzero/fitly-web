import { mapLocalPageToScreen } from '@/studio/screen/mapper/local-screen-mapper';
import { findDemoWorkspaceModule } from '@/studio/screen/demo/demo-workspace-catalog';
import type { ScreenMetadata } from '@/studio/screen/model/screen-metadata';
import { loadStudioScreen } from '@/studio/screen/service/studio-screen-service';

export const loadScreen = async (screenId: string): Promise<ScreenMetadata> => {
  if (screenId === 'profile') {
    return {
      screenId,
      sections: [{
        sectionId: 'profile-detail',
        sectionType: 'PROFILE',
        title: 'Personal information',
      }],
      title: 'Personal information',
    };
  }

  const localPage = findDemoWorkspaceModule(screenId);

  if (localPage) {
    return mapLocalPageToScreen(localPage);
  }

  return loadStudioScreen(screenId);
};

import type { NavigationItem } from '@/studio/navigation/model/navigation-item';
import type { WorkspaceNavItem } from '@/studio/screen/model/workspace-metadata.types';

export const mapDemoNavigationItem = (
  item: WorkspaceNavItem,
): NavigationItem => {
  const screenId = item.screenId ?? item.moduleKey;

  return {
    children: item.children?.map(mapDemoNavigationItem),
    description: item.description,
    disabled: item.disabled,
    key: item.key,
    label: item.label,
    target: screenId ? { screenId, type: 'SCREEN' } : undefined,
  };
};

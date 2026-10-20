import { requestNavigation } from '@/studio/navigation/api/navigation.api';
import { demoNavigation } from '@/studio/navigation/demo/demo-navigation';
import { mapDemoNavigationItem } from '@/studio/navigation/mapper/navigation-mapper';
import type { NavigationItem } from '@/studio/navigation/model/navigation-item';

export const loadNavigation = async (): Promise<NavigationItem[]> => {
  const response = await requestNavigation();
  return response ?? demoNavigation.map(mapDemoNavigationItem);
};

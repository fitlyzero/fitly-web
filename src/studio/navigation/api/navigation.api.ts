import { getJson } from '@/api/http';
import type { NavigationItem } from '@/studio/navigation/model/navigation-item';

export const requestNavigation = (): Promise<NavigationItem[] | null> =>
  getJson<NavigationItem[]>('/api/workspace/navigation');

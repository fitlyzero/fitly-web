import type { DynamicPageSection } from '@/studio/section/model/local-section.types';

export interface DynamicPageSchema {
  badge: string;
  moduleKey: string;
  sections: DynamicPageSection[];
  subtitle: string;
  title: string;
}

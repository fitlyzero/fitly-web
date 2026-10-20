import { mapLocalSection } from '@/studio/section/mapper/local-section-mapper';
import type { DynamicPageSchema } from '@/studio/screen/model/local-screen.types';
import type { ScreenMetadata } from '@/studio/screen/model/screen-metadata';

export const mapLocalPageToScreen = (page: DynamicPageSchema): ScreenMetadata => ({
  screenId: page.moduleKey,
  sections: page.sections.map(mapLocalSection),
  subtitle: page.subtitle,
  title: page.title,
});

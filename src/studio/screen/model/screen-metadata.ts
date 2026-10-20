import type { SectionMetadata } from '@/studio/section/model/section-metadata';

export interface ScreenMetadata {
  screenId: string;
  sections: SectionMetadata[];
  subtitle?: string;
  title: string;
}

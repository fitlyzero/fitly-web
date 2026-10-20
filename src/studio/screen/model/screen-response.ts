import type { SectionResponse } from '@/studio/section/model/section-response';

export interface ScreenResponse {
  name?: string;
  screen_id?: string;
  section_tree?: SectionResponse;
}

import type { FieldResponse } from '@/studio/field/model/field-response';
import type {
  FieldDetailLayoutResponse,
  FieldGridLayoutResponse,
} from '@/studio/field/model/field-layout-response';
import type { StudioSectionType } from '@/studio/section/model/studio-section-type';

export type { StudioSectionType } from '@/studio/section/model/studio-section-type';

export interface SectionResponse {
  children?: SectionResponse[];
  default_layout?: StudioSectionType;
  detail_layout?: FieldDetailLayoutResponse[];
  fields?: FieldResponse[];
  grid_layout?: FieldGridLayoutResponse[];
  name?: string;
  seq_no?: number;
  section_id?: string;
}

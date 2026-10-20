import type { FieldDataResponse } from '@/studio/field/model/field-data-response';
import type { FieldStateResponse } from '@/studio/field/model/field-state-response';
import type { ChildSectionStateResponse } from '@/studio/section/model/child-section-state-response';

export interface RowDataResponse {
  // Element shape is not defined by the standard response yet.
  actions?: unknown[];
  child_sections_state?: ChildSectionStateResponse[];
  created_at?: string | null;
  created_by?: string | null;
  fields_data?: FieldDataResponse[];
  fields_state?: FieldStateResponse[];
  is_active?: boolean;
  record_id?: string;
  updated_at?: string | null;
  updated_by?: string | null;
}

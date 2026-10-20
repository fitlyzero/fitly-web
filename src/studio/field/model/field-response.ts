import type { StudioDataType } from '@/studio/field/model/studio-data-type';

export interface FieldResponse {
  code?: string;
  data_type?: StudioDataType;
  field_id?: string;
  format_pattern?: string | null;
  max_length?: number | null;
  name?: string;
}

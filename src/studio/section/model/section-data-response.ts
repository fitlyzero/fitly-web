import type { RowDataResponse } from '@/studio/section/model/row-data-response';

export interface SectionDataResponse {
  current_page?: number;
  page_size?: number;
  records?: RowDataResponse[];
  // Element shape is not defined by the standard response yet.
  system_actions?: unknown[];
  total_page?: number;
  total_record?: number;
}

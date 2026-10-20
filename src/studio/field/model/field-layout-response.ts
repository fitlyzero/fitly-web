interface BaseFieldLayoutResponse {
  field_id?: string;
}

export interface FieldGridLayoutResponse extends BaseFieldLayoutResponse {
  column_no?: number;
}

export interface FieldDetailLayoutResponse extends BaseFieldLayoutResponse {
  column_no?: number;
  column_span?: number;
  row_no?: number;
  row_span?: number;
}

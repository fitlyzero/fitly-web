import type { FieldMetadata } from '@/studio/field/model/field-metadata';
import type { FieldValue } from '@/studio/field/model/field-value';

export interface CellFieldRendererProps {
  field: FieldMetadata;
  mode: 'cell';
  value: FieldValue;
}

export interface InputFieldRendererProps {
  error?: string;
  field: FieldMetadata;
  mode: 'input';
  onBlur?: () => void;
  onChange: (value: FieldValue) => void;
  value: FieldValue;
}

export type FieldRendererProps = CellFieldRendererProps | InputFieldRendererProps;

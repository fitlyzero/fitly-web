import type { FieldDataType } from '@/studio/field/model/field-data-type';
import type {
  FieldDetailLayoutMetadata,
  FieldGridLayoutMetadata,
} from '@/studio/field/model/field-layout-metadata';
import type { FieldOption } from '@/studio/field/model/field-option';
import type { FieldValidation } from '@/studio/field/model/field-validation';
import type { FieldValue } from '@/studio/field/model/field-value';
import type { StudioDataType } from '@/studio/field/model/studio-data-type';

export interface FieldMetadata {
  dataType: FieldDataType;
  defaultValue?: FieldValue;
  description?: string;
  detailLayout?: FieldDetailLayoutMetadata;
  fieldId: string;
  format?: string;
  gridLayout?: FieldGridLayoutMetadata;
  isDisabled?: boolean;
  isMandatory?: boolean;
  isReadOnly?: boolean;
  name: string;
  nameDisplay: string;
  options?: FieldOption[];
  placeholder?: string;
  referenceSource?: string;
  studioDataType?: StudioDataType;
  validation?: FieldValidation;
}

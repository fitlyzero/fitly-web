import type { ComponentType } from 'react';

import { AmountField } from '@/studio/field/components/amount-field';
import { BooleanField } from '@/studio/field/components/boolean-field';
import { DateField } from '@/studio/field/components/date-field';
import { DateTimeField } from '@/studio/field/components/datetime-field';
import { DecimalField } from '@/studio/field/components/decimal-field';
import { DropdownField } from '@/studio/field/components/dropdown-field';
import { FileField } from '@/studio/field/components/file-field';
import { IdField } from '@/studio/field/components/id-field';
import { ImageField } from '@/studio/field/components/image-field';
import { IntegerField } from '@/studio/field/components/integer-field';
import { ListField } from '@/studio/field/components/list-field';
import { MultiSelectField } from '@/studio/field/components/multi-select-field';
import { PercentageField } from '@/studio/field/components/percentage-field';
import { QuantityField } from '@/studio/field/components/quantity-field';
import { ReferenceField } from '@/studio/field/components/reference-field';
import { SearchField } from '@/studio/field/components/search-field';
import { StringField } from '@/studio/field/components/string-field';
import { TextField } from '@/studio/field/components/text-field';
import { TimeField } from '@/studio/field/components/time-field';
import { UrlField } from '@/studio/field/components/url-field';
import type { FieldRendererProps } from '@/studio/field/model/field-renderer-props';
import type { StudioDataType } from '@/studio/field/model/studio-data-type';

export type RegisteredFieldType = StudioDataType | 'LIST' | 'REFERENCE';

type RegisteredFieldComponent = ComponentType<FieldRendererProps>;

export const fieldRegistry = {
  AMOUNT: AmountField,
  BOOLEAN: BooleanField,
  DATE: DateField,
  DATETIME: DateTimeField,
  DECIMAL: DecimalField,
  DROPDOWN: DropdownField,
  FILE: FileField,
  ID: IdField,
  IMAGE: ImageField,
  INTEGER: IntegerField,
  LIST: ListField,
  MULTI_SELECT: MultiSelectField,
  PERCENTAGE: PercentageField,
  QUANTITY: QuantityField,
  REFERENCE: ReferenceField,
  SEARCH: SearchField,
  STRING: StringField,
  TEXT: TextField,
  TIME: TimeField,
  URL: UrlField,
} satisfies Record<RegisteredFieldType, RegisteredFieldComponent>;

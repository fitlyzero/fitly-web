import { TextField } from '@mui/material';
import type { ReactElement } from 'react';

import type { InputFieldRendererProps } from '@/studio/field/model/field-renderer-props';
import { textFieldProps } from '@/studio/field/shared/text-input';

export const NumberInput = ({
  error,
  field,
  integer = false,
  onBlur,
  onChange,
  value,
}: InputFieldRendererProps & { integer?: boolean }): ReactElement => (
  <TextField
    {...textFieldProps(field, error)}
    onBlur={onBlur}
    onChange={(event) =>
      onChange(event.target.value === '' ? undefined : Number(event.target.value))}
    slotProps={{
      htmlInput: {
        max: field.validation?.max,
        min: field.validation?.min,
        readOnly: field.isReadOnly,
        step: integer ? 1 : 'any',
      },
    }}
    type="number"
    value={typeof value === 'number' ? value : ''}
  />
);

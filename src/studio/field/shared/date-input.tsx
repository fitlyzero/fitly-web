import { TextField } from '@mui/material';
import type { ReactElement } from 'react';

import type { InputFieldRendererProps } from '@/studio/field/model/field-renderer-props';
import { textFieldProps } from '@/studio/field/shared/text-input';

export const DateInput = ({
  error,
  field,
  onBlur,
  onChange,
  value,
}: InputFieldRendererProps): ReactElement => (
  <TextField
    {...textFieldProps(field, error)}
    onBlur={onBlur}
    onChange={(event) => onChange(event.target.value)}
    slotProps={{
      htmlInput: { readOnly: field.isReadOnly },
      inputLabel: { shrink: true },
    }}
    type="date"
    value={typeof value === 'string' ? value : ''}
  />
);

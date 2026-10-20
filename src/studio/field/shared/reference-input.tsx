import { Autocomplete, TextField } from '@mui/material';
import type { ReactElement } from 'react';

import type { InputFieldRendererProps } from '@/studio/field/model/field-renderer-props';
import { textFieldProps } from '@/studio/field/shared/text-input';

export const ReferenceInput = ({
  error,
  field,
  onBlur,
  onChange,
  value,
}: InputFieldRendererProps): ReactElement => {
  const selected = field.options?.find((option) => option.value === value) ?? null;

  return (
    <Autocomplete
      disabled={field.isDisabled || field.isReadOnly}
      getOptionLabel={(option) => option.label}
      onBlur={onBlur}
      onChange={(_, option) => onChange(option?.value ?? null)}
      options={field.options ?? []}
      renderInput={(params) => (
        <TextField {...params} {...textFieldProps(field, error)} />
      )}
      value={selected}
    />
  );
};

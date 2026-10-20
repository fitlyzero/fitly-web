import { TextField } from '@mui/material';
import type { ReactElement } from 'react';

import type { FieldMetadata } from '@/studio/field/model/field-metadata';
import type { InputFieldRendererProps } from '@/studio/field/model/field-renderer-props';

export const textFieldProps = (field: FieldMetadata, error?: string) => ({
  disabled: field.isDisabled,
  error: Boolean(error),
  fullWidth: true,
  helperText: error ?? field.description,
  label: field.nameDisplay,
  placeholder: field.placeholder,
  required: field.isMandatory,
});

export const TextInput = ({
  error,
  field,
  multiline = false,
  onBlur,
  onChange,
  value,
}: InputFieldRendererProps & { multiline?: boolean }): ReactElement => {
  const rowCount = multiline
    ? Math.max(1, Math.trunc(field.detailLayout?.rowSpan ?? 3))
    : 1;
  const isMultiline = multiline && rowCount > 1;

  return (
    <TextField
      {...textFieldProps(field, error)}
      minRows={isMultiline ? rowCount : undefined}
      multiline={isMultiline}
      onBlur={onBlur}
      onChange={(event) => onChange(event.target.value)}
      slotProps={{
        htmlInput: {
          maxLength: field.validation?.maxLength,
          readOnly: field.isReadOnly,
        },
      }}
      value={typeof value === 'string' ? value : ''}
    />
  );
};

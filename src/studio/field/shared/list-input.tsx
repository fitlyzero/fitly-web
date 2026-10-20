import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import type { ReactElement } from 'react';

import type { InputFieldRendererProps } from '@/studio/field/model/field-renderer-props';
import type { FieldValue } from '@/studio/field/model/field-value';

export const ListInput = ({
  error,
  field,
  onBlur,
  onChange,
  value,
}: InputFieldRendererProps): ReactElement => (
  <FormControl
    disabled={field.isDisabled || field.isReadOnly}
    error={Boolean(error)}
    fullWidth
    required={field.isMandatory}
  >
    <InputLabel id={`${field.fieldId}-label`}>{field.nameDisplay}</InputLabel>
    <Select
      label={field.nameDisplay}
      labelId={`${field.fieldId}-label`}
      onBlur={onBlur}
      onChange={(event) => onChange(event.target.value as FieldValue)}
      value={value ?? ''}
    >
      {field.options?.map((option) => (
        <MenuItem disabled={option.disabled} key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
    {error || field.description
      ? <FormHelperText>{error ?? field.description}</FormHelperText>
      : null}
  </FormControl>
);

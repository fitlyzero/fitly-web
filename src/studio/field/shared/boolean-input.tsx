import {
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
} from '@mui/material';
import type { ReactElement } from 'react';

import type { InputFieldRendererProps } from '@/studio/field/model/field-renderer-props';

export const BooleanInput = ({
  error,
  field,
  onBlur,
  onChange,
  value,
}: InputFieldRendererProps): ReactElement => {
  const inputId = `${field.fieldId}-input`;
  const control = (
    <Checkbox
      checked={Boolean(value)}
      disabled={field.isDisabled || field.isReadOnly}
      id={inputId}
      onBlur={onBlur}
      onChange={(event) => onChange(event.target.checked)}
      size="small"
      sx={{ alignSelf: 'flex-start', ml: -1 }}
    />
  );

  return (
    <FormControl error={Boolean(error)} required={field.isMandatory}>
      <FormLabel htmlFor={inputId} sx={{ mb: 0.5 }}>{field.nameDisplay}</FormLabel>
      {control}
      {error || field.description
        ? <FormHelperText>{error ?? field.description}</FormHelperText>
        : null}
    </FormControl>
  );
};

import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from '@mui/material';
import { useEffect, useState, type ReactElement } from 'react';

import type { InputFieldRendererProps } from '@/studio/field/model/field-renderer-props';
import {
  combineDateTimeInputParts,
  normalizeTimeInputValue,
  toDateTimeInputParts,
} from '@/studio/field/shared/date-time-format';

const getInputParts = (value: InputFieldRendererProps['value']) =>
  typeof value === 'string'
    ? toDateTimeInputParts(value) ?? { date: '', time: '' }
    : { date: '', time: '' };

export const DateTimeInput = ({
  error,
  field,
  onBlur,
  onChange,
  value,
}: InputFieldRendererProps): ReactElement => {
  const initialParts = getInputParts(value);
  const [date, setDate] = useState(initialParts.date);
  const [time, setTime] = useState(initialParts.time);

  useEffect(() => {
    const parts = getInputParts(value);
    setDate(parts.date);
    setTime(parts.time);
  }, [value]);

  const emitDateTime = (
    nextDate: string,
    nextTime: string,
    changedValue: string,
  ): void => {
    if (!changedValue) {
      onChange('');
      return;
    }

    const dateTime = combineDateTimeInputParts(nextDate, nextTime);
    if (dateTime) onChange(dateTime);
  };

  const inputProps = {
    disabled: field.isDisabled,
    error: Boolean(error),
    fullWidth: true,
    required: field.isMandatory,
  };

  return (
    <FormControl
      disabled={field.isDisabled}
      error={Boolean(error)}
      fullWidth
      required={field.isMandatory}
    >
      <FormLabel>{field.nameDisplay}</FormLabel>
      <Box
        sx={{
          display: 'grid',
          gap: 1,
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          mt: '3px',
        }}
      >
        <TextField
          {...inputProps}
          onBlur={onBlur}
          onChange={(event) => {
            const nextDate = event.target.value;
            setDate(nextDate);
            emitDateTime(nextDate, time, nextDate);
          }}
          slotProps={{
            htmlInput: {
              'aria-label': `${field.nameDisplay} date`,
              readOnly: field.isReadOnly,
            },
          }}
          type="date"
          value={date}
        />
        <TextField
          {...inputProps}
          onBlur={onBlur}
          onChange={(event) => {
            const nextTime = normalizeTimeInputValue(event.target.value)
              ?? event.target.value;
            setTime(nextTime);
            emitDateTime(date, nextTime, nextTime);
          }}
          slotProps={{
            htmlInput: {
              'aria-label': `${field.nameDisplay} time`,
              readOnly: field.isReadOnly,
              step: 1,
            },
          }}
          type="time"
          value={time}
        />
      </Box>
      {error || field.description
        ? <FormHelperText>{error ?? field.description}</FormHelperText>
        : null}
    </FormControl>
  );
};

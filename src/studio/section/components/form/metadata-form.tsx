import { Box, Button, CircularProgress } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import type { ReactElement } from 'react';

import type { FieldMetadata } from '@/studio/field/model/field-metadata';
import type { FieldValue } from '@/studio/field/model/field-value';
import { FieldRenderer } from '@/studio/field/renderer/field-renderer';
import type { DynamicFormValues } from '@/studio/section/model/local-section.types';

interface MetadataFormProps {
  fields: FieldMetadata[];
  onSubmit: (values: DynamicFormValues) => void | Promise<void>;
  submitLabel: string;
}

const getDefaultValues = (fields: FieldMetadata[]): DynamicFormValues =>
  Object.fromEntries(fields.map((field) => [field.name, field.defaultValue]));

const getRules = (field: FieldMetadata) => ({
  max: field.validation?.max == null ? undefined : { message: `Maximum value is ${field.validation.max}.`, value: field.validation.max },
  maxLength: field.validation?.maxLength == null ? undefined : { message: `Use at most ${field.validation.maxLength} characters.`, value: field.validation.maxLength },
  min: field.validation?.min == null ? undefined : { message: `Minimum value is ${field.validation.min}.`, value: field.validation.min },
  minLength: field.validation?.minLength == null ? undefined : { message: `Use at least ${field.validation.minLength} characters.`, value: field.validation.minLength },
  pattern: field.validation?.pattern == null ? undefined : { message: 'Invalid format.', value: new RegExp(field.validation.pattern) },
  required: field.isMandatory ? `${field.nameDisplay} is required.` : undefined,
});

export const MetadataForm = ({ fields, onSubmit, submitLabel }: MetadataFormProps): ReactElement => {
  const form = useForm<DynamicFormValues>({ defaultValues: getDefaultValues(fields), mode: 'onBlur' });

  return (
    <Box component="form" noValidate onSubmit={form.handleSubmit(onSubmit)} sx={{ display: 'grid', gap: 2 }}>
      {fields.map((field) => (
        <Controller
          control={form.control}
          key={field.fieldId}
          name={field.name}
          rules={getRules(field)}
          render={({ field: controllerField, fieldState }) => (
            <FieldRenderer
              error={fieldState.error?.message}
              field={field}
              mode="input"
              onBlur={controllerField.onBlur}
              onChange={(value: FieldValue) => controllerField.onChange(value)}
              value={controllerField.value}
            />
          )}
        />
      ))}
      <Button disabled={form.formState.isSubmitting} sx={{ justifySelf: 'end' }} type="submit" variant="contained">
        {form.formState.isSubmitting ? <CircularProgress color="inherit" size={20} /> : submitLabel}
      </Button>
    </Box>
  );
};

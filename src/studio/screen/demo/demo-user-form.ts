import type { FieldMetadata } from '@/studio/field/model/field-metadata';

export const demoUserFormMetadata = {
  entity: 'user',
  version: 1,
  fields: [
    {
      dataType: 'STRING',
      defaultValue: '',
      description: 'This value is shown across audit trails and approval workflows.',
      fieldId: 'fullName',
      isMandatory: true,
      name: 'fullName',
      nameDisplay: 'Full name',
      placeholder: 'e.g. Avery Nguyen',
      validation: { minLength: 3 },
    },
    {
      dataType: 'INTEGER',
      defaultValue: 25,
      fieldId: 'age',
      isMandatory: true,
      name: 'age',
      nameDisplay: 'Age',
      placeholder: '18',
      validation: { max: 70, min: 18 },
    },
    {
      dataType: 'DATE',
      defaultValue: '2026-05-14',
      fieldId: 'startDate',
      isMandatory: true,
      name: 'startDate',
      nameDisplay: 'Start date',
    },
    {
      dataType: 'LIST',
      defaultValue: 'full_time',
      fieldId: 'employmentType',
      isMandatory: true,
      name: 'employmentType',
      nameDisplay: 'Employment type',
      options: [
        { label: 'Full-time', value: 'full_time' },
        { label: 'Contractor', value: 'contractor' },
        { label: 'Intern', value: 'intern' },
      ],
      placeholder: 'Choose employment type',
    },
  ] satisfies FieldMetadata[],
};

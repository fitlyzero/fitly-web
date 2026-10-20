export type StudioDataType =
  | 'ID'
  | 'STRING'
  | 'TEXT'
  | 'INTEGER'
  | 'DECIMAL'
  | 'QUANTITY'
  | 'AMOUNT'
  | 'PERCENTAGE'
  | 'BOOLEAN'
  | 'DATE'
  | 'DATETIME'
  | 'TIME'
  | 'SEARCH'
  | 'DROPDOWN'
  | 'FILE'
  | 'IMAGE'
  | 'MULTI_SELECT'
  | 'URL';

export const studioDataTypes = [
  'ID',
  'STRING',
  'TEXT',
  'INTEGER',
  'DECIMAL',
  'QUANTITY',
  'AMOUNT',
  'PERCENTAGE',
  'BOOLEAN',
  'DATE',
  'DATETIME',
  'TIME',
  'SEARCH',
  'DROPDOWN',
  'FILE',
  'IMAGE',
  'MULTI_SELECT',
  'URL',
] as const satisfies readonly StudioDataType[];

export const studioSystemActionOrder = [
  'NEW',
  'COPY',
  'DELETE',
  'ATTACHMENT',
  'IMPORT',
  'EXPORT',
] as const;

export type StudioSystemAction = typeof studioSystemActionOrder[number];

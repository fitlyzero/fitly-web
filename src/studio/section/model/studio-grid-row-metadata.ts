import type { FieldValue } from '@/studio/field/model/field-value';

export interface StudioFieldState {
  displayed: boolean;
  mandatory: boolean;
  readonly: boolean;
}

export interface StudioChildSectionState {
  displayed: boolean;
}

export interface StudioGridRowMetadata {
  childSectionStates?: Record<string, StudioChildSectionState>;
  fieldStates?: Record<string, StudioFieldState>;
  isActive?: boolean;
  rawValues: Record<string, FieldValue>;
  recordId: string;
  values: Record<string, FieldValue>;
}

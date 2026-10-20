import type { FieldDataType } from '@/studio/field/model/field-data-type';
import type {
  FieldDetailLayoutResponse,
  FieldGridLayoutResponse,
} from '@/studio/field/model/field-layout-response';
import type { FieldMetadata } from '@/studio/field/model/field-metadata';
import type { FieldResponse } from '@/studio/field/model/field-response';
import type { FieldValue } from '@/studio/field/model/field-value';
import type { StudioDataType } from '@/studio/field/model/studio-data-type';
import { getFrontendMessage } from '@/i18n/frontend-messages';
import type { RowDataResponse } from '@/studio/section/model/row-data-response';
import type { SectionDataResponse } from '@/studio/section/model/section-data-response';
import type { SectionResponse } from '@/studio/section/model/section-response';
import type {
  StudioChildSectionState,
  StudioFieldState,
  StudioGridRowMetadata,
} from '@/studio/section/model/studio-grid-row-metadata';
import type { StudioSectionMetadata } from '@/studio/section/model/studio-section-metadata';
import type { StudioSectionType } from '@/studio/section/model/studio-section-type';
import {
  studioSystemActionOrder,
  type StudioSystemAction,
} from '@/studio/section/model/studio-system-action';

export interface OrderedStudioSection {
  parentId?: string;
  section: SectionResponse;
}

const detailColumnCount = 12;

export const requireStudioString = (value: string | undefined): string => {
  if (!value) throw new Error(getFrontendMessage('invalidStudioResponse'));
  return value;
};

const requirePositiveInteger = (value: number | undefined): number => {
  if (!Number.isInteger(value) || (value ?? 0) < 1) {
    throw new Error(getFrontendMessage('invalidStudioResponse'));
  }

  return value as number;
};

const toUiDataType = (dataType: StudioDataType | undefined): FieldDataType => {
  switch (dataType) {
    case 'BOOLEAN':
    case 'DATETIME':
    case 'INTEGER':
    case 'STRING':
      return dataType;
    case 'ID':
    case 'TEXT':
    case 'DECIMAL':
    case 'QUANTITY':
    case 'AMOUNT':
    case 'PERCENTAGE':
    case 'DATE':
    case 'TIME':
    case 'SEARCH':
    case 'DROPDOWN':
    case 'FILE':
    case 'IMAGE':
    case 'MULTI_SELECT':
    case 'URL':
      return 'STRING';
    default:
      throw new Error(getFrontendMessage('invalidStudioResponse'));
  }
};

const toFieldMetadata = (
  field: FieldResponse,
  gridLayoutResponse: FieldGridLayoutResponse | undefined,
  detailLayoutResponse: FieldDetailLayoutResponse | undefined,
): FieldMetadata => {
  const studioDataType = field.data_type;
  let detailLayout: FieldMetadata['detailLayout'];

  if (detailLayoutResponse) {
    const columnNo = requirePositiveInteger(detailLayoutResponse.column_no);
    const columnSpan = requirePositiveInteger(detailLayoutResponse.column_span);
    const rowNo = requirePositiveInteger(detailLayoutResponse.row_no);
    const rowSpan = requirePositiveInteger(detailLayoutResponse.row_span);

    if (columnNo + columnSpan - 1 > detailColumnCount) {
      throw new Error(getFrontendMessage('invalidStudioResponse'));
    }

    detailLayout = { columnNo, columnSpan, rowNo, rowSpan };
  }

  const gridLayout = gridLayoutResponse
    ? { columnNo: requirePositiveInteger(gridLayoutResponse.column_no) }
    : undefined;

  return {
    dataType: toUiDataType(studioDataType),
    detailLayout,
    fieldId: requireStudioString(field.field_id),
    format: field.format_pattern ?? undefined,
    gridLayout,
    name: requireStudioString(field.code),
    nameDisplay: requireStudioString(field.name),
    studioDataType,
    validation: field.max_length == null
      ? undefined
      : { maxLength: field.max_length },
  };
};

const requireStudioSectionType = (
  value: StudioSectionType | undefined,
): StudioSectionType => {
  switch (value) {
    case 'DETAIL':
    case 'GRID':
    case 'TREE':
      return value;
    default:
      throw new Error(getFrontendMessage('invalidStudioResponse'));
  }
};

const toFieldLayoutMap = <TLayout extends { field_id?: string }>(
  layouts: TLayout[] | undefined,
): Map<string, TLayout> =>
  new Map((layouts ?? []).map((fieldLayout) => [
    requireStudioString(fieldLayout.field_id),
    fieldLayout,
  ]));

const toFieldValue = (value: unknown): FieldValue => {
  if (value === null || value === undefined) return null;
  if (
    typeof value === 'string'
    || typeof value === 'number'
    || typeof value === 'boolean'
  ) {
    return value;
  }

  return String(value);
};

const isStudioSystemAction = (action: unknown): action is StudioSystemAction =>
  studioSystemActionOrder.some((systemAction) => systemAction === action);

export const getOrderedStudioChildren = (
  section: SectionResponse,
): SectionResponse[] =>
  [...(section.children ?? [])].sort(
    (left, right) => (left.seq_no ?? Number.MAX_SAFE_INTEGER)
      - (right.seq_no ?? Number.MAX_SAFE_INTEGER),
  );

export const mapStudioSectionStructure = (
  orderedSection: OrderedStudioSection,
): StudioSectionMetadata => {
  const { parentId, section } = orderedSection;
  const defaultLayout = requireStudioSectionType(section.default_layout);
  const gridLayouts = toFieldLayoutMap(section.grid_layout);
  const detailLayouts = toFieldLayoutMap(section.detail_layout);
  const allFields = (section.fields ?? []).map((field) => {
    const fieldId = requireStudioString(field.field_id);
    return toFieldMetadata(
      field,
      gridLayouts.get(fieldId),
      detailLayouts.get(fieldId),
    );
  });
  const fieldsById = new Map(allFields.map((field) => [field.fieldId, field]));
  const fieldsByLayout: Partial<Record<StudioSectionType, FieldMetadata[]>> = {};

  const mapLayoutFields = (
    layouts: Array<{ field_id?: string }>,
  ): FieldMetadata[] =>
    layouts.map((fieldLayout) => {
      const field = fieldsById.get(requireStudioString(fieldLayout.field_id));
      if (!field) throw new Error(getFrontendMessage('invalidStudioResponse'));
      return field;
    });

  if (section.grid_layout !== undefined) {
    fieldsByLayout.GRID = mapLayoutFields(section.grid_layout);
  }
  if (section.detail_layout !== undefined) {
    fieldsByLayout.DETAIL = mapLayoutFields(section.detail_layout);
  }

  const fields = fieldsByLayout[defaultLayout];
  if (fields === undefined) {
    throw new Error(getFrontendMessage('invalidStudioResponse'));
  }

  const metadata = {
    childSections: [],
    fields,
    fieldsByLayout,
    parentId,
    rows: [],
    sectionId: requireStudioString(section.section_id),
    sequence: section.seq_no,
    source: 'STUDIO' as const,
    systemActions: [],
    title: requireStudioString(section.name),
  };

  switch (defaultLayout) {
    case 'DETAIL':
      return { ...metadata, sectionType: 'DETAIL' };
    case 'TREE':
      return { ...metadata, sectionType: 'TREE' };
    case 'GRID':
      return { ...metadata, sectionType: 'GRID' };
  }
};

const toStudioRow = (record: RowDataResponse): StudioGridRowMetadata => {
  const values: StudioGridRowMetadata['values'] = {};
  const rawValues: StudioGridRowMetadata['rawValues'] = {};

  for (const fieldData of record.fields_data ?? []) {
    const fieldId = requireStudioString(fieldData.field_id);
    const fieldCode = requireStudioString(fieldData.field_code);
    rawValues[fieldCode] = toFieldValue(fieldData.value);
    values[fieldId] = toFieldValue(fieldData.display_value ?? fieldData.value);
  }

  const fieldStates: Record<string, StudioFieldState> = {};
  for (const fieldState of record.fields_state ?? []) {
    fieldStates[requireStudioString(fieldState.field_id)] = {
      displayed: fieldState.displayed ?? true,
      mandatory: fieldState.mandatory ?? false,
      readonly: fieldState.readonly ?? true,
    };
  }

  const childSectionStates: Record<string, StudioChildSectionState> = {};
  for (const childSectionState of record.child_sections_state ?? []) {
    childSectionStates[requireStudioString(childSectionState.section_id)] = {
      displayed: childSectionState.displayed ?? true,
    };
  }

  return {
    childSectionStates,
    fieldStates,
    isActive: record.is_active,
    rawValues,
    recordId: requireStudioString(record.record_id),
    values,
  };
};

export const mapStudioSectionData = (
  section: StudioSectionMetadata,
  response: SectionDataResponse,
): StudioSectionMetadata => ({
  ...section,
  rows: (response.records ?? []).map(toStudioRow),
  systemActions: (response.system_actions ?? []).filter(isStudioSystemAction),
});

import type { FieldDataType } from '@/studio/field/model/field-data-type';
import type { FieldMetadata } from '@/studio/field/model/field-metadata';
import type { FieldOption } from '@/studio/field/model/field-option';
import type {
  DynamicRecordDetailField,
  DynamicTableColumn,
  DynamicTableRow,
} from '@/studio/section/model/local-section.types';

const inferDataType = (column: DynamicTableColumn, values: unknown[]): FieldDataType => {
  if (column.presentation === 'currency') return 'DECIMAL';
  if (column.presentation === 'status') return 'LIST';
  if (values.some((value) => typeof value === 'boolean')) return 'BOOLEAN';
  if (values.some((value) => typeof value === 'number')) return 'DECIMAL';
  if (/date|time/i.test(column.key)) return 'DATE';
  if (/customer|vendor|product|warehouse|employee|manager|owner/i.test(column.key)) {
    return 'REFERENCE';
  }
  return 'STRING';
};

export const mapColumnsToFields = (
  columns: DynamicTableColumn[],
  rows: DynamicTableRow[],
): FieldMetadata[] =>
  columns.map((column) => {
    const values = rows.map((row) => row[column.dataIndex]);
    const dataType = inferDataType(column, values);
    let options: FieldOption[] | undefined;

    if (column.statusMap) {
      options = Object.entries(column.statusMap).map(([value, descriptor]) => ({
        label: descriptor.label ?? value,
        value,
      }));
    } else if (dataType === 'REFERENCE') {
      options = [...new Set(values.filter(
        (value): value is string | number =>
          typeof value === 'string' || typeof value === 'number',
      ))].map((value) => ({ label: String(value), value }));
    }

    return {
      dataType,
      fieldId: column.key,
      name: column.dataIndex,
      nameDisplay: column.title,
      options,
    };
  });

export const mapDetailsToFields = (
  details: DynamicRecordDetailField[],
  sectionFields: FieldMetadata[],
  row: DynamicTableRow,
): FieldMetadata[] => {
  const generatedFields = mapColumnsToFields(
    details.map((detail) => ({
      currency: detail.currency,
      dataIndex: detail.dataIndex,
      key: detail.dataIndex,
      presentation: detail.presentation,
      statusMap: detail.statusMap,
      title: detail.label,
    })),
    [row],
  );

  return details.map((detail, index) =>
    sectionFields.find((field) => field.name === detail.dataIndex) ?? generatedFields[index]);
};

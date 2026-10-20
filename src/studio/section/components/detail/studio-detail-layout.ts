import type { FieldMetadata } from '@/studio/field/model/field-metadata';

export interface StudioDetailFieldPlacement {
  colStart: number;
  field: FieldMetadata;
  height: number;
  rowStart: number;
  width: number;
}

const detailColumnCount = 12;

export const createStudioDetailFieldPlacements = (
  fields: FieldMetadata[],
): StudioDetailFieldPlacement[] => {
  const configuredFields = fields.filter(
    (field) => field.detailLayout !== undefined,
  );
  const fallbackFields = fields.filter((field) => !field.detailLayout);
  const placements: StudioDetailFieldPlacement[] = configuredFields.map((field) => {
    const layout = field.detailLayout;
    if (!layout) throw new Error('Expected configured Studio detail layout.');

    return {
      colStart: layout.columnNo,
      field,
      height: layout.rowSpan,
      rowStart: layout.rowNo,
      width: layout.columnSpan,
    };
  });
  let rowCursor = placements.reduce(
    (maxRow, placement) => Math.max(
      maxRow,
      placement.rowStart + placement.height - 1,
    ),
    0,
  );

  for (const field of fallbackFields) {
    placements.push({
      colStart: 1,
      field,
      height: 1,
      rowStart: rowCursor + 1,
      width: detailColumnCount,
    });
    rowCursor += 1;
  }

  return placements;
};

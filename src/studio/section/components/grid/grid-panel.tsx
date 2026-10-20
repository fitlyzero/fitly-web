import { Divider } from '@mui/material';
import type { GridRowId } from '@mui/x-data-grid';
import type { ReactElement } from 'react';

import type { FieldMetadata } from '@/studio/field/model/field-metadata';
import { GridTable } from '@/studio/section/components/grid/grid-table';
import {
  GridToolbar,
  type RecordNavigationProps,
} from '@/studio/section/components/grid/grid-toolbar';
import type { DynamicTableRow } from '@/studio/section/model/local-section.types';
import type { LocalGridSectionMetadata } from '@/studio/section/model/section-metadata';

export const GridPanel = ({
  fields,
  grid,
  onOpenDetail,
  onOpenFilters,
  onSelectRow,
  recordNavigation,
  rows,
  selectedRowId,
}: {
  fields: FieldMetadata[];
  grid: LocalGridSectionMetadata['grid'];
  onOpenDetail?: (rowId: GridRowId) => void;
  onOpenFilters: () => void;
  onSelectRow?: (rowId: GridRowId) => void;
  recordNavigation?: RecordNavigationProps;
  rows: DynamicTableRow[];
  selectedRowId: GridRowId | null;
}): ReactElement => (
  <>
    <GridToolbar
      grid={grid}
      hasSelection={selectedRowId !== null}
      onOpenFilters={onOpenFilters}
      recordNavigation={recordNavigation}
    />
    <Divider />
    <GridTable
      checkboxSelection
      fields={fields}
      onOpenDetail={onOpenDetail}
      onSelectRow={onSelectRow}
      rows={rows}
      selectedRowId={selectedRowId}
    />
  </>
);

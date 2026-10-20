import { Box, IconButton, Tooltip } from '@mui/material';
import type { GridColDef, GridRowId, GridRowParams } from '@mui/x-data-grid';
import type { ReactElement } from 'react';

import { FitlyDataGrid } from '@/components/FitlyDataGrid';
import type { FieldMetadata } from '@/studio/field/model/field-metadata';
import type { FieldValue } from '@/studio/field/model/field-value';
import { FieldRenderer } from '@/studio/field/renderer/field-renderer';
import styles from '@/studio/section/components/grid/grid-section.module.css';
import type { DynamicTableRow } from '@/studio/section/model/local-section.types';
import editIconSrc from '../../../../../icon/edit.png';

interface GridTableProps {
  checkboxSelection?: boolean;
  fields: FieldMetadata[];
  onOpenDetail?: (rowId: GridRowId) => void;
  onSelectRow?: (rowId: GridRowId) => void;
  rows: DynamicTableRow[];
  selectedRowId?: GridRowId | null;
}

const createColumns = (
  fields: FieldMetadata[],
  onOpenDetail?: (rowId: GridRowId) => void,
): GridColDef[] => {
  const dataColumns: GridColDef[] = fields.map((field) => ({
    field: field.name,
    flex: 1,
    headerName: field.nameDisplay,
    minWidth: 140,
    renderCell: (params) => (
      <FieldRenderer field={field} mode="cell" value={params.value as FieldValue} />
    ),
  }));

  if (!onOpenDetail) return dataColumns;

  return [
    {
      align: 'center',
      disableColumnMenu: true,
      field: '__recordDetail',
      filterable: false,
      headerName: '',
      renderCell: (params) => (
        <Tooltip title="Open record detail">
          <IconButton
            aria-label={`Open record ${params.id} detail`}
            onClick={(event) => {
              event.stopPropagation();
              onOpenDetail(params.id);
            }}
            size="small"
          >
            <Box
              alt=""
              aria-hidden="true"
              className={styles.editIcon}
              component="img"
              src={editIconSrc}
            />
          </IconButton>
        </Tooltip>
      ),
      sortable: false,
      width: 52,
    },
    ...dataColumns,
  ];
};

export const GridTable = ({
  checkboxSelection = false,
  fields,
  onOpenDetail,
  onSelectRow,
  rows,
  selectedRowId,
}: GridTableProps): ReactElement => (
  <Box className={styles.gridContainer}>
    <FitlyDataGrid
      checkboxSelection={checkboxSelection}
      className={styles.embeddedGrid}
      columns={createColumns(fields, onOpenDetail)}
      getRowClassName={(params) =>
        params.id === selectedRowId ? styles.selectedRow : ''}
      onRowClick={onSelectRow
        ? (params: GridRowParams) => onSelectRow(params.id)
        : undefined}
      rows={rows}
    />
  </Box>
);

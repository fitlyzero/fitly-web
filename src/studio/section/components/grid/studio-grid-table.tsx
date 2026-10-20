import { Box, IconButton, Paper, Tooltip } from '@mui/material';
import type {
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams,
  GridRowParams,
} from '@mui/x-data-grid';
import { useLayoutEffect, useState, type ReactElement } from 'react';

import { FitlyDataGrid } from '@/components/FitlyDataGrid';
import type { FieldMetadata } from '@/studio/field/model/field-metadata';
import { FieldRenderer } from '@/studio/field/renderer/field-renderer';
import styles from '@/studio/section/components/grid/studio-grid-section.module.css';
import {
  StudioSectionHeader,
  type StudioSectionLayoutControls,
} from '@/studio/section/components/studio-section-header';
import type { StudioGridRowMetadata } from '@/studio/section/model/studio-grid-row-metadata';
import type { StudioGridSectionMetadata } from '@/studio/section/model/studio-section-metadata';
import editIconSrc from '../../../../../icon/edit.png';

const gridPageSize = 25;

const createColumns = (
  fields: FieldMetadata[],
  onOpenDetail?: (row: StudioGridRowMetadata) => void,
): GridColDef<StudioGridRowMetadata>[] => {
  const orderedFields = fields
    .map((field, apiIndex) => ({ apiIndex, field }))
    .sort((left, right) => {
      const leftColumnNo = left.field.gridLayout?.columnNo;
      const rightColumnNo = right.field.gridLayout?.columnNo;

      if (leftColumnNo === undefined && rightColumnNo === undefined) {
        return left.apiIndex - right.apiIndex;
      }
      if (leftColumnNo === undefined) return 1;
      if (rightColumnNo === undefined) return -1;

      return leftColumnNo - rightColumnNo || left.apiIndex - right.apiIndex;
    })
    .map(({ field }) => field);

  const recordDetailColumns: GridColDef<StudioGridRowMetadata>[] = onOpenDetail ? [{
      align: 'center',
      disableColumnMenu: true,
      field: '__recordDetail',
      filterable: false,
      headerName: '',
      renderCell: (params: GridRenderCellParams<StudioGridRowMetadata>) => {
        const row = params.row;

        return (
          <Tooltip title="Open record detail">
            <IconButton
              aria-label={`Open record ${row.recordId} detail`}
              onClick={(event) => {
                event.stopPropagation();
                onOpenDetail(row);
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
        );
      },
      sortable: false,
      width: 52,
    }] : [];

  return [
    ...recordDetailColumns,
    ...orderedFields.map((field) => {
      const isHidden = (row: StudioGridRowMetadata): boolean =>
        row.fieldStates?.[field.fieldId]?.displayed === false;

      return {
        field: field.fieldId,
        flex: 1,
        headerName: field.nameDisplay,
        minWidth: 140,
        renderCell: (params: GridRenderCellParams<StudioGridRowMetadata>) => (
          isHidden(params.row) ? null : (
            <FieldRenderer
              field={field}
              mode="cell"
              value={params.row.values[field.fieldId]}
            />
          )
        ),
        valueGetter: (_value: unknown, row: StudioGridRowMetadata) =>
          (isHidden(row) ? null : row.values[field.fieldId]),
      };
    }),
  ];
};

export const StudioGridTable = ({
  layoutControls,
  onOpenDetail,
  onSelectRow,
  section,
  selectedRowId,
}: {
  layoutControls?: StudioSectionLayoutControls;
  onOpenDetail?: (row: StudioGridRowMetadata) => void;
  onSelectRow?: (row: StudioGridRowMetadata) => void;
  section: StudioGridSectionMetadata;
  selectedRowId?: string;
}): ReactElement => {
  const fields = section.fieldsByLayout?.GRID ?? section.fields;
  const lastPage = Math.max(0, Math.ceil(section.rows.length / gridPageSize) - 1);
  const [page, setPage] = useState(0);
  const currentPage = Math.min(page, lastPage);
  const paginationModel: GridPaginationModel = {
    page: currentPage,
    pageSize: gridPageSize,
  };

  useLayoutEffect(() => {
    setPage(0);
  }, [section.sectionId]);

  useLayoutEffect(() => {
    setPage((current) => Math.min(current, lastPage));
  }, [lastPage]);

  return (
    <Paper
      aria-label={section.title}
      className={styles.gridTable}
      component="section"
      elevation={0}
      square
    >
      <StudioSectionHeader
        {...layoutControls}
        pagination={{
          onPageChange: setPage,
          page: currentPage,
          pageSize: gridPageSize,
          rowCount: section.rows.length,
        }}
        systemActions={section.systemActions}
        title={section.title}
      />
      <Box className={styles.gridContainer}>
        <FitlyDataGrid
          checkboxSelection
          className={styles.embeddedGrid}
          columns={createColumns(fields, onOpenDetail)}
          getRowId={(row) => (row as StudioGridRowMetadata).recordId}
          getRowClassName={(params) => [
            params.id === selectedRowId ? styles.selectedRecordRow : '',
            params.row.isActive === false ? styles.deactivatedRecordRow : '',
          ].filter(Boolean).join(' ')}
          hideFooter
          onPaginationModelChange={(model) => setPage(model.page)}
          onRowClick={onSelectRow
            ? (params: GridRowParams<StudioGridRowMetadata>) => onSelectRow(params.row)
            : undefined}
          paginationModel={paginationModel}
          rows={section.rows}
        />
      </Box>
    </Paper>
  );
};

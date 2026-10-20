import { Paper } from '@mui/material';
import type { GridRowId } from '@mui/x-data-grid';
import type { ReactElement } from 'react';

import type { FieldMetadata } from '@/studio/field/model/field-metadata';
import { RelatedRecords } from '@/studio/section/components/detail/related-records';
import { GridPanel } from '@/studio/section/components/grid/grid-panel';
import styles from '@/studio/section/components/grid/grid-section.module.css';
import { ResizableGridLayout } from '@/studio/section/components/grid/resizable-grid-layout';
import type {
  DetailSectionMetadata,
  LocalGridSectionMetadata,
} from '@/studio/section/model/section-metadata';
import type {
  DynamicRecordListRow,
  DynamicRecordListSection,
  DynamicTableRow,
  DynamicTableSection,
} from '@/studio/section/model/local-section.types';

interface RecordListLayoutProps {
  activeTab: string;
  currentRecordIndex: number;
  detail: DetailSectionMetadata;
  fields: FieldMetadata[];
  grid: DynamicRecordListSection;
  layout: LocalGridSectionMetadata['layout'];
  onChangeTab: (tab: string) => void;
  onOpenDetail: (rowId: GridRowId) => void;
  onOpenFilters: () => void;
  onSelectRecord: (recordIndex: number) => void;
  onSelectRow: (rowId: GridRowId) => void;
  recordCount: number;
  rows: DynamicTableRow[];
  sectionId: string;
  selectedRecord?: DynamicRecordListRow;
  selectedRowId: GridRowId | null;
}

const minimumGridHeight = 320;

export const RecordListLayout = ({
  activeTab,
  currentRecordIndex,
  detail,
  fields,
  grid,
  layout,
  onChangeTab,
  onOpenDetail,
  onOpenFilters,
  onSelectRecord,
  onSelectRow,
  recordCount,
  rows,
  sectionId,
  selectedRecord,
  selectedRowId,
}: RecordListLayoutProps): ReactElement => (
  <ResizableGridLayout
    child={(
      <RelatedRecords
        activeTab={activeTab}
        detail={detail}
        onChangeTab={onChangeTab}
        record={selectedRecord}
      />
    )}
    collapseLabel="Hide related records"
    expandLabel="Show related records"
    layout={layout?.recordChild}
    minimumPrimaryHeight={minimumGridHeight}
    parent={(
      <Paper
        className={`${styles.panel} ${styles.recordListPanel}`}
        elevation={0}
        square
      >
        <GridPanel
          fields={fields}
          grid={grid}
          onOpenDetail={onOpenDetail}
          onOpenFilters={onOpenFilters}
          onSelectRow={onSelectRow}
          recordNavigation={{ currentRecordIndex, onSelectRecord, recordCount }}
          rows={rows}
          selectedRowId={selectedRowId}
        />
      </Paper>
    )}
    sectionId={sectionId}
    separatorLabel="Resize related records"
  />
);

export const SingleGridLayout = ({
  fields,
  grid,
  onOpenFilters,
  rows,
}: {
  fields: FieldMetadata[];
  grid: DynamicTableSection;
  onOpenFilters: () => void;
  rows: DynamicTableRow[];
}): ReactElement => (
  <Paper
    className={`${styles.panel} ${styles.singleGridPanel}`}
    elevation={0}
    square
  >
    <GridPanel
      fields={fields}
      grid={grid}
      onOpenFilters={onOpenFilters}
      rows={rows}
      selectedRowId={null}
    />
  </Paper>
);

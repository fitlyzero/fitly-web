import { Box, useTheme } from '@mui/material';
import type { GridRowId } from '@mui/x-data-grid';
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';

import type {
  GridSectionMetadata,
  LocalGridSectionMetadata,
} from '@/studio/section/model/section-metadata';
import { LocalDetailSection } from '@/studio/section/components/detail/local-detail-section';
import { GridFilterDrawer } from '@/studio/section/components/grid/grid-filter-drawer';
import {
  RecordListLayout,
  SingleGridLayout,
} from '@/studio/section/components/grid/grid-layouts';
import { StudioSection } from '@/studio/section/components/studio-section';
import styles from '@/studio/section/components/grid/grid-section.module.css';
import type {
  DynamicRecordListRow,
  DynamicTableRow,
} from '@/studio/section/model/local-section.types';
import type { StudioSectionMetadata } from '@/studio/section/model/studio-section-metadata';

interface GridSectionProps {
  renderChildSection?: (section: StudioSectionMetadata) => ReactNode;
  section: GridSectionMetadata;
}

const createRows = (section: LocalGridSectionMetadata): DynamicTableRow[] => {
  const { grid } = section;

  if (grid.type === 'record-list') {
    return grid.rows.map((row) => ({ ...row.cells, id: row.key }));
  }

  return grid.rows.map((row, index) => {
    const rowKey = row[grid.rowKeyField];

    return {
      ...row,
      id: typeof rowKey === 'string' || typeof rowKey === 'number' ? rowKey : index,
    };
  });
};

const filterRows = (rows: DynamicTableRow[], searchValue: string): DynamicTableRow[] => {
  const search = searchValue.trim().toLocaleLowerCase();
  if (!search) return rows;

  return rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value ?? '').toLocaleLowerCase().includes(search)),
  );
};

const findSelectedRecord = (
  records: DynamicRecordListRow[] | undefined,
  selectedRowId: GridRowId | null,
): DynamicRecordListRow | undefined =>
  records?.find((record) => record.key === selectedRowId);

export const GridSection = ({
  renderChildSection,
  section,
}: GridSectionProps): ReactElement => {
  if (section.source === 'STUDIO') {
    return (
      <StudioSection
        renderChildSection={renderChildSection}
        section={section}
      />
    );
  }

  return <LocalGridSection section={section} />;
};

const LocalGridSection = ({
  section,
}: {
  section: LocalGridSectionMetadata;
}): ReactElement => {
  const theme = useTheme();
  const recordList = section.grid.type === 'record-list' ? section.grid : undefined;
  const table = section.grid.type === 'table' ? section.grid : undefined;
  const [filterOpen, setFilterOpen] = useState(false);
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [searchDraft, setSearchDraft] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [selectedRowId, setSelectedRowId] = useState<GridRowId | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState(
    section.detail?.detailTabs?.[0]?.key ?? 'lines',
  );
  const rows = useMemo(() => createRows(section), [section]);
  const filteredRows = useMemo(
    () => filterRows(rows, searchValue),
    [rows, searchValue],
  );
  const selectedRecord = findSelectedRecord(recordList?.rows, selectedRowId);
  const selectedRow = filteredRows.find((row) => row.id === selectedRowId);
  const selectedRowIndex = filteredRows.findIndex((row) => row.id === selectedRowId);

  const selectRecordAtIndex = (rowIndex: number): void => {
    const rowId = filteredRows[rowIndex]?.id;
    if (typeof rowId === 'string' || typeof rowId === 'number') {
      setSelectedRowId(rowId);
    }
  };

  useLayoutEffect(() => {
    setActiveDetailTab(section.detail?.detailTabs?.[0]?.key ?? 'lines');
    setDetailOpen(false);
    setSelectedRowId(null);
  }, [section.sectionId]);

  useEffect(() => {
    if (!recordList) return;

    const selectionIsVisible = selectedRowId !== null
      && filteredRows.some((row) => row.id === selectedRowId);

    if (!selectionIsVisible) {
      setSelectedRowId((filteredRows[0]?.id as GridRowId | undefined) ?? null);
      setDetailOpen(false);
    }
  }, [filteredRows, recordList, selectedRowId]);

  const themeVariables = {
    '--grid-section-divider-color': theme.palette.divider,
    '--grid-section-paper-background': theme.palette.background.paper,
    '--grid-section-secondary-text': theme.palette.text.secondary,
    '--grid-section-selected-background': theme.palette.action.selected,
  } as CSSProperties;

  return (
    <Box
      aria-label={section.title}
      className={styles.section}
      component="section"
      style={themeVariables}
    >
      {recordList && section.detail && isDetailOpen && selectedRecord && selectedRow ? (
        <LocalDetailSection
          activeTab={activeDetailTab}
          currentRecordIndex={selectedRowIndex}
          detail={section.detail}
          fields={section.fields}
          grid={recordList}
          layout={section.layout}
          onBack={() => setDetailOpen(false)}
          onChangeTab={setActiveDetailTab}
          onSelectRecord={selectRecordAtIndex}
          record={selectedRecord}
          recordCount={filteredRows.length}
          row={selectedRow}
          sectionId={section.sectionId}
        />
      ) : recordList && section.detail ? (
        <RecordListLayout
          activeTab={activeDetailTab}
          currentRecordIndex={selectedRowIndex}
          detail={section.detail}
          fields={section.fields}
          grid={recordList}
          layout={section.layout}
          onChangeTab={setActiveDetailTab}
          onOpenDetail={(rowId) => {
            setSelectedRowId(rowId);
            setDetailOpen(true);
          }}
          onOpenFilters={() => setFilterOpen(true)}
          onSelectRecord={selectRecordAtIndex}
          onSelectRow={setSelectedRowId}
          recordCount={filteredRows.length}
          rows={filteredRows}
          sectionId={section.sectionId}
          selectedRecord={selectedRecord}
          selectedRowId={selectedRowId}
        />
      ) : table ? (
        <SingleGridLayout
          fields={section.fields}
          grid={table}
          onOpenFilters={() => setFilterOpen(true)}
          rows={filteredRows}
        />
      ) : null}

      <GridFilterDrawer
        gridTitle={section.grid.title}
        onApply={() => {
          setSearchValue(searchDraft);
          setFilterOpen(false);
        }}
        onChangeSearch={setSearchDraft}
        onClear={() => {
          setSearchDraft('');
          setSearchValue('');
        }}
        onClose={() => setFilterOpen(false)}
        open={filterOpen}
        searchValue={searchDraft}
      />
    </Box>
  );
};

import { Box, Divider, Paper, Tab, Tabs, Typography } from '@mui/material';
import type { ReactElement } from 'react';

import { GridTable } from '@/studio/section/components/grid/grid-table';
import styles from '@/studio/section/components/grid/grid-section.module.css';
import { mapColumnsToFields } from '@/studio/section/mapper/local-field-mapper';
import type { DetailSectionMetadata } from '@/studio/section/model/section-metadata';
import type {
  DynamicRecordDetailTab,
  DynamicRecordListRow,
  DynamicTableRow,
} from '@/studio/section/model/local-section.types';

const getDetailRows = (
  record: DynamicRecordListRow,
  activeTab?: DynamicRecordDetailTab,
): DynamicTableRow[] => {
  if (!activeTab || activeTab.rowDataKey === 'lineRows') return record.lineRows;
  return record.tabRows?.[activeTab.rowDataKey] ?? [];
};

const addRequiredRowIds = (rows: DynamicTableRow[]): DynamicTableRow[] =>
  rows.map((row, index) => {
    const rowKey = row.id ?? row.key;

    return {
      ...row,
      id: typeof rowKey === 'string' || typeof rowKey === 'number' ? rowKey : index,
    };
  });

export const RelatedRecords = ({
  activeTab,
  detail,
  onChangeTab,
  record,
  tabsAriaLabel = 'Related record tabs',
}: {
  activeTab: string;
  detail: DetailSectionMetadata;
  onChangeTab: (tab: string) => void;
  record?: DynamicRecordListRow;
  tabsAriaLabel?: string;
}): ReactElement => {
  const activeDetailTab = detail.detailTabs?.find((tab) => tab.key === activeTab);
  const detailRows = record ? getDetailRows(record, activeDetailTab) : [];
  const detailColumns = activeDetailTab?.columns ?? detail.lineColumns;

  return (
    <Paper className={styles.relatedRecords} elevation={0} square>
      {detail.detailTabs?.length ? (
        <Tabs
          aria-label={tabsAriaLabel}
          onChange={(_, value: string) => onChangeTab(value)}
          scrollButtons="auto"
          value={activeTab}
          variant="scrollable"
        >
          {detail.detailTabs.map((tab) => (
            <Tab key={tab.key} label={tab.label} value={tab.key} />
          ))}
        </Tabs>
      ) : (
        <Typography className={styles.relatedTitle} variant="subtitle2">Lines</Typography>
      )}
      <Divider />
      {!record ? (
        <Box className={styles.emptyState}>
          <Typography variant="body2">Select a record to view related data</Typography>
        </Box>
      ) : detailRows.length === 0 ? (
        <Box className={styles.emptyState}>
          <Typography variant="body2">
            {activeDetailTab?.emptyText ?? 'No related records'}
          </Typography>
        </Box>
      ) : (
        <GridTable
          fields={mapColumnsToFields(detailColumns, detailRows)}
          rows={addRequiredRowIds(detailRows)}
        />
      )}
    </Paper>
  );
};

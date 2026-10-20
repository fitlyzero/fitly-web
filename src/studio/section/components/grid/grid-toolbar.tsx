import {
  AddOutlined,
  AttachFileOutlined,
  ChevronLeftOutlined,
  ChevronRightOutlined,
  DownloadOutlined,
  EmailOutlined,
  FilterAltOutlined,
  FirstPageOutlined,
  LastPageOutlined,
  PrintOutlined,
  RefreshOutlined,
  UploadFileOutlined,
} from '@mui/icons-material';
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import type { ReactElement } from 'react';

import styles from '@/studio/section/components/grid/grid-section.module.css';
import type {
  DynamicRecordDefaultActionKey,
  DynamicRecordListSection,
  DynamicRecordToolbarAction,
} from '@/studio/section/model/local-section.types';
import type { LocalGridSectionMetadata } from '@/studio/section/model/section-metadata';

export interface RecordNavigationProps {
  currentRecordIndex: number;
  onSelectRecord: (recordIndex: number) => void;
  recordCount: number;
}

const actionIcons: Record<DynamicRecordDefaultActionKey, ReactElement> = {
  attachFile: <AttachFileOutlined fontSize="small" />,
  create: <AddOutlined fontSize="small" />,
  exportExcel: <DownloadOutlined fontSize="small" />,
  importExcel: <UploadFileOutlined fontSize="small" />,
};

const defaultActionLabels: Record<DynamicRecordDefaultActionKey, string> = {
  attachFile: 'Attach file',
  create: 'New',
  exportExcel: 'Export Excel',
  importExcel: 'Import Excel',
};

const isRecordList = (
  grid: LocalGridSectionMetadata['grid'],
): grid is DynamicRecordListSection => grid.type === 'record-list';

export const getConfiguredActionIcon = (
  action: DynamicRecordToolbarAction,
): ReactElement | undefined => {
  switch (action.icon) {
    case 'mail':
    case 'send':
      return <EmailOutlined fontSize="small" />;
    case 'print':
      return <PrintOutlined fontSize="small" />;
    case 'refresh':
      return <RefreshOutlined fontSize="small" />;
    case 'attach':
      return <AttachFileOutlined fontSize="small" />;
    case 'download':
    case 'export':
      return <DownloadOutlined fontSize="small" />;
    case 'import':
    case 'upload':
      return <UploadFileOutlined fontSize="small" />;
    case 'new':
      return <AddOutlined fontSize="small" />;
    default:
      return undefined;
  }
};

export const RecordNavigation = ({
  currentRecordIndex,
  onSelectRecord,
  recordCount,
}: RecordNavigationProps): ReactElement => {
  const isFirstRecord = currentRecordIndex <= 0;
  const isLastRecord = currentRecordIndex < 0 || currentRecordIndex >= recordCount - 1;
  const currentPosition = currentRecordIndex >= 0 ? currentRecordIndex + 1 : 0;

  return (
    <Box aria-label="Record navigation" className={styles.recordNavigation} role="group">
      <IconButton
        aria-label="First record"
        className={styles.recordNavigationButton}
        disabled={isFirstRecord}
        onClick={() => onSelectRecord(0)}
        size="small"
      >
        <FirstPageOutlined fontSize="small" />
      </IconButton>
      <IconButton
        aria-label="Previous record"
        className={styles.recordNavigationButton}
        disabled={isFirstRecord}
        onClick={() => onSelectRecord(currentRecordIndex - 1)}
        size="small"
      >
        <ChevronLeftOutlined fontSize="small" />
      </IconButton>
      <Typography
        aria-label={`Record ${currentPosition} of ${recordCount}`}
        aria-live="polite"
        className={styles.recordPosition}
        component="span"
        role="status"
        variant="body2"
      >
        {currentPosition}/{recordCount}
      </Typography>
      <IconButton
        aria-label="Next record"
        className={styles.recordNavigationButton}
        disabled={isLastRecord}
        onClick={() => onSelectRecord(currentRecordIndex + 1)}
        size="small"
      >
        <ChevronRightOutlined fontSize="small" />
      </IconButton>
      <IconButton
        aria-label="Last record"
        className={styles.recordNavigationButton}
        disabled={isLastRecord}
        onClick={() => onSelectRecord(recordCount - 1)}
        size="small"
      >
        <LastPageOutlined fontSize="small" />
      </IconButton>
    </Box>
  );
};

export const GridToolbar = ({
  grid,
  hasSelection,
  onOpenFilters,
  recordNavigation,
}: {
  grid: LocalGridSectionMetadata['grid'];
  hasSelection: boolean;
  onOpenFilters: () => void;
  recordNavigation?: RecordNavigationProps;
}): ReactElement => {
  const actions: DynamicRecordDefaultActionKey[] = isRecordList(grid)
    ? ['create', 'importExcel', 'exportExcel', 'attachFile']
    : ['create', 'exportExcel'];

  return (
    <Box className={styles.toolbar}>
      {actions.map((key) => {
        const config = isRecordList(grid) ? grid.defaultActions?.[key] : undefined;
        if (config?.visible === false) return null;

        return (
          <Button
            key={key}
            startIcon={actionIcons[key]}
            variant={key === 'create' ? 'contained' : 'outlined'}
          >
            {config?.label
              ?? (key === 'create' && 'createLabel' in grid
                ? grid.createLabel
                : defaultActionLabels[key])}
          </Button>
        );
      })}
      {isRecordList(grid)
        ? [...(grid.toolbarActions ?? []), ...(grid.fieldActions ?? [])]
          .filter((action) => action.visible !== false && action.scope !== 'detail')
          .map((action) => (
            <Button
              disabled={action.requiresSelection && !hasSelection}
              key={action.key}
              startIcon={getConfiguredActionIcon(action)}
              variant={action.tone === 'primary' ? 'contained' : 'outlined'}
            >
              {action.label}
            </Button>
          ))
        : null}
      <Box className={styles.toolbarSpacer} />
      <Tooltip title="Filters">
        <IconButton aria-label={`Open ${grid.title} filters`} onClick={onOpenFilters}>
          <FilterAltOutlined />
        </IconButton>
      </Tooltip>
      {recordNavigation ? <RecordNavigation {...recordNavigation} /> : null}
    </Box>
  );
};

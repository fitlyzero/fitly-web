import { ArrowBackOutlined } from '@mui/icons-material';
import { Box, Button, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import type { ReactElement } from 'react';

import type { FieldMetadata } from '@/studio/field/model/field-metadata';
import { FieldRenderer } from '@/studio/field/renderer/field-renderer';
import { RelatedRecords } from '@/studio/section/components/detail/related-records';
import styles from '@/studio/section/components/grid/grid-section.module.css';
import {
  getConfiguredActionIcon,
  RecordNavigation,
} from '@/studio/section/components/grid/grid-toolbar';
import { ResizableGridLayout } from '@/studio/section/components/grid/resizable-grid-layout';
import { mapDetailsToFields } from '@/studio/section/mapper/local-field-mapper';
import type { GridSectionLayoutMetadata } from '@/studio/section/model/section-layout-metadata';
import type { DetailSectionMetadata } from '@/studio/section/model/section-metadata';
import type {
  DynamicRecordListRow,
  DynamicRecordListSection,
  DynamicTableRow,
} from '@/studio/section/model/local-section.types';

const minimumDetailHeight = 180;

export const LocalDetailSection = ({
  activeTab,
  currentRecordIndex,
  detail,
  fields,
  grid,
  layout,
  onBack,
  onChangeTab,
  onSelectRecord,
  record,
  recordCount,
  row,
  sectionId,
}: {
  activeTab: string;
  currentRecordIndex: number;
  detail: DetailSectionMetadata;
  fields: FieldMetadata[];
  grid: DynamicRecordListSection;
  layout?: GridSectionLayoutMetadata;
  onBack: () => void;
  onChangeTab: (tab: string) => void;
  onSelectRecord: (recordIndex: number) => void;
  record: DynamicRecordListRow;
  recordCount: number;
  row: DynamicTableRow;
  sectionId: string;
}): ReactElement => {
  const detailFields = mapDetailsToFields(
    record.detailFields ?? detail.detailFields,
    fields,
    row,
  );

  return (
    <Paper className={styles.recordDetail} component="section" elevation={0} square>
      <Box className={styles.detailHeader}>
        <Tooltip title="Back to grid">
          <IconButton aria-label="Back to grid" onClick={onBack}>
            <ArrowBackOutlined />
          </IconButton>
        </Tooltip>
        <Box>
          <Typography component="h2" variant="h3">Record detail</Typography>
          <Typography color="text.secondary" variant="body2">{detail.title}</Typography>
        </Box>
        <Box className={styles.detailHeaderSpacer} />
        {grid.fieldActions
          ?.filter((action) => action.visible !== false && action.scope !== 'list')
          .map((action) => (
            <Button
              key={action.key}
              size="small"
              startIcon={getConfiguredActionIcon(action)}
              variant={action.tone === 'primary' ? 'contained' : 'outlined'}
            >
              {action.label}
            </Button>
          ))}
        <RecordNavigation
          currentRecordIndex={currentRecordIndex}
          onSelectRecord={onSelectRecord}
          recordCount={recordCount}
        />
      </Box>
      <ResizableGridLayout
        child={(
          <RelatedRecords
            activeTab={activeTab}
            detail={detail}
            onChangeTab={onChangeTab}
            record={record}
            tabsAriaLabel="Record detail tabs"
          />
        )}
        collapseLabel="Hide record detail related records"
        expandLabel="Show record detail related records"
        layout={layout?.recordChild}
        minimumPrimaryHeight={minimumDetailHeight}
        parent={(
          <Box className={styles.detailContent}>
            <Box className={styles.detailFields}>
              {detailFields.map((field) => (
                <Box key={field.fieldId}>
                  <Typography color="text.secondary" variant="caption">
                    {field.nameDisplay}
                  </Typography>
                  <FieldRenderer field={field} mode="cell" value={row[field.name]} />
                </Box>
              ))}
            </Box>
          </Box>
        )}
        scope="detail"
        sectionId={sectionId}
        separatorLabel="Resize record detail related records"
      />
    </Paper>
  );
};

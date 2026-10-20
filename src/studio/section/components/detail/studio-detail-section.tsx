import { ArrowBackOutlined } from '@mui/icons-material';
import { Box, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { useLayoutEffect, useState, type ReactElement } from 'react';

import type { FieldMetadata } from '@/studio/field/model/field-metadata';
import type { FieldValue } from '@/studio/field/model/field-value';
import { FieldRenderer } from '@/studio/field/renderer/field-renderer';
import { createStudioDetailFieldPlacements } from '@/studio/section/components/detail/studio-detail-layout';
import styles from '@/studio/section/components/grid/studio-grid-section.module.css';
import {
  StudioSectionHeader,
  type StudioSectionLayoutControls,
} from '@/studio/section/components/studio-section-header';
import type { StudioGridRowMetadata } from '@/studio/section/model/studio-grid-row-metadata';
import type {
  StudioDetailSectionMetadata,
  StudioGridSectionMetadata,
} from '@/studio/section/model/studio-section-metadata';

const createDraftValues = (
  fields: FieldMetadata[],
  row: StudioGridRowMetadata,
): Record<string, FieldValue> =>
  Object.fromEntries(fields.map((field) => {
    const hasRawValue = Object.prototype.hasOwnProperty.call(
      row.rawValues,
      field.name,
    );

    return [
      field.fieldId,
      hasRawValue ? row.rawValues[field.name] : row.values[field.fieldId],
    ];
  }));

const applyRecordFieldState = (
  field: FieldMetadata,
  row: StudioGridRowMetadata,
): FieldMetadata => {
  const state = row.fieldStates?.[field.fieldId];

  return state
    ? { ...field, isMandatory: state.mandatory, isReadOnly: state.readonly }
    : field;
};

export const StudioDetailSection = ({
  layoutControls,
  onBack,
  row,
  section,
}: {
  layoutControls?: StudioSectionLayoutControls;
  onBack?: () => void;
  row: StudioGridRowMetadata;
  section: StudioGridSectionMetadata | StudioDetailSectionMetadata;
}): ReactElement => {
  const fields = section.fieldsByLayout?.DETAIL ?? section.fields;
  const [draftValues, setDraftValues] = useState<Record<string, FieldValue>>(
    () => createDraftValues(fields, row),
  );
  const recordFields = fields
    .filter((field) => row.fieldStates?.[field.fieldId]?.displayed !== false)
    .map((field) => applyRecordFieldState(field, row));
  const fieldPlacements = createStudioDetailFieldPlacements(recordFields);

  useLayoutEffect(() => {
    setDraftValues(createDraftValues(fields, row));
  }, [fields, row, section.sectionId]);

  return (
    <Paper
      aria-label={`${section.title} record detail`}
      className={[
        styles.recordDetail,
        row.isActive === false ? styles.deactivatedRecordDetail : '',
      ].filter(Boolean).join(' ')}
      component="section"
      data-record-active={row.isActive !== false}
      elevation={0}
      square
    >
      <StudioSectionHeader
        {...layoutControls}
        leading={onBack ? (
          <Tooltip title="Back to grid">
            <IconButton aria-label="Back to grid" onClick={onBack}>
              <ArrowBackOutlined />
            </IconButton>
          </Tooltip>
        ) : undefined}
        systemActions={section.systemActions}
        title={section.title}
      />
      <Box className={styles.detailContent}>
        {recordFields.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            No fields available
          </Typography>
        ) : (
          <Box className={styles.detailFields}>
            {fieldPlacements.map(({ colStart, field, height, rowStart, width }) => (
              <Box
                className={styles.detailField}
                data-field-id={field.fieldId}
                key={field.fieldId}
                style={{
                  gridColumn: `${colStart} / span ${width}`,
                  gridRow: `${rowStart} / span ${height}`,
                }}
              >
                {field.isReadOnly === false ? (
                  <FieldRenderer
                    field={field}
                    mode="input"
                    onChange={(value) => {
                      setDraftValues((currentValues) => ({
                        ...currentValues,
                        [field.fieldId]: value,
                      }));
                    }}
                    value={draftValues[field.fieldId]}
                  />
                ) : (
                  <>
                    <Typography color="text.secondary" variant="caption">
                      {field.nameDisplay}
                    </Typography>
                    <FieldRenderer
                      field={field}
                      mode="cell"
                      value={row.values[field.fieldId]}
                    />
                  </>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

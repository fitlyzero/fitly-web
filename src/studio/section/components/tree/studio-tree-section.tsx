import { Box, List, ListItemText, Paper, Typography } from '@mui/material';
import type { ReactElement } from 'react';

import {
  StudioSectionHeader,
  type StudioSectionLayoutControls,
} from '@/studio/section/components/studio-section-header';
import type { StudioGridRowMetadata } from '@/studio/section/model/studio-grid-row-metadata';
import type { StudioTreeSectionMetadata } from '@/studio/section/model/studio-section-metadata';

const getParentRecordId = (row: StudioGridRowMetadata): string | undefined => {
  const parentId = row.rawValues.parent_id
    ?? row.rawValues.parentId
    ?? row.rawValues.parent;
  return typeof parentId === 'string' ? parentId : undefined;
};

const StudioTreeNode = ({
  childrenByParent,
  labelFieldId,
  row,
}: {
  childrenByParent: Map<string, StudioGridRowMetadata[]>;
  labelFieldId?: string;
  row: StudioGridRowMetadata;
}): ReactElement => {
  const children = childrenByParent.get(row.recordId) ?? [];
  const label = labelFieldId ? row.values[labelFieldId] : row.recordId;

  return (
    <Box component="li" sx={{ listStyle: 'none' }}>
      <ListItemText primary={String(label ?? row.recordId)} />
      {children.length > 0 ? (
        <List disablePadding sx={{ pl: 3 }}>
          {children.map((child) => (
            <StudioTreeNode
              childrenByParent={childrenByParent}
              key={child.recordId}
              labelFieldId={labelFieldId}
              row={child}
            />
          ))}
        </List>
      ) : null}
    </Box>
  );
};

export const StudioTreeSection = ({
  layoutControls,
  section,
}: {
  layoutControls?: StudioSectionLayoutControls;
  section: StudioTreeSectionMetadata;
}): ReactElement => {
  const fields = section.fieldsByLayout?.TREE ?? section.fields;
  const recordIds = new Set(section.rows.map((row) => row.recordId));
  const childrenByParent = new Map<string, StudioGridRowMetadata[]>();

  for (const row of section.rows) {
    const parentId = getParentRecordId(row);
    if (!parentId) continue;
    const children = childrenByParent.get(parentId) ?? [];
    children.push(row);
    childrenByParent.set(parentId, children);
  }

  const roots = section.rows.filter((row) => {
    const parentId = getParentRecordId(row);
    return !parentId || !recordIds.has(parentId);
  });
  const visibleRoots = roots.length > 0 ? roots : section.rows;
  const visibleChildren = roots.length > 0
    ? childrenByParent
    : new Map<string, StudioGridRowMetadata[]>();

  return (
    <Paper
      aria-label={section.title}
      component="section"
      elevation={0}
      square
      sx={{ display: 'flex', height: '100%', flexDirection: 'column', overflow: 'hidden' }}
    >
      <StudioSectionHeader
        {...layoutControls}
        systemActions={section.systemActions}
        title={section.title}
      />
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', p: 2 }}>
        {visibleRoots.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            No tree records available.
          </Typography>
        ) : (
          <List>
            {visibleRoots.map((row) => (
              <StudioTreeNode
                childrenByParent={visibleChildren}
                key={row.recordId}
                labelFieldId={fields[0]?.fieldId}
                row={row}
              />
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
};

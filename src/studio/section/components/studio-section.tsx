import {
  Box,
  Divider,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  useLayoutEffect,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';

import { ErrorState, LoadingState } from '@/components/AsyncState';
import { StudioDetailSection } from '@/studio/section/components/detail/studio-detail-section';
import { ResizableGridLayout } from '@/studio/section/components/grid/resizable-grid-layout';
import { StudioGridTable } from '@/studio/section/components/grid/studio-grid-table';
import styles from '@/studio/section/components/grid/studio-grid-section.module.css';
import {
  StudioSectionHeader,
  type StudioSectionLayoutControls,
} from '@/studio/section/components/studio-section-header';
import { StudioTreeSection } from '@/studio/section/components/tree/studio-tree-section';
import { studioRecordStateConfig } from '@/studio/section/config/studio-record-state-config';
import type { StudioGridRowMetadata } from '@/studio/section/model/studio-grid-row-metadata';
import type {
  StudioDetailSectionMetadata,
  StudioGridSectionMetadata,
  StudioSectionMetadata,
  StudioTreeSectionMetadata,
} from '@/studio/section/model/studio-section-metadata';
import type { StudioSectionType } from '@/studio/section/model/studio-section-type';
import { useSectionDataQuery } from '@/studio/section/use-section-data-query';

const minimumGridHeight = 320;
const minimumDetailHeight = 180;
const studioLayoutOrder: StudioSectionType[] = ['GRID', 'DETAIL', 'TREE'];

const getAvailableLayouts = (section: StudioSectionMetadata): StudioSectionType[] => {
  const configuredLayouts = new Set<StudioSectionType>([section.sectionType]);
  for (const layout of studioLayoutOrder) {
    if (
      section.fieldsByLayout !== undefined
      && Object.prototype.hasOwnProperty.call(section.fieldsByLayout, layout)
    ) {
      configuredLayouts.add(layout);
    }
  }

  if (section.fieldsByLayout !== undefined) {
    return studioLayoutOrder.filter((layout) => configuredLayouts.has(layout));
  }

  const inferredLayouts = new Set<StudioSectionType>([section.sectionType]);
  if (section.fields.some((field) => field.detailLayout !== undefined)) {
    inferredLayouts.add('DETAIL');
  }

  return studioLayoutOrder.filter((layout) => inferredLayouts.has(layout));
};

const StudioChildSectionContent = ({
  parentRecordId,
  renderChildSection,
  section,
}: {
  parentRecordId: string;
  renderChildSection: (section: StudioSectionMetadata) => ReactNode;
  section: StudioSectionMetadata;
}): ReactElement => {
  const query = useSectionDataQuery(section, parentRecordId);

  if (query.isError) {
    return <Box sx={{ p: 2 }}><ErrorState message={query.error.message} /></Box>;
  }

  if (!query.data) {
    return <Box sx={{ p: 2 }}><LoadingState /></Box>;
  }

  return <>{renderChildSection(query.data)}</>;
};

const StudioChildSectionTabs = ({
  activeSectionId,
  onChangeSection,
  parentRecordId,
  renderChildSection,
  sections,
}: {
  activeSectionId: string;
  onChangeSection: (sectionId: string) => void;
  parentRecordId?: string;
  renderChildSection?: (section: StudioSectionMetadata) => ReactNode;
  sections: StudioSectionMetadata[];
}): ReactElement => {
  const activeSection = sections.find(
    (section) => section.sectionId === activeSectionId,
  ) ?? sections[0];

  if (!activeSection) {
    return (
      <Paper className={styles.childSections} elevation={0} square>
        <Typography color="text.secondary" sx={{ p: 3 }} variant="body2">
          No child sections are available for the selected record.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper className={styles.childSections} elevation={0} square>
      <Tabs
        aria-label="Child section tabs"
        onChange={(_, sectionId: string) => onChangeSection(sectionId)}
        scrollButtons="auto"
        value={activeSection?.sectionId ?? false}
        variant="scrollable"
      >
        {sections.map((section) => (
          <Tab
            key={section.sectionId}
            label={section.title}
            value={section.sectionId}
          />
        ))}
      </Tabs>
      <Divider />
      <Box className={styles.childSectionContent}>
        {parentRecordId && renderChildSection ? (
          <StudioChildSectionContent
            parentRecordId={parentRecordId}
            renderChildSection={renderChildSection}
            section={activeSection}
          />
        ) : (
          <Typography color="text.secondary" sx={{ p: 3 }} variant="body2">
            Select a record to display child sections.
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

const EmptyStudioDetailSection = ({
  layoutControls,
  section,
}: {
  layoutControls: StudioSectionLayoutControls;
  section: StudioSectionMetadata;
}): ReactElement => (
  <Paper
    aria-label={`${section.title} record detail`}
    className={styles.recordDetail}
    component="section"
    elevation={0}
    square
  >
    <StudioSectionHeader
      {...layoutControls}
      systemActions={section.systemActions}
      title={section.title}
    />
    <Typography color="text.secondary" sx={{ p: 3 }} variant="body2">
      Select a record to display this detail section.
    </Typography>
  </Paper>
);

export const StudioSection = ({
  renderChildSection,
  section,
}: {
  renderChildSection?: (section: StudioSectionMetadata) => ReactNode;
  section: StudioSectionMetadata;
}): ReactElement => {
  const theme = useTheme();
  const [activeLayout, setActiveLayout] = useState<StudioSectionType>(
    section.sectionType,
  );
  const [selectedRow, setSelectedRow] = useState<StudioGridRowMetadata | null>(
    section.rows[0] ?? null,
  );
  const [activeChildSectionId, setActiveChildSectionId] = useState(
    section.childSections[0]?.sectionId ?? '',
  );
  const availableLayouts = getAvailableLayouts(section);
  const activeRow = selectedRow ?? section.rows[0];
  const displayedChildSections = section.childSections.filter(
    (childSection) =>
      activeRow?.childSectionStates?.[childSection.sectionId]?.displayed !== false,
  );

  useLayoutEffect(() => {
    setActiveLayout(section.sectionType);
    setSelectedRow(section.rows[0] ?? null);
    setActiveChildSectionId(section.childSections[0]?.sectionId ?? '');
  }, [section.childSections, section.rows, section.sectionId, section.sectionType]);

  const themeVariables = {
    '--grid-section-divider-color': theme.palette.divider,
    '--grid-section-paper-background': theme.palette.background.paper,
    '--grid-section-secondary-text': theme.palette.text.secondary,
    '--grid-section-selected-background': theme.palette.action.selected,
    '--studio-deactivated-record-background': studioRecordStateConfig.deactivated.background,
    '--studio-deactivated-record-hover-background': studioRecordStateConfig.deactivated.hoverBackground,
    '--studio-deactivated-record-indicator': studioRecordStateConfig.deactivated.indicator,
    '--studio-deactivated-record-selected-background': studioRecordStateConfig.deactivated.selectedBackground,
    '--studio-deactivated-record-selected-hover-background': studioRecordStateConfig.deactivated.selectedHoverBackground,
    '--studio-deactivated-record-text': studioRecordStateConfig.deactivated.text,
    '--studio-selected-record-background': alpha(theme.palette.primary.main, 0.14),
    '--studio-selected-record-hover-background': alpha(theme.palette.primary.main, 0.2),
    '--studio-selected-record-indicator': theme.palette.primary.main,
  } as CSSProperties;
  const layoutControls: StudioSectionLayoutControls = {
    activeLayout,
    availableLayouts,
    onLayoutChange: setActiveLayout,
  };

  let primaryContent: ReactElement;

  switch (activeLayout) {
    case 'DETAIL': {
      primaryContent = activeRow ? (
        <StudioDetailSection
          layoutControls={layoutControls}
          row={activeRow}
          section={{ ...section, sectionType: 'DETAIL' } as StudioDetailSectionMetadata}
        />
      ) : (
        <EmptyStudioDetailSection
          layoutControls={layoutControls}
          section={section}
        />
      );
      break;
    }
    case 'TREE':
      primaryContent = (
        <StudioTreeSection
          layoutControls={layoutControls}
          section={{ ...section, sectionType: 'TREE' } as StudioTreeSectionMetadata}
        />
      );
      break;
    case 'GRID':
      primaryContent = (
        <StudioGridTable
          layoutControls={layoutControls}
          onOpenDetail={availableLayouts.includes('DETAIL')
            ? (row) => {
                setSelectedRow(row);
                setActiveLayout('DETAIL');
              }
            : undefined}
          onSelectRow={setSelectedRow}
          section={{ ...section, sectionType: 'GRID' } as StudioGridSectionMetadata}
          selectedRowId={selectedRow?.recordId}
        />
      );
      break;
  }

  return (
    <Box
      aria-label={section.title}
      className={styles.section}
      component="section"
      style={themeVariables}
    >
      {section.childSections.length > 0 ? (
        <ResizableGridLayout
          child={(
            <StudioChildSectionTabs
              activeSectionId={activeChildSectionId}
              onChangeSection={setActiveChildSectionId}
              parentRecordId={activeRow?.recordId}
              renderChildSection={renderChildSection}
              sections={displayedChildSections}
            />
          )}
          collapseLabel="Hide child sections"
          expandLabel="Show child sections"
          minimumPrimaryHeight={activeLayout === 'DETAIL'
            ? minimumDetailHeight
            : minimumGridHeight}
          parent={primaryContent}
          scope={activeLayout === 'DETAIL' ? 'detail' : undefined}
          sectionId={section.sectionId}
          separatorLabel="Resize child sections"
        />
      ) : (
        primaryContent
      )}
    </Box>
  );
};

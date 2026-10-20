import { Box, Paper, Typography } from '@mui/material';
import type { ReactElement } from 'react';

import {
  FormSection,
  HeroSection,
  StatsSection,
} from '@/studio/section/components/content/content-sections';
import { GridSection } from '@/studio/section/components/grid/grid-section';
import { ProfileSection } from '@/studio/section/components/profile/profile-section';
import { StudioSection } from '@/studio/section/components/studio-section';
import { TreeSection } from '@/studio/section/components/tree/tree-section';
import { WorkflowSection } from '@/studio/section/components/workflow/workflow-section';
import type { SectionMetadata } from '@/studio/section/model/section-metadata';

const DetailSectionWithoutRecord = ({
  title,
}: {
  title: string;
}): ReactElement => (
  <Box sx={{ p: { xs: 2, md: 3 } }}>
    <Paper component="section" elevation={0} sx={{ border: 1, borderColor: 'divider', p: 3 }}>
      <Typography component="h2" variant="h3">{title}</Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
        Select a record to display this detail section.
      </Typography>
    </Paper>
  </Box>
);

export const SectionRenderer = ({
  section,
}: {
  section: SectionMetadata;
}): ReactElement => {
  switch (section.sectionType) {
    case 'GRID':
      return (
        <GridSection
          renderChildSection={(childSection) => (
            <SectionRenderer section={childSection} />
          )}
          section={section}
        />
      );
    case 'DETAIL':
      if ('source' in section && section.source === 'STUDIO') {
        return (
          <StudioSection
            renderChildSection={(childSection) => (
              <SectionRenderer section={childSection} />
            )}
            section={section}
          />
        );
      }
      return <DetailSectionWithoutRecord title={section.title} />;
    case 'TREE':
      return section.source === 'STUDIO'
        ? (
            <StudioSection
              renderChildSection={(childSection) => (
                <SectionRenderer section={childSection} />
              )}
              section={section}
            />
          )
        : <TreeSection section={section} />;
    case 'HERO':
      return <HeroSection section={section.definition} />;
    case 'STATS':
      return <StatsSection section={section.definition} />;
    case 'FORM':
      return <FormSection section={section.definition} />;
    case 'WORKFLOW':
      return (
        <Box sx={{ px: { xs: 2, md: 3 }, py: 2 }}>
          <WorkflowSection section={section.definition} />
        </Box>
      );
    case 'PROFILE':
      return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <ProfileSection />
        </Box>
      );
  }
};

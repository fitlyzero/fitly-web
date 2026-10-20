import { Alert, Box } from '@mui/material';
import type { ReactElement } from 'react';

import type { ScreenMetadata } from '@/studio/screen/model/screen-metadata';
import { SectionRenderer } from '@/studio/section/components/section-renderer';

export const ScreenRenderer = ({ screen }: { screen: ScreenMetadata }): ReactElement => {
  if (screen.sections.length === 0) {
    return <Alert severity="warning">This screen does not contain any sections.</Alert>;
  }

  return (
    <Box
      aria-label={screen.title}
      component="article"
      sx={{ display: 'grid', height: '100%', minHeight: 0, minWidth: 0, overflow: 'auto' }}
    >
      {screen.sections.map((section) => (
        <SectionRenderer key={section.sectionId} section={section} />
      ))}
    </Box>
  );
};

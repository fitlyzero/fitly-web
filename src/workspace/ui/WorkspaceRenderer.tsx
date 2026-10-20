import { Box } from '@mui/material';
import type { ReactElement } from 'react';

import { ErrorState, LoadingState } from '@/components/AsyncState';
import { ScreenRenderer } from '@/studio/screen/components/screen-renderer';
import { useScreenQuery } from '@/studio/screen/use-screen-query';

export const WorkspaceRenderer = ({ screenId }: { screenId: string }): ReactElement => {
  const query = useScreenQuery(screenId);

  if (query.isError) {
    return <Box sx={{ p: { xs: 2, md: 3 } }}><ErrorState message={query.error.message} /></Box>;
  }

  if (query.isLoading || !query.data) {
    return <Box sx={{ p: { xs: 2, md: 3 } }}><LoadingState /></Box>;
  }

  return (
    <Box
      component="section"
      sx={{
        height: '100%',
        minWidth: 0,
      }}
    >
      <ScreenRenderer screen={query.data} />
    </Box>
  );
};

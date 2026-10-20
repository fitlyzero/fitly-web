import { Box, Typography } from '@mui/material';
import type { ReactElement } from 'react';

import { brand } from '@/theme/brand';

export const ProjectLogo = (): ReactElement => (
  <Box sx={{ textAlign: 'center' }}>
    <Box
      alt="Fitly"
      component="img"
      src={brand.logo.full}
      sx={{ display: 'block', height: 112, maxWidth: '100%', mx: 'auto', objectFit: 'contain' }}
    />
    <Typography color="text.secondary" sx={{ mt: 1, textTransform: 'uppercase' }} variant="caption">
      {brand.platformName}
    </Typography>
  </Box>
);

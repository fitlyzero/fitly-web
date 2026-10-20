import { Typography } from '@mui/material';
import type { ReactElement } from 'react';

import type { CellFieldRendererProps } from '@/studio/field/model/field-renderer-props';

export const TextCell = ({ value }: CellFieldRendererProps): ReactElement => (
  <Typography noWrap variant="body2">
    {value == null || value === '' ? '-' : String(value)}
  </Typography>
);

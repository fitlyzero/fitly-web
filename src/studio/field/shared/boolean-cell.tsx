import { Checkbox } from '@mui/material';
import type { ReactElement } from 'react';

import type { CellFieldRendererProps } from '@/studio/field/model/field-renderer-props';

export const BooleanCell = ({ value }: CellFieldRendererProps): ReactElement =>
  <Checkbox checked={Boolean(value)} disabled size="small" />;

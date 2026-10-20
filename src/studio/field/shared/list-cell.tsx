import { Chip } from '@mui/material';
import type { ReactElement } from 'react';

import type { CellFieldRendererProps } from '@/studio/field/model/field-renderer-props';

export const ListCell = ({ field, value }: CellFieldRendererProps): ReactElement => {
  const label = field.options?.find((option) => option.value === value)?.label
    ?? String(value ?? '-');

  return <Chip label={label} size="small" variant="outlined" />;
};

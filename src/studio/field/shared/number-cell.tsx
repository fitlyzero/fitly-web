import { Typography } from '@mui/material';
import type { ReactElement } from 'react';

import type { CellFieldRendererProps } from '@/studio/field/model/field-renderer-props';

export const NumberCell = ({
  integer = false,
  value,
}: CellFieldRendererProps & { integer?: boolean }): ReactElement => {
  const number = typeof value === 'number' ? value : Number(value);
  const formattedValue = Number.isFinite(number)
    ? new Intl.NumberFormat('en-US', {
        maximumFractionDigits: integer ? 0 : 2,
      }).format(number)
    : '-';

  return <Typography noWrap variant="body2">{formattedValue}</Typography>;
};

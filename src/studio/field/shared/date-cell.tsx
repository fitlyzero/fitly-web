import { Typography } from '@mui/material';
import type { ReactElement } from 'react';

import type { CellFieldRendererProps } from '@/studio/field/model/field-renderer-props';
import { formatDateTime } from '@/studio/field/shared/date-time-format';

export const DateCell = ({
  dateTime = false,
  value,
}: CellFieldRendererProps & { dateTime?: boolean }): ReactElement => {
  if (typeof value !== 'string' || !value) {
    return <Typography variant="body2">-</Typography>;
  }

  const formattedDateTime = dateTime
    ? formatDateTime(value)
    : null;
  const date = new Date(value);
  const formattedValue = dateTime
    ? formattedDateTime ?? value
    : Number.isNaN(date.getTime())
      ? value
      : new Intl.DateTimeFormat('vi-VN').format(date);

  return <Typography noWrap variant="body2">{formattedValue}</Typography>;
};

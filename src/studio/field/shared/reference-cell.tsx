import { Link } from '@mui/material';
import type { ReactElement } from 'react';

import type { CellFieldRendererProps } from '@/studio/field/model/field-renderer-props';

export const ReferenceCell = ({ field, value }: CellFieldRendererProps): ReactElement => {
  const label = field.options?.find((option) => option.value === value)?.label
    ?? String(value ?? '-');

  return (
    <Link component="button" underline="hover" variant="body2">
      {label}
    </Link>
  );
};

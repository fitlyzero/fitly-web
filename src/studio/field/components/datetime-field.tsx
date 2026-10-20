import type { ReactElement } from 'react';

import type { FieldRendererProps } from '@/studio/field/model/field-renderer-props';
import { DateCell } from '@/studio/field/shared/date-cell';
import { DateTimeInput } from '@/studio/field/shared/date-time-input';

export const DateTimeField = (props: FieldRendererProps): ReactElement =>
  props.mode === 'cell'
    ? <DateCell {...props} dateTime />
    : <DateTimeInput {...props} />;

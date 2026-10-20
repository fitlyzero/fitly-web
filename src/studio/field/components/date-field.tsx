import type { ReactElement } from 'react';

import type { FieldRendererProps } from '@/studio/field/model/field-renderer-props';
import { DateCell } from '@/studio/field/shared/date-cell';
import { DateInput } from '@/studio/field/shared/date-input';
import { TextCell } from '@/studio/field/shared/text-cell';
import { TextInput } from '@/studio/field/shared/text-input';

export const DateField = (props: FieldRendererProps): ReactElement => {
  if (props.field.studioDataType) {
    return props.mode === 'cell'
      ? <TextCell {...props} />
      : <TextInput {...props} />;
  }

  return props.mode === 'cell'
    ? <DateCell {...props} />
    : <DateInput {...props} />;
};

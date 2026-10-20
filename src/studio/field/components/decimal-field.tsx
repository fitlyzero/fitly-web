import type { ReactElement } from 'react';

import type { FieldRendererProps } from '@/studio/field/model/field-renderer-props';
import { NumberCell } from '@/studio/field/shared/number-cell';
import { NumberInput } from '@/studio/field/shared/number-input';
import { TextCell } from '@/studio/field/shared/text-cell';
import { TextInput } from '@/studio/field/shared/text-input';

export const DecimalField = (props: FieldRendererProps): ReactElement => {
  if (props.field.studioDataType) {
    return props.mode === 'cell'
      ? <TextCell {...props} />
      : <TextInput {...props} />;
  }

  return props.mode === 'cell'
    ? <NumberCell {...props} />
    : <NumberInput {...props} />;
};

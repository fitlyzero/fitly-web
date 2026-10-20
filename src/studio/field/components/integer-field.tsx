import type { ReactElement } from 'react';

import type { FieldRendererProps } from '@/studio/field/model/field-renderer-props';
import { NumberCell } from '@/studio/field/shared/number-cell';
import { NumberInput } from '@/studio/field/shared/number-input';

export const IntegerField = (props: FieldRendererProps): ReactElement =>
  props.mode === 'cell'
    ? <NumberCell {...props} integer />
    : <NumberInput {...props} integer />;

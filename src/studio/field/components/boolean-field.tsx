import type { ReactElement } from 'react';

import type { FieldRendererProps } from '@/studio/field/model/field-renderer-props';
import { BooleanCell } from '@/studio/field/shared/boolean-cell';
import { BooleanInput } from '@/studio/field/shared/boolean-input';

export const BooleanField = (props: FieldRendererProps): ReactElement =>
  props.mode === 'cell'
    ? <BooleanCell {...props} />
    : <BooleanInput {...props} />;

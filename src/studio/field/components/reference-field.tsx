import type { ReactElement } from 'react';

import type { FieldRendererProps } from '@/studio/field/model/field-renderer-props';
import { ReferenceCell } from '@/studio/field/shared/reference-cell';
import { ReferenceInput } from '@/studio/field/shared/reference-input';

export const ReferenceField = (props: FieldRendererProps): ReactElement =>
  props.mode === 'cell'
    ? <ReferenceCell {...props} />
    : <ReferenceInput {...props} />;

import type { ReactElement } from 'react';

import type { FieldRendererProps } from '@/studio/field/model/field-renderer-props';
import { ListCell } from '@/studio/field/shared/list-cell';
import { ListInput } from '@/studio/field/shared/list-input';

export const ListField = (props: FieldRendererProps): ReactElement =>
  props.mode === 'cell' ? <ListCell {...props} /> : <ListInput {...props} />;

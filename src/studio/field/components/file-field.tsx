import type { ReactElement } from 'react';

import type { FieldRendererProps } from '@/studio/field/model/field-renderer-props';
import { TextCell } from '@/studio/field/shared/text-cell';
import { TextInput } from '@/studio/field/shared/text-input';

export const FileField = (props: FieldRendererProps): ReactElement =>
  props.mode === 'cell' ? <TextCell {...props} /> : <TextInput {...props} />;

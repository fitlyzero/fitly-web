import type { ReactElement } from 'react';

import type { FieldRendererProps } from '@/studio/field/model/field-renderer-props';
import { fieldRegistry } from '@/studio/field/renderer/field-registry';

export const FieldRenderer = (props: FieldRendererProps): ReactElement => {
  const fieldType = props.field.studioDataType ?? props.field.dataType;
  const FieldComponent = fieldRegistry[fieldType];

  return <FieldComponent {...props} />;
};

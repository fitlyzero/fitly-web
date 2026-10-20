import { Paper, type PaperProps } from '@mui/material';
import type { PropsWithChildren, ReactElement } from 'react';

export const SectionCard = ({ children, ...props }: PropsWithChildren<PaperProps>): ReactElement => (
  <Paper elevation={0} {...props} sx={{ border: 1, borderColor: 'divider', p: 2, ...props.sx }}>
    {children}
  </Paper>
);

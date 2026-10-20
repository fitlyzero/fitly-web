import { Alert, Box, Skeleton } from '@mui/material';
import type { ReactElement } from 'react';

export const LoadingState = (): ReactElement => (
  <Box aria-label="Loading" sx={{ display: 'grid', gap: 1.5 }}>
    <Skeleton height={56} variant="rounded" />
    <Skeleton height={320} variant="rounded" />
  </Box>
);

export const ErrorState = ({ message }: { message: string }): ReactElement => (
  <Alert severity="error">{message}</Alert>
);

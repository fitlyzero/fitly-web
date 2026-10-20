import { QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { PropsWithChildren, ReactElement } from 'react';

import { queryClient } from '@/app/providers/query-client';
import { appTheme } from '@/theme/theme';

export const AppProviders = ({
  children,
}: PropsWithChildren): ReactElement => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

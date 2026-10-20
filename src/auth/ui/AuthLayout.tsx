import { Box, FormControl, MenuItem, Paper, Select, Typography } from '@mui/material';
import type { PropsWithChildren, ReactElement } from 'react';

import type { AuthLanguage } from '@/auth/model/auth.types';

interface AuthLayoutProps extends PropsWithChildren {
  language: AuthLanguage;
  languageLabel: string;
  onLanguageChange: (language: AuthLanguage) => void;
}

export const AuthLayout = ({
  children,
  language,
  languageLabel,
  onLanguageChange,
}: AuthLayoutProps): ReactElement => (
  <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.default', px: 2, py: 3 }}>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', maxWidth: 1200, mx: 'auto' }}>
      <FormControl size="small" variant="standard">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography color="text.secondary" variant="body2">
            {languageLabel}:
          </Typography>
          <Select
            id="auth-language"
            inputProps={{ 'aria-label': languageLabel }}
            value={language}
            onChange={(event) => onLanguageChange(event.target.value as AuthLanguage)}
          >
            <MenuItem value="vi_VN">Tiếng Việt</MenuItem>
            <MenuItem value="en_US">English</MenuItem>
          </Select>
        </Box>
      </FormControl>
    </Box>

    <Box sx={{ display: 'grid', minHeight: 'calc(100vh - 96px)', placeItems: 'center', py: 4 }}>
      <Paper
        elevation={0}
        sx={{ border: 1, borderColor: 'divider', maxWidth: 480, p: { xs: 3, sm: 5 }, width: '100%' }}
      >
        <Box sx={{ display: 'grid', gap: 3 }}>{children}</Box>
      </Paper>
    </Box>
  </Box>
);

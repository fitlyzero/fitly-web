import { Avatar, Box, Paper, Typography } from '@mui/material';
import type { ReactElement } from 'react';

import { useAuthStore } from '@/auth/store/useAuthStore';

export const ProfileSection = (): ReactElement => {
  const session = useAuthStore((state) => state.session);

  if (!session) {
    return <Box />;
  }

  return (
    <Box>
      <Typography component="h1" variant="h2">Personal information</Typography>
      <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', display: 'flex', gap: 2, mt: 2, p: 3 }}>
        <Avatar sx={{ bgcolor: 'primary.main', height: 56, width: 56 }}>{session.name.charAt(0)}</Avatar>
        <Box>
          <Typography variant="h3">{session.name}</Typography>
          <Typography color="text.secondary">{session.role}</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">{session.email}</Typography>
        </Box>
      </Paper>
    </Box>
  );
};

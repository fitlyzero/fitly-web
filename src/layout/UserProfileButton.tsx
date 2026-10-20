import { Avatar, Box, Button, Typography } from '@mui/material';
import type { ReactElement } from 'react';

import type { UserSession } from '@/auth/model/auth.types';

const getInitials = (name: string): string =>
  name
    .split(' ')
    .slice(0, 2)
    .map((token) => token.charAt(0).toUpperCase())
    .join('') || 'F';

export const UserProfileButton = ({
  onClick,
  session,
}: {
  onClick: () => void;
  session: UserSession;
}): ReactElement => (
  <Button
    aria-label="User profile"
    onClick={onClick}
    startIcon={
      <Avatar sx={{ bgcolor: 'primary.main', height: 30, width: 30 }}>
        {getInitials(session.name)}
      </Avatar>
    }
    sx={{ color: 'text.primary', maxWidth: 220 }}
  >
    <Box sx={{ display: { xs: 'none', sm: 'block' }, minWidth: 0, textAlign: 'left' }}>
      <Typography noWrap sx={{ fontWeight: 600 }} variant="body2">
        {session.name}
      </Typography>
      <Typography color="text.secondary" noWrap variant="caption">
        {session.role}
      </Typography>
    </Box>
  </Button>
);

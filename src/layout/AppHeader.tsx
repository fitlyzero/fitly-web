import {
  HelpOutlineOutlined,
  Logout,
  MailOutlineOutlined,
  Menu as MenuIcon,
  NotificationsNone,
} from '@mui/icons-material';
import {
  Box,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from '@mui/material';
import type { ReactElement } from 'react';

import type { AuthLanguage, UserSession } from '@/auth/model/auth.types';
import { UserProfileButton } from '@/layout/UserProfileButton';
import { brand } from '@/theme/brand';
import type { WorkspaceTarget } from '@/workspace/model/workspace-target';

interface AppHeaderProps {
  isNavigationCollapsed: boolean;
  language: AuthLanguage;
  onChangeLanguage: (language: AuthLanguage) => void;
  onOpenTarget: (target: WorkspaceTarget, label: string) => void;
  onSignOut: () => void;
  onToggleNavigation: () => void;
  session: UserSession;
}

export const AppHeader = ({
  isNavigationCollapsed,
  language,
  onChangeLanguage,
  onOpenTarget,
  onSignOut,
  onToggleNavigation,
  session,
}: AppHeaderProps): ReactElement => (
  <Box component="header" sx={{ alignItems: 'center', bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', display: 'flex', gap: 1, minHeight: 64, px: { xs: 2, md: 3 } }}>
    {isNavigationCollapsed ? (
      <Tooltip title="Show workspace menu">
        <IconButton aria-label="Show workspace menu" onClick={onToggleNavigation}><MenuIcon /></IconButton>
      </Tooltip>
    ) : null}
    <Box alt="Fitly" component="img" src={brand.logo.icon} sx={{ height: 36, width: 36 }} />
    <Box sx={{ minWidth: 0 }}>
      <Typography noWrap sx={{ fontWeight: 700 }} variant="body2">{brand.productName}</Typography>
      <Typography color="text.secondary" noWrap variant="caption">{brand.workspaceName}</Typography>
    </Box>
    <Box sx={{ flex: 1 }} />
    <FormControl size="small" sx={{ display: { xs: 'none', sm: 'block' }, minWidth: 96 }} variant="standard">
      <Select inputProps={{ 'aria-label': 'Workspace language' }} onChange={(event) => onChangeLanguage(event.target.value as AuthLanguage)} value={language}>
        <MenuItem value="vi_VN">VI</MenuItem>
        <MenuItem value="en_US">EN</MenuItem>
      </Select>
    </FormControl>
    <Tooltip title="Email support"><IconButton aria-label="Email support" href={`mailto:${brand.supportEmail}`}><MailOutlineOutlined /></IconButton></Tooltip>
    <Tooltip title="Notifications"><IconButton aria-label="Notifications"><NotificationsNone /></IconButton></Tooltip>
    <Tooltip title="Help"><IconButton aria-label="Help" href={`mailto:${brand.supportEmail}`}><HelpOutlineOutlined /></IconButton></Tooltip>
    <UserProfileButton
      onClick={() => onOpenTarget({ screenId: 'profile', type: 'SCREEN' }, 'Personal information')}
      session={session}
    />
    <Tooltip title="Log out"><IconButton aria-label="Log out" onClick={onSignOut}><Logout /></IconButton></Tooltip>
  </Box>
);

import { Close } from '@mui/icons-material';
import { Box, IconButton, Tab, Tabs, Tooltip } from '@mui/material';
import type { ReactElement } from 'react';

import type { WorkspaceTab } from '@/workspace/model/workspace-tab';

interface WorkspaceTabsProps {
  activeScreenId: string;
  onClose: (screenId: string) => void;
  onSelect: (screenId: string) => void;
  tabs: WorkspaceTab[];
}

export const WorkspaceTabs = ({ activeScreenId, onClose, onSelect, tabs }: WorkspaceTabsProps): ReactElement => (
  <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', px: 2 }}>
    <Tabs aria-label="Open workspace tabs" onChange={(_, value: string) => onSelect(value)} scrollButtons="auto" value={activeScreenId} variant="scrollable">
      {tabs.map((tab) => (
        <Tab
          aria-label={tab.label}
          key={tab.screenId}
          label={
            <Box sx={{ alignItems: 'center', display: 'flex', gap: 0.5, maxWidth: 200 }}>
              <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{tab.label}</Box>
              <Tooltip title="Close tab">
                <IconButton
                  aria-label={`Close ${tab.label}`}
                  component="span"
                  onClick={(event) => { event.stopPropagation(); onClose(tab.screenId); }}
                  size="small"
                >
                  <Close fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </Box>
          }
          value={tab.screenId}
        />
      ))}
    </Tabs>
  </Box>
);

import {
  Box,
  Button,
  Divider,
  Tab,
  TablePagination,
  Tabs,
  Typography,
} from '@mui/material';
import type { ReactElement, ReactNode } from 'react';

import type { StudioSectionType } from '@/studio/section/model/studio-section-type';
import type { StudioSystemAction } from '@/studio/section/model/studio-system-action';

const headerActionOrder = [
  'NEW',
  'SAVE',
  'REFRESH',
  'COPY',
  'DELETE',
  'ATTACHMENT',
  'IMPORT',
  'EXPORT',
] as const;

type HeaderAction = (typeof headerActionOrder)[number];

const fixedHeaderActions = new Set<HeaderAction>(['SAVE', 'REFRESH']);

const actionLabels = {
  ATTACHMENT: 'Attachment',
  COPY: 'Copy',
  DELETE: 'Delete',
  EXPORT: 'Export',
  IMPORT: 'Import',
  NEW: 'New',
  REFRESH: 'Refresh',
  SAVE: 'Save',
} satisfies Record<HeaderAction, string>;

const layoutLabels = {
  DETAIL: 'Detail',
  GRID: 'Grid',
  TREE: 'Tree',
} satisfies Record<StudioSectionType, string>;

export interface StudioSectionLayoutControls {
  activeLayout: StudioSectionType;
  availableLayouts: StudioSectionType[];
  onLayoutChange: (layout: StudioSectionType) => void;
}

export interface StudioSectionPaginationControls {
  onPageChange: (page: number) => void;
  page: number;
  pageSize: number;
  rowCount: number;
}

export const StudioSectionHeader = ({
  activeLayout,
  availableLayouts = [],
  leading,
  onAction,
  onFilter,
  onLayoutChange,
  onRecordInfo,
  onRefresh,
  onSave,
  onSort,
  pagination,
  subtitle,
  systemActions,
  title,
}: {
  activeLayout?: StudioSectionType;
  availableLayouts?: StudioSectionType[];
  leading?: ReactNode;
  onAction?: (action: StudioSystemAction) => void;
  onFilter?: () => void;
  onLayoutChange?: (layout: StudioSectionType) => void;
  onRecordInfo?: () => void;
  onRefresh?: () => void;
  onSave?: () => void;
  onSort?: () => void;
  pagination?: StudioSectionPaginationControls;
  subtitle?: string;
  systemActions: StudioSystemAction[];
  title: string;
}): ReactElement => {
  const enabledActions = new Set(systemActions);
  const showLayoutTabs = activeLayout !== undefined && availableLayouts.length > 0;

  return (
    <Box component="header" sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          gap: 1.5,
          minHeight: 50,
          px: 1.75,
          py: 1,
        }}
      >
        {leading}
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="h2"
            noWrap
            sx={{ fontSize: 15, fontWeight: 500, lineHeight: 1.3 }}
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography color="text.secondary" noWrap variant="caption">
              {subtitle}
            </Typography>
          ) : null}
        </Box>

        {showLayoutTabs ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              ml: 'auto',
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            <Tabs
              aria-label={`${title} layouts`}
              onChange={(_, layout: StudioSectionType) => onLayoutChange?.(layout)}
              sx={{
                '& .MuiTab-root': {
                  borderRadius: 1.25,
                  color: 'text.secondary',
                  fontSize: 12,
                  fontWeight: 500,
                  minHeight: 30,
                  minWidth: 58,
                  px: 1.25,
                  py: 0.5,
                  textTransform: 'none',
                },
                '& .MuiTab-root.Mui-selected': {
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  color: 'primary.main',
                },
                '& .MuiTabs-flexContainer': { gap: 0.125 },
                '& .MuiTabs-indicator': { display: 'none' },
                bgcolor: 'action.hover',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1.75,
                minHeight: 34,
                p: 0.25,
              }}
              value={activeLayout}
            >
              {availableLayouts.map((layout) => (
                <Tab key={layout} label={layoutLabels[layout]} value={layout} />
              ))}
            </Tabs>
          </Box>
        ) : null}
      </Box>

      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5,
          minHeight: 48,
          px: 1.75,
          py: 0.875,
        }}
      >
        <Box
          aria-label={`${title} system actions`}
          role="toolbar"
          sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
        >
          {headerActionOrder.map((action) => {
            const enabled = fixedHeaderActions.has(action)
              || enabledActions.has(action as StudioSystemAction);

            const handleClick = (): void => {
              if (action === 'SAVE') {
                onSave?.();
                return;
              }
              if (action === 'REFRESH') {
                onRefresh?.();
                return;
              }
              onAction?.(action);
            };

            return (
              <Button
                aria-label={actionLabels[action]}
                disabled={!enabled}
                key={action}
                onClick={handleClick}
                size="small"
                sx={{
                  '&.Mui-disabled': { opacity: 0.35 },
                  minWidth: 0,
                  px: 1,
                  textTransform: 'none',
                }}
                variant={action === 'NEW' && enabled ? 'outlined' : 'text'}
              >
                {actionLabels[action]}
              </Button>
            );
          })}
        </Box>

        <Divider flexItem orientation="vertical" sx={{ mx: 0.375 }} />
        <Button
          aria-haspopup="menu"
          disabled
          size="small"
          sx={{ '&.Mui-disabled': { opacity: 0.35 }, textTransform: 'none' }}
        >
          Record actions ▾
        </Button>

        <Box sx={{ flex: 1 }} />
        <Button
          onClick={onFilter}
          size="small"
          sx={{ '&.Mui-disabled': { opacity: 0.35 }, textTransform: 'none' }}
        >
          Filter
        </Button>
        <Button
          onClick={onSort}
          size="small"
          sx={{ '&.Mui-disabled': { opacity: 0.35 }, textTransform: 'none' }}
        >
          Sort
        </Button>
        <Button
          onClick={onRecordInfo}
          size="small"
          sx={{ '&.Mui-disabled': { opacity: 0.35 }, textTransform: 'none' }}
        >
          Record info
        </Button>
        {pagination ? (
          <TablePagination
            aria-label={`${title} pagination`}
            component="div"
            count={pagination.rowCount}
            onPageChange={(_, page) => pagination.onPageChange(page)}
            page={pagination.page}
            rowsPerPage={pagination.pageSize}
            rowsPerPageOptions={[]}
            sx={{
              flexShrink: 0,
              overflow: 'visible',
              '& .MuiTablePagination-actions': { ml: 0.5 },
              '& .MuiTablePagination-displayedRows': {
                fontFamily: 'inherit',
                fontSize: '0.8125rem',
                lineHeight: 1.75,
                m: 0,
              },
              '& .MuiTablePagination-spacer': { display: 'none' },
              '& .MuiTablePagination-toolbar': { minHeight: 30, p: 0 },
            }}
          />
        ) : null}
      </Box>
    </Box>
  );
};

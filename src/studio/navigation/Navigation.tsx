import {
  ChevronRight,
  Close,
  ExpandMore,
  Menu as MenuIcon,
  Search,
} from '@mui/icons-material';
import {
  Box,
  Collapse,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState, type ReactElement } from 'react';

import { getNavigationIcon } from '@/studio/navigation/navigation.icons';
import type { NavigationItem } from '@/studio/navigation/model/navigation-item';
import { brand } from '@/theme/brand';
import type { WorkspaceTarget } from '@/workspace/model/workspace-target';

interface NavigationProps {
  activeScreenId: string;
  isLoading: boolean;
  items: NavigationItem[];
  onCollapse: () => void;
  onOpenTarget: (target: WorkspaceTarget, label: string) => void;
}

const filterItems = (items: NavigationItem[], search: string): NavigationItem[] => {
  if (!search) return items;

  return items.reduce<NavigationItem[]>((result, item) => {
    const children = item.children ? filterItems(item.children, search) : undefined;
    const matches = `${item.label} ${item.description} ${item.key}`.toLocaleLowerCase().includes(search);
    if (matches || children?.length) result.push({ ...item, children });
    return result;
  }, []);
};

const MenuTree = ({
  activeScreenId,
  items,
  onOpenTarget,
  openGroups,
  setOpenGroups,
}: {
  activeScreenId: string;
  items: NavigationItem[];
  onOpenTarget: (target: WorkspaceTarget, label: string) => void;
  openGroups: Set<string>;
  setOpenGroups: (value: Set<string>) => void;
}): ReactElement => (
  <List dense disablePadding>
    {items.map((item) => {
      const isGroup = Boolean(item.children?.length);
      const isOpen = openGroups.has(item.key);
      const isActive = item.target?.screenId === activeScreenId;

      return (
        <Box key={item.key}>
          <ListItemButton
            disabled={item.disabled}
            onClick={() => {
              if (isGroup) {
                const next = new Set(openGroups);
                isOpen ? next.delete(item.key) : next.add(item.key);
                setOpenGroups(next);
              } else if (item.target) {
                onOpenTarget(item.target, item.label);
              }
            }}
            selected={isActive}
            sx={{ borderRadius: 1, color: 'grey.300', mb: 0.5, pl: 1.5, '&.Mui-selected': { bgcolor: 'rgba(198,106,37,.28)', color: 'white' }, '&:hover': { bgcolor: 'rgba(255,255,255,.08)' } }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
              {getNavigationIcon(item.key, item.target?.screenId)}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              slotProps={{
                primary: { sx: { fontSize: 13, fontWeight: isActive ? 700 : 500 } },
              }}
            />
            {isGroup ? (isOpen ? <ExpandMore fontSize="small" /> : <ChevronRight fontSize="small" />) : null}
          </ListItemButton>
          {isGroup ? (
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <Box sx={{ pl: 2 }}>
                <MenuTree activeScreenId={activeScreenId} items={item.children ?? []} onOpenTarget={onOpenTarget} openGroups={openGroups} setOpenGroups={setOpenGroups} />
              </Box>
            </Collapse>
          ) : null}
        </Box>
      );
    })}
  </List>
);

export const Navigation = ({
  activeScreenId,
  isLoading,
  items,
  onCollapse,
  onOpenTarget,
}: NavigationProps): ReactElement => {
  const [search, setSearch] = useState('');
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
  const filteredItems = useMemo(() => filterItems(items, search.trim().toLocaleLowerCase()), [items, search]);

  useEffect(() => {
    setOpenGroups(new Set(items.filter((item) => item.children?.length).map((item) => item.key)));
  }, [items]);

  return (
    <Box component="aside" sx={{ bgcolor: '#21130d', color: 'white', display: 'flex', flexDirection: 'column', height: '100vh', p: 2, width: 280 }}>
      <Box sx={{ alignItems: 'center', display: 'flex', gap: 1.25 }}>
        <Box alt="Fitly" component="img" src={brand.logo.icon} sx={{ bgcolor: 'white', borderRadius: 1, height: 36, width: 36 }} />
        <Box sx={{ minWidth: 0 }}>
          <Typography noWrap sx={{ fontWeight: 700, textTransform: 'uppercase' }} variant="body2">{brand.platformName}</Typography>
          <Typography color="grey.400" noWrap variant="caption">{brand.workspaceName}</Typography>
        </Box>
        <IconButton aria-label="Hide workspace menu" onClick={onCollapse} sx={{ color: 'grey.300', ml: 'auto' }}><MenuIcon /></IconButton>
      </Box>
      <TextField
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Tim kiem menu"
        size="small"
        sx={{ mt: 2, '& .MuiInputBase-root': { bgcolor: 'rgba(255,255,255,.08)', color: 'white' } }}
        value={search}
        slotProps={{
          htmlInput: { 'aria-label': 'Search workspace menu' },
          input: {
            endAdornment: search ? <InputAdornment position="end"><IconButton aria-label="Clear search" onClick={() => setSearch('')} size="small" sx={{ color: 'grey.400' }}><Close /></IconButton></InputAdornment> : undefined,
            startAdornment: <InputAdornment position="start"><Search sx={{ color: 'grey.400' }} /></InputAdornment>,
          },
        }}
      />
      <Box className="workspace-scrollbar" component="nav" sx={{ flex: 1, mt: 2, overflowY: 'auto' }} aria-label="Workspace menu">
        {isLoading ? Array.from({ length: 6 }, (_, index) => <Skeleton key={index} sx={{ bgcolor: 'rgba(255,255,255,.12)', mb: 1 }} variant="rounded" height={40} />) : null}
        {!isLoading && filteredItems.length === 0 ? <Typography color="grey.400" sx={{ p: 1 }} variant="body2">Khong tim thay menu</Typography> : null}
        <MenuTree activeScreenId={activeScreenId} items={filteredItems} onOpenTarget={onOpenTarget} openGroups={openGroups} setOpenGroups={setOpenGroups} />
      </Box>
    </Box>
  );
};

import { Box, Button, Drawer, TextField, Typography } from '@mui/material';
import type { ReactElement } from 'react';

import styles from '@/studio/section/components/grid/grid-section.module.css';

export const GridFilterDrawer = ({
  gridTitle,
  onApply,
  onChangeSearch,
  onClear,
  onClose,
  open,
  searchValue,
}: {
  gridTitle: string;
  onApply: () => void;
  onChangeSearch: (value: string) => void;
  onClear: () => void;
  onClose: () => void;
  open: boolean;
  searchValue: string;
}): ReactElement => (
  <Drawer anchor="right" onClose={onClose} open={open}>
    <Box className={styles.filterContent}>
      <Typography component="h2" variant="h3">Tim kiem &amp; Loc</Typography>
      <TextField
        label="Search"
        onChange={(event) => onChangeSearch(event.target.value)}
        slotProps={{ htmlInput: { 'aria-label': `${gridTitle} search` } }}
        value={searchValue}
      />
      <Box className={styles.filterActions}>
        <Button onClick={onClear}>Xoa</Button>
        <Button onClick={onApply} variant="contained">Ap dung</Button>
      </Box>
    </Box>
  </Drawer>
);

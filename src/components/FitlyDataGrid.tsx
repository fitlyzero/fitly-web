import { DataGrid, type DataGridProps } from '@mui/x-data-grid';
import type { ReactElement } from 'react';

export const FitlyDataGrid = (props: DataGridProps): ReactElement => (
  <DataGrid
    density="compact"
    disableRowSelectionOnClick
    pageSizeOptions={[10, 25, 50]}
    {...props}
    sx={{
      bgcolor: 'background.paper',
      borderColor: 'divider',
      minHeight: 320,
      '& .MuiDataGrid-columnHeaderTitle': { fontSize: 12, fontWeight: 700 },
      '& .MuiDataGrid-cell': { fontSize: 12 },
      ...props.sx,
    }}
  />
);

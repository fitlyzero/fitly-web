import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';

export const appTheme = createTheme({
  palette: {
    background: {
      default: '#eef2f5',
      paper: '#ffffff',
    },
    primary: {
      dark: '#6f2f0d',
      light: '#c66a25',
      main: '#8a3d12',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    button: {
      fontWeight: 600,
      letterSpacing: 0,
      textTransform: 'none',
    },
    fontFamily:
      '"IBM Plex Sans", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    h1: {
      fontSize: '1.875rem',
      fontWeight: 600,
      letterSpacing: 0,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: 0,
    },
    h3: {
      fontSize: '1.125rem',
      fontWeight: 600,
      letterSpacing: 0,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          minHeight: 36,
        },
      },
    },
    MuiDataGrid: {
      defaultProps: {
        density: 'compact',
        disableRowSelectionOnClick: true,
      },
      styleOverrides: {
        root: {
          borderColor: '#e2e8f0',
        },
        columnHeaders: {
          backgroundColor: '#f8fafc',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: 14,
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: '#334155',
          fontSize: 14,
          fontWeight: 600,
          lineHeight: 1.4,
          '&.Mui-disabled': {
            color: '#94a3b8',
          },
          '&.Mui-focused': {
            color: '#334155',
          },
        },
      },
    },
    MuiInputLabel: {
      defaultProps: {
        shrink: true,
      },
      styleOverrides: {
        root: {
          marginBottom: 3,
          maxWidth: '100%',
          pointerEvents: 'auto',
          position: 'static',
          transform: 'none',
          transformOrigin: 'top left',
          transition: 'none',
          '&.MuiInputLabel-filled, &.MuiInputLabel-outlined, &.MuiInputLabel-shrink, &.MuiInputLabel-sizeSmall, &.MuiInputLabel-standard': {
            maxWidth: '100%',
            transform: 'none',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          '& legend': {
            maxWidth: 0,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
  },
});

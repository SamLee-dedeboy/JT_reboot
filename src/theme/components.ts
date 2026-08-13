import type { Components, Theme } from '@mui/material/styles'
import { palette } from './palette'

export const components: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: {
      body: { backgroundColor: palette.brand.base, color: palette.common.white },
      '*::selection': { backgroundColor: palette.translucent.primaryGreen },
    },
  },
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 999,
        paddingInline: theme.spacing(3),
        paddingBlock: theme.spacing(1.4),
        transition: 'transform 180ms ease, background-color 180ms ease, box-shadow 180ms ease',
        [theme.breakpoints.down('md')]: {
          paddingInline: theme.spacing(2.5),
          paddingBlock: theme.spacing(1.2),
        },
        '&:hover': { transform: 'translateY(-1px)' },
      }),
    },
  },
  MuiContainer: {
    styleOverrides: {
      root: ({ theme }) => ({
        [theme.breakpoints.down('md')]: {
          paddingLeft: theme.spacing(3),
          paddingRight: theme.spacing(3),
        },
      }),
    },
  },
  MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
  MuiCard: { styleOverrides: { root: { backgroundColor: palette.surface } } },
  MuiLink: {
    styleOverrides: {
      root: { textDecorationColor: 'currentColor', textUnderlineOffset: '0.15em' },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 999,
        transition: 'transform 180ms ease, background-color 180ms ease',
        [theme.breakpoints.down('md')]: { padding: theme.spacing(1) },
        '&:hover': { transform: 'translateY(-1px)' },
      }),
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: palette.base[500],
        boxShadow: `0 2px 8px ${palette.translucent.blackShadow}`,
        position: 'sticky',
        top: 0,
        zIndex: 99,
      },
    },
  },
  MuiToolbar: {
    styleOverrides: {
      root: ({ theme }) => ({
        minHeight: 'unset !important',
        padding: theme.spacing(1.2, 2.5),
        [theme.breakpoints.up('sm')]: { minHeight: 'unset !important' },
        [theme.breakpoints.down('md')]: {
          minHeight: 'unset !important',
          padding: theme.spacing(0.9, 1.5),
        },
      }),
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundColor: palette.base[500],
        borderRadius: 6,
        boxShadow: `0 8px 24px ${palette.translucent.blackShadow}`,
        minWidth: 240,
        paddingBlock: theme.spacing(0.5),
      }),
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundColor: palette.base[500],
        color: theme.palette.common.white,
      }),
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.common.white,
        ...theme.typography.meta,
        '&:hover': {
          backgroundColor: palette.translucent.primaryGreen,
          color: theme.palette.secondary.main,
        },
      }),
    },
  },
}

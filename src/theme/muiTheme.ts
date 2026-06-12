import { createTheme } from '@mui/material/styles';
import type { CSSProperties } from 'react';

/* 
 * 1. Colors
 */

export const palette = {
  brand: {
    base: "#253439",
    primaryBlue: "#51a2bd",
    primaryGreen: "#7ed957",
  },
  common: {
    white: "#f2f0ef",
    black: "#1a1a1a",
  },
  accent: {
    blue: "#79e1e4",
    orange: "#f77c3b",
    yellow: "#f2c820",
    purple: "#b280ff",
    pink: "#ff677d",
  },
  base: {
    50: "#e9ebeb",
    100: "#bbc0c2",
    200: "#9ba2a4",
    300: "#6d777a",
    400: "#515d61",
    500: "#253439",
    600: "#222f34",
    700: "#1a2528",
    800: "#141d1f",
    900: "#101618",
  },
  surface:  "rgba(81, 93, 97, 0.3)", // 400 with 30% opacity, can be used for cards and surfaces
  surfaceStrong: "#39474B", // 400 with 45% opacity,card hover fill 
  footerBg: "#343c40",
}

/* 
 * 2. Spacing
 */

export const jtSpacing = {
    component: {
        xs: 1,
        sm: 1.5,
        md: 2.5,
        lg: 3.5,
        xl: 5,
    },
    section:{
        xs: 3,
        sm: 4.5,
        md: 6,
        lg: 9,
        xl: 12,
    },
    gap: {
        xs: 1,
        sm: 1.5,
        md: 2.5,
        lg: 3,
        xl: 4,
    },
    page: {
        x: {
            xs: 6,
            sm: 8, 
            md: 10,
        },
        y: {
            xs: 4,
            md: 6,
        }
    },
    paragraphMaxWidth: {
        default: '70ch',
        compact: '40ch',
    }
}

/* 
 * 3. Fonts and typography
 */
const fontHeading= '"Hammersmith One", sans-serif';
const fontBody = '"Nunito Sans", "Proxima Nova", "Helvetica Neue", Arial, sans-serif';

export const numbering = {
  color: {
    primary: palette.brand.primaryGreen,
    ghost: palette.base[100],
  },
  grid: {
    inlineTemplate: '1.85rem minmax(0, 1fr)',
    inlineGap: '0.65rem',
  },
  badge: {
    size: '1.9rem',
    border: '1px solid rgba(126,217,87,0.4)',
    radius: '999px',
  },
  article: {
    width: { xs: 'auto', sm: '2.4rem' },
  },
} as const;


/* 
 * 4. Theme
 */

//TODO: decide the dark and light colors

const themeOptions = {
    cssVariables: true,
    // Force dark mode - prevent auto-switching based on prefers-color-scheme
    colorSchemes: {light: false, dark: true},
    breakpoints: {
        values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1920,
        },
    },
    palette: {
      mode: 'dark',
      ...palette,
      secondary: {
        main: palette.brand.primaryBlue,
        dark: '#2f6f85',
        light: '#8bc4d4',
        contrastText: palette.common.white,
      },
      primary: {
        main: palette.brand.primaryGreen,
        light: '#b9ec9a',
        contrastText: palette.common.black,
      },
      background: {
        default: palette.brand.base,
        paper: palette.base[200],
      },
      text: {
        primary: palette.common.white,
      },
      info: {
        main: palette.brand.primaryBlue,
      },
      success: {
        main: palette.brand.primaryGreen,
      },
      divider: palette.base[400],
    },
    shape: {
        borderRadius: 8,
    },
    jtSpacing,
    numbering,
    typography: {
        fontFamily: fontBody,
        h1: {
            fontFamily: fontHeading,
            fontSize: 'clamp(3.6rem, 1.5rem + 4vw, 5rem)',
            lineHeight: 1.2,
            fontWeight: 300,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
        },
        h2: {
            fontFamily: fontHeading,
            fontSize: 'clamp(2rem, 3vw, 3.3rem)',
            lineHeight: 1.08,
            letterSpacing: '0.01em',
            textTransform: 'uppercase',
        },
        h3: {
            fontFamily: fontBody,
            fontSize: 'clamp(1.5rem, 2vw, 2rem)',
            lineHeight: 1.12,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
        },
        h4: {
            fontFamily: fontHeading,
            fontSize: 'clamp(1.4rem, 1.4vw, 1.7rem)',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
        },
        h5: {
            fontFamily: fontBody,
            fontSize: 'clamp(1rem, 0.7rem + 0.5vw, 1.05rem)',
            lineHeight: 1.2,
            fontWeight: 800,
        },
        body1: {
            fontSize: 'clamp(1.08rem, 0.95rem + 0.35vw, 1.25rem)',
            lineHeight: 1.75,
        },
        body2: {
            fontSize: 'clamp(0.98rem, 0.9rem + 0.28vw, 1.1rem)',
            lineHeight: 1.6,
            color: palette.base[100],
        },
        caption: {
            fontSize: 'clamp(0.98rem, 0.85rem + 0.35vw, 1.15rem)',
            lineHeight: 1,
            color: palette.base[100],
        },
        captionSmall: {
            fontSize: 'clamp(0.9rem, 0.7rem + 0.16vw, 1.05rem)',
            lineHeight: 1.2,
            color: palette.base[100],
        },
        button: {
            fontFamily: fontHeading,
            fontWeight: 300,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontSize: 'clamp(1rem, 0.9rem + 0.3vw, 1.15rem)',
        },
        eyebrow: {
            fontFamily: fontHeading,
            fontSize: 'clamp(0.78rem, 0.7rem + 0.2vw, 0.85rem)',
            lineHeight: 1.2,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: palette.brand.primaryGreen,
        },
        logo: {
            fontFamily: fontHeading,
            fontSize: 'clamp(1.2rem, 2vw, 2.1rem)',
            lineHeight: 1,
            fontWeight: 400,
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            color: palette.brand.primaryGreen,
        },
        logoSubtitle: {
            fontFamily: fontBody,
            fontSize: 'clamp(1rem, 1.2vw, 1.2rem)',
            lineHeight: 1,
            letterSpacing: '0.03em',
            color: palette.brand.primaryGreen,
        },
        logoHero: {
            fontFamily: fontHeading,
            fontSize: 'clamp(2.65rem, 1.5rem + 4vw, 4.7rem)',
            lineHeight: 0.95,
            fontWeight: 300,
            letterSpacing: '0.015em',
            textTransform: 'uppercase',
            color: palette.common.white,
        },
        numberGhost: {
            fontFamily: fontHeading,
            fontSize: 'clamp(1.8rem, 1.4rem + 1vw, 2.2rem)',
            lineHeight: 1,
            letterSpacing: '0.04em',
            color: numbering.color.ghost,
        },
        numberArticle: {
            fontFamily: fontHeading,
            fontSize: 'clamp(0.95rem, 0.85rem + 0.3vw, 1.1rem)',
            lineHeight: 1,
            letterSpacing: '0.06em',
            color: numbering.color.primary,
        },
        numberTimeline: {
            fontFamily: fontHeading,
            fontSize: 'clamp(2.2rem, 4vw, 3rem)',
            lineHeight: 1,
            letterSpacing: '0.04em',
            color: numbering.color.primary,
        },
        numberBadge: {
            fontFamily: fontHeading,
            fontSize: 'clamp(0.8rem, 0.72rem + 0.2vw, 0.9rem)',
            lineHeight: 1,
            letterSpacing: '0.08em',
            color: numbering.color.primary,
        },
    },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: palette.brand.base,
          color: palette.common.white,
        },
        '*::selection': {
          backgroundColor: 'rgba(126, 217, 87, 0.35)',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
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
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        }),
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          [theme.breakpoints.down('md')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
          },
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: palette.surface,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecorationColor: 'currentColor',
          textUnderlineOffset: '0.15em',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 999,
          transition: 'transform 180ms ease, background-color 180ms ease',
          [theme.breakpoints.down('md')]: {
            padding: theme.spacing(1),
          },
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        }),
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: () => ({
          backgroundColor: palette.base[500],
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          position: 'sticky',
          top: 0,
          zIndex: 99,
        }),
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: ({ theme }) => ({
          minHeight: 'unset !important',
          paddingLeft: theme.spacing(2.5),
          paddingRight: theme.spacing(2.5),
          paddingTop: theme.spacing(1.2),
          paddingBottom: theme.spacing(1.2),
          [theme.breakpoints.up('sm')]: {
            minHeight: 'unset !important',
          },
          [theme.breakpoints.down('md')]: {
            minHeight: 'unset !important',
            paddingLeft: theme.spacing(1.5),
            paddingRight: theme.spacing(1.5),
            paddingTop: theme.spacing(0.9),
            paddingBottom: theme.spacing(0.9),
          },
        }),
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: palette.base[500],
          borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          minWidth: 240,
          paddingTop: theme.spacing(0.5),
          paddingBottom: theme.spacing(0.5),
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
          color: 'white',
          fontSize: '0.95rem',
          '&:hover': {
            backgroundColor: 'rgba(126,217,87,0.08)',
            color: theme.palette.secondary.main,
          },
        }),
      },
    },
  },
} as Parameters<typeof createTheme>[0] & { jtSpacing: typeof jtSpacing; numbering: typeof numbering };


const theme = createTheme(themeOptions);

declare module '@mui/material/styles' {
  interface TypographyVariants {
    captionSmall: CSSProperties;
    eyebrow: CSSProperties;
    logo: CSSProperties;
    logoSubtitle: CSSProperties;
    logoHero: CSSProperties;
    numberGhost: CSSProperties;
    numberArticle: CSSProperties;
    numberTimeline: CSSProperties;
    numberBadge: CSSProperties;
  }

  interface TypographyVariantsOptions {
    captionSmall?: CSSProperties;
    eyebrow?: CSSProperties;
    logo?: CSSProperties;
    logoSubtitle?: CSSProperties;
    logoHero?: CSSProperties;
    numberGhost?: CSSProperties;
    numberArticle?: CSSProperties;
    numberTimeline?: CSSProperties;
    numberBadge?: CSSProperties;
  }

  interface Theme {
    jtSpacing: typeof jtSpacing;
    numbering: typeof numbering;
  }

  interface ThemeOptions {
    jtSpacing?: Theme['jtSpacing'];
    numbering?: Theme['numbering'];
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    captionSmall: true;
    eyebrow: true;
    logo: true;
    logoSubtitle: true;
    logoHero: true;
    numberGhost: true;
    numberArticle: true;
    numberTimeline: true;
    numberBadge: true;
  }
}

export default theme;

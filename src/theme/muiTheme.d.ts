import type { CSSProperties } from 'react';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    captionSmall: CSSProperties;
    eyebrow: CSSProperties;
    logo: CSSProperties;
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
    logoHero?: CSSProperties;
    numberGhost?: CSSProperties;
    numberArticle?: CSSProperties;
    numberTimeline?: CSSProperties;
    numberBadge?: CSSProperties;
  }

  interface Palette {
    translucent: {
      primaryGreen: string;
      textShadow: string;
    };
  }

  interface PaletteOptions {
    translucent?: {
      primaryGreen?: string;
      textShadow?: string;
    };
  }

  interface Theme {
    jtSpacing: {
      component: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
      };
      section: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
      };
      gap: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
      };
      page: {
        x: {
          xs: number;
          sm: number;
          md: number;
        };
        y: {
          xs: number;
          md: number;
        };
      };
      paragraphMaxWidth: {
        default: string;
        compact: string;
      };
    };
    numbering: {
      color: {
        primary: string;
        ghost: string;
      };
      grid: {
        inlineTemplate: string;
        inlineGap: string;
      };
      badge: {
        size: string;
        border: string;
        radius: string;
      };
      article: {
        width: {
          xs: string;
          sm: string;
        };
      };
    };
    highlighter: {
      defaultColor: string;
      vibrancy: {
        subtle: number;
        balanced: number;
        vibrant: number;
      };
    };
    navigation: {
      desktopButtonMinWidth: number;
      activeBorder: string;
      activeBackground: string;
      menuPanelBackground: string;
      drawerPanelBackground: string;
      panelBorder: string;
      dropdownShadow: string;
      drawerShadow: string;
    };
    logoWordmark: {
      desktopMinWidth: number;
      containerLineHeight: number;
      fontSize: {
        mobile: string;
        tablet: string;
        desktop: {
          md: string;
          lg: string;
        };
      };
      footerFontSize: string;
    };
  }

  interface ThemeOptions {
    jtSpacing?: Theme['jtSpacing'];
    numbering?: Theme['numbering'];
    highlighter?: Theme['highlighter'];
    navigation?: Theme['navigation'];
    logoWordmark?: Theme['logoWordmark'];
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    captionSmall: true;
    eyebrow: true;
    logo: true;
    logoHero: true;
    numberGhost: true;
    numberArticle: true;
    numberTimeline: true;
    numberBadge: true;
  }
}

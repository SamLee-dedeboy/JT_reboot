declare module '@mui/material/styles' {
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
  }

  interface ThemeOptions {
    jtSpacing?: Theme['jtSpacing'];
  }
}

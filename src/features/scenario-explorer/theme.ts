import type { SystemStyleObject, Theme } from '@mui/system';
import { palette as sitePalette } from '../../theme/muiTheme';

export const explorerPalette = {
  pink: '#fb0169',
  teal: '#77d6d7',
  white: sitePalette.common.white,
  green: sitePalette.brand.primaryGreen,
  blue: sitePalette.brand.primaryBlue,
  base100: sitePalette.base[100],
  base300: sitePalette.base[300],
  base400: sitePalette.base[400],
  base500: sitePalette.base[500],
  base700: sitePalette.base[700],
  base900: sitePalette.base[900],
} as const;

export const scenarioNameSx: SystemStyleObject<Theme> = {
  typography: 'button',
};

// Central icon adapter that maps project icon names to MUI icon components.
// Keeps call sites stable while the underlying icon library can change.
import { useId, type CSSProperties } from 'react';
import type { SvgIconComponent } from '@mui/icons-material';
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import WavesRoundedIcon from '@mui/icons-material/WavesRounded';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';

export type IconName =
  | 'arrow-down'
  | 'arrow-right'
  | 'arrow-up-right'
  | 'chevron-down'
  | 'plus'
  | 'mail'
  | 'drop'
  | 'sun'
  | 'waves'
  | 'compass'
  | 'users'
  | 'layers';

interface IconProps {
  name: IconName;
  size?: number;
  stroke?: string;
  strokeWidth?: number;
  style?: CSSProperties;
}

const icons: Record<IconName, SvgIconComponent> = {
  'arrow-down': ArrowDownwardRoundedIcon,
  'arrow-right': ArrowForwardRoundedIcon,
  'arrow-up-right': ArrowOutwardRoundedIcon,
  'chevron-down': ExpandMoreRoundedIcon,
  plus: AddRoundedIcon,
  mail: MailOutlineRoundedIcon,
  drop: WaterDropOutlinedIcon,
  sun: WbSunnyRoundedIcon,
  waves: WavesRoundedIcon,
  compass: ExploreOutlinedIcon,
  users: GroupsOutlinedIcon,
  layers: LayersOutlinedIcon,
};

export default function Icon({
  name,
  size = 22,
  stroke = 'currentColor',
  style,
}: IconProps) {
  const MuiIcon = icons[name];

  return (
    <MuiIcon
      aria-hidden
      sx={{
        width: size,
        height: size,
        fontSize: size,
        color: stroke,
        display: 'inline-block',
        flex: 'none',
      }}
      style={style}
    />
  );
}

export function FloodplainTileIcon({
  size = 22,
  sx,
}: {
  size?: number;
  sx?: SxProps<Theme>;
}) {
  const maskId = useId().replace(/:/g, '');

  return (
    <Box
      component="svg"
      viewBox="0 0 64 64"
      sx={{ width: size, height: size, display: 'block', ...sx }}
      aria-hidden
      focusable="false"
    >
      <defs>
        <mask id={maskId}>
          <rect x="6" y="6" width="52" height="52" rx="3" fill="white" />
          <path
            d="M38 7 C54 14 50 26 35 24 C18 22 15 34 31 37 C47 40 45 53 26 57"
            fill="none"
            stroke="black"
            strokeWidth="8.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </mask>
      </defs>
      <rect x="6" y="6" width="52" height="52" rx="3" fill="currentColor" mask={`url(#${maskId})`} />
    </Box>
  );
}

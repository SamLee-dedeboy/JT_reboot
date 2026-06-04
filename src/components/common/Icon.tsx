import type { CSSProperties } from 'react';

export type IconName =
  | 'arrow-down'
  | 'arrow-right'
  | 'arrow-up-right'
  | 'chevron-down'
  | 'plus'
  | 'mail'
  | 'drop'
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

/**
 * Minimal inline stroke icons, ported from the design prototype's `Icon`
 * primitive so geometry matches the handoff exactly.
 */
export default function Icon({
  name,
  size = 22,
  stroke = 'currentColor',
  strokeWidth = 1.6,
  style,
}: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    style,
    'aria-hidden': true,
  };
  switch (name) {
    case 'arrow-down':
      return (<svg {...common}><path d="M12 5v14M6 13l6 6 6-6" /></svg>);
    case 'arrow-right':
      return (<svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
    case 'arrow-up-right':
      return (<svg {...common}><path d="M7 17L17 7M9 7h8v8" /></svg>);
    case 'chevron-down':
      return (<svg {...common}><path d="M6 9l6 6 6-6" /></svg>);
    case 'plus':
      return (<svg {...common}><path d="M12 5v14M5 12h14" /></svg>);
    case 'mail':
      return (<svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>);
    case 'drop':
      return (<svg {...common}><path d="M12 3c3.5 4 6 7 6 10a6 6 0 1 1-12 0c0-3 2.5-6 6-10z" /></svg>);
    case 'waves':
      return (<svg {...common}><path d="M2 7c2 0 2 1.5 4 1.5S10 7 12 7s2 1.5 4 1.5S20 7 22 7" /><path d="M2 12c2 0 2 1.5 4 1.5S10 12 12 12s2 1.5 4 1.5S20 12 22 12" /><path d="M2 17c2 0 2 1.5 4 1.5S10 17 12 17s2 1.5 4 1.5S20 17 22 17" /></svg>);
    case 'compass':
      return (<svg {...common}><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></svg>);
    case 'users':
      return (<svg {...common}><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3 3-5 6-5s6 2 6 5" /><path d="M16 6a3 3 0 0 1 0 5" /><path d="M21 20c0-2.5-1.6-4.2-4-4.8" /></svg>);
    case 'layers':
      return (<svg {...common}><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5" /></svg>);
    default:
      return null;
  }
}

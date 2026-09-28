export const fontHeading = '"Hammersmith One", sans-serif'
export const fontBody = '"Nunito Sans Variable", "Nunito Sans", "Helvetica Neue", Arial, sans-serif'

/** Touchscreen sizing shared by every regional-summary stage, including 4K displays. */
export const regionalSummarySizing = {
  headerHeight: '15dvh',
  contentHeight: '85dvh',
  pageInset: 'clamp(16px, 2vw, 80px)',
  sectionGap: 'clamp(12px, 1.25vw, 48px)',
  surfacePadding: 'clamp(20px, 1.5vw, 56px)',
  touchTarget: 'clamp(56px, 3.2vw, 96px)',
  compactTouchTarget: 'clamp(44px, 2.4vw, 72px)',
  controlIconSize: 'clamp(1.5rem, 1.2vw, 3rem)',
  prominentIconSize: 'clamp(1.8rem, 1.5vw, 3.75rem)',
  guideWidth: 'clamp(520px, 28vw, 900px)',
  welcomeWidth: 'clamp(600px, 32vw, 1040px)',
  projectIntroductionWidth: 'clamp(760px, 64vw, 1800px)',
  tutorialWidthMin: 680,
  tutorialWidthRatio: 0.32,
  tutorialWidthMax: 1120,
  tutorialEstimatedHeight: 360,
  previewWidth: 'clamp(520px, 27vw, 900px)',
  previewMinHeight: 'clamp(144px, 8vw, 240px)',
  previewPadding: 'clamp(18px, 1vw, 36px)',
  previewGap: 'clamp(12px, 0.7vw, 24px)',
  previewMarkerOffset: 72,
  previewViewportInsetRatio: 0.02,
  previewViewportInsetMin: 24,
  previewViewportInsetMax: 72,
  markerPinWidth: 'clamp(58px, 3.24vw, 101px)',
  markerPinHeight: 'clamp(77px, 4.32vw, 134px)',
  markerIconSize: 'clamp(25px, 1.44vw, 46px)',
  markerAccent: 'clamp(4px, 0.22vw, 8px)',
  chartAxisFontSize: 16,
  stationPointSize: 17,
  surroundingStationPointSize: 14,
} as const

export const regionalSummaryTypography = {
  pageTitle: {
    fontFamily: fontHeading,
    fontSize: 'clamp(2rem, 2.4vw, 6rem)',
    fontWeight: 500,
    letterSpacing: '0.035em',
    lineHeight: 1,
    textTransform: 'uppercase',
  },
  pagePrompt: {
    fontFamily: fontBody,
    fontSize: 'clamp(1.1rem, 1.35vw, 3rem)',
    fontWeight: 400,
    lineHeight: 1.35,
  },
  instruction: {
    fontFamily: fontBody,
    fontSize: 'clamp(1.05rem, 1vw, 2.15rem)',
    fontWeight: 400,
    lineHeight: 1.35,
  },
  scenarioNumber: {
    fontFamily: fontHeading,
    fontSize: 'clamp(1rem, 0.95vw, 2rem)',
    fontWeight: 500,
    letterSpacing: '0.08em',
    lineHeight: 1,
    textTransform: 'uppercase',
  },
  scenarioTitle: {
    fontFamily: fontBody,
    fontSize: 'clamp(1.8rem, 2vw, 4.5rem)',
    letterSpacing: '0.035em',
    lineHeight: 1.1,
    textTransform: 'uppercase',
  },
  mapQuestion: {
    fontFamily: fontBody,
    fontSize: 'clamp(1.5rem, 1.7vw, 3.6rem)',
    letterSpacing: '0.035em',
    lineHeight: 1.1,
    textTransform: 'uppercase',
  },
  regionTitle: {
    fontFamily: fontBody,
    fontSize: 'clamp(1.65rem, 1.55vw, 3.25rem)',
    letterSpacing: '0.035em',
    lineHeight: 1.12,
    fontWeight: 500,
    textTransform: 'uppercase',
  },
  scenarioSummary: {
    fontFamily: fontBody,
    fontSize: 'clamp(1.15rem, 1.15vw, 2.4rem)',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  projectSectionTitle: {
    fontFamily: fontHeading,
    fontSize: 'clamp(1.15rem, 1.05vw, 2.25rem)',
    fontWeight: 500,
    letterSpacing: '0.04em',
    lineHeight: 1.15,
    textTransform: 'uppercase',
  },
  projectBody: {
    fontFamily: fontBody,
    fontSize: 'clamp(1.05rem, 1vw, 2.1rem)',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  action: {
    fontFamily: fontBody,
    fontSize: 'clamp(1rem, 1vw, 2rem)',
    fontWeight: 700,
    letterSpacing: '0.015em',
    lineHeight: 1.2,
  },
  markerLabel: {
    fontFamily: fontBody,
    fontSize: 'clamp(1.05rem, 0.95vw, 1.9rem)',
    fontWeight: 700,
    letterSpacing: '0.015em',
    lineHeight: 1,
  },
  timelineLabel: {
    fontFamily: fontBody,
    fontSize: 'clamp(0.8rem, 0.75vw, 1.5rem)',
    fontWeight: 700,
    lineHeight: 1.2,
  },
} as const

/** Typography used only by the detailed evidence view. */
export const regionalSummaryDetailTypography = {
  eyebrow: {
    fontFamily: fontHeading,
    fontSize: 'clamp(1rem, 0.85vw, 1.8rem)',
    fontWeight: 500,
    letterSpacing: '0.08em',
    lineHeight: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: fontBody,
    fontSize: 'clamp(1.7rem, 1.7vw, 3.6rem)',
    letterSpacing: '0.025em',
    lineHeight: 1.1,
    textTransform: 'uppercase',
  },
  lead: {
    fontFamily: fontBody,
    fontSize: 'clamp(1.05rem, 0.9vw, 1.9rem)',
    fontWeight: 400,
    lineHeight: 1.35,
  },
  sectionTitle: {
    fontFamily: fontBody,
    fontSize: 'clamp(1.15rem, 1.05vw, 2.25rem)',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  body: {
    fontFamily: fontBody,
    fontSize: 'clamp(1rem, 0.9vw, 1.9rem)',
    fontWeight: 400,
    lineHeight: 1.45,
  },
  supporting: {
    fontFamily: fontBody,
    fontSize: 'clamp(0.9rem, 0.75vw, 1.55rem)',
    fontWeight: 400,
    lineHeight: 1.35,
  },
  action: {
    fontFamily: fontBody,
    fontSize: 'clamp(1rem, 0.85vw, 1.75rem)',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  timelineLabel: {
    fontFamily: fontBody,
    fontSize: 'clamp(0.8rem, 0.72vw, 1.45rem)',
    fontWeight: 700,
    lineHeight: 1.2,
  },
} as const

export const regionalSummaryControlStyles = {
  primaryTouchButton: {
    ...regionalSummaryTypography.action,
    minHeight: regionalSummarySizing.touchTarget,
    px: 'clamp(16px, 1.5vw, 48px)',
    borderWidth: '4px',
    fontWeight: 800,
    '& .MuiButton-startIcon, & .MuiButton-endIcon': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      lineHeight: 0,
    },
    '& .MuiButton-startIcon': {
      ml: 0,
      mr: 'clamp(10px, 0.65vw, 24px)',
    },
    '& .MuiButton-endIcon': {
      ml: 'clamp(10px, 0.65vw, 24px)',
      mr: 0,
    },
    '& .MuiButton-startIcon > *:nth-of-type(1), & .MuiButton-endIcon > *:nth-of-type(1)': {
      fontSize: regionalSummarySizing.controlIconSize,
      display: 'block',
      flexShrink: 0,
    },
    '& [data-testid="ArrowBackIcon"], & [data-testid="ArrowForwardIcon"]': {
      fontSize: `${regionalSummarySizing.prominentIconSize} !important`,
    },
  },
  compactTouchButton: {
    ...regionalSummaryTypography.action,
    minHeight: regionalSummarySizing.compactTouchTarget,
    px: 'clamp(12px, 1vw, 32px)',
    '& .MuiButton-startIcon, & .MuiButton-endIcon': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      lineHeight: 0,
    },
    '& .MuiButton-startIcon': {
      ml: 0,
      mr: 'clamp(10px, 0.65vw, 24px)',
    },
    '& .MuiButton-endIcon': {
      ml: 'clamp(10px, 0.65vw, 24px)',
      mr: 0,
    },
    '& .MuiButton-startIcon > *:nth-of-type(1), & .MuiButton-endIcon > *:nth-of-type(1)': {
      fontSize: regionalSummarySizing.controlIconSize,
      display: 'block',
      flexShrink: 0,
    },
    '& [data-testid="ArrowBackIcon"], & [data-testid="ArrowForwardIcon"]': {
      fontSize: `${regionalSummarySizing.prominentIconSize} !important`,
    },
  },
} as const

export const regionalSummaryTimelineStyles = {
  contextBar: {
    position: 'absolute',
    minWidth: 76,
    top: 84,
    height: 40,
    bgcolor: 'brand.primaryBlue',
    overflow: 'visible',
  },
  contextLabel: {
    ...regionalSummaryDetailTypography.timelineLabel,
    position: 'absolute',
    top: 4,
    zIndex: 1,
    width: 'max-content',
    maxWidth: 'none',
    minHeight: 32,
    px: 1,
    display: 'flex',
    alignItems: 'center',
    color: 'common.white',
    bgcolor: 'base.900',
    border: 2,
    borderColor: 'brand.primaryBlue',
    whiteSpace: 'nowrap',
    fontWeight: 800,
  },
} as const

export const regionalSummaryTutorialStyles = {
  card: {
    bgcolor: 'base.800',
    border: 1,
    borderColor: 'primary.main',
  },
  promotionCard: {
    bgcolor: 'base.700',
    border: 4,
    borderColor: 'primary.main',
  },
  promotionTitle: {
    color: 'brand.primaryBlue',
  },
} as const

/**
 * Global row/column composition for the detailed regional-pattern view.
 * Change these named areas to rearrange the page without editing its components.
 */
export const regionalSummaryDetailGrid = {
  page: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    gridTemplateRows: `${regionalSummarySizing.headerHeight} ${regionalSummarySizing.contentHeight}`,
    gridTemplateAreas: '"header" "detail"',
    height: '100dvh',
    overflow: 'hidden',
  },
  header: {
    gridArea: 'header',
    display: 'grid',
    gridTemplateColumns: 'auto minmax(0, 1fr) auto',
    gridTemplateRows: 'minmax(0, 1fr)',
    alignItems: 'center',
    columnGap: regionalSummarySizing.sectionGap,
  },
  detail: {
    gridArea: 'detail',
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    gridTemplateRows: 'auto 45dvh minmax(0, 1fr)',
    gridTemplateAreas: '"timeline" "workspace" "regions"',
    gap: '1dvh',
    minHeight: 0,
    overflow: 'hidden',
  },
  timeline: {
    gridArea: 'timeline',
    display: 'grid',
    gridTemplateRows: 'auto minmax(0, 1fr)',
    minHeight: 0,
  },
  workspace: {
    gridArea: 'workspace',
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 0.8fr) minmax(0, 1.7fr)' },
    gridTemplateRows: 'minmax(0, 1fr)',
    gap: regionalSummarySizing.sectionGap,
    minHeight: 0,
  },
  map: {
    display: 'grid',
    gridTemplateRows: 'minmax(0, 1fr)',
    minWidth: 0,
    minHeight: 0,
  },
  patternDetails: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    gridTemplateRows: 'minmax(0, 1fr) auto',
    gap: regionalSummarySizing.sectionGap,
    minWidth: 0,
    minHeight: 0,
  },
  charts: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.45fr) minmax(0, 1fr)' },
    gridTemplateRows: 'minmax(0, 1fr)',
    gap: regionalSummarySizing.sectionGap,
    minWidth: 0,
    minHeight: 0,
  },
  interpretation: { minWidth: 0, minHeight: 0 },
  regions: { gridArea: 'regions', minHeight: 0, overflow: 'hidden' },
} as const

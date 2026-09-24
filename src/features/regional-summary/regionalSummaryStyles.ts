export const fontHeading = '"Hammersmith One", sans-serif'
export const fontBody = '"Nunito Sans", "Helvetica Neue", Arial, sans-serif'

/** Touchscreen sizing shared by every regional-summary stage, including 4K displays. */
export const regionalSummarySizing = {
  headerHeight: '15dvh',
  contentHeight: '85dvh',
  pageInset: 'clamp(16px, 2vw, 80px)',
  sectionGap: 'clamp(12px, 1.25vw, 48px)',
  surfacePadding: 'clamp(20px, 1.5vw, 56px)',
  touchTarget: 'clamp(56px, 3.2vw, 96px)',
  compactTouchTarget: 'clamp(44px, 2.4vw, 72px)',
  guideWidth: 'clamp(520px, 28vw, 900px)',
  welcomeWidth: 'clamp(600px, 32vw, 1040px)',
  previewWidth: 'clamp(440px, 24vw, 760px)',
  previewMinHeight: 'clamp(156px, 9vw, 280px)',
  markerPinWidth: 'clamp(48px, 2.7vw, 84px)',
  markerPinHeight: 'clamp(64px, 3.6vw, 112px)',
  markerIconSize: 'clamp(21px, 1.2vw, 38px)',
  markerAccent: 'clamp(4px, 0.22vw, 8px)',
  chartAxisFontSize: 16,
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
    textTransform: 'uppercase',
  },
  scenarioSummary: {
    fontFamily: fontBody,
    fontSize: 'clamp(1.15rem, 1.15vw, 2.4rem)',
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

export const regionalSummaryControlStyles = {
  primaryTouchButton: {
    ...regionalSummaryTypography.action,
    minHeight: regionalSummarySizing.touchTarget,
    px: 'clamp(16px, 1.5vw, 48px)',
  },
  compactTouchButton: {
    ...regionalSummaryTypography.action,
    minHeight: regionalSummarySizing.compactTouchTarget,
    px: 'clamp(12px, 1vw, 32px)',
  },
} as const

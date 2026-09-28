import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, Dialog, DialogContent, IconButton, Typography } from '@mui/material'
import {
  regionalSummaryControlStyles,
  regionalSummarySizing,
  regionalSummaryTypography,
} from './regionalSummaryStyles'

interface RegionalProjectIntroductionProps {
  open: boolean
  onClose: () => void
}

const introductionSections = [
  {
    title: 'Why this project',
    body: 'Just Transitions in the Delta explores equitable futures for water management in the Sacramento–San Joaquin Delta amid drought, salinity, and sea-level rise.',
  },
  {
    title: 'How it works',
    body: 'The project uses participatory scenario planning—a bottom-up process shaped through workshops, interviews, surveys, partnerships, exhibitions, and field work—to create and evaluate possible futures with Delta communities and public contributors.',
  },
  {
    title: 'What you can explore here',
    body: 'Compare six adaptation scenarios and see where modeled salinity patterns become saltier or fresher. The regional stories make the benefits, consequences, and tradeoffs of each possible future visible.',
  },
] as const

export default function RegionalProjectIntroduction({
  open,
  onClose,
}: RegionalProjectIntroductionProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="regional-project-introduction-title"
      maxWidth={false}
      slotProps={{
        backdrop: {
          sx: { bgcolor: 'translucent.800' },
        },
        paper: {
          sx: {
            width: regionalSummarySizing.projectIntroductionWidth,
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: 'calc(100dvh - 32px)',
            m: 2,
            bgcolor: 'base.900',
            color: 'common.white',
            border: 1,
            borderColor: 'primary.main',
            borderRadius: 0,
            boxShadow: 24,
          },
        },
      }}
    >
      <DialogContent
        sx={{
          p: regionalSummarySizing.surfacePadding,
          display: 'grid',
          gap: regionalSummarySizing.sectionGap,
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 2 }}>
          <Box>
            <Typography sx={{ ...regionalSummaryTypography.scenarioNumber, color: 'primary.main' }}>
              About the project
            </Typography>
            <Typography
              id="regional-project-introduction-title"
              component="h2"
              sx={{ ...regionalSummaryTypography.regionTitle, mt: 1.5 }}
            >
              Just Transitions in the Delta
            </Typography>
          </Box>
          <IconButton
            aria-label="Close project introduction"
            onClick={onClose}
            sx={{
              alignSelf: 'start',
              width: regionalSummarySizing.compactTouchTarget,
              height: regionalSummarySizing.compactTouchTarget,
              color: 'common.white',
              border: 1,
              borderColor: 'translucent.400',
              '& .MuiSvgIcon-root': {
                fontSize: regionalSummarySizing.controlIconSize,
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
            gap: regionalSummarySizing.sectionGap,
          }}
        >
          {introductionSections.map((section, index) => (
            <Box
              key={section.title}
              sx={{
                pt: 2,
                borderTop: 2,
                borderColor: index === 2 ? 'salinity.teal' : 'primary.main',
              }}
            >
              <Typography component="h3" sx={regionalSummaryTypography.projectSectionTitle}>
                {section.title}
              </Typography>
              <Typography sx={{ ...regionalSummaryTypography.projectBody, mt: 1.5 }}>
                {section.body}
              </Typography>
            </Box>
          ))}
        </Box>

        <Button
          variant="contained"
          onClick={onClose}
          sx={{ ...regionalSummaryControlStyles.primaryTouchButton, justifySelf: 'end' }}
        >
          Explore the scenarios
        </Button>
      </DialogContent>
    </Dialog>
  )
}

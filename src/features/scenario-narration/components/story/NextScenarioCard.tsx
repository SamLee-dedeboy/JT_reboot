// The end of a story below lg: the next adaptation scenario as a photo card, so a reader
// moves on without the scenario tabs, then the way back to every scenario.
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import type { ScenarioContent } from '@/content/scenarios'
import { jtSpacing } from '@/theme'
import { focusRing } from '@/ui/focusRing'
import { assetUrl } from '@/utils/baseUrl'

export default function NextScenarioCard({ next }: { next?: ScenarioContent }) {
  return (
    <Stack
      component="nav"
      aria-label="More scenarios"
      spacing={jtSpacing.gap.md}
      sx={{ mt: jtSpacing.section.lg }}
    >
      {next && (
        <>
          <Typography variant="eyebrow" component="h2" sx={{ color: 'base.100' }}>
            Next scenario
          </Typography>
          <Box
            component={Link}
            to={`/scenarios/${next.slug}`}
            sx={(theme) => ({
              position: 'relative',
              minHeight: 280,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              gap: jtSpacing.gap.xs,
              p: jtSpacing.component.lg,
              borderRadius: 5,
              overflow: 'hidden',
              color: 'common.white',
              textDecoration: 'none',
              backgroundImage: `linear-gradient(180deg, ${theme.palette.translucent[50]} 0%, ${theme.palette.translucent[500]} 45%, ${theme.palette.translucent[900]} 100%), url(${assetUrl(next.image)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              '&:focus-visible': focusRing,
              '& .next-arrow': { transition: 'transform 200ms ease' },
              '&:hover .next-arrow': { transform: 'translateX(3px)' },
            })}
          >
            <Box
              className="next-arrow"
              aria-hidden="true"
              sx={{
                position: 'absolute',
                top: jtSpacing.component.md,
                right: jtSpacing.component.md,
                width: 44,
                height: 44,
                display: 'grid',
                placeItems: 'center',
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: 'common.black',
              }}
            >
              <ArrowForwardIcon sx={{ width: 20, height: 20 }} />
            </Box>
            <Typography variant="numberArticle" component="span">
              {next.number}
            </Typography>
            <Typography variant="h3" component="span">
              {next.title}
            </Typography>
            <Typography variant="body1" component="span" sx={{ color: 'base.50' }}>
              {next.summary}
            </Typography>
          </Box>
        </>
      )}
      <Button
        component={Link}
        to="/scenarios"
        startIcon={<ArrowBackIcon />}
        sx={{ alignSelf: 'flex-start', color: 'common.white' }}
      >
        All scenarios
      </Button>
    </Stack>
  )
}

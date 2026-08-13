import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import CloseIcon from '@mui/icons-material/Close'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import type { SvgIconComponent } from '@mui/icons-material'
import { Box, Button, IconButton, Popover, Stack, Typography } from '@mui/material'
import Eyebrow from '../../../../../ui/Eyebrow'
import { palette } from '../../../../../theme/index'

export interface PlacePopoverProps {
  anchorEl: HTMLElement | null
  color?: string
  description: string
  icon: SvgIconComponent
  onClose: () => void
  onExplore?: () => void
  open: boolean
  placeName: string
  takeaway: string
}

function PlacePopover({
  anchorEl,
  color = palette.brand.primaryPink,
  description,
  icon: Icon,
  onClose,
  onExplore,
  open,
  placeName,
  takeaway,
}: PlacePopoverProps) {
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      marginThreshold={12}
      open={open}
      onClose={onClose}
      transformOrigin={{ horizontal: 'left', vertical: 'top' }}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: palette.base[800],
            backgroundImage: 'none',
            border: `1px solid ${palette.base[400]}`,
            borderRadius: 2.5,
            boxShadow: `0 18px 48px ${palette.translucent.textShadow}`,
            color: palette.common.white,
            maxHeight: 'calc(100dvh - 32px)',
            overflowY: 'auto',
            width: 'min(410px, calc(100vw - 32px))',
            ml: 0.5,
          },
        },
      }}
    >
      <Box
        onClick={(event) => event.stopPropagation()}
        sx={{ p: { xs: 2.5, sm: 3.5 }, position: 'relative' }}
      >
        <IconButton
          aria-label={`Close details for ${placeName}`}
          onClick={onClose}
          size="small"
          sx={{ color, position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', pr: 3, mb: 3 }}>
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: palette.common.white,
              border: `5px solid ${color}`,
              borderRadius: '50%',
              color,
              display: 'flex',
              flex: '0 0 auto',
              height: 48,
              justifyContent: 'center',
              width: 48,
            }}
          >
            <Icon sx={{ fontSize: 30 }} />
          </Box>
          <Typography
            component="h2"
            sx={{
              color,
              fontSize: { xs: 20, sm: 22 },
              fontWeight: 600,
              lineHeight: 1.1,
              textTransform: 'uppercase',
            }}
          >
            {placeName}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1.5} sx={{ mb: 2.5 }}>
          <ArticleOutlinedIcon sx={{ color, flex: '0 0 auto', mt: 2.25 }} />
          <Box>
            <Eyebrow sx={{ color, mb: 0.5 }}>Why this place</Eyebrow>
            <Typography sx={{ color: palette.base[50], fontSize: 16, lineHeight: 1.35 }}>
              {description}
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          spacing={1.5}
          sx={{ border: `1px solid ${color}`, borderRadius: 1.5, mb: 2.5, p: 2 }}
        >
          <LightbulbOutlinedIcon sx={{ color, flex: '0 0 auto' }} />
          <Box>
            <Eyebrow sx={{ color, mb: 0.75 }}>Key takeaways</Eyebrow>
            <Typography sx={{ color: palette.base[100], fontSize: 15.5, lineHeight: 1.4 }}>
              {takeaway}
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            aria-label={`Explore ${placeName}`}
            onClick={onExplore}
            startIcon={<PlayArrowRoundedIcon />}
            variant="contained"
            sx={{
              backgroundColor: color,
              boxShadow: `0 8px 24px ${palette.translucent.primaryPink}`,
              color: palette.base[900],
              fontWeight: (theme) => theme.typography.fontWeightBold,
              minHeight: 48,
              minWidth: { xs: '100%', sm: 140 },
              px: 2.25,
              '&:hover': {
                backgroundColor: color,
                boxShadow: `0 10px 30px ${palette.translucent.primaryPink}`,
                filter: 'brightness(1.12)',
              },
            }}
          >
            Explore
          </Button>
        </Box>
      </Box>
    </Popover>
  )
}

export default PlacePopover

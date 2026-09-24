// On/off switch repeated in JT_dashboard/src/lib/Sunburst/Sunburst.svelte and
// SunburstGrid.svelte (`bind:checked` → checked + onChange). An MUI Switch
// restyled to the original 48x24 slider geometry and 300ms slide.
import { Switch } from '@mui/material'

interface SliderToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export default function SliderToggle({ checked, onChange, label }: SliderToggleProps) {
  return (
    <Switch
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      disableRipple
      slotProps={{ input: { 'aria-label': label } }}
      sx={(theme) => {
        const toggle = theme.coDesign.sunburst.toggle
        const transition = theme.transitions.create(['transform', 'background-color'], {
          duration: toggle.durationMs,
          easing: theme.transitions.easing.easeInOut,
        })
        return {
          width: toggle.width,
          height: toggle.height,
          p: 0,
          flexShrink: 0,
          overflow: 'visible',
          '& .MuiSwitch-switchBase': {
            p: 0,
            top: toggle.inset,
            left: toggle.inset,
            color: toggle.thumbColor,
            transition,
            '&:hover': { bgcolor: 'transparent' },
            '&.Mui-checked': {
              color: toggle.thumbColor,
              transform: `translateX(${toggle.travel}px)`,
              '&:hover': { bgcolor: 'transparent' },
            },
            '&.Mui-checked + .MuiSwitch-track': { bgcolor: toggle.trackOn, opacity: 1 },
            '&.Mui-focusVisible + .MuiSwitch-track': {
              outline: `2px solid ${toggle.focusRing}`,
              outlineOffset: 2,
            },
          },
          '& .MuiSwitch-thumb': {
            width: toggle.thumb,
            height: toggle.thumb,
            bgcolor: toggle.thumbColor,
            boxShadow: 'none',
          },
          '& .MuiSwitch-track': {
            borderRadius: `${toggle.height / 2}px`,
            bgcolor: toggle.trackOff,
            opacity: 1,
            transition,
          },
        }
      }}
    />
  )
}

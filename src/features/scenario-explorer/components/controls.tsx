// The explorer's compact controls: one height, one label style, and the pill tray and chips
// from the ranking pages' vocabulary, so the controls stay quiet beside the visualizations.
import { useId, type ReactNode } from 'react'
import { Box, FormControl, IconButton, Select, Typography } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material/Select'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { explorerControl } from '../../../theme'
import { useCompactExplorer } from '../explorerType'
import { smallIconSx, selectMenuProps } from './controlStyles'

export function InfoButton({
  label,
  onClick,
}: {
  label: string
  onClick: (button: HTMLButtonElement) => void
}) {
  return (
    <IconButton
      aria-label={label}
      onClick={(event) => onClick(event.currentTarget)}
      size="small"
      sx={{ ...smallIconSx, color: 'text.secondary', p: 0.25 }}
    >
      <InfoOutlinedIcon />
    </IconButton>
  )
}

/** A control's one-line label, with its info and other small actions riding beside it. */
export function ControlLabel({
  children,
  id,
  inline = false,
  label,
}: {
  children?: ReactNode
  id?: string
  /** Sits beside its value instead of above it. */
  inline?: boolean
  label: string
}) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        gap: 0.25,
        height: explorerControl.labelHeight,
        mb: inline ? 0 : 0.5,
        minWidth: 0,
      }}
    >
      <Typography id={id} component="span" variant="chartTitle" noWrap>
        {label}
      </Typography>
      {children}
    </Box>
  )
}

interface LabeledSelectProps {
  children: ReactNode
  disabled?: boolean
  label: string
  onChange: (event: SelectChangeEvent<string>) => void
  onInfoClick?: (button: HTMLButtonElement) => void
  infoLabel?: string
  value: string
  tourId?: string
  displayValue?: string
  compactValue?: string
  /** Its width in the compact layout, where other fields fit their values. */
  fixedBasis?: string
}

export function LabeledSelect({
  children,
  compactValue,
  disabled = false,
  displayValue,
  fixedBasis,
  infoLabel,
  label,
  onChange,
  onInfoClick,
  tourId,
  value,
}: LabeledSelectProps) {
  const labelId = useId()
  const compact = useCompactExplorer()
  // A scenario's role carries a color; the region is a plain filter, so it stays white.
  const roleColor =
    label === 'Scenario' || label.startsWith('Map') || /^Selected (Scenario|Model)/.test(label)
      ? 'brand.primaryGreen'
      : label.startsWith('Base')
        ? 'brand.primaryBlue'
        : null

  return (
    <FormControl
      data-tour={tourId}
      size="small"
      sx={{
        flex: compact ? `0 1 ${fixedBasis ?? 'auto'}` : `1 1 ${explorerControl.fieldBasis}`,
        minWidth: 0,
      }}
    >
      <ControlLabel id={labelId} label={label}>
        {onInfoClick && <InfoButton label={infoLabel ?? `About ${label}`} onClick={onInfoClick} />}
      </ControlLabel>
      <Select
        disabled={disabled}
        labelId={labelId}
        MenuProps={selectMenuProps}
        value={value}
        onChange={onChange}
        startAdornment={
          roleColor ? (
            <Box
              aria-hidden
              sx={{
                bgcolor: roleColor,
                borderRadius: '50%',
                flex: '0 0 auto',
                height: explorerControl.dotSize,
                ml: explorerControl.fieldInline,
                width: explorerControl.dotSize,
              }}
            />
          ) : undefined
        }
        renderValue={
          compactValue
            ? () => (
                <Box
                  component="span"
                  sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  <Box component="span" sx={{ display: { xs: 'none', xl: 'inline' } }}>
                    {displayValue ?? value}
                  </Box>
                  <Box component="span" sx={{ display: { xs: 'inline', xl: 'none' } }}>
                    {compactValue}
                  </Box>
                </Box>
              )
            : undefined
        }
        sx={{
          bgcolor: 'base.800',
          borderRadius: explorerControl.fieldRadius,
          height: explorerControl.height,
          transition: 'background-color 160ms ease',
          '&:hover': { bgcolor: 'base.900' },
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'border.strong' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'base.200' },
          '& .MuiSelect-icon': { color: 'text.secondary' },
          '& .MuiSelect-select': {
            typography: 'controlValue',
            color: roleColor ?? 'common.white',
            display: 'block',
            minWidth: 0,
            overflow: 'hidden',
            pl: roleColor ? 0.75 : explorerControl.fieldInline,
            py: 0,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }}
      >
        {children}
      </Select>
    </FormControl>
  )
}

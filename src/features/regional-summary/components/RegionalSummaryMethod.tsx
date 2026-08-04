import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Box, Chip, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface RegionalSummaryMethodProps {
  open: boolean
  onClose: () => void
}

const Step = ({ number, title, children }: { number: string; title: string; children: ReactNode }) => (
  <Box sx={(theme) => ({ display: 'grid', gap: theme.jtSpacing.gap.sm, gridTemplateColumns: '32px minmax(0, 1fr)' })}>
    <Box aria-hidden sx={{ alignItems: 'center', bgcolor: 'base.600', borderRadius: '50%', color: 'base.100', display: 'flex', height: 32, justifyContent: 'center', typography: 'captionSmall', width: 32 }}>{number}</Box>
    <Box>
      <Typography component="h3" variant="button" sx={{ color: 'base.50' }}>{title}</Typography>
      <Typography component="div" variant="caption" sx={{ color: 'base.100', mt: 0.5 }}>{children}</Typography>
    </Box>
  </Box>
)

const Key = ({ children }: { children: ReactNode }) => <Box component="span" sx={{ color: 'brand.primaryGreen', fontWeight: 500 }}>{children}</Box>

export default function RegionalSummaryMethod({ open, onClose }: RegionalSummaryMethodProps) {
  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} aria-labelledby="regional-method-title" slotProps={{ paper: { sx: { bgcolor: 'base.800', backgroundImage: 'none', maxHeight: 'calc(100dvh - 48px)' } } }}>
      <DialogTitle id="regional-method-title" sx={(theme) => ({ alignItems: 'start', borderBottom: 1, borderColor: 'divider', display: 'flex', gap: theme.jtSpacing.gap.md, justifyContent: 'space-between', pb: theme.jtSpacing.component.md })}>
        <Box>
          <Typography component="h2" variant="h3">How the summaries are computed</Typography>
          <Typography component="p" variant="caption" sx={{ color: 'base.100', mt: 0.75 }}>A plain-language overview of the D-1641-inspired analytical screening method.</Typography>
        </Box>
        <IconButton aria-label="Close method explanation" onClick={onClose} size="small"><CloseRoundedIcon /></IconButton>
      </DialogTitle>
      <DialogContent sx={(theme) => ({ display: 'grid', gap: theme.jtSpacing.section.sm, pt: `${theme.jtSpacing.component.lg} !important` })}>
        <Box sx={(theme) => ({ display: 'grid', gap: theme.jtSpacing.gap.lg, mt: theme.jtSpacing.component.sm })}>
          <Step number="1" title="Pair daily station values">For each place and date, the calculation uses only stations that have values in both the selected scenario and Business as Usual. It averages those paired values and calculates the <Key>daily regional difference</Key>.</Step>
          <Step number="2" title="Use a region-appropriate time window">The daily differences are smoothed using the time statistic that best matches the place's <Key>D-1641</Key> context. This makes short-lived noise less likely to become a report.</Step>
          <Step number="3" title="What counts as a report">Regional evidence requires a rolling change of at least <Key>50 µS/cm or 10%</Key>, at least <Key>70% of days</Key> moving in the same direction, and at least <Key>60% station agreement</Key>.</Step>
          <Step number="4" title="Build exact report periods">Adjacent <Key>qualifying days moving in the same direction</Key> are joined into one report. <Key>Exact dates</Key> come from the daily evidence; month names are used only to make the summary sentence easier to read.</Step>
        </Box>

        <Box sx={(theme) => ({ display: 'grid', gap: theme.jtSpacing.gap.md })}>
          <Box>
            <Typography component="h3" variant="h4">The D-1641 objectives behind the method</Typography>
            <Typography component="p" variant="caption" sx={{ color: 'base.100', mt: 0.75 }}>D-1641 regulates electrical conductivity at <Key>specific compliance locations</Key> using <Key>averages over time</Key>. Those objective structures inform our regional screening windows; they are context, not a claim of compliance.</Typography>
          </Box>
          <Box sx={(theme) => ({ display: 'grid', gap: theme.jtSpacing.gap.sm, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' } })}>
            <Box sx={(theme) => ({ borderTop: 1, borderColor: 'divider', pt: theme.jtSpacing.component.sm })}>
              <Typography variant="button">Western and interior Delta</Typography>
              <Typography component="p" variant="caption" sx={{ color: 'base.100', mt: 0.5 }}>Maximum <Key>14-day running average</Key> of mean daily EC. Agricultural objectives begin at <Key>450 µS/cm on April 1</Key>; later-season values vary by location and water-year type.</Typography>
            </Box>
            <Box sx={(theme) => ({ borderTop: 1, borderColor: 'divider', pt: theme.jtSpacing.component.sm })}>
              <Typography variant="button">Southern Delta</Typography>
              <Typography component="p" variant="caption" sx={{ color: 'base.100', mt: 0.5 }}>Maximum <Key>30-day running average</Key>: <Key>700 µS/cm from April through August</Key> and <Key>1,000 µS/cm from September through March</Key> at the named compliance locations.</Typography>
            </Box>
            <Box sx={(theme) => ({ borderTop: 1, borderColor: 'divider', pt: theme.jtSpacing.component.sm })}>
              <Typography variant="button">Export-area locations</Typography>
              <Typography component="p" variant="caption" sx={{ color: 'base.100', mt: 0.5 }}>Maximum <Key>monthly average</Key> of mean daily EC, with a <Key>1,000 µS/cm objective</Key> throughout the year at the named intake locations.</Typography>
            </Box>
            <Box sx={(theme) => ({ borderTop: 1, borderColor: 'divider', pt: theme.jtSpacing.component.sm })}>
              <Typography variant="button">Bay and Suisun context</Typography>
              <Typography component="p" variant="caption" sx={{ color: 'base.100', mt: 0.5 }}>Bay regions use regional evidence only. Suisun objectives require monthly averages of daily high-tide EC, which this modeled dataset does not contain, so no numeric Suisun objective is applied.</Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={(theme) => ({ bgcolor: 'base.700', borderRadius: 1, display: 'grid', gap: theme.jtSpacing.gap.md, p: theme.jtSpacing.component.md })}>
          <Typography component="h3" variant="h4">How the regional window changes</Typography>
          <Box sx={(theme) => ({ display: 'grid', gap: theme.jtSpacing.gap.md, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' } })}>
            <Box><Chip label="14-day rolling" size="small" /><Typography variant="caption" component="p" sx={{ color: 'base.100', mt: 0.75 }}>Most <Key>non-Bay, non-Suisun regions</Key>. Timing is D-1641-inspired; a numeric objective is included only where a represented objective location exists.</Typography></Box>
            <Box><Chip label="30-day rolling" size="small" /><Typography variant="caption" component="p" sx={{ color: 'base.100', mt: 0.75 }}><Key>Southern Delta and export-area regions</Key>, reflecting the longer averaging periods used in their D-1641 context.</Typography></Box>
            <Box><Chip label="Daily regional" size="small" /><Typography variant="caption" component="p" sx={{ color: 'base.100', mt: 0.75 }}><Key>Bay regions</Key> use <Key>region-wide evidence only</Key>. They do not make station-level D-1641 hotspot claims.</Typography></Box>
            <Box><Chip label="Daily directional" size="small" /><Typography variant="caption" component="p" sx={{ color: 'base.100', mt: 0.75 }}><Key>Suisun regions</Key> are screened directionally. Numeric objectives are not applied because the model does not contain the required <Key>daily high-tide EC</Key>.</Typography></Box>
          </Box>
        </Box>

        <Box sx={(theme) => ({ borderLeft: 3, borderColor: 'brand.primaryGreen', pl: theme.jtSpacing.component.md })}>
          <Typography component="h3" variant="button" sx={{ color: 'brand.primaryGreen' }}>Important interpretation</Typography>
          <Typography component="p" variant="caption" sx={{ color: 'base.100', mt: 0.5 }}>These are analytical screening results, not regulatory compliance determinations. D-1641 informs the <Key>averaging window, timing, and objective context</Key>. It does not make every modeled station an official compliance station.</Typography>
        </Box>

        <Box sx={(theme) => ({ display: 'grid', gap: theme.jtSpacing.gap.sm })}>
          <Typography component="h3" variant="h4">What “strongest signal” means</Typography>
          <Typography component="p" variant="caption" sx={{ color: 'base.100' }}>The interface marks a report as strongest when its <Key>largest absolute rolling daily deviation is greater than 700 µS/cm</Key>. The map's recommended <Key>450 µS/cm OR 10%</Key> controls are an <Key>additional display filter</Key>; they do not change how the underlying reports were calculated.</Typography>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

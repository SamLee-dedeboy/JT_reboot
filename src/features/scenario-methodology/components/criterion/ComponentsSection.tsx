import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import {
  Box,
  Button,
  ButtonBase,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { jtSpacing } from '@/theme'
import { NumberedHeading, StageChip } from '@/ui'
import { type StoryTable } from '@/content/criteria'
import { CitedText } from './citations'
import CaveatsPanel from './CaveatsPanel'
import { type SectionProps, methodologyTextColumnSx, sectionSx } from './criterionLayout'

const COUNT_WORDS: Record<number, string> = { 3: 'three', 4: 'four' }

export default function ComponentsSection({ story, accent }: SectionProps) {
  const { intro, items } = story.components
  const [active, setActive] = useState(0)
  const item = items[active]
  const [lead, ...details] = item.spec

  return (
    <Box component="section" id="components" aria-labelledby="components-title" sx={sectionSx}>
      <NumberedHeading
        variant="h3"
        title="What are the components of this criterion?"
        id="components-title"
        accent={accent}
      />
      {intro && (
        <Typography
          variant="body1"
          sx={{ ...methodologyTextColumnSx, color: 'base.100', whiteSpace: 'pre-line' }}
        >
          {intro}
        </Typography>
      )}
      <Typography
        variant="body1"
        sx={{
          ...methodologyTextColumnSx,
          mt: intro ? jtSpacing.gap.sm : jtSpacing.gap.xs,
          color: 'base.100',
        }}
      >
        This criterion has {COUNT_WORDS[items.length] ?? items.length} components. Select one to see
        how it is measured.
      </Typography>

      <Box
        sx={{
          mt: jtSpacing.gap.lg,
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: `repeat(${items.length % 2 ? items.length : 2}, minmax(0, 1fr))`,
            lg: `repeat(${items.length}, minmax(0, 1fr))`,
          },
          gap: jtSpacing.gap.sm,
        }}
      >
        {items.map((component, index) => (
          <ComponentCard
            key={component.name}
            number={index + 1}
            name={component.name}
            summary={component.summary}
            selected={index === active}
            accent={accent}
            onSelect={() => setActive(index)}
          />
        ))}
      </Box>

      <Box
        id="component-panel"
        role="region"
        aria-label={item.name}
        sx={{ pt: jtSpacing.section.sm }}
      >
        <Box
          sx={{
            pb: jtSpacing.gap.lg,
            borderBottom: 1,
            borderColor: 'border.subtle',
          }}
        >
          <Typography component="p" variant="navigationSubLabel" sx={{ color: accent }}>
            {lead.label}
          </Typography>
          <Typography
            component="p"
            variant="editorialEmphasis"
            sx={{ ...methodologyTextColumnSx, mt: 0.5, color: 'base.50' }}
          >
            {lead.value}
          </Typography>
          <Box component="dl" sx={{ m: 0, mt: jtSpacing.gap.sm }}>
            {details.map((row, index) => (
              <Box
                key={row.label}
                sx={{
                  ...methodologyTextColumnSx,
                  mt: index ? jtSpacing.gap.xs : 0,
                  display: 'grid',
                  gridTemplateColumns: '5em minmax(0, 1fr)',
                  alignItems: 'baseline',
                }}
              >
                <Typography component="dt" variant="navigationSubLabel" sx={{ color: 'base.200' }}>
                  {row.label}
                </Typography>
                <Typography component="dd" variant="body2" sx={{ m: 0, color: 'base.100' }}>
                  {row.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* The ordered method, with its caveats always in view beside it */}
        <Box
          sx={{
            mt: jtSpacing.gap.lg,
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: item.caveats ? 'minmax(0, 7fr) minmax(0, 5fr)' : '1fr',
            },
            gap: { xs: jtSpacing.gap.lg, md: jtSpacing.section.sm },
            alignItems: 'start',
          }}
        >
          <Box>
            <Typography variant="navigationLabel" component="h3">
              Method
            </Typography>
            <Box
              component="ol"
              sx={{
                ...(item.caveats ? {} : methodologyTextColumnSx),
                m: 0,
                p: 0,
                mt: jtSpacing.gap.sm,
                listStyle: 'none',
              }}
            >
              {item.method.map((step, index) => (
                <Box
                  component="li"
                  key={step}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '28px minmax(0, 1fr)',
                    columnGap: jtSpacing.gap.sm,
                    alignItems: 'baseline',
                    py: jtSpacing.component.sm,
                    borderTop: 1,
                    borderColor: 'border.subtle',
                  }}
                >
                  <Typography variant="h4" component="span" sx={{ color: accent }}>
                    {index + 1}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'base.100' }}>
                    <CitedText text={step} />
                  </Typography>
                </Box>
              ))}
            </Box>
            {item.link && (
              <Button
                component={Link}
                to={item.link.to}
                variant="contained"
                sx={{ mt: jtSpacing.gap.md }}
              >
                {item.link.label}
              </Button>
            )}
          </Box>

          {item.caveats && (
            <CaveatsPanel
              accent={accent}
              caveats={item.caveats.map((caveat) => ({
                key: caveat,
                content: <CitedText text={caveat} />,
              }))}
            />
          )}
        </Box>

        {item.tables?.map((table) => (
          <OptionalTable key={`${item.name}-${table.caption}`} table={table} accent={accent} />
        ))}
      </Box>
    </Box>
  )
}

/** A component as a numbered card; selecting it shows its details below the row. */
function ComponentCard({
  number,
  name,
  summary,
  selected,
  accent,
  onSelect,
}: {
  number: number
  name: string
  summary: string
  selected: boolean
  accent: string
  onSelect: () => void
}) {
  return (
    <ButtonBase
      onClick={onSelect}
      aria-pressed={selected}
      aria-controls="component-panel"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: jtSpacing.gap.sm,
        p: jtSpacing.component.md,
        textAlign: 'left',
        color: 'inherit',
        border: 1,
        borderColor: 'border.subtle',
        borderTop: 3,
        borderTopColor: selected ? accent : 'border.subtle',
        borderRadius: 1,
        bgcolor: selected ? alpha(accent, 0.1) : 'transparent',
        '&:hover': { bgcolor: selected ? alpha(accent, 0.1) : 'translucent.100' },
        '&.Mui-focusVisible': { outline: 2, outlineColor: accent, outlineOffset: 2 },
      }}
    >
      <Typography component="span" variant="statNumber" sx={{ color: accent }}>
        {number}
      </Typography>
      <Typography component="span" variant="h4" sx={{ color: 'base.50' }}>
        {name}
      </Typography>
      <Typography component="span" variant="body2" sx={{ color: 'base.100' }}>
        <CitedText text={summary} />
      </Typography>
    </ButtonBase>
  )
}

/** A component's data table, closed until asked for. */
function OptionalTable({ table, accent }: { table: StoryTable; accent: string }) {
  const [open, setOpen] = useState(false)

  return (
    <Box sx={{ mt: jtSpacing.gap.lg }}>
      <Button
        variant="outlined"
        startIcon={open ? <RemoveIcon /> : <AddIcon />}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        sx={{ color: accent, borderColor: 'border.subtle' }}
      >
        {table.caption}
      </Button>
      {open && <StoryDataTable table={table} accent={accent} />}
    </Box>
  )
}

function StoryDataTable({ table, accent }: { table: StoryTable; accent: string }) {
  return (
    <Box component="figure" aria-label={table.caption} sx={{ m: 0, mt: jtSpacing.gap.sm }}>
      <Box
        sx={{
          overflowX: 'auto',
          border: 1,
          borderColor: 'border.subtle',
          borderRadius: 1,
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: alpha(accent, 0.1) }}>
              {table.columns.map((column) => (
                <TableCell
                  key={column}
                  sx={{
                    typography: 'chartTitle',
                    color: 'base.50',
                    whiteSpace: 'nowrap',
                    borderBottom: 2,
                    borderBottomColor: accent,
                  }}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {table.rows.map((row) => (
              <TableRow
                key={row[0]}
                sx={{
                  '&:nth-of-type(even)': { bgcolor: 'translucent.100' },
                  '&:last-of-type td': { borderBottom: 0 },
                }}
              >
                {row.map((cell, index) => (
                  <TableCell
                    key={`${row[0]}-${table.columns[index]}`}
                    sx={{
                      typography: 'body2',
                      color: index ? 'base.100' : 'common.white',
                      verticalAlign: 'top',
                      borderColor: 'border.subtle',
                    }}
                  >
                    {index ? cell : <RowLabel text={cell} />}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  )
}

/** A row's first cell; a trailing life stage ("…, juvenile") becomes a pill, as in the breakout table. */
function RowLabel({ text }: { text: string }) {
  const match = /^(.*), (juvenile|adult)$/i.exec(text)
  if (!match) return text
  const stage = match[2].charAt(0).toUpperCase() + match[2].slice(1).toLowerCase()
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      {match[1]}
      <StageChip label={stage} plain />
    </Box>
  )
}

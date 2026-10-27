// Internal editor for the criterion copy in editorial/criteria-copy.json. Each field
// shows Claude's draft, GPT's draft, and a box for the user's final text, laid out
// in the same order as the criterion's summary and its page. Edits save to the file
// through the dev-server endpoint (vite/criteriaCopyPlugin.ts); the file is re-read
// every few seconds so a draft GPT or Claude writes meanwhile shows up here.
import {
  Box,
  Button,
  Chip,
  Stack,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { teamStyle, type EvaluationTeamId } from '../../features/scenarios/teamStyle'
import { jtSpacing, navigation } from '../../theme'
import PageLayout from '../PageLayout'
import ReportPassages from './ReportPassages'
import {
  COPY_ENDPOINT,
  COPY_FILE_PATH,
  sameText,
  type CopyColumn,
  type CopyEntry,
  type CopyFile,
  type CriterionSource,
} from './copyFile'

type SaveState = 'loading' | 'saved' | 'saving' | 'offline'
type Filter = 'all' | 'open' | 'apply'

interface Payload {
  file: CopyFile
  live: Record<string, string>
  sources: Record<string, CriterionSource>
}

const POLL_MS = 5000
const SAVE_DELAY_MS = 600

/** Where a field stands between the user's text and the site. */
function fieldStatus(entry: CopyEntry, live: string) {
  if (!entry.yours.trim()) return { label: 'No final text yet', tone: 'idle' as const }
  if (sameText(entry.yours, live)) return { label: 'On the site', tone: 'done' as const }
  return { label: 'To apply', tone: 'pending' as const }
}

export default function CriteriaCopyEditor() {
  const [payload, setPayload] = useState<Payload>()
  const [saveState, setSaveState] = useState<SaveState>('loading')
  const [filter, setFilter] = useState<Filter>('all')
  const [params, setParams] = useSearchParams()
  // Values typed but not yet confirmed by the server; polling never overwrites these.
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const latest = useRef<Record<string, string>>({})
  const timers = useRef(new Map<string, number>())

  const load = useCallback(async () => {
    try {
      const response = await fetch(COPY_ENDPOINT)
      if (!response.ok) throw new Error(String(response.status))
      setPayload(await response.json())
      setSaveState((state) => (state === 'saving' ? state : 'saved'))
    } catch {
      setSaveState('offline')
    }
  }, [])

  useEffect(() => {
    load()
    const interval = window.setInterval(load, POLL_MS)
    window.addEventListener('focus', load)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', load)
    }
  }, [load])

  const save = useCallback((key: string, column: CopyColumn, value: string) => {
    const id = `${key}:${column}`
    latest.current = { ...latest.current, [id]: value }
    setDrafts(latest.current)
    setSaveState('saving')
    window.clearTimeout(timers.current.get(id))
    timers.current.set(
      id,
      window.setTimeout(async () => {
        try {
          const response = await fetch(COPY_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, column, value }),
          })
          if (!response.ok) throw new Error(String(response.status))
          const next: Payload = await response.json()
          if (latest.current[id] === value) {
            const rest = { ...latest.current }
            delete rest[id]
            latest.current = rest
            setDrafts(rest)
          }
          setPayload(next)
          setSaveState(Object.keys(latest.current).length ? 'saving' : 'saved')
        } catch {
          setSaveState('offline')
        }
      }, SAVE_DELAY_MS),
    )
  }, [])

  const criteria = payload?.file.criteria ?? []
  const activeId = params.get('criterion') ?? criteria[0]?.id
  const criterion = criteria.find((candidate) => candidate.id === activeId) ?? criteria[0]
  const accent = criterion ? teamStyle[criterion.id as EvaluationTeamId]?.color : undefined

  const valueOf = (entry: CopyEntry, column: CopyColumn) =>
    drafts[`${entry.key}:${column}`] ?? entry[column]

  const visible = useMemo(() => {
    if (!criterion || !payload) return []
    return criterion.sections
      .map((section) => ({
        ...section,
        entries: section.entries.filter((entry) => {
          if (filter === 'all') return true
          const status = fieldStatus(entry, payload.live[entry.key] ?? '')
          return filter === 'open' ? status.tone === 'idle' : status.tone === 'pending'
        }),
      }))
      .filter((section) => section.entries.length)
  }, [criterion, payload, filter])

  return (
    <PageLayout title="Criteria copy" fullWidthContent plainContent>
      <Box sx={{ px: jtSpacing.page.x, pb: jtSpacing.section.lg }}>
        <Stack spacing={jtSpacing.gap.sm} sx={{ maxWidth: jtSpacing.paragraphMaxWidth.default }}>
          <Typography variant="body1" sx={{ color: 'base.100' }}>
            Each field shows Claude’s draft and GPT’s draft beside a box for your final text. Your
            text and notes save to <code>{COPY_FILE_PATH}</code> as you type. Claude or GPT then
            applies every “To apply” field to the site.
          </Typography>
          <SaveIndicator state={saveState} />
        </Stack>

        {criterion && payload && (
          <>
            <Box
              sx={{
                position: 'sticky',
                top: navigation.barHeight,
                zIndex: 2,
                mt: jtSpacing.component.lg,
                bgcolor: 'brand.base',
                borderBottom: 1,
                borderColor: 'border.subtle',
              }}
            >
              <Tabs
                value={criterion.id}
                onChange={(_, id: string) => setParams({ criterion: id }, { replace: true })}
                variant="scrollable"
                allowScrollButtonsMobile
                textColor="inherit"
                slotProps={{ indicator: { sx: { bgcolor: accent } } }}
              >
                {criteria.map((candidate) => (
                  <Tab key={candidate.id} value={candidate.id} label={candidate.label} />
                ))}
              </Tabs>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: 'minmax(200px, .22fr) minmax(0, 1fr)' },
                gap: { xs: jtSpacing.gap.lg, lg: jtSpacing.section.sm },
                alignItems: 'start',
                mt: jtSpacing.component.lg,
              }}
            >
              <Outline
                criterion={criterion}
                live={payload.live}
                filter={filter}
                onFilter={setFilter}
              />
              <Stack spacing={jtSpacing.section.sm} sx={{ minWidth: 0 }}>
                {visible.length === 0 && (
                  <Typography variant="body1" sx={{ color: 'base.200' }}>
                    No fields match this filter.
                  </Typography>
                )}
                {visible.map((section) => (
                  <Box
                    key={section.id}
                    component="section"
                    id={`${criterion.id}-${section.id}`}
                    sx={{ scrollMarginTop: navigation.pageRailTop }}
                  >
                    <Typography variant="eyebrow" component="p" sx={{ color: 'base.200' }}>
                      {section.page === 'evaluation' ? 'Evaluation page' : 'Criterion page'}
                    </Typography>
                    <Typography
                      variant="h3"
                      component="h2"
                      sx={{ color: accent, mt: jtSpacing.gap.xs }}
                    >
                      {section.label}
                    </Typography>
                    <ReportPassages source={payload.sources[criterion.id]} sectionId={section.id} />
                    <Stack spacing={jtSpacing.gap.lg} sx={{ mt: jtSpacing.component.md }}>
                      {section.entries.map((entry) => (
                        <FieldRow
                          key={entry.key}
                          entry={entry}
                          live={payload.live[entry.key] ?? ''}
                          accent={accent}
                          valueOf={valueOf}
                          onChange={save}
                        />
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>
          </>
        )}
      </Box>
    </PageLayout>
  )
}

function SaveIndicator({ state }: { state: SaveState }) {
  const text = {
    loading: 'Loading…',
    saved: 'All changes saved to the file',
    saving: 'Saving…',
    offline: 'Can’t reach the dev server. Run npm run dev; edits only save there.',
  }[state]
  return (
    <Typography
      variant="captionSmall"
      role="status"
      sx={{ color: state === 'offline' ? 'error.light' : 'base.200' }}
    >
      {text}
    </Typography>
  )
}

function Outline({
  criterion,
  live,
  filter,
  onFilter,
}: {
  criterion: CopyFile['criteria'][number]
  live: Record<string, string>
  filter: Filter
  onFilter: (filter: Filter) => void
}) {
  return (
    <Box
      component="nav"
      aria-label="Sections"
      sx={{ position: { lg: 'sticky' }, top: navigation.pageRailTop, userSelect: 'none' }}
    >
      <Typography variant="eyebrow" component="p" sx={{ color: 'base.200' }}>
        Show
      </Typography>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={filter}
        onChange={(_, value: Filter | null) => value && onFilter(value)}
        sx={{ mt: jtSpacing.gap.xs, flexWrap: 'wrap' }}
      >
        <ToggleButton value="all">All</ToggleButton>
        <ToggleButton value="open">No final text</ToggleButton>
        <ToggleButton value="apply">To apply</ToggleButton>
      </ToggleButtonGroup>

      <Typography
        variant="eyebrow"
        component="p"
        sx={{ color: 'base.200', mt: jtSpacing.component.lg }}
      >
        Structure
      </Typography>
      <Stack
        component="ol"
        spacing={jtSpacing.gap.xs}
        sx={{ m: 0, mt: jtSpacing.gap.xs, p: 0, listStyle: 'none' }}
      >
        {criterion.sections.map((section, index) => {
          const done = section.entries.filter((entry) => entry.yours.trim()).length
          const toApply = section.entries.filter(
            (entry) => fieldStatus(entry, live[entry.key] ?? '').tone === 'pending',
          ).length
          const pageStarts = index === 0 || criterion.sections[index - 1].page !== section.page
          return (
            <Box component="li" key={section.id}>
              {pageStarts && (
                <Typography
                  variant="captionSmall"
                  component="p"
                  sx={{ color: 'base.200', mt: index ? jtSpacing.gap.sm : 0, mb: jtSpacing.gap.xs }}
                >
                  {section.page === 'evaluation'
                    ? '/scenarios/evaluation'
                    : `/scenarios/evaluation/${criterion.id}`}
                </Typography>
              )}
              <Box
                component="a"
                href={`#${criterion.id}-${section.id}`}
                sx={{
                  display: 'block',
                  color: 'common.white',
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                <Typography variant="body2" component="span">
                  {section.label}
                </Typography>
                <Typography
                  variant="captionSmall"
                  component="span"
                  sx={{ display: 'block', color: 'base.200' }}
                >
                  {done}/{section.entries.length} final{toApply ? ` · ${toApply} to apply` : ''}
                </Typography>
              </Box>
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}

function FieldRow({
  entry,
  live,
  accent,
  valueOf,
  onChange,
}: {
  entry: CopyEntry
  live: string
  accent?: string
  valueOf: (entry: CopyEntry, column: CopyColumn) => string
  onChange: (key: string, column: CopyColumn, value: string) => void
}) {
  const yours = valueOf(entry, 'yours')
  const status = fieldStatus({ ...entry, yours }, live)
  const multiline = entry.kind !== 'line'

  return (
    <Box
      sx={{
        p: jtSpacing.component.md,
        bgcolor: 'base.800',
        borderLeft: 3,
        borderColor: status.tone === 'pending' ? accent : 'border.subtle',
      }}
    >
      <Stack
        direction="row"
        useFlexGap
        spacing={jtSpacing.gap.sm}
        sx={{ alignItems: 'center', flexWrap: 'wrap' }}
      >
        <Typography variant="navigationLabel" component="h3">
          {entry.label}
        </Typography>
        <Chip
          size="small"
          label={status.label}
          variant={status.tone === 'idle' ? 'outlined' : 'filled'}
          sx={{
            ...(status.tone === 'pending' &&
              accent && { bgcolor: alpha(accent, 0.24), color: 'common.white' }),
            ...(status.tone === 'done' && {
              bgcolor: 'translucent.primaryGreen',
              color: 'common.white',
            }),
          }}
        />
        {!live && (
          <Typography variant="captionSmall" sx={{ color: 'base.200' }}>
            Not on the site now
          </Typography>
        )}
      </Stack>
      <Typography
        variant="captionSmall"
        component="p"
        sx={{ color: 'base.200', mt: jtSpacing.gap.xs, overflowWrap: 'anywhere' }}
      >
        {entry.source}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
          gap: jtSpacing.gap.md,
          mt: jtSpacing.component.sm,
        }}
      >
        <Draft
          title="Claude"
          text={entry.claude}
          kind={entry.kind}
          onUse={() => onChange(entry.key, 'yours', entry.claude)}
        />
        <Draft
          title="GPT"
          text={entry.gpt}
          reference={entry.gptReference}
          kind={entry.kind}
          onUse={() => onChange(entry.key, 'yours', entry.gpt)}
        />
        <Stack spacing={jtSpacing.gap.xs}>
          <Typography variant="eyebrow" component="p" sx={{ color: accent }}>
            Yours
          </Typography>
          <TextField
            value={yours}
            onChange={(event) => onChange(entry.key, 'yours', event.target.value)}
            multiline={multiline}
            minRows={multiline ? 3 : undefined}
            placeholder={entry.kind === 'list' ? 'One item per line' : 'Your final text'}
            size="small"
            fullWidth
            slotProps={{ htmlInput: { 'aria-label': `${entry.label}: your text` } }}
          />
          <TextField
            value={valueOf(entry, 'note')}
            onChange={(event) => onChange(entry.key, 'note', event.target.value)}
            placeholder="Note for Claude or GPT (optional)"
            size="small"
            fullWidth
            slotProps={{ htmlInput: { 'aria-label': `${entry.label}: note` } }}
          />
        </Stack>
      </Box>
    </Box>
  )
}

function Draft({
  title,
  text,
  reference,
  kind,
  onUse,
}: {
  title: string
  text: string
  reference?: string
  kind: CopyEntry['kind']
  onUse: () => void
}) {
  return (
    <Stack spacing={jtSpacing.gap.xs} sx={{ minWidth: 0 }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="eyebrow" component="p" sx={{ color: 'base.200' }}>
          {title}
        </Typography>
        <Button size="small" onClick={onUse} disabled={!text.trim()}>
          Use this
        </Button>
      </Stack>
      {text.trim() ? (
        kind === 'list' ? (
          <Box component="ul" sx={{ m: 0, pl: jtSpacing.component.md }}>
            {text.split('\n').map((item, index) => (
              <Typography key={index} component="li" variant="body2" sx={{ color: 'base.100' }}>
                {item}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: 'base.100', whiteSpace: 'pre-wrap' }}>
            {text}
          </Typography>
        )
      ) : (
        <Typography variant="body2" sx={{ color: 'base.200', fontStyle: 'italic' }}>
          Not drafted yet
        </Typography>
      )}
      {reference?.trim() && (
        <Box component="details" sx={{ color: 'base.200' }}>
          <Typography
            component="summary"
            variant="captionSmall"
            sx={{ cursor: 'pointer', color: 'base.200' }}
          >
            Sources used
          </Typography>
          <Typography
            component="p"
            variant="captionSmall"
            sx={{ mt: jtSpacing.gap.xs, color: 'base.200', whiteSpace: 'pre-wrap' }}
          >
            {reference}
          </Typography>
        </Box>
      )}
    </Stack>
  )
}

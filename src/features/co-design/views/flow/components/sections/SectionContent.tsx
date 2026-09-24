// Column stack under a section header (the dashboard's global `.section-content`).
import { styled } from '@mui/material/styles'

const SectionContent = styled('div', {
  shouldForwardProp: (prop) => prop !== 'centered',
})<{ centered?: boolean }>(({ centered }) => ({
  display: 'flex',
  height: '100%',
  flexDirection: 'column',
  zIndex: 1,
  ...(centered && { alignItems: 'center', justifyContent: 'center' }),
}))

export default SectionContent

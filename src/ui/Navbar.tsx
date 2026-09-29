// Responsive top navigation with desktop dropdown menus and mobile drawer links.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
  Collapse,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Logo from './Logo'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { assetUrl } from '../utils/baseUrl'

interface DropdownItem {
  label: string
  href: string
  external?: boolean
  disabled?: boolean
}

interface NavItem {
  label: string
  caption?: string
  href?: string
  dropdown?: DropdownItem[]
  /** Disabled "coming soon" item — rendered greyed out, not navigable. */
  disabled?: boolean
}

const navItems: NavItem[] = [
  {
    label: 'Background',
    caption: 'Explore the project background and its approach to just transitions.',
    dropdown: [
      { label: 'A Delta in Transition', href: '#', disabled: true },
      { label: 'Participatory Scenario Planning', href: '#', disabled: true },
      { label: 'What Is a Just Transition?', href: '#', disabled: true },
    ],
  },
  {
    label: 'Co-Designing',
    caption: 'Explore the collaborative process, participant input, and workshop materials.',
    dropdown: [
      { label: 'Co-Design Dashboard', href: '/pages/co-design-dashboard' },
      { label: 'Participant Responses', href: '#', disabled: true },
      { label: 'Workshop Reports', href: '#', disabled: true },
    ],
  },
  {
    label: 'Future Scenarios',
    caption: 'Explore possible futures, modeling, evaluation, and scenario performance.',
    dropdown: [
      { label: 'Choose a Future', href: '/scenarios' },
      { label: 'Modeling & Evaluation', href: '/scenarios#outflow-variations' },
      { label: 'Performance & Ranking', href: '/scenarios#ranking-overview' },
    ],
  },
  {
    label: 'Resources',
    caption: 'Browse governance, project documentation, and related resources.',
    dropdown: [
      { label: 'Governance & Implementation', href: '#', disabled: true },
      { label: 'Project Documentation', href: '/pages/project-documentation' },
      { label: 'References & Related Projects', href: '/pages/resources' },
    ],
  },
  {
    label: 'Internal',
    caption: 'Project tools and design references for the team.',
    dropdown: [
      { label: 'Scenario Explorer', href: '/pages/scenario-explorer/internal' },
      { label: 'D-1641 Station Explorer', href: '/pages/scenario-explorer/d1641' },
      { label: 'Regional Summary', href: '/pages/regional-summary' },
      { label: 'Design System', href: '/design-system' },
      { label: 'EJ Playground', href: '/pages/playground' },
      { label: 'Baseline Exploration', href: '/pages/baseline-exploration' },
      { label: 'Scenario Time Lapse', href: '/pages/scenario-time-lapse' },
      { label: 'KelpDiagram', href: '/pages/kelp-diagram' },
      { label: 'Watershed', href: '/pages/watershed' },
      { label: 'Rank Visualization', href: '/pages/rank-visualization' },
      { label: 'Co-Design Timeline', href: '/pages/co-design-timeline' },
    ],
  },
]

function DesktopNavbar() {
  const [desktopAnchorEl, setDesktopAnchorEl] = useState<HTMLElement | null>(null)
  const [desktopMenuIndex, setDesktopMenuIndex] = useState<number | null>(null)
  const theme = useTheme()
  const activeDesktopMenu = desktopMenuIndex !== null ? navItems[desktopMenuIndex] : null

  const handleDesktopMenuOpen = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setDesktopAnchorEl(event.currentTarget)
    setDesktopMenuIndex(index)
  }

  const handleDesktopMenuClose = () => {
    setDesktopAnchorEl(null)
    setDesktopMenuIndex(null)
  }

  const menuItemSx = {
    marginInline: theme.jtSpacing.component.xs / 2,
    marginBlock: theme.jtSpacing.component.xs / 2,
    paddingInline: 1.25,
    paddingBlock: 1.1,
    borderRadius: theme.shape.borderRadius,
    border: '1px solid transparent',
    color: 'common.white',
    whiteSpace: 'normal',
    transition: 'border-color 180ms ease, background-color 180ms ease, transform 180ms ease',
    '&.Mui-disabled': {
      color: 'base.300',
      opacity: 0.58,
      '& .dropdown-link-marker': { bgcolor: 'base.300' },
    },
    '&:hover, &:focus-visible': {
      bgcolor: 'translucent.primaryGreen',
      borderColor: 'translucent.primaryGreen',
      color: 'common.white',
      transform: 'translateY(-1px)',
      '& .dropdown-link-marker': {
        opacity: 1,
        transform: 'scaleY(1)',
      },
    },
  } as const

  const desktopMenuMarkerSx = {
    width: 3,
    height: 22,
    marginTop: 0.1,
    bgcolor: 'primary.main',
    opacity: 0.72,
    transform: 'scaleY(0.72)',
    transformOrigin: 'top',
    transition: 'opacity 180ms ease, transform 180ms ease',
    flex: 'none',
  } as const

  return (
    <>
      {/* Primary desktop links and buttons that open the active dropdown. */}
      <Stack
        direction="row"
        spacing={{ md: 0, lg: theme.jtSpacing.gap.xs }}
        sx={{ alignItems: 'center', paddingLeft: { md: 0, lg: theme.jtSpacing.component.lg } }}
      >
        {navItems.map((item, i) =>
          item.disabled ? (
            <Button
              key={item.label}
              disabled
              sx={{
                minWidth: 0,
                paddingInline: { md: 0.75, lg: 1.25 },
                whiteSpace: 'nowrap',
                '&.Mui-disabled': { color: 'base.300' },
              }}
            >
              {item.label}
            </Button>
          ) : item.href ? (
            <Button
              key={item.label}
              component={Link}
              to={item.href}
              sx={{
                minWidth: 0,
                paddingInline: { md: 0.75, lg: 1.25 },
                whiteSpace: 'nowrap',
                color: 'common.white',
              }}
            >
              {item.label}
            </Button>
          ) : (
            <Button
              key={item.label}
              aria-haspopup="menu"
              aria-expanded={desktopMenuIndex === i ? 'true' : undefined}
              sx={{
                minWidth: 0,
                paddingInline: { md: 0.75, lg: 1.25 },
                whiteSpace: 'nowrap',
                color: 'common.white',
                borderRadius: 999,
                border:
                  desktopMenuIndex === i ? theme.navigation.activeBorder : '1px solid transparent',
                bgcolor: desktopMenuIndex === i ? theme.navigation.activeBackground : 'transparent',
                transition:
                  'color 180ms ease, border-color 180ms ease, background-color 180ms ease',
                '&:hover, &:focus-visible': {
                  color: 'primary.light',
                  borderColor: 'translucent.primaryGreen',
                  bgcolor: 'translucent.primaryGreen',
                },
                '& .MuiButton-endIcon': {
                  marginLeft: { md: 0.125, lg: 0.375 },
                  marginRight: { md: -0.5, lg: -0.25 },
                },
              }}
              endIcon={
                <KeyboardArrowDownIcon
                  sx={{
                    fontSize: { md: 15, lg: 18 },
                    transform: desktopMenuIndex === i ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 180ms ease',
                  }}
                />
              }
              onClick={(event) => handleDesktopMenuOpen(event, i)}
            >
              {item.label}
            </Button>
          ),
        )}
      </Stack>

      {/* Floating panel for the dropdown selected from the desktop link row. */}
      <Menu
        anchorEl={desktopAnchorEl}
        open={Boolean(desktopAnchorEl && activeDesktopMenu?.dropdown)}
        onClose={handleDesktopMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        slotProps={{
          paper: {
            sx: {
              marginTop: theme.jtSpacing.component.xs,
              minWidth: 312,
              maxWidth: 360,
              overflow: 'visible',
              bgcolor: theme.navigation.menuPanelBackground,
              border: theme.navigation.panelBorder,
              borderRadius: theme.navigation.panelRadius,
              boxShadow: theme.navigation.dropdownShadow,
              backdropFilter: 'blur(12px)',
              backgroundImage: 'none',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -6,
                left: 'calc(50% - 6px)',
                width: 12,
                height: 12,
                bgcolor: theme.navigation.menuPanelBackground,
                borderTop: theme.navigation.panelBorder,
                borderLeft: theme.navigation.panelBorder,
                transform: 'rotate(45deg)',
              },
              '& .MuiList-root': {
                padding: theme.jtSpacing.component.sm,
              },
            },
          },
        }}
      >
        {activeDesktopMenu?.dropdown && (
          <Box
            sx={{
              paddingInline: theme.jtSpacing.component.xs,
              paddingTop: 0,
              paddingBottom: theme.jtSpacing.component.sm,
              position: 'relative',
            }}
          >
            <Typography variant="eyebrow" component="p" sx={{ marginBottom: 0.75 }}>
              Explore
            </Typography>
            <Typography
              variant="captionSmall"
              component="p"
              sx={{ color: 'base.100', lineHeight: 1.45, maxWidth: 280 }}
            >
              {activeDesktopMenu.caption}
            </Typography>
            <Box
              sx={{
                marginTop: theme.jtSpacing.component.sm,
                height: 1,
                width: '100%',
                bgcolor: 'border.default',
              }}
            />
          </Box>
        )}
        {activeDesktopMenu?.dropdown?.map((sub) =>
          sub.disabled ? (
            <MenuItem key={sub.label} disabled sx={menuItemSx}>
              <Box component="span" sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                <Box className="dropdown-link-marker" component="span" sx={desktopMenuMarkerSx} />
                <Typography component="span" variant="navigationLabel" sx={{ lineHeight: 1.25 }}>
                  {sub.label}
                </Typography>
              </Box>
            </MenuItem>
          ) : sub.external ? (
            <MenuItem
              key={sub.label}
              component="a"
              href={sub.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDesktopMenuClose}
              sx={menuItemSx}
            >
              <Box component="span" sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                <Box className="dropdown-link-marker" component="span" sx={desktopMenuMarkerSx} />
                <Box component="span" sx={{ display: 'block' }}>
                  <Typography
                    component="span"
                    variant="navigationLabel"
                    sx={{ display: 'block', lineHeight: 1.25 }}
                  >
                    {sub.label}
                  </Typography>
                  <Typography
                    component="span"
                    variant="captionSmall"
                    sx={{
                      display: 'block',
                      marginTop: theme.jtSpacing.component.xs * 0.45,
                      color: 'base.100',
                    }}
                  >
                    This leads to an external project.
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ) : (
            <MenuItem
              key={sub.label}
              component={Link}
              to={sub.href}
              onClick={handleDesktopMenuClose}
              sx={menuItemSx}
            >
              <Box component="span" sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                <Box className="dropdown-link-marker" component="span" sx={desktopMenuMarkerSx} />
                <Typography component="span" variant="navigationLabel" sx={{ lineHeight: 1.25 }}>
                  {sub.label}
                </Typography>
              </Box>
            </MenuItem>
          ),
        )}
      </Menu>
    </>
  )
}

function MobileNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const theme = useTheme()

  const closeMobileMenu = () => {
    setMobileOpen(false)
    setOpenDropdown(null)
  }

  const mobileSubItemSx = {
    paddingInline: theme.navigation.spacing.subItemInline,
    paddingBlock: theme.navigation.spacing.subItemBlock,
    borderRadius: theme.shape.borderRadius,
    color: 'common.white',
    alignItems: 'flex-start',
    '&:hover': { bgcolor: 'translucent.primaryGreen' },
  } as const

  const mobileNavButtonSx = {
    borderRadius: theme.shape.borderRadius,
    border: '1px solid',
    borderColor: 'border.subtle',
    bgcolor: 'translucent.400',
    color: 'common.white',
    paddingInline: theme.navigation.spacing.mobileButtonInline,
    paddingBlock: theme.navigation.spacing.mobileButtonBlock,
    transition: 'border-color 180ms ease, background-color 180ms ease, transform 180ms ease',
    '&:hover': {
      borderColor: 'translucent.primaryGreen',
      bgcolor: 'translucent.primaryGreen',
      transform: 'translateY(-1px)',
    },
  } as const

  return (
    <>
      {/* Compact trigger that opens and closes the mobile navigation drawer. */}
      <IconButton
        aria-label="Toggle menu"
        onClick={() => setMobileOpen((current) => !current)}
        sx={{ color: 'brand.primaryGreen' }}
      >
        <MenuIcon />
      </IconButton>

      {/* Slide-in mobile menu containing top-level links and collapsible submenus. */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={closeMobileMenu}
        slotProps={{
          paper: {
            sx: {
              width: { xs: 'min(88vw, 360px)', sm: 380 },
              bgcolor: theme.navigation.drawerPanelBackground,
              borderLeft: theme.navigation.panelBorder,
              boxShadow: theme.navigation.drawerShadow,
              backdropFilter: 'blur(12px)',
            },
          },
        }}
      >
        <Box
          sx={{
            padding: {
              xs: theme.jtSpacing.component.sm,
              sm: theme.jtSpacing.component.md,
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: theme.jtSpacing.gap.sm,
              marginBottom: theme.jtSpacing.component.md,
            }}
          >
            <Box>
              <Typography variant="h4" component="h2" sx={{ color: 'common.white' }}>
                Menu
              </Typography>
            </Box>
            <IconButton
              aria-label="Close menu"
              onClick={closeMobileMenu}
              sx={{
                color: 'primary.main',
                border: 1,
                borderColor: 'translucent.primaryGreen',
                bgcolor: 'translucent.primaryGreen',
                flex: 'none',
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <List
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.jtSpacing.gap.xs,
              padding: 0,
            }}
          >
            {navItems.map((item, idx) => (
              <Box key={item.label}>
                {item.disabled ? (
                  <ListItemButton disabled sx={mobileNavButtonSx}>
                    <ListItemText
                      primary={item.label}
                      secondary="Coming soon"
                      slotProps={{
                        primary: {
                          sx: {
                            color: 'base.300',
                            whiteSpace: 'nowrap',
                            typography: 'navigationLabel',
                          },
                        },
                        secondary: {
                          sx: {
                            color: 'base.300',
                            marginTop: theme.jtSpacing.component.xs / 4,
                          },
                        },
                      }}
                    />
                  </ListItemButton>
                ) : item.href ? (
                  <ListItemButton
                    component={Link}
                    to={item.href}
                    onClick={closeMobileMenu}
                    sx={mobileNavButtonSx}
                  >
                    <ListItemText
                      primary={item.label}
                      slotProps={{
                        primary: {
                          sx: {
                            color: 'common.white',
                            whiteSpace: 'nowrap',
                            typography: 'navigationLabel',
                          },
                        },
                      }}
                    />
                  </ListItemButton>
                ) : (
                  <Box
                    sx={{
                      borderRadius: theme.shape.borderRadius,
                      border: '1px solid',
                      borderColor:
                        openDropdown === idx ? 'translucent.primaryGreen' : 'border.subtle',
                      bgcolor:
                        openDropdown === idx ? 'translucent.primaryGreen' : 'translucent.400',
                      overflow: 'hidden',
                    }}
                  >
                    <ListItemButton
                      onClick={() => setOpenDropdown((current) => (current === idx ? null : idx))}
                      sx={{
                        color: 'common.white',
                        justifyContent: 'space-between',
                        paddingInline: theme.navigation.spacing.mobileButtonInline,
                        paddingBlock: theme.navigation.spacing.mobileButtonBlock,
                      }}
                    >
                      <ListItemText
                        primary={item.label}
                        secondary={openDropdown === idx ? item.caption : undefined}
                        slotProps={{
                          primary: {
                            sx: {
                              color: 'common.white',
                              whiteSpace: 'nowrap',
                              typography: 'navigationLabel',
                            },
                          },
                          secondary: {
                            sx: {
                              color: 'base.100',
                              marginTop: theme.jtSpacing.component.xs * 0.45,
                              typography: 'captionSmall',
                            },
                          },
                        }}
                      />
                      {item.dropdown &&
                        (openDropdown === idx ? (
                          <ExpandLessIcon sx={{ color: 'common.white' }} />
                        ) : (
                          <ExpandMoreIcon sx={{ color: 'common.white' }} />
                        ))}
                    </ListItemButton>

                    <Collapse in={openDropdown === idx} timeout="auto" unmountOnExit>
                      <Box
                        sx={{
                          marginInline: theme.jtSpacing.component.xs,
                          marginBottom: theme.jtSpacing.component.xs,
                          paddingTop: theme.jtSpacing.component.xs * 0.75,
                        }}
                      >
                        <Typography
                          variant="eyebrow"
                          component="p"
                          sx={{
                            paddingInline: theme.navigation.spacing.subItemInline,
                            paddingTop: theme.jtSpacing.component.xs * 0.7,
                            paddingBottom: theme.jtSpacing.component.xs / 4,
                          }}
                        >
                          Explore
                        </Typography>
                        {item.dropdown?.map((sub) =>
                          sub.disabled ? (
                            <ListItemButton key={sub.label} disabled sx={mobileSubItemSx}>
                              <Box
                                component="span"
                                sx={{
                                  width: 3,
                                  height: 22,
                                  marginTop: theme.jtSpacing.component.xs / 4,
                                  marginRight: theme.jtSpacing.component.xs * 1.1,
                                  borderRadius: '50%',
                                  bgcolor: 'base.300',
                                  flex: 'none',
                                }}
                              />
                              <ListItemText
                                primary={sub.label}
                                secondary="Coming soon"
                                slotProps={{
                                  primary: { sx: { typography: 'navigationLabel' } },
                                  secondary: { sx: { typography: 'captionSmall' } },
                                }}
                              />
                            </ListItemButton>
                          ) : sub.external ? (
                            <ListItemButton
                              key={sub.label}
                              component="a"
                              href={sub.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={closeMobileMenu}
                              sx={mobileSubItemSx}
                            >
                              <Box
                                component="span"
                                sx={{
                                  width: 3,
                                  height: 22,
                                  marginTop: theme.jtSpacing.component.xs / 4,
                                  marginRight: theme.jtSpacing.component.xs * 1.1,
                                  borderRadius: '50%',
                                  bgcolor: 'primary.main',
                                  opacity: 0.72,
                                  flex: 'none',
                                }}
                              />
                              <ListItemText
                                primary={sub.label}
                                secondary="Opens a related project"
                                slotProps={{
                                  primary: {
                                    sx: { color: 'common.white', typography: 'navigationLabel' },
                                  },
                                  secondary: {
                                    sx: {
                                      color: 'base.100',
                                      marginTop: theme.jtSpacing.component.xs * 0.35,
                                    },
                                  },
                                }}
                              />
                            </ListItemButton>
                          ) : (
                            <ListItemButton
                              key={sub.label}
                              component={Link}
                              to={sub.href}
                              onClick={closeMobileMenu}
                              sx={mobileSubItemSx}
                            >
                              <Box
                                component="span"
                                sx={{
                                  width: 3,
                                  height: 22,
                                  marginTop: theme.jtSpacing.component.xs / 4,
                                  marginRight: theme.jtSpacing.component.xs * 1.1,
                                  borderRadius: '50%',
                                  bgcolor: 'primary.main',
                                  opacity: 0.72,
                                  flex: 'none',
                                }}
                              />
                              <ListItemText
                                primary={sub.label}
                                slotProps={{
                                  primary: {
                                    sx: { color: 'common.white', typography: 'navigationLabel' },
                                  },
                                }}
                              />
                            </ListItemButton>
                          ),
                        )}
                      </Box>
                    </Collapse>
                  </Box>
                )}
              </Box>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  )
}

export default function Navbar() {
  const theme = useTheme()
  const isDesktopNav = useMediaQuery(theme.breakpoints.up('md'))
  const navHeight = isDesktopNav ? 76 : 72

  return (
    <AppBar
      position="sticky"
      component="nav"
      color="transparent"
      elevation={4}
      sx={{ height: 'auto', overflow: 'hidden', bgcolor: 'base.900' }}
    >
      {/* Shared navigation shell with the brand at left and one breakpoint-specific menu at right. */}
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', height: navHeight }}>
        <Toolbar
          sx={{
            maxWidth: '1400px',
            margin: '0 auto',
            width: '100%',
            height: '100%',
            paddingInline: { md: 1, lg: 3 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              gap: { md: 0.5, lg: 2 },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.25, md: 1, lg: 2 } }}>
              <Box
                component="img"
                src={assetUrl('/images/uc-logo-white.png')}
                alt="University of California"
                sx={{
                  display: 'block',
                  width: { xs: 48, sm: 58, md: 44, lg: 76 },
                  height: 'auto',
                  flex: 'none',
                }}
              />
              <Logo />
            </Box>
            {isDesktopNav ? <DesktopNavbar /> : <MobileNavbar />}
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  )
}

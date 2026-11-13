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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { visuallyHidden } from '@mui/utils'
import Icon from './Icon'
import { assetUrl } from '@/utils/baseUrl'
import { menuGroups, navItems, type DropdownGroup, type DropdownItem } from './navigation'

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

  const menuItemHoverSx = menuItemSx['&:hover, &:focus-visible']

  // The highlighted starting point at the top of a grouped menu.
  const featuredItemSx = {
    ...menuItemSx,
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 0.5,
    padding: theme.jtSpacing.component.sm,
    border: theme.navigation.panelBorder,
    bgcolor: 'translucent.primaryGreenSubtle',
    '&:hover, &:focus-visible': { ...menuItemHoverSx, borderColor: 'primary.main' },
  } as const

  // Shortcuts sit under their page's label, one quieter step down, with a shorter marker.
  const nestedItemSx = {
    ...menuItemSx,
    marginBlock: 0,
    marginLeft: theme.navigation.spacing.nestedIndent,
    paddingBlock: 0.75,
  } as const

  const nestedMarkerSx = { ...desktopMenuMarkerSx, height: 16 } as const

  const linkProps = (entry: DropdownItem) =>
    entry.external
      ? { component: 'a' as const, href: entry.href, target: '_blank', rel: 'noopener noreferrer' }
      : { component: Link, to: entry.href }

  // Menu items stay direct children of the menu list so arrow keys reach every link.
  const groupedMenuEntries = (groups: DropdownGroup[]) =>
    groups.flatMap((group, groupIndex) =>
      group.featured
        ? group.items.map((entry) => (
            <MenuItem
              key={entry.label}
              {...linkProps(entry)}
              disabled={entry.disabled}
              onClick={handleDesktopMenuClose}
              sx={featuredItemSx}
            >
              <Typography variant="eyebrow" component="span">
                {group.label}
              </Typography>
              <Box
                component="span"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Typography variant="h4" component="span">
                  {entry.label}
                </Typography>
                <ArrowForwardIcon sx={{ color: 'primary.main' }} />
              </Box>
              {entry.caption && (
                <Typography variant="captionSmall" component="span" sx={{ whiteSpace: 'normal' }}>
                  {entry.caption}
                </Typography>
              )}
            </MenuItem>
          ))
        : [
            <Box
              key={`group:${group.label}`}
              sx={{
                marginInline: theme.jtSpacing.component.xs,
                // A group that opens the menu needs no divider above it.
                ...(groupIndex === 0
                  ? { paddingTop: theme.jtSpacing.component.xs / 2 }
                  : {
                      marginTop: theme.jtSpacing.component.xs,
                      paddingTop: theme.jtSpacing.component.sm,
                    }),
                paddingInline: 1.25,
                paddingBottom: theme.jtSpacing.component.xs / 2,
                borderTop: groupIndex === 0 ? 0 : 1,
                borderColor: 'border.subtle',
              }}
            >
              <Typography variant="eyebrow" component="p">
                {group.label}
              </Typography>
            </Box>,
            ...group.items.flatMap((entry) => [
              <MenuItem
                key={entry.label}
                {...linkProps(entry)}
                disabled={entry.disabled}
                onClick={handleDesktopMenuClose}
                sx={menuItemSx}
              >
                <Box component="span" sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                  <Box className="dropdown-link-marker" component="span" sx={desktopMenuMarkerSx} />
                  <Box component="span" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="navigationLabel" component="span">
                      {entry.label}
                      {entry.external && (
                        <Box
                          component="span"
                          sx={{ display: 'inline-flex', ml: 0.75, color: 'primary.main' }}
                        >
                          <Icon name="arrow-up-right" size={14} />
                          <Box component="span" sx={visuallyHidden}>
                            (opens in a new tab)
                          </Box>
                        </Box>
                      )}
                    </Typography>
                    {entry.caption && (
                      <Typography variant="captionSmall" component="span">
                        {entry.caption}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </MenuItem>,
              ...(entry.children ?? []).map((child) => (
                <MenuItem
                  key={child.label}
                  {...linkProps(child)}
                  disabled={child.disabled}
                  onClick={handleDesktopMenuClose}
                  sx={nestedItemSx}
                >
                  <Box
                    component="span"
                    sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}
                  >
                    <Box className="dropdown-link-marker" component="span" sx={nestedMarkerSx} />
                    <Box
                      component="span"
                      sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}
                    >
                      <Typography variant="navigationShortcut" component="span">
                        {child.label}
                      </Typography>
                      {child.hint && (
                        <Typography variant="captionSmall" component="span">
                          {child.hint}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </MenuItem>
              )),
            ]),
          ],
    )

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
                    // An icon's box, not text: sized directly rather than through fontSize.
                    width: { md: 15, lg: 18 },
                    height: { md: 15, lg: 18 },
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
        open={Boolean(
          desktopAnchorEl && (activeDesktopMenu?.dropdown || activeDesktopMenu?.groups),
        )}
        onClose={handleDesktopMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        slotProps={{
          paper: {
            sx: {
              marginTop: theme.jtSpacing.component.xs,
              minWidth: activeDesktopMenu?.groups ? theme.navigation.groupedPanelWidth.min : 312,
              maxWidth: activeDesktopMenu?.groups ? theme.navigation.groupedPanelWidth.max : 360,
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
              variant="captionProse"
              component="p"
              sx={{ color: 'base.100', maxWidth: 280 }}
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
                <Typography component="span" variant="navigationLabel">
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
                  <Typography component="span" variant="navigationLabel" sx={{ display: 'block' }}>
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
                <Typography component="span" variant="navigationLabel">
                  {sub.label}
                </Typography>
              </Box>
            </MenuItem>
          ),
        )}
        {activeDesktopMenu?.groups && groupedMenuEntries(activeDesktopMenu.groups)}
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

  // One drawer link; a nested shortcut sits indented under its page.
  const mobileEntry = (sub: DropdownItem, nested: boolean) => {
    const sx = nested
      ? { ...mobileSubItemSx, marginLeft: theme.navigation.spacing.nestedIndent }
      : mobileSubItemSx
    const marker = (
      <Box
        component="span"
        sx={{
          width: 3,
          height: 22,
          marginTop: theme.jtSpacing.component.xs / 4,
          marginRight: theme.jtSpacing.component.xs * 1.1,
          borderRadius: '50%',
          bgcolor: sub.disabled ? 'base.300' : 'primary.main',
          opacity: sub.disabled ? 1 : 0.72,
          flex: 'none',
        }}
      />
    )
    const primarySx = { color: 'common.white', typography: 'navigationLabel' }

    if (sub.disabled) {
      return (
        <ListItemButton key={sub.label} disabled sx={sx}>
          {marker}
          <ListItemText
            primary={sub.label}
            slotProps={{ primary: { sx: { typography: 'navigationLabel' } } }}
          />
        </ListItemButton>
      )
    }
    if (sub.external) {
      return (
        <ListItemButton
          key={sub.label}
          component="a"
          href={sub.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMobileMenu}
          sx={sx}
        >
          {marker}
          <ListItemText
            primary={sub.label}
            secondary="Opens a related project"
            slotProps={{
              primary: { sx: primarySx },
              secondary: {
                sx: { color: 'base.100', marginTop: theme.jtSpacing.component.xs * 0.35 },
              },
            }}
          />
        </ListItemButton>
      )
    }
    return (
      <ListItemButton
        key={sub.label}
        component={Link}
        to={sub.href}
        onClick={closeMobileMenu}
        sx={sx}
      >
        {marker}
        <ListItemText primary={sub.label} slotProps={{ primary: { sx: primarySx } }} />
      </ListItemButton>
    )
  }

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
                      slotProps={{
                        primary: {
                          sx: {
                            color: 'base.300',
                            whiteSpace: 'nowrap',
                            typography: 'navigationLabel',
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
                      {(item.dropdown || item.groups) &&
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
                        {menuGroups(item).map((group) => (
                          <Box key={group.label}>
                            <Typography
                              variant="eyebrow"
                              component="p"
                              sx={{
                                paddingInline: theme.navigation.spacing.subItemInline,
                                paddingTop: theme.jtSpacing.component.xs * 0.7,
                                paddingBottom: theme.jtSpacing.component.xs / 4,
                              }}
                            >
                              {group.label}
                            </Typography>
                            {group.items.flatMap((sub) => [
                              mobileEntry(sub, false),
                              ...(sub.children ?? []).map((child) => mobileEntry(child, true)),
                            ])}
                          </Box>
                        ))}
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
  const navHeight = isDesktopNav ? theme.navigation.barHeight.md : theme.navigation.barHeight.xs

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

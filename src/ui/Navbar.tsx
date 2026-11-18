// Responsive top navigation with desktop dropdown menus and a full-screen mobile menu.
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  Menu,
  MenuItem,
  Portal,
  Stack,
  Typography,
  Collapse,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Logo from './Logo'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import type { Theme } from '@mui/material/styles'
import { visuallyHidden } from '@mui/utils'
import Icon from './Icon'
import { assetUrl } from '@/utils/baseUrl'
import { navItems, type DropdownGroup, type DropdownItem, type NavItem } from './navigation'

// Shared by both menus: the desktop dropdown and the mobile drawer draw the same panel and links.
const menuStyles = (theme: Theme) => {
  const item = {
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

  const marker = {
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

  return {
    item,
    marker,
    // The highlighted starting point at the top of a grouped menu.
    featured: {
      ...item,
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: 0.5,
      padding: theme.jtSpacing.component.sm,
      border: theme.navigation.panelBorder,
      bgcolor: 'translucent.primaryGreenSubtle',
      '&:hover, &:focus-visible': {
        ...item['&:hover, &:focus-visible'],
        borderColor: 'primary.main',
      },
    },
    // Shortcuts sit under their page's label, one quieter step down, with a shorter marker.
    nested: {
      ...item,
      marginBlock: 0,
      marginLeft: theme.navigation.spacing.nestedIndent,
      paddingBlock: 0.75,
    },
    nestedMarker: { ...marker, height: 16 },
    // The page being viewed: held in its hover look, marker at full height.
    current: {
      bgcolor: 'translucent.primaryGreen',
      borderColor: 'translucent.primaryGreen',
      '& .dropdown-link-marker': { opacity: 1, transform: 'scaleY(1)' },
    },
    panel: {
      bgcolor: theme.navigation.menuPanelBackground,
      border: theme.navigation.panelBorder,
      borderRadius: theme.navigation.panelRadius,
      boxShadow: theme.navigation.dropdownShadow,
      backgroundImage: 'none',
    },
    // The small pointer joining a panel to the button that opened it; `size` is its square's side.
    caret: (left: string, size = 12) => ({
      content: '""',
      position: 'absolute',
      top: -size / 2,
      left,
      width: size,
      height: size,
      bgcolor: theme.navigation.menuPanelBackground,
      borderTop: theme.navigation.panelBorder,
      borderLeft: theme.navigation.panelBorder,
      transform: 'rotate(45deg)',
    }),
    // A group's eyebrow; a group that opens the menu needs no divider above it.
    groupHead: (groupIndex: number) => ({
      marginInline: theme.jtSpacing.component.xs,
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
    }),
  }
}

const linkProps = (entry: DropdownItem) =>
  entry.external
    ? { component: 'a' as const, href: entry.href, target: '_blank', rel: 'noopener noreferrer' }
    : { component: Link, to: entry.href }

// Marks an outside link and tells screen readers it opens a new tab.
function ExternalMark() {
  return (
    <Box component="span" sx={{ display: 'inline-flex', ml: 0.75, color: 'primary.main' }}>
      <Icon name="arrow-up-right" size={14} />
      <Box component="span" sx={visuallyHidden}>
        (opens in a new tab)
      </Box>
    </Box>
  )
}

function DesktopNavbar() {
  const [desktopAnchorEl, setDesktopAnchorEl] = useState<HTMLElement | null>(null)
  const [desktopMenuIndex, setDesktopMenuIndex] = useState<number | null>(null)
  const theme = useTheme()
  const activeDesktopMenu = desktopMenuIndex !== null ? navItems[desktopMenuIndex] : null
  const styles = menuStyles(theme)

  const handleDesktopMenuOpen = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setDesktopAnchorEl(event.currentTarget)
    setDesktopMenuIndex(index)
  }

  const handleDesktopMenuClose = () => {
    setDesktopAnchorEl(null)
    setDesktopMenuIndex(null)
  }

  const menuItemSx = styles.item
  const desktopMenuMarkerSx = styles.marker
  const featuredItemSx = styles.featured
  const nestedItemSx = styles.nested
  const nestedMarkerSx = styles.nestedMarker

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
            <Box key={`group:${group.label}`} sx={styles.groupHead(groupIndex)}>
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
                      {entry.external && <ExternalMark />}
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
              ...styles.panel,
              backdropFilter: 'blur(12px)',
              '&::before': styles.caret('calc(50% - 6px)'),
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
  const { pathname } = useLocation()
  const styles = menuStyles(theme)

  const closeMobileMenu = () => {
    setMobileOpen(false)
    setOpenDropdown(null)
  }

  // A top-level row reads like a section-rail item, an eyebrow; the open one turns green
  // and takes the links' marker bar at its left edge.
  const topRowSx = (open: boolean) =>
    ({
      gap: theme.jtSpacing.gap.xs,
      paddingBlock: theme.navigation.spacing.mobileButtonBlock,
      paddingLeft: theme.jtSpacing.component.sm,
      paddingRight: theme.navigation.spacing.subItemInline,
      color: open ? 'primary.main' : 'common.white',
      transition: 'color 180ms ease, background-color 180ms ease',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 3,
        bgcolor: 'primary.main',
        opacity: open ? 1 : 0,
        transition: 'opacity 180ms ease',
      },
      '&:hover, &:focus-visible': {
        color: 'primary.light',
        bgcolor: 'translucent.primaryGreenSubtle',
      },
      '&.Mui-disabled': { color: 'base.300', opacity: 1 },
    }) as const

  // One link in an open panel; a nested shortcut sits indented under its page.
  const mobileEntry = (entry: DropdownItem, nested: boolean) => {
    const current = !entry.external && !entry.disabled && entry.href === pathname
    const note = nested ? entry.hint : entry.caption
    return (
      <ListItemButton
        key={entry.label}
        {...linkProps(entry)}
        disabled={entry.disabled}
        aria-current={current ? 'page' : undefined}
        onClick={closeMobileMenu}
        sx={[nested ? styles.nested : styles.item, current && styles.current]}
      >
        <Box
          component="span"
          sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start', width: '100%' }}
        >
          <Box
            className="dropdown-link-marker"
            component="span"
            sx={nested ? styles.nestedMarker : styles.marker}
          />
          <Box component="span" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography
              variant={nested ? 'navigationShortcut' : 'navigationLabel'}
              component="span"
            >
              {entry.label}
              {entry.external && <ExternalMark />}
            </Typography>
            {note && (
              <Typography variant="captionSmall" component="span">
                {note}
              </Typography>
            )}
          </Box>
        </Box>
      </ListItemButton>
    )
  }

  // What a top-level item's panel lists: the desktop dropdown's contents, in its order.
  const panelContents = (item: NavItem) => [
    ...(item.dropdown
      ? [
          <Box
            key="intro"
            sx={{
              paddingInline: theme.jtSpacing.component.xs,
              paddingBottom: theme.jtSpacing.component.xs,
            }}
          >
            <Typography variant="eyebrow" component="p" sx={{ marginBottom: 0.75 }}>
              Explore
            </Typography>
            <Typography variant="captionProse" component="p" sx={{ color: 'base.100' }}>
              {item.caption}
            </Typography>
            <Box
              sx={{
                marginTop: theme.jtSpacing.component.sm,
                height: 1,
                bgcolor: 'border.default',
              }}
            />
          </Box>,
          ...item.dropdown.map((entry) => mobileEntry(entry, false)),
        ]
      : []),
    ...(item.groups ?? []).flatMap((group, groupIndex) =>
      group.featured
        ? group.items.map((entry) => (
            <ListItemButton
              key={entry.label}
              {...linkProps(entry)}
              onClick={closeMobileMenu}
              sx={styles.featured}
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
                <Typography variant="captionSmall" component="span">
                  {entry.caption}
                </Typography>
              )}
            </ListItemButton>
          ))
        : [
            <Box key={`group:${group.label}`} sx={styles.groupHead(groupIndex)}>
              <Typography variant="eyebrow" component="p">
                {group.label}
              </Typography>
            </Box>,
            ...group.items.flatMap((entry) => [
              mobileEntry(entry, false),
              ...(entry.children ?? []).map((child) => mobileEntry(child, true)),
            ]),
          ],
    ),
  ]

  return (
    <>
      {/* One button in the navbar opens and closes the menu, so the brand row never repeats. */}
      <IconButton
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
        aria-controls="mobile-menu"
        onClick={() => (mobileOpen ? closeMobileMenu() : setMobileOpen(true))}
        sx={{ color: 'brand.primaryGreen' }}
      >
        {mobileOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>

      {/* Full-screen menu that slides in from the right under the navbar, which stays in place above it.
          Portaled to the body so it stacks below the navbar rather than inside it. */}
      <Portal>
        <Drawer
          id="mobile-menu"
          variant="persistent"
          anchor="right"
          open={mobileOpen}
          slotProps={{
            paper: {
              onKeyDown: (event: React.KeyboardEvent) => {
                if (event.key === 'Escape') closeMobileMenu()
              },
              sx: {
                top: theme.navigation.barHeight.xs,
                width: '100%',
                height: theme.navigation.belowBar('100dvh').xs,
                zIndex: theme.navigation.mobileMenuZIndex,
                border: 0,
                bgcolor: theme.navigation.drawerPanelBackground,
                backgroundImage: 'none',
              },
            },
          }}
        >
          <Box
            sx={{
              paddingInline: theme.jtSpacing.component.sm,
              paddingBlock: theme.jtSpacing.component.md,
            }}
          >
            <List
              component="nav"
              aria-label="Main"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: 0,
              }}
            >
              {navItems.map((item, idx) => {
                const open = openDropdown === idx
                const label = (
                  <Typography variant="eyebrow" component="span" sx={{ flex: 1, color: 'inherit' }}>
                    {item.label}
                  </Typography>
                )

                if (item.disabled) {
                  return (
                    <ListItemButton key={item.label} disabled sx={topRowSx(false)}>
                      {label}
                    </ListItemButton>
                  )
                }
                if (item.href) {
                  return (
                    <ListItemButton
                      key={item.label}
                      component={Link}
                      to={item.href}
                      onClick={closeMobileMenu}
                      sx={topRowSx(false)}
                    >
                      {label}
                    </ListItemButton>
                  )
                }
                return (
                  <Box key={item.label}>
                    <ListItemButton
                      aria-expanded={open}
                      onClick={() => setOpenDropdown(open ? null : idx)}
                      sx={topRowSx(open)}
                    >
                      {label}
                      <KeyboardArrowDownIcon
                        sx={{
                          width: 20,
                          height: 20,
                          flex: 'none',
                          color: open ? 'primary.main' : 'base.100',
                          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 180ms ease',
                        }}
                      />
                    </ListItemButton>

                    <Collapse in={open} timeout="auto" unmountOnExit>
                      <Box
                        sx={{
                          ...styles.panel,
                          position: 'relative',
                          marginTop: theme.jtSpacing.component.sm,
                          marginBottom: theme.jtSpacing.component.sm,
                          padding: theme.jtSpacing.component.xs,
                          paddingTop: theme.jtSpacing.component.sm,
                          // The pointer sits under the row's label, clear of the panel's corner.
                          '&::before': styles.caret(
                            theme.spacing(theme.jtSpacing.component.md),
                            18,
                          ),
                        }}
                      >
                        {panelContents(item)}
                      </Box>
                    </Collapse>
                  </Box>
                )
              })}
            </List>
          </Box>
        </Drawer>
      </Portal>
    </>
  )
}

// The UC seal and the site wordmark at the navbar's left.
function Brand() {
  return (
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
            <Brand />
            {isDesktopNav ? <DesktopNavbar /> : <MobileNavbar />}
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  )
}

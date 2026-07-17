// Responsive top navigation with desktop dropdown menus and mobile drawer links.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Box, Button, Drawer, IconButton, List, ListItemButton, ListItemText, Menu, MenuItem, Stack, Typography, Collapse, useMediaQuery, useTheme } from '@mui/material';
import Logo from './Logo';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
//import './Navbar.css';

interface DropdownItem {
  label: string;
  href: string;
  external?: boolean;
}

interface NavItem {
  label: string;
  caption?: string;
  href?: string;
  dropdown?: DropdownItem[];
  /** Disabled "coming soon" item — rendered greyed out, not navigable. */
  disabled?: boolean;
}

const navItems: NavItem[] = [
  {
    label: 'Adaptation Scenarios',
    href: '/scenarios',
  },
  {
    label: 'Repository',
    caption: 'Browse reports, learning materials, and project resources.',
    dropdown: [
      { label: 'Project Documentation & Reports', href: '/pages/project-documentation' },
      { label: 'Service Learning & Education', href: '/pages/service-learning' },
      { label: 'References & Resources', href: '/pages/resources' },
    ],
  },
  {
    label: 'Related Projects',
    caption: 'Visit companion Delta planning and adaptation efforts.',
    dropdown: [
      { label: 'Franks Tract Futures', href: 'https://franks-tract-futures-ucdavis.hub.arcgis.com/', external: true },
      { label: 'Delta Island Adaptations', href: 'https://deltaislandadaptations-ucdavis.hub.arcgis.com/', external: true },
      { label: 'Delta Adapts', href: 'https://www.deltacouncil.ca.gov/delta-plan/climate-change', external: true },
    ],
  },
  {
    label: 'Internal',
    caption: 'Project tools and design references for the team.',
    dropdown: [
      { label: 'Scenario Explorer', href: '/pages/scenario-explorer' },
      { label: 'Design System', href: '/design-system' },
      { label: 'EJ Playground', href: '/pages/playground' },
      { label: 'Baseline Exploration', href: '/pages/baseline-exploration' },
      { label: 'KelpDiagram', href: '/pages/kelp-diagram' },
      { label: 'Watershed', href: '/pages/watershed' },

    ]
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [desktopAnchorEl, setDesktopAnchorEl] = useState<HTMLElement | null>(null);
  const [desktopMenuIndex, setDesktopMenuIndex] = useState<number | null>(null);
  const theme = useTheme();
  const isDesktopNav = useMediaQuery(theme.breakpoints.up('md'));

  const navHeight = isDesktopNav ? 76 : 72;
  const activeDesktopMenu = desktopMenuIndex !== null ? navItems[desktopMenuIndex] : null;

  const handleDesktopMenuOpen = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setDesktopAnchorEl(event.currentTarget);
    setDesktopMenuIndex(index);
  };

  const handleDesktopMenuClose = () => {
    setDesktopAnchorEl(null);
    setDesktopMenuIndex(null);
  };

  const menuItemSx = {
    mx: 1,
    my: 0.5,
    px: 1.75,
    py: 1.2,
    borderRadius: 'var(--mui-shape-borderRadius)',
    border: '1px solid transparent',
    color: 'common.white',
    whiteSpace: 'normal',
    transition: 'border-color 180ms ease, background-color 180ms ease, transform 180ms ease',
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
  } as const;

  const mobileSubItemSx = {
    px: 1.25,
    py: 1,
    borderRadius: 'var(--mui-shape-borderRadius)',
    color: 'common.white',
    alignItems: 'flex-start',
    '&:hover': {
      bgcolor: 'translucent.primaryGreen',
    },
  } as const;

  const mobileNavButtonSx = {
    borderRadius: 'var(--mui-shape-borderRadius)',
    border: '1px solid rgba(155,162,164,0.18)',
    bgcolor: 'rgba(81,93,97,0.22)',
    color: 'common.white',
    px: 1.5,
    py: 1.25,
    transition: 'border-color 180ms ease, background-color 180ms ease, transform 180ms ease',
    '&:hover': {
      borderColor: 'translucent.primaryGreen',
      bgcolor: 'translucent.primaryGreen',
      transform: 'translateY(-1px)',
    },
  } as const;

  const titleLabelSx = {
    fontWeight: 800,
    letterSpacing: '0.015em',
    lineHeight: 1.25,
  } as const;

  return (
    <AppBar position="sticky" component="nav" color="transparent" elevation={4} sx={{ height: 'auto', overflow: 'hidden' }}>
      <Box
        sx={{ display: 'flex', alignItems: 'center', width: '100%', height: navHeight }}
      >
        <Toolbar sx={{ maxWidth: '1400px', margin: '0 auto', width: '100%', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 2 }}>
            <Logo />

            <Box sx={{ display: { xs: 'inline-flex', md: 'none' } }}>
              <IconButton aria-label="Toggle menu" onClick={() => setMobileOpen((current) => !current)} sx={{ color: 'brand.primaryGreen' }}>
                <MenuIcon />
              </IconButton>
            </Box>

            <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', pl: theme.jtSpacing.component.lg}}>
              {navItems.map((item, i) => (
                item.disabled ? (
                  <Button
                    key={item.label}
                    disabled
                    sx={{
                      minWidth: theme.navigation.desktopButtonMinWidth,
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
                      minWidth: theme.navigation.desktopButtonMinWidth,
                      whiteSpace: 'nowrap',
                      color: 'common.white',
                    }}
                  >
                    {item.label}
                  </Button>
                ) : (
                  <Button
                    key={item.label}
                    sx={{
                      minWidth: theme.navigation.desktopButtonMinWidth,
                      whiteSpace: 'nowrap',
                      color: 'common.white',
                      border: desktopMenuIndex === i ? theme.navigation.activeBorder : '1px solid transparent',
                      bgcolor: desktopMenuIndex === i ? theme.navigation.activeBackground : 'transparent',
                    }}
                    endIcon={<KeyboardArrowDownIcon />}
                    onClick={(event) => handleDesktopMenuOpen(event, i)}
                  >
                    {item.label}
                  </Button>
                )
              ))}
            </Stack>
          </Box>
        </Toolbar>
      </Box>

      <Menu
        anchorEl={desktopAnchorEl}
        open={Boolean(desktopAnchorEl && activeDesktopMenu?.dropdown)}
        onClose={handleDesktopMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.25,
              minWidth: 330,
              maxWidth: 380,
              overflow: 'visible',
              bgcolor: theme.navigation.menuPanelBackground,
              border: theme.navigation.panelBorder,
              borderRadius: 'var(--mui-shape-borderRadius)',
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
                p: 1,
              },
            },
          },
        }}
      >
        {activeDesktopMenu?.dropdown && (
          <Box sx={{ px: 2.5, pt: 1.5, pb: 1, position: 'relative' }}>
            <Typography variant="eyebrow" component="p" sx={{ mb: 0.75 }}>
              Explore
            </Typography>
            <Typography variant="captionSmall" component="p" sx={{ color: 'base.100', lineHeight: 1.45, maxWidth: 280 }}>
              {activeDesktopMenu.caption}
            </Typography>
            <Box sx={{ mt: 1.25, height: 2, width: 56, bgcolor: 'primary.main', borderRadius: 999 }} />
          </Box>
        )}
        {activeDesktopMenu?.dropdown?.map((sub) => (
          sub.external ? (
            <MenuItem key={sub.label} component="a" href={sub.href} target="_blank" rel="noopener noreferrer" onClick={handleDesktopMenuClose} sx={menuItemSx}>
              <Box component="span" sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                <Box className="dropdown-link-marker" component="span" sx={{ width: 3, height: 24, mt: 0.1, borderRadius: 999, bgcolor: 'primary.main', opacity: 0.5, transform: 'scaleY(0.72)', transformOrigin: 'top', transition: 'opacity 180ms ease, transform 180ms ease', flex: 'none' }} />
                <Box component="span" sx={{ display: 'block' }}>
                  <Typography component="span" sx={{ display: 'block', ...titleLabelSx }}>
                    {sub.label}
                  </Typography>
                  <Typography component="span" variant="captionSmall" sx={{ display: 'block', mt: 0.45, color: 'base.100' }}>
                    This leads to an external project.
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ) : (
            <MenuItem key={sub.label} component={Link} to={sub.href} onClick={handleDesktopMenuClose} sx={menuItemSx}>
              <Box component="span" sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                <Box className="dropdown-link-marker" component="span" sx={{ width: 3, height: 22, mt: 0.1, borderRadius: 999, bgcolor: 'primary.main', opacity: 0.5, transform: 'scaleY(0.72)', transformOrigin: 'top', transition: 'opacity 180ms ease, transform 180ms ease', flex: 'none' }} />
                <Typography component="span" sx={titleLabelSx}>
                  {sub.label}
                </Typography>
              </Box>
            </MenuItem>
          )
        ))}
      </Menu>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
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
        <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 2.5 }}>
            <Box>
              <Typography variant="h4" component="h2" sx={{ color: 'common.white', lineHeight: 1.12 }}>
                Menu
              </Typography>
            </Box>
            <IconButton
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
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
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 0 }}>
            {navItems.map((item, idx) => (
              <Box key={item.label}>
                {item.disabled ? (
                  <ListItemButton disabled sx={mobileNavButtonSx}>
                    <ListItemText
                      primary={item.label}
                      secondary="Coming soon"
                      slotProps={{
                        primary: { sx: { color: 'base.300', whiteSpace: 'nowrap', ...titleLabelSx } },
                        secondary: { sx: { color: 'base.300', mt: 0.25 } },
                      }}
                    />
                  </ListItemButton>
                ) : item.href ? (
                  <ListItemButton component={Link} to={item.href} onClick={() => setMobileOpen(false)} sx={mobileNavButtonSx}>
                    <ListItemText primary={item.label} slotProps={{ primary: { sx: { color: 'common.white', whiteSpace: 'nowrap', ...titleLabelSx } } }} />
                  </ListItemButton>
                ) : (
                  <Box
                    sx={{
                      borderRadius: 'var(--mui-shape-borderRadius)',
                      border: openDropdown === idx ? theme.navigation.activeBorder : '1px solid rgba(155,162,164,0.18)',
                      bgcolor: openDropdown === idx ? 'translucent.primaryGreen' : 'rgba(81,93,97,0.22)',
                      overflow: 'hidden',
                    }}
                  >
                    <ListItemButton onClick={() => setOpenDropdown((current) => (current === idx ? null : idx))} sx={{ color: 'common.white', justifyContent: 'space-between', px: 1.5, py: 1.25 }}>
                      <ListItemText
                        primary={item.label}
                        secondary={openDropdown === idx ? item.caption : undefined}
                        slotProps={{
                          primary: { sx: { color: 'common.white', whiteSpace: 'nowrap', ...titleLabelSx } },
                          secondary: { sx: { color: 'base.100', mt: 0.45, lineHeight: 1.45 } },
                        }}
                      />
                      {item.dropdown && (openDropdown === idx ? <ExpandLessIcon sx={{ color: 'common.white' }} /> : <ExpandMoreIcon sx={{ color: 'common.white' }} />)}
                    </ListItemButton>

                    <Collapse in={openDropdown === idx} timeout="auto" unmountOnExit>
                      <Box sx={{ mx: 1, mb: 1, pt: 0.75}}>
                        <Typography variant="eyebrow" component="p" sx={{ px: 1.25, pt: 0.7, pb: 0.25 }}>
                          Explore
                        </Typography>
                        {item.dropdown?.map((sub) => (
                          sub.external ? (
                            <ListItemButton key={sub.label} component="a" href={sub.href} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} sx={mobileSubItemSx}>
                              <Box component="span" sx={{ width: 3, height: 22, mt: 0.25, mr: 1.1, borderRadius: 999, bgcolor: 'primary.main', opacity: 0.72, flex: 'none' }} />
                              <ListItemText
                                primary={sub.label}
                                secondary="Opens a related project"
                                slotProps={{
                                  primary: { sx: { color: 'common.white', ...titleLabelSx } },
                                  secondary: { sx: { color: 'base.100', mt: 0.35 } },
                                }}
                              />
                            </ListItemButton>
                          ) : (
                            <ListItemButton key={sub.label} component={Link} to={sub.href} onClick={() => setMobileOpen(false)} sx={mobileSubItemSx}>
                              <Box component="span" sx={{ width: 3, height: 22, mt: 0.25, mr: 1.1, borderRadius: 999, bgcolor: 'primary.main', opacity: 0.72, flex: 'none' }} />
                              <ListItemText primary={sub.label} slotProps={{ primary: { sx: { color: 'common.white', ...titleLabelSx } } }} />
                            </ListItemButton>
                          )
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
    </AppBar>
  );
}

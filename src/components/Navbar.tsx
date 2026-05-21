import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Box, Button, Drawer, IconButton, List, ListItemButton, ListItemText, Menu, MenuItem, Stack, Typography, Collapse, useTheme } from '@mui/material';
import Logo from './Logo';
import MenuIcon from '@mui/icons-material/Menu';
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
  href?: string;
  dropdown?: DropdownItem[];
}

const navItems: NavItem[] = [
  {
    label: 'Scenarios',
    dropdown: [
      { label: 'Adaptation Scenarios', href: '/pages/adaptation-scenarios' },
    ],
  },
  {
    label: 'Get Involved',
    dropdown: [
      { label: 'Public Events', href: '/pages/public-events' },
      { label: 'Participatory Scenario Planning', href: '/pages/scenario-planning' },
      { label: 'Contact Us', href: '/pages/contact-us' },
    ],
  },
  {
    label: 'Repository',
    dropdown: [
      { label: 'Project Documentation & Reports', href: '/pages/project-documentation' },
      { label: 'Service Learning & Education', href: '/pages/service-learning' },
      { label: 'References & Resources', href: '/pages/resources' },
    ],
  },
  {
    label: 'Related Projects',
    dropdown: [
      { label: 'Franks Tract Futures', href: 'https://franks-tract-futures-ucdavis.hub.arcgis.com/', external: true },
      { label: 'Delta Island Adaptations', href: 'https://deltaislandadaptations-ucdavis.hub.arcgis.com/', external: true },
      { label: 'Delta Adapts', href: 'https://www.deltacouncil.ca.gov/delta-plan/climate-change', external: true },
    ],
  },
  {
    label: 'Internal',
    dropdown: [
      { label: 'Design System', href: '/design-system' },
      { label: 'EJ Playground', href: '/pages/playground' },
      { label: 'KelpDiagram', href: '/pages/kelp-diagram' },

    ]
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [desktopAnchorEl, setDesktopAnchorEl] = useState<HTMLElement | null>(null);
  const [desktopMenuIndex, setDesktopMenuIndex] = useState<number | null>(null);
  const theme = useTheme();

  const activeDesktopMenu = desktopMenuIndex !== null ? navItems[desktopMenuIndex] : null;

  const handleDesktopMenuOpen = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setDesktopAnchorEl(event.currentTarget);
    setDesktopMenuIndex(index);
  };

  const handleDesktopMenuClose = () => {
    setDesktopAnchorEl(null);
    setDesktopMenuIndex(null);
  };

  return (
    <AppBar position="sticky" component="nav" color="transparent" elevation={4} sx={{ height: 'auto' }}>
      <Toolbar sx={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 2 }}>
          <Logo />

          <Box sx={{ display: { xs: 'inline-flex', md: 'none' } }}>
            <IconButton aria-label="Toggle menu" onClick={() => setMobileOpen((current) => !current)} sx={{ color: 'brand.primaryGreen' }}>
              <MenuIcon />
            </IconButton>
          </Box>

          <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', pl: theme.jtSpacing.component.lg}}>
            {navItems.map((item, i) => (
              item.href ? (
                <Button
                  key={item.label}
                  component={Link}
                  to={item.href}
                  sx={{
                    minWidth: 140,
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
                    minWidth: 140,
                    whiteSpace: 'nowrap',
                    color: 'common.white',
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

      <Menu
        anchorEl={desktopAnchorEl}
        open={Boolean(desktopAnchorEl && activeDesktopMenu?.dropdown)}
        onClose={handleDesktopMenuClose}
      >
        {activeDesktopMenu?.dropdown?.map((sub) => (
          sub.external ? (
            <MenuItem key={sub.label} component="a" href={sub.href} target="_blank" rel="noopener noreferrer" onClick={handleDesktopMenuClose} sx={{ color: 'common.white' }}>
              {sub.label}
            </MenuItem>
          ) : (
            <MenuItem key={sub.label} component={Link} to={sub.href} onClick={handleDesktopMenuClose} sx={{ color: 'common.white' }}>
              {sub.label}
            </MenuItem>
          )
        ))}
      </Menu>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 320, p: 2 }}>
          <Typography variant="h4" component="div" sx={{ mb: 2, color: 'secondary.main'}}>
            Just Transitions in the Delta
          </Typography>
          <List>
            {navItems.map((item, idx) => (
              <Box key={item.label} sx={{ mb: 1 }}>
                {item.href ? (
                  <ListItemButton component={Link} to={item.href} onClick={() => setMobileOpen(false)} sx={{ color: 'common.white' }}>
                    <ListItemText primary={item.label} slotProps={{ primary: { sx: { color: 'common.white', whiteSpace: 'nowrap' } } }} />
                  </ListItemButton>
                ) : (
                  <>
                    <ListItemButton onClick={() => setOpenDropdown((current) => (current === idx ? null : idx))} sx={{ color: 'common.white', justifyContent: 'space-between' }}>
                      <ListItemText primary={item.label} slotProps={{ primary: { sx: { color: 'common.white', whiteSpace: 'nowrap' } } }} />
                      {item.dropdown && (openDropdown === idx ? <ExpandLessIcon sx={{ color: 'common.white' }} /> : <ExpandMoreIcon sx={{ color: 'common.white' }} />)}
                    </ListItemButton>

                    <Collapse in={openDropdown === idx} timeout="auto" unmountOnExit>
                      <Box sx={{ pl: 2 }}>
                        {item.dropdown?.map((sub) => (
                          sub.external ? (
                            <ListItemButton key={sub.label} component="a" href={sub.href} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} sx={{ color: 'common.white' }}>
                              <ListItemText primary={sub.label} slotProps={{ primary: { sx: { color: 'common.white' } } }} />
                            </ListItemButton>
                          ) : (
                            <ListItemButton key={sub.label} component={Link} to={sub.href} onClick={() => setMobileOpen(false)} sx={{ color: 'common.white' }}>
                              <ListItemText primary={sub.label} slotProps={{ primary: { sx: { color: 'common.white' } } }} />
                            </ListItemButton>
                          )
                        ))}
                      </Box>
                    </Collapse>
                  </>
                )}
              </Box>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}

import { useState } from "react";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Logout from "@mui/icons-material/Logout";
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from '@mui/icons-material/Menu';
import AppsIcon from '@mui/icons-material/Apps';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useTheme, styled, alpha } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import { getUser, setUser } from "../../core/auth/index.js";
import { appRegistry } from "../../core/apps/app-registry.js";

const MobileNavItem = styled(ListItemButton)(({ theme, active }) => ({
  padding: theme.spacing(1, 2.5),
  borderRadius: 0,
  borderLeft: active ? `4px solid #f59e0b` : '4px solid transparent',
  backgroundColor: active ? alpha('#f59e0b', 0.1) : 'transparent',
  '&:hover': {
    backgroundColor: alpha('#f59e0b', 0.05),
    borderLeft: active ? `4px solid #f59e0b` : `4px solid ${theme.palette.divider}`,
  },
  '& .MuiTypography-root': {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: active ? '#f59e0b' : theme.palette.text.primary,
  }
}));

/**
 * Global app shell (single layout wrapper).
 *
 * @param {{ home: { widgets?: { critical?: unknown[]; context?: unknown[] }; apps?: unknown[] } }} props
 */
export default function AppShell() {
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const [accountDrawerOpen, setAccountDrawerOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  
  const isAccountMenuOpen = Boolean(accountAnchorEl);

  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleAccountMenuOpen = (event) => setAccountAnchorEl(event.currentTarget);
  const handleAccountMenuClose = () => setAccountAnchorEl(null);

  // Compute active app based on route
  const pathParts = location.pathname.split('/');
  const activeAppId = (pathParts[1] && pathParts[1] !== 'home') ? pathParts[1] : null;
  const currentApp = activeAppId ? appRegistry.find(a => a.id === decodeURIComponent(activeAppId)) : null;
  
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  
  // Trigger is true when user scrolls down 10px or more
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
  });

  // Determine if the current route is the home page
  const isHome = location.pathname === "/" || location.pathname === "/home" || location.pathname === "/login";

  // Set the background conditionally based on the route
  const shellBgStyles = isHome
    ? {
        backgroundImage: "url('/my_bg.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }
    : {
        backgroundColor: "background.default",
      };

  // Get user context for branding
  const user = getUser();
  const brandName = (location.pathname === '/login') 
    ? "Babyeyi System" 
    : (user?.metadata?.school || "Babyeyi System");
  const brandLogo = user?.metadata?.brandLogo || "/logo.png";

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: "100vh", display: 'flex', flexDirection: 'column', ...shellBgStyles }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: isHome ? "transparent" : "secondary.main",
          color: isHome ? "secondary.main" : "white",
          borderBottom: isHome ? 'none' : '1px solid rgba(255,255,255,0.1)',
          transition: "all 0.3s ease-in-out",
          ...(isHome && trigger && {
            backdropFilter: "blur(8px)",
          }),
        }}
      >
        <Toolbar sx={{ 
          minHeight: isHome ? (isMobile ? 56 : 64) : 38,
          px: isHome ? { xs: 2, md: 4 } : { xs: 1, md: 2 },
          transition: "all 0.3s ease-in-out",
        }}>
          {isHome ? (
            <Stack direction="row" alignItems="center" spacing={2} sx={{ cursor: 'default' }}>
              <Box
                component="img"
                src={brandLogo}
                alt={brandName}
                sx={{
                  height: isMobile ? 32 : 40,
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
              {!isMobile && (
                <Box sx={{ 
                  height: 32, 
                  borderLeft: '1px solid', 
                  borderColor: 'divider',
                  pl: 2,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ 
                      fontWeight: 700, 
                      color: 'secondary.main',
                      lineHeight: 1
                    }}
                  >
                    {brandName}
                  </Typography>
                </Box>
              )}
            </Stack>
          ) : (
            <Stack direction="row" alignItems="center" spacing={isMobile ? 1 : 3} sx={{ mr: 2 }}>
              {isMobile ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <IconButton 
                    color="inherit" 
                    size="small" 
                    onClick={() => setMobileNavOpen(true)}
                    sx={{ p: 0.5 }}
                  >
                    <MenuIcon sx={{ fontSize: 24 }} />
                  </IconButton>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600, 
                    letterSpacing: '0.01em',
                    color: 'white',
                    fontSize: '1.1rem'
                  }}>
                    {currentApp?.name || "App"}
                  </Typography>
                </Stack>
              ) : (
                <Link 
                  to="/"
                  onMouseEnter={() => setIsHeaderHovered(true)}
                  onMouseLeave={() => setIsHeaderHovered(false)}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <AnimatePresence mode="wait">
                      {isHeaderHovered ? (
                        <motion.div
                          key="chevron"
                          initial={{ opacity: 0, x: 5, scale: 0.8 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: 5, scale: 0.8 }}
                          transition={{ duration: 0.15 }}
                        >
                          <ChevronLeftIcon sx={{ fontSize: 24 }} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="logo"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.15 }}
                        >
                          <Box component="img" src="/logo_white.png" sx={{ height: 20, width: 'auto' }} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>

                  <Box sx={{ 
                    height: 24, 
                    borderLeft: '1px solid', 
                    borderColor: 'rgba(255,255,255,0.3)',
                    pl: 1,
                    display: 'flex',
                    alignItems: 'center',
                    overflow: 'hidden'
                  }}>
                    <AnimatePresence mode="wait">
                      {isHeaderHovered ? (
                        <motion.div
                          key="back"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.15 }}
                        >
                          <Typography variant="h5" sx={{ 
                            fontWeight: 700, 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.025em',
                            color: 'rgba(255,255,255,0.8)'
                          }}>
                            Back
                          </Typography>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="title"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.15 }}
                        >
                          <Typography variant="h5" sx={{ 
                            fontWeight: 700, 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.025em',
                            color: 'white',
                            noWrap: true
                          }}>
                            {currentApp?.name || "App"}
                          </Typography>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>
                </Link>
              )}
              
              {/* Sub-navigation Drawer for Mobile */}
              {currentApp && isMobile && (
                <Drawer
                  anchor="left"
                  open={mobileNavOpen}
                  onClose={() => setMobileNavOpen(false)}
                  PaperProps={{ sx: { width: 400, bgcolor: 'background.default' } }}
                >
                  <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<AppsIcon />}
                      onClick={() => { navigate('/'); setMobileNavOpen(false); }}
                      sx={{ 
                        justifyContent: 'flex-start', 
                        bgcolor: 'secondary.main', 
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        textTransform: 'none',
                        py: 1.2,
                        px: 2,
                        borderRadius: '8px',
                        boxShadow: 'none',
                        '&:hover': { bgcolor: 'secondary.dark', boxShadow: 'none' }
                      }}
                    >
                      All Apps
                    </Button>
                    <IconButton onClick={() => setMobileNavOpen(false)} sx={{ color: 'text.secondary' }}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  <Divider />
                  <List disablePadding sx={{ mt: 1 }}>
                    {currentApp.views.map((view) => {
                      const isActive = location.pathname === `/${currentApp.id}/${view.id}` || (location.pathname === `/${currentApp.id}` && currentApp.defaultView === view.id);
                      return (
                        <MobileNavItem 
                          key={view.id} 
                          active={isActive}
                          onClick={() => { navigate(`/${currentApp.id}/${view.id}`); setMobileNavOpen(false); }}
                        >
                          <ListItemText primary={view.label || (view.id === "all" ? (currentApp.id === "students" ? "All Students" : "All") : view.id)} />
                        </MobileNavItem>
                      );
                    })}
                  </List>
                </Drawer>
              )}

              {/* Desktop sub-navigation links */}
              {currentApp && !isMobile && (
                <nav style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {currentApp.views.map((view) => {
                    const isActive = location.pathname === `/${currentApp.id}/${view.id}` || (location.pathname === `/${currentApp.id}` && currentApp.defaultView === view.id);
                    return (
                      <Typography
                        key={view.id}
                        variant="body1"
                        onClick={() => navigate(`/${currentApp.id}/${view.id}`)}
                        sx={{
                          cursor: 'pointer',
                          color: isActive ? '#f59e0b' : 'rgba(255,255,255,0.6)',
                          textTransform: 'capitalize',
                          transition: 'all 0.2s',
                          '&:hover': { color: 'white' }
                        }}
                      >
                        {view.label || (view.id === "all" ? (currentApp.id === "students" ? "All Students" : "All") : view.id)}
                      </Typography>
                    );
                  })}
                </nav>
              )}
            </Stack>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" spacing={0.5} alignItems="center">
            {location.pathname !== '/login' && user && (
              <>
                <IconButton aria-label="notifications" color="inherit" size="small">
                  <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: 16, minWidth: 16 } }}>
                    <NotificationsIcon sx={{ fontSize: 20 }} />
                  </Badge>
                </IconButton>
                <IconButton aria-label="messages" color="inherit" size="small">
                  <Badge badgeContent={2} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: 16, minWidth: 16 } }}>
                    <ChatIcon sx={{ fontSize: 20 }} />
                  </Badge>
                </IconButton>
                <IconButton aria-label="settings" color="inherit" size="small" onClick={() => navigate('/setup')}>
                  <Badge variant="dot" color="warning">
                    <SettingsIcon sx={{ fontSize: 20 }} />
                  </Badge>
                </IconButton>
                <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1, borderColor: isHome ? 'divider' : 'rgba(255,255,255,0.2)' }} />
              </>
            )}
            
            {location.pathname !== '/login' && (
              <Tooltip title="Account settings">
                {!isMobile ? (
                  <Chip
                    label={user?.metadata?.name || "User"}
                    size="small"
                    avatar={<Avatar sx={{ width: 24, height: 24 }}>{user?.metadata?.name?.charAt(0)}</Avatar>}
                    onClick={handleAccountMenuOpen}
                    sx={{
                      height: 32,
                      bgcolor: isHome ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)',
                      color: isHome ? 'text.primary' : 'white',
                      '& .MuiChip-label': { fontWeight: 600, fontSize: '0.8rem' },
                      '&:hover': {
                        bgcolor: isHome ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
                      }
                    }}
                  />
                ) : (
                  <IconButton 
                    size="small" 
                    onClick={() => setAccountDrawerOpen(true)}
                    sx={{ p: 0.5 }}
                  >
                    <Avatar sx={{ width: 28, height: 28, border: '2px solid', borderColor: isHome ? 'primary.main' : 'white' }} />
                  </IconButton>
                )}
              </Tooltip>
            )}

            {/* Desktop Account Menu Dropdown */}
            {location.pathname !== '/login' && (
              <Menu
                anchorEl={accountAnchorEl}
                open={isAccountMenuOpen}
                onClose={handleAccountMenuClose}
                onClick={handleAccountMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      bgcolor: "background.default",
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": { width: 32, height: 32, ml: -0.5, mr: 1 },
                      "&::before": {
                        content: '""', display: "block", position: "absolute", top: 0, right: 14, width: 10, height: 10,
                        bgcolor: "background.default", transform: "translateY(-50%) rotate(45deg)", zIndex: 0,
                      },
                    },
                  },
                }}
              >
                <MenuItem>
                  <Avatar>{user?.metadata?.name?.charAt(0)}</Avatar>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{user?.metadata?.name || "User"}</Typography>
                    <Typography variant="caption" color="text.secondary">{user?.metadata?.email || "user@example.com"}</Typography>
                  </Box>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleAccountMenuClose}>
                  <ListItemIcon><SettingsOutlinedIcon fontSize="small" /></ListItemIcon>
                  Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            )}

            {/* Mobile Account Right Drawer */}
            {location.pathname !== '/login' && (
              <Drawer
                anchor="right"
                open={accountDrawerOpen}
                onClose={() => setAccountDrawerOpen(false)}
                PaperProps={{ sx: { width: 400 } }}
              >
                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar sx={{ width: 56, height: 56 }}>{user?.metadata?.name?.charAt(0)}</Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{user?.metadata?.name || "User"}</Typography>
                      <Typography variant="body2" color="text.secondary">{user?.metadata?.email || "user@example.com"}</Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <List disablePadding>
                    <ListItemButton sx={{ borderRadius: '8px', mb: 0.5 }} onClick={() => setAccountDrawerOpen(false)}>
                      <ListItemIcon><SettingsOutlinedIcon size="small" /></ListItemIcon>
                      <ListItemText primary="Account Settings" />
                    </ListItemButton>
                    <ListItemButton sx={{ borderRadius: '8px', color: 'error.main' }} onClick={handleLogout}>
                      <ListItemIcon><Logout size="small" color="error" /></ListItemIcon>
                      <ListItemText primary="Logout" />
                    </ListItemButton>
                  </List>
                </Box>
              </Drawer>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      <Container 
        component="main"
        maxWidth={isHome ? "lg" : false} 
        disableGutters={!isHome}
        sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: isHome ? 'auto' : 'calc(100vh - 74px)', // Explicit height calculation
          py: isHome ? 3 : 0,
          transition: 'all 0.3s ease-in-out',
          overflow: isHome ? 'visible' : 'hidden'
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}


import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Avatar,
  Badge, Drawer, List, ListItem, ListItemIcon, ListItemText,
  InputBase, Box, Divider, Tooltip, useMediaQuery, useTheme,
  Menu, MenuItem, Chip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Search from '@mui/icons-material/Search';
import Notifications from '@mui/icons-material/Notifications';
import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined';
import Dashboard from '@mui/icons-material/Dashboard';
import Inventory2 from '@mui/icons-material/Inventory2';
import EventNote from '@mui/icons-material/EventNote';
import Person from '@mui/icons-material/Person';
import Logout from '@mui/icons-material/Logout';
import Close from '@mui/icons-material/Close';
import SchoolOutlined from '@mui/icons-material/SchoolOutlined';
import LoginIcon from '@mui/icons-material/Login';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { rentalService, catalogService } from '../services/api';

const navLinks = [
  { label: 'Ana Sayfa', path: '/', icon: <Dashboard /> },
  { label: 'Katalog', path: '/catalog', icon: <Inventory2 /> },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [navbarSearchQuery, setNavbarSearchQuery] = useState('');
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navbarSearchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(navbarSearchQuery.trim())}`);
    } else {
      navigate(`/catalog`);
    }
  };
  const { user, isAuthenticated, logout } = useAuth();

  // Dynamic Notifications states
  const [notifications, setNotifications] = useState([]);
  const [notiAnchorEl, setNotiAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchNotifications();
      // Poll every 15 seconds to keep it fresh
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated, user]);

  const fetchNotifications = async () => {
    try {
      const userId = user?.id || parseInt(localStorage.getItem('userId'));
      if (!userId) return;
      
      // Get incoming requests
      const rentals = await rentalService.getRentals({ ownerUserId: userId });
      const pendingRentals = rentals.filter(r => r.status === 'PENDING');
      
      // Resolve item details to show beautiful notification titles
      const enrichingNotifications = [];
      for (const req of pendingRentals) {
        let title = `Eşya #${req.itemId}`;
        try {
          const item = await catalogService.getItemById(req.itemId);
          title = item.title;
        } catch {}
        enrichingNotifications.push({
          id: req.id,
          itemId: req.itemId,
          itemTitle: title,
          totalPrice: req.totalPrice,
          renterUserId: req.renterUserId,
        });
      }
      setNotifications(enrichingNotifications);
    } catch (error) {
      console.error('Failed to load notifications in Navbar:', error);
    }
  };

  const handleNotiClick = (event) => {
    setNotiAnchorEl(event.currentTarget);
  };

  const handleNotiClose = () => {
    setNotiAnchorEl(null);
  };

  const handleNotiItemClick = (id) => {
    handleNotiClose();
    // Redirect to rentals page, incoming tab
    navigate('/rentals');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getUserInitials = () => {
    if (user && user.firstName && user.lastName) {
      return `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`;
    }
    return 'CS';
  };

  // Add pages requiring auth to navigation if user is logged in
  const activeNavLinks = [...navLinks];
  if (isAuthenticated) {
    activeNavLinks.push({ label: 'Kiralamalarım', path: '/rentals', icon: <EventNote /> });
    activeNavLinks.push({ label: 'Profil', path: '/profile', icon: <Person /> });
  }

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(226,232,240,0.6)',
          zIndex: 1200,
        }}
      >
        <Toolbar className="flex justify-between items-center px-4 md:px-8 py-1">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-underline group">
            <Box
              sx={{
                width: 40, height: 40, borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              <SchoolOutlined sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em',
                fontSize: '1.15rem',
              }}
            >
              Campus<span style={{ color: '#6366f1' }}>Share</span>
            </Typography>
          </Link>          {/* Search bar (desktop) */}
          {!isMobile && (
            <Box
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{
                flex: 1, maxWidth: 420, mx: 4,
                display: 'flex', alignItems: 'center',
                background: searchFocused ? '#fff' : '#f1f5f9',
                borderRadius: '14px', px: 1.5, py: 0.6,
                border: searchFocused ? '2px solid #6366f1' : '2px solid transparent',
                transition: 'all 0.3s',
                boxShadow: searchFocused ? '0 0 0 4px rgba(99,102,241,0.1)' : 'none',
              }}
            >
              <Search sx={{ color: '#94a3b8', fontSize: 20, mr: 1 }} />
              <InputBase
                placeholder="Kampüste ne kiralamak istersin?"
                value={navbarSearchQuery}
                onChange={(e) => setNavbarSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                sx={{
                  flex: 1, fontSize: '0.875rem',
                  fontFamily: '"Inter", sans-serif',
                  '& input::placeholder': { color: '#94a3b8' },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="small"
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  borderRadius: '10px',
                  px: 2.5,
                  py: 0.6,
                  minWidth: 'fit-content',
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
                    boxShadow: 'none',
                  }
                }}
              >
                Ara
              </Button>
            </Box>
          )}
          {/* Navigation links (desktop) */}
          {!isMobile && (
            <Box className="flex items-center gap-1">
              {activeNavLinks.map((link) => (
                <Button
                  key={link.path}
                  component={Link}
                  to={link.path}
                  startIcon={link.icon}
                  sx={{
                    color: location.pathname === link.path ? '#6366f1' : '#64748b',
                    background: location.pathname === link.path ? 'rgba(99,102,241,0.08)' : 'transparent',
                    fontWeight: location.pathname === link.path ? 700 : 500,
                    fontSize: '0.82rem', px: 1.5, py: 0.8,
                    borderRadius: '10px',
                    '&:hover': {
                      background: 'rgba(99,102,241,0.06)',
                      color: '#6366f1',
                    },
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Right side actions */}
          <Box className="flex items-center gap-1.5 ml-2">
            {isMobile && (
              <IconButton sx={{ color: '#64748b' }}>
                <Search />
              </IconButton>
            )}

            {isAuthenticated ? (
              <>
                <Tooltip title="Bildirimler">
                  <IconButton 
                    onClick={handleNotiClick}
                    sx={{ color: '#64748b', '&:hover': { color: '#6366f1' } }}
                  >
                    <Badge
                      badgeContent={notifications.length}
                      sx={{
                        '& .MuiBadge-badge': {
                          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                          color: '#fff', fontSize: '0.65rem', fontWeight: 700,
                          minWidth: 18, height: 18,
                        },
                      }}
                    >
                      <Notifications fontSize="small" />
                    </Badge>
                  </IconButton>
                </Tooltip>

                {/* Notifications Dropdown Panel */}
                <Menu
                  anchorEl={notiAnchorEl}
                  open={Boolean(notiAnchorEl)}
                  onClose={handleNotiClose}
                  disableScrollLock
                  PaperProps={{
                    sx: {
                      width: 320,
                      maxHeight: 400,
                      mt: 1.5,
                      borderRadius: '16px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      overflow: 'hidden',
                      '& .MuiList-root': {
                        p: 0,
                      }
                    }
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <Box sx={{ p: 2, background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }} className="flex justify-between items-center">
                    <Typography sx={{ fontWeight: 800, fontSize: '0.88rem', color: '#1e293b' }}>
                      Bildirimler ({notifications.length})
                    </Typography>
                    {notifications.length > 0 && (
                      <Chip 
                        label="Yeni" 
                        size="small" 
                        sx={{ 
                          background: '#fee2e2', 
                          color: '#ef4444', 
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          height: 20
                        }} 
                      />
                    )}
                  </Box>
                  <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <Box sx={{ py: 4, px: 2, textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '2rem', mb: 1 }}>🔔</Typography>
                        <Typography sx={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>
                          Yeni bildiriminiz bulunmuyor.
                        </Typography>
                      </Box>
                    ) : (
                      notifications.map((noti) => (
                        <MenuItem 
                          key={noti.id} 
                          onClick={() => handleNotiItemClick(noti.id)}
                          sx={{ 
                            py: 1.8, 
                            px: 2, 
                            borderBottom: '1px solid #f1f5f9',
                            whiteSpace: 'normal',
                            '&:hover': { background: '#f5f3ff' }
                          }}
                        >
                          <Box className="flex flex-col gap-0.5" sx={{ width: '100%' }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#1e293b', lineHeight: 1.3 }}>
                              Yeni Kiralama Talebi! 📬
                            </Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.4 }}>
                              Bir öğrenci <strong>{noti.itemTitle}</strong> eşyanızı kiralamak istiyor.
                            </Typography>
                            <Typography sx={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: 700, mt: 0.5 }}>
                              Kiralama Fiyatı: {noti.totalPrice}₺ • Onay Bekliyor
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))
                    )}
                  </Box>
                  {notifications.length > 0 && (
                    <Box sx={{ p: 1.5, background: '#f8fafc', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <Button 
                        fullWidth 
                        size="small" 
                        onClick={() => handleNotiItemClick(null)}
                        sx={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          color: '#6366f1',
                          textTransform: 'none'
                        }}
                      >
                        Tüm Talepleri Yönet
                      </Button>
                    </Box>
                  )}
                </Menu>

                {!isMobile && (
                  <Button
                    variant="contained"
                    startIcon={<AddCircleOutlined />}
                    component={Link}
                    to="/catalog/new"
                    sx={{
                      ml: 1, borderRadius: '12px', px: 2.5,
                      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                      fontSize: '0.82rem',
                      boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
                        background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
                      },
                    }}
                  >
                    İlan Ver
                  </Button>
                )}

                <Tooltip title="Profil Menüsü">
                  <Avatar
                    onClick={handleProfileClick}
                    sx={{
                      width: 36, height: 36, ml: 1,
                      background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                      color: '#4f46e5', fontWeight: 700, fontSize: '0.8rem',
                      border: '2px solid #fff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textDecoration: 'none',
                      '&:hover': { transform: 'scale(1.08)' },
                    }}
                  >
                    {getUserInitials()}
                  </Avatar>
                </Tooltip>

                <Menu
                  anchorEl={profileAnchorEl}
                  open={Boolean(profileAnchorEl)}
                  onClose={handleProfileClose}
                  disableScrollLock
                  PaperProps={{
                    sx: {
                      width: 200,
                      mt: 1.5,
                      borderRadius: '16px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                    }
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={() => { handleProfileClose(); navigate('/profile'); }} sx={{ py: 1.2, px: 2, fontSize: '0.88rem' }}>
                    <Person fontSize="small" sx={{ mr: 1.5, color: '#64748b' }} />
                    Profilim
                  </MenuItem>
                  <MenuItem onClick={() => { handleProfileClose(); navigate('/rentals'); }} sx={{ py: 1.2, px: 2, fontSize: '0.88rem' }}>
                    <EventNote fontSize="small" sx={{ mr: 1.5, color: '#64748b' }} />
                    Kiralamalarım
                  </MenuItem>
                  <Divider sx={{ my: 1 }} />
                  <MenuItem onClick={() => { handleProfileClose(); handleLogout(); }} sx={{ py: 1.2, px: 2, fontSize: '0.88rem', color: '#ef4444' }}>
                    <Logout fontSize="small" sx={{ mr: 1.5, color: '#ef4444' }} />
                    Çıkış Yap
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="outlined"
                component={Link}
                to="/login"
                startIcon={<LoginIcon />}
                sx={{
                  borderRadius: '12px',
                  borderColor: '#6366f1',
                  color: '#6366f1',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'rgba(99,102,241,0.05)',
                    borderColor: '#4f46e5',
                  }
                }}
              >
                Giriş Yap
              </Button>
            )}

            {isMobile && (
              <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: '#334155', ml: 0.5 }}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280, borderRadius: '24px 0 0 24px',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        <Box className="p-4">
          <Box className="flex justify-between items-center mb-6">
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Menü
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          {isAuthenticated ? (
            <Box className="flex items-center gap-3 mb-6 p-3 rounded-2xl" sx={{ background: '#f1f5f9' }}>
              <Avatar sx={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', width: 44, height: 44 }}>
                {getUserInitials()}
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {user ? `${user.firstName} ${user.lastName}` : 'Öğrenci'}
                </Typography>
                <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                  Güven Skoru: {user?.trustScore || 0}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Button
              fullWidth
              variant="contained"
              component={Link}
              to="/login"
              onClick={() => setDrawerOpen(false)}
              sx={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', mb: 3, borderRadius: '12px', py: 1.2 }}
            >
              Giriş Yap / Kayıt Ol
            </Button>
          )}

          <Divider sx={{ mb: 2 }} />

          <List>
            {activeNavLinks.map((link) => (
              <ListItem
                key={link.path}
                component={Link}
                to={link.path}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  borderRadius: '12px', mb: 0.5,
                  color: location.pathname === link.path ? '#6366f1' : '#475569',
                  background: location.pathname === link.path ? 'rgba(99,102,241,0.08)' : 'transparent',
                  '&:hover': { background: 'rgba(99,102,241,0.06)' },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  {link.icon}
                </ListItemIcon>
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{ fontWeight: location.pathname === link.path ? 700 : 500, fontSize: '0.9rem' }}
                />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          {isAuthenticated && (
            <>
              <Button
                fullWidth variant="contained" startIcon={<AddCircleOutlined />}
                component={Link} to="/catalog/new"
                onClick={() => setDrawerOpen(false)}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)', mb: 1.5,
                  borderRadius: '12px', py: 1.3,
                }}
              >
                İlan Ver
              </Button>

              <Button
                fullWidth variant="outlined" startIcon={<Logout />}
                onClick={() => { setDrawerOpen(false); handleLogout(); }}
                sx={{ borderRadius: '12px', py: 1.2, borderColor: '#e2e8f0', color: '#ef4444' }}
              >
                Çıkış Yap
              </Button>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
}

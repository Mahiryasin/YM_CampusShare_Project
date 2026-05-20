import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Box, Grid, Card,
  Chip, Avatar, AvatarGroup, CircularProgress
} from '@mui/material';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Inventory2 from '@mui/icons-material/Inventory2';
import EventNote from '@mui/icons-material/EventNote';
import People from '@mui/icons-material/People';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Star from '@mui/icons-material/Star';
import SchoolOutlined from '@mui/icons-material/SchoolOutlined';
import SecurityOutlined from '@mui/icons-material/SecurityOutlined';
import SpeedOutlined from '@mui/icons-material/SpeedOutlined';
import VerifiedOutlined from '@mui/icons-material/VerifiedOutlined';
import { Link } from 'react-router-dom';
import { catalogService, rentalService, authService } from '../services/api';

const features = [
  {
    icon: <SecurityOutlined sx={{ fontSize: 28 }} />,
    title: 'Güvenli Kiralama',
    desc: 'Kampüs içi doğrulanmış öğrenci profilleri ile güvenli alışveriş deneyimi.',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  },
  {
    icon: <SpeedOutlined sx={{ fontSize: 28 }} />,
    title: 'Hızlı Eşleşme',
    desc: 'Akıllı filtreleme sistemiyle saniyeler içinde ihtiyacına uygun eşyayı bul.',
    gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
  },
  {
    icon: <VerifiedOutlined sx={{ fontSize: 28 }} />,
    title: 'Güven Puanı',
    desc: 'Her işlemde güven puanı kazan, kampüste itibarını oluştur.',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
  },
];

const categories = [
  { name: 'Elektronik', emoji: '💻' },
  { name: 'Kitap & Eğitim', emoji: '📚' },
  { name: 'Outdoor', emoji: '⛺' },
  { name: 'Müzik', emoji: '🎸' },
  { name: 'Spor', emoji: '⚽' },
  { name: 'Ev & Yaşam', emoji: '🏠' },
];

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [rentalsCount, setRentalsCount] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [userCount, setUserCount] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeStats() {
      setLoading(true);
      try {
        // Fetch all active items from catalog-service
        const itemsData = await catalogService.getAllItems();
        setItems(itemsData);
      } catch (error) {
        console.error('Failed to load home items:', error);
      }

      try {
        // Fetch users count dynamically
        const count = await authService.getUserCount();
        if (typeof count === 'number') {
          setUserCount(count);
        }
      } catch (error) {
        console.error('Failed to load home user count:', error);
      }

      try {
        // Fetch rentals (safe-guard in case rental-service is offline)
        const rentalsData = await rentalService.getRentals();
        if (Array.isArray(rentalsData)) {
          setRentalsCount(rentalsData.length);
          const savings = rentalsData.reduce((sum, r) => sum + (r.totalPrice || 0), 0);
          setTotalSavings(savings);
        }
      } catch (error) {
        console.error('Rental service offline/error:', error);
      } finally {
        setLoading(false);
      }
    }
    loadHomeStats();
  }, []);

  const getCategoryCount = (categoryName) => {
    return items.filter((item) => item.category === categoryName).length;
  };

  // Real statistics incorporating live database numbers
  const statsList = [
    { icon: <Inventory2 />, value: `${items.length}`, label: 'Aktif İlan', color: '#6366f1' },
    { icon: <People />, value: `${Math.max(1, userCount)}`, label: 'Öğrenci', color: '#10b981' },
    { icon: <EventNote />, value: `${rentalsCount}`, label: 'Kiralama', color: '#f59e0b' },
    { icon: <TrendingUp />, value: `₺${totalSavings.toLocaleString('tr-TR')}`, label: 'Tasarruf', color: '#3b82f6' },
  ];

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* =================== HERO =================== */}
      <Box
        sx={{
          position: 'relative',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 100%)',
          pt: { xs: 10, md: 14 }, pb: { xs: 12, md: 18 },
          overflow: 'hidden',
        }}
      >
        {/* Decorative blobs */}
        <Box sx={{
          position: 'absolute', top: -120, right: -80,
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <Box sx={{
          position: 'absolute', bottom: -100, left: -60,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        {/* Grid pattern */}
        <Box sx={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                icon={<SchoolOutlined sx={{ color: '#a5b4fc !important', fontSize: 16 }} />}
                label="Kampüs İçi Paylaşım Platformu"
                sx={{
                  mb: 3, background: 'rgba(99,102,241,0.12)',
                  color: '#c7d2fe', fontWeight: 600,
                  border: '1px solid rgba(165,180,252,0.2)',
                  '& .MuiChip-icon': { color: '#a5b4fc' },
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  color: '#fff', fontWeight: 900,
                  fontSize: { xs: '2rem', sm: '2.8rem', md: '3.4rem' },
                  lineHeight: 1.12, mb: 3, letterSpacing: '-0.03em',
                }}
              >
                Kampüsünde{' '}
                <Box component="span" sx={{
                  background: 'linear-gradient(135deg, #818cf8, #6366f1, #a78bfa)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  Paylaş
                </Box>
                ,<br />
                Kazan ve{' '}
                <Box component="span" sx={{
                  background: 'linear-gradient(135deg, #34d399, #10b981)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  Tasarruf Et!
                </Box>
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(203,213,225,0.85)', fontSize: { xs: '1rem', md: '1.15rem' },
                  lineHeight: 1.7, mb: 5, maxWidth: 540, fontWeight: 400,
                }}
              >
                Kullanmadığın eşyalarını kirala, ihtiyacın olanı kampüs içindeki
                arkadaşlarından güvenle temin et. Öğrenci doğrulanmalı platform.
              </Typography>

              <Box className="flex flex-wrap gap-3">
                <Button
                  variant="contained" size="large"
                  endIcon={<ArrowForward />}
                  component={Link} to="/catalog"
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    px: 4, py: 1.6, fontSize: '0.95rem', borderRadius: '14px',
                    boxShadow: '0 8px 30px rgba(99,102,241,0.35)',
                    '&:hover': {
                      boxShadow: '0 12px 40px rgba(99,102,241,0.45)',
                      background: 'linear-gradient(135deg, #818cf8, #6366f1)',
                    },
                  }}
                >
                  Kataloğu İncele
                </Button>
                <Button
                  variant="outlined" size="large"
                  component={Link} to="/how-it-works"
                  sx={{
                    borderColor: 'rgba(148,163,184,0.3)', color: '#e2e8f0',
                    px: 4, py: 1.6, fontSize: '0.95rem', borderRadius: '14px',
                    '&:hover': {
                      borderColor: 'rgba(148,163,184,0.5)',
                      background: 'rgba(255,255,255,0.05)',
                    },
                  }}
                >
                  Nasıl Çalışır?
                </Button>
              </Box>

              {/* Social proof */}
              <Box className="flex items-center gap-3 mt-8">
                <AvatarGroup max={4} sx={{
                  '& .MuiAvatar-root': {
                    width: 34, height: 34, fontSize: '0.7rem', fontWeight: 700,
                    border: '2px solid #1e1b4b',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  },
                }}>
                  <Avatar>A</Avatar>
                  <Avatar sx={{ background: 'linear-gradient(135deg, #10b981, #14b8a6) !important' }}>B</Avatar>
                  <Avatar sx={{ background: 'linear-gradient(135deg, #f59e0b, #f97316) !important' }}>C</Avatar>
                  <Avatar>D</Avatar>
                  <Avatar>E</Avatar>
                </AvatarGroup>
                <Box>
                  <Typography sx={{ color: '#e2e8f0', fontSize: '0.82rem', fontWeight: 600 }}>
                    {Math.max(1, userCount)} Kayıtlı Öğrenci
                  </Typography>
                  <Box className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} sx={{ color: '#fbbf24', fontSize: 14 }} />
                    ))}
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.72rem', ml: 0.5 }}>
                      4.9 puan
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Right side - visual card stack */}
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              <Box sx={{ position: 'relative', width: 340, height: 280 }}>
                {/* Back card */}
                <Card sx={{
                  position: 'absolute', top: 40, left: 30,
                  width: 280, height: 200, borderRadius: '20px !important',
                  background: 'rgba(99,102,241,0.12)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  backdropFilter: 'blur(20px)',
                  transform: 'rotate(-6deg)',
                  boxShadow: 'none',
                  '&:hover': { transform: 'rotate(-6deg) !important', boxShadow: 'none !important' },
                }} />
                {/* Middle card */}
                <Card sx={{
                  position: 'absolute', top: 20, left: 15,
                  width: 280, height: 200, borderRadius: '20px !important',
                  background: 'rgba(99,102,241,0.18)',
                  border: '1px solid rgba(99,102,241,0.25)',
                  backdropFilter: 'blur(20px)',
                  transform: 'rotate(-3deg)',
                  boxShadow: 'none',
                  '&:hover': { transform: 'rotate(-3deg) !important', boxShadow: 'none !important' },
                }} />
                {/* Front card */}
                <Card sx={{
                  position: 'absolute', top: 0, left: 0,
                  width: 280, borderRadius: '20px !important',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(20px)',
                  p: 3, boxShadow: 'none',
                  '&:hover': { transform: 'none !important', boxShadow: 'none !important' },
                }}>
                  <Box sx={{
                    width: '100%', height: 120, borderRadius: '14px',
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))',
                    mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Typography sx={{ fontSize: '3rem' }}>📷</Typography>
                  </Box>
                  <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem', mb: 0.5 }}>
                    Sony A7III Kamera
                  </Typography>
                  <Typography sx={{ color: '#94a3b8', fontSize: '0.8rem', mb: 1.5 }}>
                    Elektronik • Çok İyi Durumda
                  </Typography>
                  <Box className="flex justify-between items-center">
                    <Typography sx={{
                      color: '#818cf8', fontWeight: 800, fontSize: '1.2rem',
                    }}>
                      250₺<Typography component="span" sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 400 }}> /gün</Typography>
                    </Typography>
                    <Box className="flex items-center gap-0.5">
                      <Star sx={{ color: '#fbbf24', fontSize: 16 }} />
                      <Typography sx={{ color: '#e2e8f0', fontSize: '0.8rem', fontWeight: 600 }}>4.8</Typography>
                    </Box>
                  </Box>
                </Card>

                {/* Floating badge */}
                <Box sx={{
                  position: 'absolute', bottom: 80, right: -20,
                  background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                  borderRadius: '14px', px: 2, py: 1.2,
                  backdropFilter: 'blur(12px)',
                }}>
                  <Typography sx={{ color: '#34d399', fontSize: '0.7rem', fontWeight: 600 }}>
                    ✓ Doğrulanmış İlan
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* =================== STATS BAR =================== */}
      <Container maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 20 }}>
        <Card sx={{
          borderRadius: '20px !important', p: { xs: 3, md: 4 },
          background: '#fff', border: '1px solid rgba(226,232,240,0.8)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.06)',
          '&:hover': { transform: 'none !important' },
        }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 1.5 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {statsList.map((stat, idx) => (
                <Grid item xs={6} md={3} key={idx}>
                  <Box className="flex items-center gap-3">
                    <Box sx={{
                      width: 48, height: 48, borderRadius: '14px',
                      background: `${stat.color}12`, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      color: stat.color,
                    }}>
                      {stat.icon}
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: '#1e293b', lineHeight: 1.2 }}>
                        {stat.value}
                      </Typography>
                      <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 500 }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Card>
      </Container>

      {/* =================== CATEGORIES =================== */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <Box className="text-center" sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{
            fontWeight: 800, color: '#1e293b', mb: 2,
            fontSize: { xs: '1.6rem', md: '2.2rem' },
            letterSpacing: '-0.02em'
          }}>
            Kategorilere Göz At
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '1.05rem', maxWidth: 500, mx: 'auto' }}>
            Kampüsteki tüm ilanları kategorilere göre filtrele
          </Typography>
        </Box>

        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            gap: 3.5,
            width: '100%',
            px: { xs: 2, md: 0 }
          }}
        >
          {categories.map((cat, idx) => (
            <Box
              key={idx}
              component={Link}
              to={`/catalog?category=${cat.name}`}
              sx={{
                width: { xs: 'calc(50% - 14px)', sm: '180px', md: '180px' },
                minWidth: '150px',
                textAlign: 'center',
                p: 3,
                cursor: 'pointer',
                textDecoration: 'none',
                background: '#ffffff',
                borderRadius: '24px',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.02)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  borderColor: '#6366f1',
                  transform: 'translateY(-6px)',
                  boxShadow: '0 12px 30px rgba(99, 102, 241, 0.1)',
                  '& .emoji-box': { 
                    transform: 'scale(1.1) rotate(4deg)',
                    background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
                  },
                },
              }}
            >
              <Box 
                className="emoji-box" 
                sx={{
                  width: 64, height: 64, borderRadius: '18px',
                  background: '#f1f5f9', mx: 'auto', mb: 2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.8rem', transition: 'all 0.3s ease',
                }}
              >
                {cat.emoji}
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e293b', mb: 0.5 }}>
                {cat.name}
              </Typography>
              <Typography sx={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600 }}>
                {getCategoryCount(cat.name)} ilan
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* =================== FEATURES =================== */}
      <Box sx={{ background: '#f8fafc', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box className="text-center mb-10">
            <Typography variant="h4" sx={{
              fontWeight: 800, color: '#1e293b', mb: 1.5,
              fontSize: { xs: '1.5rem', md: '2rem' },
            }}>
              Neden CampusShare?
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '1rem', maxWidth: 500, mx: 'auto' }}>
              Öğrenciler tarafından, öğrenciler için tasarlandı
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feat, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Card sx={{
                  p: 4, height: '100%',
                  '&:hover .feat-icon': {
                    transform: 'scale(1.1) rotate(5deg)',
                  },
                }}>
                  <Box
                    className="feat-icon"
                    sx={{
                      width: 56, height: 56, borderRadius: '16px',
                      background: feat.gradient,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', mb: 3, transition: 'transform 0.3s',
                      boxShadow: `0 8px 24px ${feat.gradient.includes('#6366f1') ? 'rgba(99,102,241,0.3)' : feat.gradient.includes('#10b981') ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                    }}
                  >
                    {feat.icon}
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b', mb: 1 }}>
                    {feat.title}
                  </Typography>
                  <Typography sx={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.7 }}>
                    {feat.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* =================== CTA =================== */}
      <Box sx={{
        background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
        py: { xs: 8, md: 10 },
      }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{
            color: '#fff', fontWeight: 800, mb: 2,
            fontSize: { xs: '1.4rem', md: '2rem' },
          }}>
            Hemen Başla, Kampüsünü Keşfet!
          </Typography>
          <Typography sx={{ color: 'rgba(203,213,225,0.8)', mb: 4, fontSize: '1rem' }}>
            Binlerce öğrenci zaten CampusShare kullanıyor. Sen de katıl!
          </Typography>
          <Box className="flex justify-center gap-3 flex-wrap">
            <Button
              variant="contained" size="large"
              component={Link} to="/catalog"
              sx={{
                background: '#fff', color: '#312e81',
                px: 4, py: 1.5, fontWeight: 700, borderRadius: '14px',
                '&:hover': { background: '#f1f5f9', boxShadow: '0 8px 30px rgba(255,255,255,0.2)' },
              }}
            >
              Kataloğa Git
            </Button>
            <Button
              variant="outlined" size="large"
              component={Link} to="/catalog/new"
              sx={{
                borderColor: 'rgba(255,255,255,0.25)', color: '#fff',
                px: 4, py: 1.5, fontWeight: 700, borderRadius: '14px',
                '&:hover': { borderColor: '#fff', background: 'rgba(255,255,255,0.05)' },
              }}
            >
              İlan Oluştur
            </Button>
          </Box>
        </Container>
      </Box>

      {/* =================== FOOTER =================== */}
      <Box sx={{ background: '#0f172a', py: 5 }}>
        <Container maxWidth="lg">
          <Box className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Box className="flex items-center gap-2">
              <SchoolOutlined sx={{ color: '#6366f1', fontSize: 22 }} />
              <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>
                Campus<span style={{ color: '#6366f1' }}>Share</span>
              </Typography>
            </Box>
            <Typography sx={{ color: '#475569', fontSize: '0.78rem' }}>
              © 2026 CampusShare — YM Project. Tüm hakları saklıdır.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

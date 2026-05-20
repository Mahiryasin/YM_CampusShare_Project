import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Grid, Card, CardContent,
  Chip, Avatar, Divider, LinearProgress, CircularProgress, Alert, Button
} from '@mui/material';
import Person from '@mui/icons-material/Person';
import Star from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';
import Inventory2 from '@mui/icons-material/Inventory2';
import EventNote from '@mui/icons-material/EventNote';
import VerifiedUser from '@mui/icons-material/VerifiedUser';
import School from '@mui/icons-material/School';
import Email from '@mui/icons-material/Email';
import Badge from '@mui/icons-material/Badge';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Message from '@mui/icons-material/Message';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { catalogService, rentalService, reviewService, authService } from '../services/api';

export default function ProfilePage() {
  const { user, isAuthenticated, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const [stats, setStats] = useState({
    myListingsCount: 0,
    myRentalsCount: 0,
    activeRentalsCount: 0,
    completedRentalsCount: 0,
  });
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(5.0);
  const [reviewerNames, setReviewerNames] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    refreshProfile();
    fetchUserStatsAndReviews();
  }, [isAuthenticated, navigate]);

  const fetchUserStatsAndReviews = async () => {
    try {
      setLoading(true);
      const userId = user?.id || parseInt(localStorage.getItem('userId'));
      
      // Get user items count
      const myListings = await catalogService.getAllItems(null, userId);
      
      // Get user rentals
      const myRentals = await rentalService.getRentals({ renterUserId: userId });
      const myActiveRentals = myRentals.filter(r => r.status === 'ACTIVE' || r.status === 'PENDING');
      const myCompletedRentals = myRentals.filter(r => r.status === 'COMPLETED' || r.status === 'RETURNED');

      setStats({
        myListingsCount: myListings.length,
        myRentalsCount: myRentals.length,
        activeRentalsCount: myActiveRentals.length,
        completedRentalsCount: myCompletedRentals.length
      });

      // Fetch reviews left for this user
      try {
        const userReviews = await reviewService.getReviewsForUser(userId);
        setReviews(userReviews);

        // Fetch average rating
        const avg = await reviewService.getAverageRatingForUser(userId);
        setAverageRating(avg);

        // Resolve names for reviewers
        const names = {};
        for (const rev of userReviews) {
          if (rev.reviewerUserId && !names[rev.reviewerUserId]) {
            try {
              const prof = await authService.getProfile(rev.reviewerUserId);
              names[rev.reviewerUserId] = `${prof.firstName} ${prof.lastName}`;
            } catch {
              names[rev.reviewerUserId] = `Kullanıcı #${rev.reviewerUserId}`;
            }
          }
        }
        setReviewerNames(names);
      } catch (revError) {
        console.error('Failed to fetch reviews:', revError);
      }

    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  // Calculate dynamic trust score based on review ratings (average out of 5 stars maps to percentage out of 100)
  const trustScore = Math.round(averageRating * 20);
  const trustColor = trustScore >= 80 ? '#10b981' : trustScore >= 50 ? '#f59e0b' : '#ef4444';
  const userInitials = `${user.firstName?.[0]?.toUpperCase() || ''}${user.lastName?.[0]?.toUpperCase() || ''}`;

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      {/* Header with cover */}
      <Box sx={{
        position: 'relative',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
        pt: 6, pb: 16, px: 2,
        overflow: 'hidden',
      }}>
        {/* Decorative elements */}
        <Box sx={{
          position: 'absolute', top: -80, right: -40,
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <Box sx={{
          position: 'absolute', bottom: -60, left: -30,
          width: 250, height: 250, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)',
          filter: 'blur(40px)',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
          <Typography variant="h3" sx={{
            color: '#fff', fontWeight: 800, mb: 1,
            fontSize: { xs: '1.6rem', md: '2.2rem' },
          }}>
            Profilim
          </Typography>
          <Typography sx={{ color: 'rgba(203,213,225,0.7)', fontSize: '0.95rem' }}>
            Hesap bilgilerini görüntüle ve doğrulamalarını kontrol et
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -10 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
            <CircularProgress color="primary" size={50} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Profile card */}
            <Grid item xs={12} md={4}>
              <Card sx={{
                borderRadius: '24px !important', overflow: 'visible',
                boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
                '&:hover': { transform: 'none !important' },
              }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  {/* Avatar */}
                  <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                    <Avatar sx={{
                      width: 100, height: 100,
                      background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                      fontSize: '2rem', fontWeight: 800,
                      border: '4px solid #fff',
                      boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
                    }}>
                      {userInitials}
                    </Avatar>
                  </Box>

                  <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: '#1e293b' }}>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem', mb: 2 }}>
                    {localStorage.getItem('email') || `${user.firstName.toLowerCase()}.${user.lastName.toLowerCase()}@edu.tr`}
                  </Typography>

                  <Box className="flex justify-center gap-2 mb-3">
                    <Chip
                      icon={<VerifiedUser sx={{ fontSize: '16px !important' }} />}
                      label="Öğrenci"
                      size="small"
                      sx={{
                        background: '#e0e7ff', color: '#4338ca',
                        fontWeight: 700, '& .MuiChip-icon': { color: '#4338ca' },
                      }}
                    />
                    <Chip
                      label="Aktif"
                      size="small"
                      sx={{
                        background: '#dcfce7',
                        color: '#166534',
                        fontWeight: 700,
                      }}
                    />
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Trust Score */}
                  <Box sx={{ mb: 3 }}>
                    <Box className="flex justify-between items-center mb-1.5">
                      <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#475569' }}>
                        Güven Puanı
                      </Typography>
                      <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: trustColor }}>
                        {trustScore}/100
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={trustScore}
                      sx={{
                        height: 8, borderRadius: 10, background: '#f1f5f9',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 10,
                          background: `linear-gradient(90deg, ${trustColor}, ${trustColor}cc)`,
                        },
                      }}
                    />
                  </Box>

                  {/* Info items */}
                  <Box className="flex flex-col gap-2.5 text-left">
                    {[
                      { icon: <School sx={{ fontSize: 18 }} />, label: 'Öğrenci No', value: user.studentNumber },
                      { icon: <Email sx={{ fontSize: 18 }} />, label: 'E-posta', value: localStorage.getItem('email') || 'ornek@edu.tr' },
                      { icon: <Badge sx={{ fontSize: 18 }} />, label: 'Hesap Tipi', value: 'Kampüs Üyesi (Doğrulanmış)' },
                    ].map((item, idx) => (
                      <Box key={idx} className="flex items-center gap-3" sx={{
                        background: '#f8fafc', borderRadius: '12px', p: 1.5,
                      }}>
                        <Box sx={{ color: '#94a3b8' }}>{item.icon}</Box>
                        <Box>
                          <Typography sx={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 500 }}>{item.label}</Typography>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', color: '#334155' }}>{item.value}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                    sx={{
                      mt: 3,
                      borderRadius: '12px',
                      py: 1.2,
                      fontWeight: 700,
                      textTransform: 'none',
                      borderColor: '#fca5a5',
                      color: '#ef4444',
                      '&:hover': {
                        background: '#fef2f2',
                        borderColor: '#ef4444',
                      }
                    }}
                  >
                    Çıkış Yap
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Right content */}
            <Grid item xs={12} md={8}>
              {/* Stats grid */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                  { label: 'İlanlarım', value: stats.myListingsCount, icon: <Inventory2 />, color: '#6366f1', bg: '#eef2ff' },
                  { label: 'Kiralamalarım', value: stats.myRentalsCount, icon: <EventNote />, color: '#3b82f6', bg: '#eff6ff' },
                  { label: 'Aktif Kiralamalar', value: stats.activeRentalsCount, icon: <Star />, color: '#10b981', bg: '#ecfdf5' },
                  { label: 'Tamamlanan', value: stats.completedRentalsCount, icon: <TrendingUp />, color: '#f59e0b', bg: '#fffbeb' },
                ].map((stat, idx) => (
                  <Grid item xs={6} md={3} key={idx}>
                    <Card sx={{
                      p: 2, textAlign: 'center', borderRadius: '16px !important',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                      '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.06)' },
                    }}>
                      <Box sx={{
                        width: 40, height: 40, borderRadius: '12px',
                        background: stat.bg, mx: 'auto', mb: 1.5,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: stat.color,
                      }}>
                        {stat.icon}
                      </Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: '#1e293b' }}>
                        {stat.value}
                      </Typography>
                      <Typography sx={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 500 }}>
                        {stat.label}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Reviews Card */}
              <Card sx={{
                borderRadius: '20px !important', mb: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                '&:hover': { transform: 'none !important' },
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box className="flex items-center gap-2 mb-3">
                    <Message sx={{ color: '#6366f1' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Kampüsteki Öğrenci Değerlendirmeleri ({reviews.length})
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />

                  {reviews.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                        Henüz bir değerlendirme yapılmamış. Kiralamalar tamamlandıkça yorumlar burada listelenir!
                      </Typography>
                    </Box>
                  ) : (
                    <Box className="flex flex-col gap-4">
                      {reviews.map((rev) => (
                        <Box key={rev.id} sx={{
                          background: '#f8fafc', p: 2.5, borderRadius: '16px',
                          border: '1px solid #f1f5f9'
                        }}>
                          <Box className="flex justify-between items-center mb-1">
                            <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e293b' }}>
                              {reviewerNames[rev.reviewerUserId] || `Kullanıcı #${rev.reviewerUserId}`}
                            </Typography>
                            <Box className="flex">
                              {[1, 2, 3, 4, 5].map((s) => (
                                s <= rev.rating 
                                  ? <Star key={s} sx={{ color: '#fbbf24', fontSize: 16 }} />
                                  : <StarBorder key={s} sx={{ color: '#cbd5e1', fontSize: 16 }} />
                              ))}
                            </Box>
                          </Box>
                          <Typography sx={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.5, mb: 1 }}>
                            {rev.comment || 'Puanlama yapıldı, yorum bırakılmadı.'}
                          </Typography>
                          <Typography sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                            İlan ID: #{rev.itemId} • {new Date(rev.createdDate).toLocaleDateString('tr-TR')}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Information Card */}
              <Card sx={{
                borderRadius: '20px !important',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                '&:hover': { transform: 'none !important' },
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>🛡️ Güvenli Kampüs Topluluğu</Typography>
                  <Typography sx={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.7, mb: 2 }}>
                    CampusShare, sadece doğrulanmış üniversite öğrencileri arasındaki yardımlaşmayı hedefler. Eşyalarınızı kiralarken ve teslim alırken özenli davranmanız, topluluk içindeki <strong>Güven Puanınızı</strong> artırır.
                  </Typography>
                  <Typography sx={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.7 }}>
                    Bilgilerinizi güncellemek veya herhangi bir sorun bildirmek için CampusShare Destek Ekibi ile iletişime geçebilirsiniz.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Grid, Card, CardContent,
  Button, Chip, IconButton, Tooltip, Dialog,
  DialogTitle, DialogContent, DialogActions, Divider,
  LinearProgress, Tabs, Tab, Alert, CircularProgress, TextField
} from '@mui/material';
import Person from '@mui/icons-material/Person';
import Inventory2 from '@mui/icons-material/Inventory2';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Cancel from '@mui/icons-material/Cancel';
import HourglassEmpty from '@mui/icons-material/HourglassEmpty';
import PlayCircle from '@mui/icons-material/PlayCircle';
import Done from '@mui/icons-material/Done';
import Block from '@mui/icons-material/Block';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import AttachMoney from '@mui/icons-material/AttachMoney';
import Visibility from '@mui/icons-material/Visibility';
import RateReview from '@mui/icons-material/RateReview';
import Star from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { rentalService, catalogService, authService, reviewService } from '../services/api';

/* ---------- RentalStatus matching backend enum ---------- */
const STATUS_CONFIG = {
  PENDING:   { label: 'Beklemede',   color: '#f59e0b', bg: '#fef3c7', icon: <HourglassEmpty sx={{ fontSize: 16 }} /> },
  APPROVED:  { label: 'Onaylandı',   color: '#10b981', bg: '#d1fae5', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
  REJECTED:  { label: 'Reddedildi',  color: '#ef4444', bg: '#fee2e2', icon: <Cancel sx={{ fontSize: 16 }} /> },
  ACTIVE:    { label: 'Devam Ediyor', color: '#3b82f6', bg: '#dbeafe', icon: <PlayCircle sx={{ fontSize: 16 }} /> },
  COMPLETED: { label: 'Tamamlandı',  color: '#8b5cf6', bg: '#ede9fe', icon: <Done sx={{ fontSize: 16 }} /> },
  CANCELLED: { label: 'İptal',       color: '#6b7280', bg: '#f3f4f6', icon: <Block sx={{ fontSize: 16 }} /> },
};

export default function RentalsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState(0); // 0 = outgoing (benim kiralamalarım), 1 = incoming (bana gelen talepler)
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Cache stores to resolve names/titles dynamically
  const [itemCache, setItemCache] = useState({});
  const [userCache, setUserCache] = useState({});
  const [detailRental, setDetailRental] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Review System states
  const [reviewTargetRental, setReviewTargetRental] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewedRentals, setReviewedRentals] = useState(() => {
    const saved = localStorage.getItem('reviewedRentals');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchRentals();
  }, [isAuthenticated, tab, navigate]);

  const fetchRentals = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const userId = user?.id || parseInt(localStorage.getItem('userId'));
      let data = [];
      if (tab === 0) {
        // Fetch kiraladıklarım (outgoing)
        data = await rentalService.getRentals({ renterUserId: userId });
      } else {
        // Fetch bana gelen talepler (incoming)
        data = await rentalService.getRentals({ ownerUserId: userId });
      }
      setRentals(data);

      // Async resolve item titles and renter profile details to enrich UI
      resolveEnrichments(data);
    } catch (error) {
      console.error(error);
      setErrorMsg('Kiralamalarınız yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const resolveEnrichments = async (rentalList) => {
    const resolvedItems = { ...itemCache };
    const resolvedUsers = { ...userCache };

    for (const rental of rentalList) {
      // Resolve item title
      if (rental.itemId && !resolvedItems[rental.itemId]) {
        try {
          const item = await catalogService.getItemById(rental.itemId);
          resolvedItems[rental.itemId] = item.title;
        } catch {
          resolvedItems[rental.itemId] = `Eşya #${rental.itemId}`;
        }
      }

      // Resolve renter name for incoming requests
      if (rental.renterUserId && !resolvedUsers[rental.renterUserId]) {
        try {
          const profile = await authService.getProfile(rental.renterUserId);
          resolvedUsers[rental.renterUserId] = `${profile.firstName} ${profile.lastName}`;
        } catch {
          resolvedUsers[rental.renterUserId] = `Kullanıcı #${rental.renterUserId}`;
        }
      }
    }

    setItemCache(resolvedItems);
    setUserCache(resolvedUsers);
  };

  const handleUpdateStatus = async (rental, newStatus) => {
    setActionLoadingId(rental.id);
    try {
      await rentalService.updateRental(rental.id, {
        itemId: rental.itemId,
        renterUserId: rental.renterUserId,
        ownerUserId: rental.ownerUserId,
        startDate: rental.startDate,
        endDate: rental.endDate,
        totalPrice: rental.totalPrice,
        status: newStatus
      });
      // Refresh list
      fetchRentals();
    } catch (error) {
      console.error(error);
      alert('Kiralama durumu güncellenirken bir hata oluştu.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewTargetRental) return;
    setReviewSubmitting(true);
    try {
      const reviewerUserId = user?.id || parseInt(localStorage.getItem('userId'));
      
      // Submit the review to review-service
      await reviewService.createReview({
        rentalId: reviewTargetRental.id,
        reviewerUserId: reviewerUserId,
        targetUserId: reviewTargetRental.ownerUserId, // Rate the owner
        itemId: reviewTargetRental.itemId,
        rating: reviewRating,
        comment: reviewComment
      });

      // Keep track of reviewed rentals
      const updated = [...reviewedRentals, reviewTargetRental.id];
      setReviewedRentals(updated);
      localStorage.setItem('reviewedRentals', JSON.stringify(updated));

      // Close Dialog
      setReviewTargetRental(null);
      setReviewComment('');
      setReviewRating(5);
      alert('Değerlendirmeniz başarıyla gönderildi! Diğer öğrenciler bu yorumu profil sayfasında görebilecek.');
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Değerlendirme gönderilirken bir hata oluştu.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const filtered = statusFilter === 'ALL'
    ? rentals
    : rentals.filter((r) => r.status === statusFilter);

  // Summary stats calculations
  const totalSpent = rentals.filter(r => r.renterUserId === user?.id && ['APPROVED', 'ACTIVE', 'COMPLETED'].includes(r.status)).reduce((s, r) => s + r.totalPrice, 0);
  const totalEarned = rentals.filter(r => r.ownerUserId === user?.id && ['APPROVED', 'ACTIVE', 'COMPLETED'].includes(r.status)).reduce((s, r) => s + r.totalPrice, 0);
  const activeCount = rentals.filter((r) => r.status === 'ACTIVE').length;
  const pendingCount = rentals.filter((r) => r.status === 'PENDING').length;

  const summaryCards = [
    { label: 'Toplam Harcama', value: `${totalSpent}₺`, icon: <AttachMoney />, color: '#ef4444', bg: '#fef2f2' },
    { label: 'Toplam Kazanç', value: `${totalEarned}₺`, icon: <AttachMoney />, color: '#10b981', bg: '#ecfdf5' },
    { label: 'Aktif Kiralama', value: activeCount, icon: <PlayCircle />, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Bekleyen Talep', value: pendingCount, icon: <HourglassEmpty />, color: '#f59e0b', bg: '#fffbeb' },
  ];

  const getDaysLeft = (endDate) => {
    const diff = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      {/* Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
        pt: 6, pb: 10, px: 2,
      }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{
            color: '#fff', fontWeight: 800, mb: 1,
            fontSize: { xs: '1.6rem', md: '2.2rem' },
          }}>
            Kiralamalarım
          </Typography>
          <Typography sx={{ color: 'rgba(203,213,225,0.7)', fontSize: '0.95rem' }}>
            Tüm kiralama işlemlerini takip et ve gelen talepleri yönet
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -5 }}>
        {/* Summary cards */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {summaryCards.map((card, idx) => (
            <Grid item xs={6} md={3} key={idx}>
              <Card sx={{
                p: 2.5, borderRadius: '18px !important',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                '&:hover': { transform: 'none !important' },
              }}>
                <Box className="flex items-center gap-3">
                  <Box sx={{
                    width: 44, height: 44, borderRadius: '12px',
                    background: card.bg, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: card.color,
                  }}>
                    {card.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#1e293b', lineHeight: 1.2 }}>
                      {card.value}
                    </Typography>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 500 }}>
                      {card.label}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Tabs + Filter */}
        <Card sx={{
          mb: 3, borderRadius: '18px !important',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          '&:hover': { transform: 'none !important' },
        }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tab}
              onChange={(_, v) => { setTab(v); setStatusFilter('ALL'); }}
              sx={{
                px: 2,
                '& .MuiTab-root': {
                  fontWeight: 600, textTransform: 'none', fontSize: '0.9rem',
                  minHeight: 52,
                },
                '& .Mui-selected': { color: '#6366f1' },
                '& .MuiTabs-indicator': { backgroundColor: '#6366f1', borderRadius: '4px 4px 0 0', height: 3 },
              }}
            >
              <Tab label="Kiraladıklarım" />
              <Tab label="Gelen Talepler" />
            </Tabs>
          </Box>

          {/* Status filter chips */}
          <Box className="flex gap-2 flex-wrap p-3">
            {['ALL', ...Object.keys(STATUS_CONFIG)].map((status) => {
              const isAll = status === 'ALL';
              const conf = STATUS_CONFIG[status];
              return (
                <Chip
                  key={status}
                  label={isAll ? 'Tümü' : conf.label}
                  icon={isAll ? undefined : conf.icon}
                  clickable
                  onClick={() => setStatusFilter(status)}
                  size="small"
                  sx={{
                    fontWeight: 600, fontSize: '0.75rem',
                    background: statusFilter === status
                      ? (isAll ? '#6366f1' : conf.color) : (isAll ? '#f1f5f9' : conf.bg),
                    color: statusFilter === status
                      ? '#fff' : (isAll ? '#64748b' : conf.color),
                    border: 'none',
                    '& .MuiChip-icon': {
                      color: statusFilter === status ? '#fff' : conf?.color,
                    },
                  }}
                />
              );
            })}
          </Box>
        </Card>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
            {errorMsg}
          </Alert>
        )}

        {/* Rentals list */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
            <CircularProgress color="primary" size={50} />
          </Box>
        ) : (
          <Box className="flex flex-col gap-3">
            {filtered.map((rental) => {
              const conf = STATUS_CONFIG[rental.status] || STATUS_CONFIG.PENDING;
              const daysLeft = getDaysLeft(rental.endDate);
              const itemTitle = itemCache[rental.itemId] || `Yükleniyor (Eşya #${rental.itemId})`;
              const renterName = userCache[rental.renterUserId] || `Kullanıcı #${rental.renterUserId}`;
              const alreadyReviewed = reviewedRentals.includes(rental.id);

              return (
                <Card key={rental.id} sx={{
                  borderRadius: '18px !important', overflow: 'hidden',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                  borderLeft: `4px solid ${conf.color}`,
                  '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.06)' },
                }}>
                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <Grid container spacing={2} alignItems="center">
                      {/* Item info */}
                      <Grid item xs={12} md={4}>
                        <Box className="flex items-center gap-3">
                          <Box sx={{
                            width: 50, height: 50, borderRadius: '14px',
                            background: `${conf.color}12`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Inventory2 sx={{ color: conf.color, fontSize: 22 }} />
                          </Box>
                          <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>
                              {itemTitle}
                            </Typography>
                            <Box className="flex items-center gap-1 mt-0.5">
                              <Person sx={{ fontSize: 14, color: '#94a3b8' }} />
                              <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                                {tab === 0 ? `Sahip ID: #${rental.ownerUserId}` : `Kiralayan: ${renterName}`}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>

                      {/* Dates */}
                      <Grid item xs={6} md={2.5}>
                        <Box className="flex items-center gap-1.5">
                          <CalendarMonth sx={{ color: '#94a3b8', fontSize: 16 }} />
                          <Box>
                            <Typography sx={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 500 }}>Tarih Aralığı</Typography>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#334155' }}>
                              {rental.startDate} → {rental.endDate}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      {/* Price */}
                      <Grid item xs={6} md={1.5}>
                        <Typography sx={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 500 }}>Toplam</Typography>
                        <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#6366f1' }}>
                          {rental.totalPrice}₺
                        </Typography>
                      </Grid>

                      {/* Status */}
                      <Grid item xs={6} md={2}>
                        <Chip
                          icon={conf.icon}
                          label={conf.label}
                          size="small"
                          sx={{
                            background: conf.bg, color: conf.color,
                            fontWeight: 700, fontSize: '0.75rem',
                            '& .MuiChip-icon': { color: conf.color },
                          }}
                        />
                        {rental.status === 'ACTIVE' && daysLeft > 0 && (
                          <Typography sx={{ color: '#94a3b8', fontSize: '0.65rem', mt: 0.5 }}>
                            {daysLeft} gün kaldı
                          </Typography>
                        )}
                      </Grid>

                      {/* Actions */}
                      <Grid item xs={6} md={2} sx={{ textAlign: 'right' }}>
                        <Box className="flex justify-end gap-1">
                          <Tooltip title="Detay">
                            <IconButton
                              onClick={() => setDetailRental({ ...rental, itemTitle, renterName })}
                              sx={{
                                border: '1px solid #e2e8f0', borderRadius: '10px',
                                '&:hover': { borderColor: '#c7d2fe', background: '#f5f3ff' },
                              }}
                            >
                              <Visibility sx={{ fontSize: 18, color: '#64748b' }} />
                            </IconButton>
                          </Tooltip>

                          {/* Write Review for Completed Rentals (Outgoing only) */}
                          {tab === 0 && rental.status === 'COMPLETED' && (
                            <Tooltip title={alreadyReviewed ? "Değerlendirildi" : "Yorum Yap"}>
                              <IconButton
                                disabled={alreadyReviewed}
                                onClick={() => setReviewTargetRental({ ...rental, itemTitle })}
                                sx={{
                                  border: '1px solid #e0e7ff', borderRadius: '10px',
                                  background: alreadyReviewed ? '#f1f5f9' : '#eef2ff',
                                  '&:hover': { background: '#e0e7ff' },
                                }}
                              >
                                <RateReview sx={{ fontSize: 18, color: alreadyReviewed ? '#94a3b8' : '#6366f1' }} />
                              </IconButton>
                            </Tooltip>
                          )}

                          {/* Incoming pending approvals */}
                          {tab === 1 && rental.status === 'PENDING' && (
                            <>
                              <Tooltip title="Onayla">
                                <IconButton
                                  disabled={actionLoadingId === rental.id}
                                  onClick={() => handleUpdateStatus(rental, 'APPROVED')}
                                  sx={{
                                    border: '1px solid #d1fae5', borderRadius: '10px',
                                    background: '#ecfdf5',
                                    '&:hover': { background: '#d1fae5' },
                                  }}
                                >
                                  {actionLoadingId === rental.id ? <CircularProgress size={16} color="success" /> : <CheckCircle sx={{ fontSize: 18, color: '#10b981' }} />}
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reddet">
                                <IconButton
                                  disabled={actionLoadingId === rental.id}
                                  onClick={() => handleUpdateStatus(rental, 'REJECTED')}
                                  sx={{
                                    border: '1px solid #fee2e2', borderRadius: '10px',
                                    background: '#fef2f2',
                                    '&:hover': { background: '#fee2e2' },
                                  }}
                                >
                                  {actionLoadingId === rental.id ? <CircularProgress size={16} color="error" /> : <Cancel sx={{ fontSize: 18, color: '#ef4444' }} />}
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              );
            })}

            {filtered.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <Typography sx={{ fontSize: '3rem', mb: 2 }}>📋</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b', mb: 1 }}>
                  Kiralama Bulunamadı
                </Typography>
                <Typography sx={{ color: '#94a3b8' }}>
                  Bu filtreye uygun kiralama işlemi bulunmuyor
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Container>

      {/* Detail Dialog */}
      <Dialog
        open={!!detailRental}
        onClose={() => setDetailRental(null)}
        maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: '24px' } }}
      >
        {detailRental && (() => {
          const conf = STATUS_CONFIG[detailRental.status] || STATUS_CONFIG.PENDING;
          return (
            <>
              <DialogTitle sx={{ pb: 1 }}>
                <Box className="flex justify-between items-center">
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Kiralama Detayı</Typography>
                  <IconButton onClick={() => setDetailRental(null)}><Cancel /></IconButton>
                </Box>
              </DialogTitle>
              <Divider />
              <DialogContent sx={{ p: 3.5 }}>
                <Box className="flex items-center gap-3 mb-4">
                  <Box sx={{
                    width: 56, height: 56, borderRadius: '16px',
                    background: `${conf.color}12`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Inventory2 sx={{ color: conf.color, fontSize: 26 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                      {detailRental.itemTitle}
                    </Typography>
                    <Chip
                      icon={conf.icon}
                      label={conf.label}
                      size="small"
                      sx={{
                        mt: 0.5, background: conf.bg, color: conf.color,
                        fontWeight: 700, '& .MuiChip-icon': { color: conf.color },
                      }}
                    />
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  {[
                    { label: 'Kiralama ID', value: `#${detailRental.id}` },
                    { label: 'Eşya ID', value: `#${detailRental.itemId}` },
                    { label: 'Kiralayan', value: detailRental.renterName },
                    { label: 'Sahip ID', value: `#${detailRental.ownerUserId}` },
                    { label: 'Başlangıç', value: detailRental.startDate },
                    { label: 'Bitiş', value: detailRental.endDate },
                    { label: 'Toplam Fiyat', value: `${detailRental.totalPrice}₺` },
                  ].map((item, idx) => (
                    <Grid item xs={6} key={idx}>
                      <Box sx={{ background: '#f8fafc', borderRadius: '12px', p: 2 }}>
                        <Typography sx={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 500, mb: 0.3 }}>
                          {item.label}
                        </Typography>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e293b' }}>
                          {item.value}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </DialogContent>
            </>
          );
        })()}
      </Dialog>

      {/* Review Dialog */}
      <Dialog
        open={!!reviewTargetRental}
        onClose={() => setReviewTargetRental(null)}
        maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: '24px' } }}
      >
        {reviewTargetRental && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box className="flex justify-between items-center">
                <Typography variant="h6" sx={{ fontWeight: 700 }}>İşlemi Değerlendir</Typography>
                <IconButton onClick={() => setReviewTargetRental(null)}><Cancel /></IconButton>
              </Box>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 3 }}>
              <Typography sx={{ color: '#64748b', fontSize: '0.85rem', mb: 2 }}>
                <strong>{reviewTargetRental.itemTitle}</strong> işlemini tamamladınız. Lütfen kiralama deneyiminizi ve ilan sahibini değerlendirin:
              </Typography>

              {/* Star selector */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <IconButton key={star} onClick={() => setReviewRating(star)} sx={{ p: 0.5 }}>
                    {star <= reviewRating 
                      ? <Star sx={{ color: '#fbbf24', fontSize: 36 }} /> 
                      : <StarBorder sx={{ color: '#cbd5e1', fontSize: 36 }} />
                    }
                  </IconButton>
                ))}
              </Box>

              {/* Comment input */}
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                label="Deneyiminizi anlatın..."
                placeholder="Eşya temiz miydi? İlan sahibiyle iletişiminiz nasıldı? Diğer öğrencilere yardımcı olun..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                InputProps={{
                  sx: { borderRadius: '12px !important' }
                }}
              />
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button 
                onClick={() => setReviewTargetRental(null)} 
                sx={{ color: '#64748b' }}
              >
                İptal
              </Button>
              <Button
                variant="contained"
                disabled={reviewSubmitting}
                onClick={handleSubmitReview}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  boxShadow: '0 4px 14px rgba(99,102,241,0.25)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #818cf8, #6366f1)',
                  }
                }}
              >
                {reviewSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Gönder'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

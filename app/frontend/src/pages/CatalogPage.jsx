import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Grid, Card, CardContent, CardActions,
  Button, Chip, TextField, InputAdornment, MenuItem, Select,
  FormControl, InputLabel, IconButton, Tooltip, Dialog,
  DialogTitle, DialogContent, DialogActions, Divider, Switch,
  FormControlLabel, Alert, CircularProgress
} from '@mui/material';
import Search from '@mui/icons-material/Search';
import Add from '@mui/icons-material/Add';
import Star from '@mui/icons-material/Star';
import Visibility from '@mui/icons-material/Visibility';
import Delete from '@mui/icons-material/Delete';
import Close from '@mui/icons-material/Close';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import LocalOffer from '@mui/icons-material/LocalOffer';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import AttachMoney from '@mui/icons-material/AttachMoney';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { catalogService, rentalService } from '../services/api';

const allCategories = ['Tümü', 'Elektronik', 'Outdoor', 'Müzik', 'Kitap & Eğitim', 'Spor', 'Ev & Yaşam'];
const conditionLabels = { NEW: 'Sıfır', GOOD: 'İyi', FAIR: 'Orta' };
const conditionColors = { NEW: '#10b981', GOOD: '#3b82f6', FAIR: '#f59e0b' };

const categoryEmojis = {
  'Elektronik': '💻', 'Outdoor': '⛺', 'Müzik': '🎸',
  'Kitap & Eğitim': '📚', 'Spor': '⚽', 'Ev & Yaşam': '🏠',
};

export default function CatalogPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  
  // Dialog controls
  const [detailItem, setDetailItem] = useState(null);
  const [rentalItem, setRentalItem] = useState(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [rentalLoading, setRentalLoading] = useState(false);
  const [rentalError, setRentalError] = useState('');
  const [rentalSuccess, setRentalSuccess] = useState('');

  // Sync state with URL search params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const catParam = params.get('category');
    
    if (searchParam) {
      setSearchQuery(decodeURIComponent(searchParam));
    } else {
      setSearchQuery('');
    }
    
    if (catParam) {
      setSelectedCategory(catParam);
    } else {
      setSelectedCategory('Tümü');
    }
  }, [location.search]);

  // Fetch items on mount and category filter change
  useEffect(() => {
    fetchCatalogItems();
  }, [selectedCategory]);

  const fetchCatalogItems = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const categoryParam = selectedCategory === 'Tümü' ? null : selectedCategory;
      const data = await catalogService.getAllItems(categoryParam);
      setItems(data);
    } catch (error) {
      console.error(error);
      setErrorMsg('Katalog yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleRentalSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!startDate || !endDate) {
      setRentalError('Lütfen tarih aralığını seçin.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      setRentalError('Bitiş tarihi başlangıç tarihinden sonra olmalıdır.');
      return;
    }

    setRentalError('');
    setRentalSuccess('');
    setRentalLoading(true);

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = diffDays * rentalItem.dailyPrice;

    try {
      await rentalService.createRental({
        itemId: rentalItem.id,
        renterUserId: user.id,
        ownerUserId: rentalItem.ownerUserId,
        startDate: startDate,
        endDate: endDate,
        totalPrice: totalPrice,
        status: 'PENDING'
      });

      setRentalSuccess('Kiralama talebiniz başarıyla gönderildi! Yönlendiriliyorsunuz...');
      setTimeout(() => {
        setRentalItem(null);
        setDetailItem(null);
        navigate('/rentals');
      }, 2000);
    } catch (error) {
      console.error(error);
      setRentalError(error.response?.data?.message || 'Kiralama talebi gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setRentalLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Bu ilanı tamamen kaldırmak istediğinizden emin misiniz?')) {
      try {
        await catalogService.deleteItem(itemId);
        setItems(items.filter(item => item.id !== itemId));
      } catch (error) {
        console.error(error);
        alert('İlan silinirken bir hata oluştu.');
      }
    }
  };

  const toggleFav = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const getCalculatedTotal = () => {
    if (!rentalItem) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end) || end <= start) return 0;
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * rentalItem.dailyPrice;
  };

  const filteredItems = items
    .filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((item) => !showAvailableOnly || item.isAvailable)
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.dailyPrice - b.dailyPrice;
      if (sortBy === 'price_desc') return b.dailyPrice - a.dailyPrice;
      return new Date(b.createdDate || b.id) - new Date(a.createdDate || a.id);
    });

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      {/* Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)',
        pt: 6, pb: 10, px: 2,
      }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{
            color: '#fff', fontWeight: 800, mb: 1,
            fontSize: { xs: '1.6rem', md: '2.2rem' },
          }}>
            Kampüs Kataloğu
          </Typography>
          <Typography sx={{ color: 'rgba(203,213,225,0.7)', fontSize: '0.95rem' }}>
            {filteredItems.length} aktif ilan listelendi • Paylaş, Koru, Kazan!
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -5 }}>
        {/* Filter card */}
        <Card sx={{
          p: { xs: 2.5, md: 3.5 }, mb: 4,
          borderRadius: '20px !important',
          boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
          '&:hover': { transform: 'none !important' },
        }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                placeholder="Eşya ara... (Örn: Kamera, Çadır)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: '#f8fafc',
                    '&:hover fieldset': { borderColor: '#c7d2fe' },
                    '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6} md={2.5}>
              <FormControl fullWidth>
                <InputLabel>Sırala</InputLabel>
                <Select value={sortBy} label="Sırala" onChange={(e) => setSortBy(e.target.value)}>
                  <MenuItem value="newest">En Yeni</MenuItem>
                  <MenuItem value="price_asc">Fiyat ↑</MenuItem>
                  <MenuItem value="price_desc">Fiyat ↓</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2.5}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showAvailableOnly}
                    onChange={(e) => setShowAvailableOnly(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#10b981' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#10b981' },
                    }}
                  />
                }
                label={<Typography sx={{ fontSize: '0.82rem', fontWeight: 500 }}>Sadece Müsait</Typography>}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth variant="contained" startIcon={<Add />}
                component={Link} to="/catalog/new"
                sx={{
                  py: 1.6,
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                }}
              >
                Yeni İlan
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* Category chips */}
        <Box className="flex gap-2 flex-wrap mb-6">
          {allCategories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              clickable
              onClick={() => setSelectedCategory(cat)}
              sx={{
                px: 1.5, py: 2.5, fontWeight: 600, fontSize: '0.82rem',
                background: selectedCategory === cat
                  ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#fff',
                color: selectedCategory === cat ? '#fff' : '#64748b',
                border: selectedCategory === cat ? 'none' : '1px solid #e2e8f0',
                boxShadow: selectedCategory === cat ? '0 4px 14px rgba(99,102,241,0.25)' : 'none',
                '&:hover': {
                  background: selectedCategory === cat
                    ? 'linear-gradient(135deg, #818cf8, #6366f1)' : '#f8fafc',
                },
              }}
            />
          ))}
        </Box>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
            {errorMsg}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
            <CircularProgress color="primary" size={50} />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {filteredItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                  <Card sx={{
                    height: '100%', display: 'flex', flexDirection: 'column',
                    overflow: 'hidden', position: 'relative',
                    opacity: item.isAvailable ? 1 : 0.75,
                  }}>
                    <Box sx={{
                      height: 180, position: 'relative', overflow: 'hidden',
                      background: `linear-gradient(135deg, ${conditionColors[item.condition]}15, ${conditionColors[item.condition]}08)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Typography sx={{ fontSize: '3.5rem' }}>
                        {categoryEmojis[item.category] || '📦'}
                      </Typography>

                      <Chip
                        size="small"
                        label={conditionLabels[item.condition]}
                        sx={{
                          position: 'absolute', top: 12, left: 12,
                          background: `${conditionColors[item.condition]}18`,
                          color: conditionColors[item.condition],
                          fontWeight: 700, fontSize: '0.7rem',
                          border: `1px solid ${conditionColors[item.condition]}30`,
                        }}
                      />

                      {!item.isAvailable && (
                        <Box sx={{
                          position: 'absolute', inset: 0,
                          background: 'rgba(15,23,42,0.5)', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Chip label="Kiralandı" sx={{
                            background: 'rgba(239,68,68,0.9)', color: '#fff',
                            fontWeight: 700,
                          }} />
                        </Box>
                      )}

                      <IconButton
                        onClick={(e) => { e.stopPropagation(); toggleFav(item.id); }}
                        sx={{
                          position: 'absolute', top: 8, right: 8,
                          background: 'rgba(255,255,255,0.85)',
                          backdropFilter: 'blur(8px)',
                          width: 34, height: 34,
                          '&:hover': { background: '#fff' },
                        }}
                      >
                        {favorites.has(item.id)
                          ? <Favorite sx={{ fontSize: 18, color: '#ef4444' }} />
                          : <FavoriteBorder sx={{ fontSize: 18, color: '#94a3b8' }} />
                        }
                      </IconButton>
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                      <Box className="flex items-start justify-between mb-1.5">
                        <Typography sx={{
                          fontWeight: 700, fontSize: '0.95rem', color: '#1e293b',
                          lineHeight: 1.3, pr: 1,
                          display: '-webkit-box', WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                          {item.title}
                        </Typography>
                      </Box>

                      <Typography sx={{
                        color: '#94a3b8', fontSize: '0.78rem', mb: 2,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        lineHeight: 1.5,
                      }}>
                        {item.description}
                      </Typography>

                      <Box className="flex items-center gap-2 mb-2">
                        <Chip
                          size="small"
                          icon={<LocalOffer sx={{ fontSize: '14px !important' }} />}
                          label={item.category}
                          sx={{
                            background: '#f1f5f9', color: '#475569',
                            fontWeight: 600, fontSize: '0.7rem',
                            '& .MuiChip-icon': { color: '#94a3b8' },
                          }}
                        />
                      </Box>

                      <Box className="flex justify-between items-end">
                        <Box>
                          <Typography sx={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Günlük Fiyat
                          </Typography>
                          <Typography sx={{
                            fontWeight: 800, fontSize: '1.25rem',
                            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                          }}>
                            {item.dailyPrice}₺
                          </Typography>
                        </Box>
                        <Box className="flex items-center gap-0.5" sx={{ background: '#fefce8', px: 1, py: 0.4, borderRadius: '8px' }}>
                          <Star sx={{ color: '#f59e0b', fontSize: 15 }} />
                          <Typography sx={{ color: '#92400e', fontSize: '0.75rem', fontWeight: 700 }}>
                            4.8
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>

                    <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0, gap: 1 }}>
                      <Button
                        fullWidth variant="contained" size="small"
                        disabled={!item.isAvailable}
                        onClick={() => { setDetailItem(item); setRentalItem(item); }}
                        sx={{
                          py: 1.1, borderRadius: '12px',
                          background: item.isAvailable
                            ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#e2e8f0',
                          fontSize: '0.8rem',
                        }}
                      >
                        {item.isAvailable ? 'Kirala' : 'Müsait Değil'}
                      </Button>
                      <Tooltip title="Detay">
                        <IconButton
                          onClick={() => setDetailItem(item)}
                          sx={{
                            border: '1px solid #e2e8f0', borderRadius: '12px',
                            '&:hover': { borderColor: '#c7d2fe', background: '#f5f3ff' },
                          }}
                        >
                          <Visibility sx={{ fontSize: 18, color: '#64748b' }} />
                        </IconButton>
                      </Tooltip>
                      {isAuthenticated && item.ownerUserId === user?.id && (
                        <Tooltip title="İlanı Sil">
                          <IconButton
                            onClick={() => handleDeleteItem(item.id)}
                            sx={{
                              border: '1px solid #fee2e2', borderRadius: '12px',
                              background: '#fef2f2',
                              '&:hover': { background: '#fecaca' },
                            }}
                          >
                            <Delete sx={{ fontSize: 18, color: '#ef4444' }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {filteredItems.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 12 }}>
                <Typography sx={{ fontSize: '3rem', mb: 2 }}>🔍</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#1e293b', mb: 1 }}>
                  Eşya Bulunamadı
                </Typography>
                <Typography sx={{ color: '#94a3b8' }}>
                  Farklı bir arama terimi veya kategori deneyin
                </Typography>
              </Box>
            )}
          </>
        )}
      </Container>

      {/* ========== Detail & Rental Dialog ========== */}
      <Dialog
        open={!!detailItem}
        onClose={() => { setDetailItem(null); setRentalItem(null); setRentalError(''); }}
        maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: '24px', overflow: 'hidden' } }}
      >
        {detailItem && (
          <>
            <Box sx={{
              height: 200,
              background: `linear-gradient(135deg, ${conditionColors[detailItem.condition]}20, ${conditionColors[detailItem.condition]}08)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <Typography sx={{ fontSize: '5rem' }}>
                {categoryEmojis[detailItem.category] || '📦'}
              </Typography>
              <IconButton
                onClick={() => { setDetailItem(null); setRentalItem(null); setRentalError(''); }}
                sx={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.8)' }}
              >
                <Close />
              </IconButton>
            </Box>
            <DialogContent sx={{ p: 4 }}>
              <Box className="flex items-start justify-between mb-3">
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
                  {detailItem.title}
                </Typography>
                <Chip
                  label={detailItem.isAvailable ? 'Müsait' : 'Kiralandı'}
                  sx={{
                    background: detailItem.isAvailable ? '#dcfce7' : '#fef2f2',
                    color: detailItem.isAvailable ? '#166534' : '#dc2626',
                    fontWeight: 700,
                  }}
                />
              </Box>
              <Typography sx={{ color: '#64748b', mb: 3, lineHeight: 1.7 }}>
                {detailItem.description || 'Bu ilan için herhangi bir açıklama girilmemiş.'}
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Box sx={{ background: '#f8fafc', borderRadius: '14px', p: 2 }}>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 500, mb: 0.3 }}>Kategori</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>{detailItem.category}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ background: '#f8fafc', borderRadius: '14px', p: 2 }}>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 500, mb: 0.3 }}>Durum</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: conditionColors[detailItem.condition] }}>
                      {conditionLabels[detailItem.condition]}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ background: '#f8fafc', borderRadius: '14px', p: 2 }}>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 500, mb: 0.3 }}>Günlük Fiyat</Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#6366f1' }}>{detailItem.dailyPrice}₺</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ background: '#f8fafc', borderRadius: '14px', p: 2 }}>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 500, mb: 0.3 }}>Sahip ID</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>#{detailItem.ownerUserId}</Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Rental Form Section */}
              {rentalItem && (
                <Box sx={{ borderTop: '1px solid #e2e8f0', pt: 3, mt: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarMonth sx={{ color: '#6366f1' }} /> Kiralama Dönemi Seçin
                  </Typography>

                  {rentalError && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>
                      {rentalError}
                    </Alert>
                  )}

                  {rentalSuccess && (
                    <Alert severity="success" sx={{ mb: 2, borderRadius: '10px' }}>
                      {rentalSuccess}
                    </Alert>
                  )}

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Başlangıç Tarihi"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Bitiş Tarihi"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3, p: 2, borderRadius: '14px', background: 'rgba(99,102,241,0.06)', display: 'flex', justifyContent: 'between', alignItems: 'center' }} className="flex justify-between items-center">
                    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>Toplam Tutar:</Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#4f46e5' }}>
                      {getCalculatedTotal()}₺
                    </Typography>
                  </Box>
                </Box>
              )}
            </DialogContent>

            <DialogActions sx={{ px: 4, pb: 4, gap: 1.5 }}>
              {rentalItem ? (
                <Button
                  fullWidth variant="contained" size="large"
                  onClick={handleRentalSubmit}
                  disabled={rentalLoading || !detailItem.isAvailable}
                  startIcon={rentalLoading ? <CircularProgress size={20} color="inherit" /> : null}
                  sx={{
                    py: 1.5, borderRadius: '14px',
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    fontSize: '0.95rem',
                  }}
                >
                  {isAuthenticated ? 'Kiralama Talebini Gönder' : 'Kiralamak İçin Giriş Yap'}
                </Button>
              ) : (
                <Button
                  fullWidth variant="contained" size="large"
                  disabled={!detailItem.isAvailable}
                  onClick={() => setRentalItem(detailItem)}
                  sx={{
                    py: 1.5, borderRadius: '14px',
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    fontSize: '0.95rem',
                  }}
                >
                  {detailItem.isAvailable ? 'Hemen Kirala' : 'Müsait Değil'}
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

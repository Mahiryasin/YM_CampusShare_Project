import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, TextField, Button, Card,
  CardContent, Grid, MenuItem, Switch, FormControlLabel,
  InputAdornment, Alert, CircularProgress
} from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Save from '@mui/icons-material/Save';
import AttachMoney from '@mui/icons-material/AttachMoney';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { catalogService } from '../services/api';

const conditions = [
  { value: 'NEW', label: 'Sıfır' },
  { value: 'GOOD', label: 'İyi Durumda' },
  { value: 'FAIR', label: 'Orta' },
];

const categories = ['Elektronik', 'Outdoor', 'Müzik', 'Kitap & Eğitim', 'Spor', 'Ev & Yaşam'];

export default function CreateItemPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    dailyPrice: '',
    condition: 'GOOD',
    isAvailable: true,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.dailyPrice) {
      setErrorMsg('Lütfen yıldızlı (*) zorunlu alanları doldurun.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const itemData = {
        title: form.title,
        description: form.description,
        category: form.category,
        dailyPrice: parseFloat(form.dailyPrice),
        condition: form.condition,
        isAvailable: form.isAvailable,
        ownerUserId: user?.id || parseInt(localStorage.getItem('userId'))
      };

      await catalogService.createItem(itemData);
      setSuccessMsg('İlanınız başarıyla yayınlandı! Kataloğa yönlendiriliyorsunuz...');
      setTimeout(() => {
        navigate('/catalog');
      }, 2000);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || 'İlan yayınlanırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      <Box sx={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81, #3730a3)', pt: 6, pb: 10, px: 2 }}>
        <Container maxWidth="md">
          <Button component={Link} to="/catalog" startIcon={<ArrowBack />}
            sx={{ color: 'rgba(203,213,225,0.7)', mb: 2, '&:hover': { color: '#fff', background: 'transparent' } }}>
            Kataloğa Dön
          </Button>
          <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800, fontSize: { xs: '1.6rem', md: '2.2rem' }, mb: 1 }}>
            Yeni İlan Oluştur
          </Typography>
          <Typography sx={{ color: 'rgba(203,213,225,0.7)', fontSize: '0.95rem' }}>
            Eşyanı kampüs arkadaşlarınla paylaş
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ mt: -5 }}>
        <Card sx={{ borderRadius: '24px !important', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', '&:hover': { transform: 'none !important' } }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            {errorMsg && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                {errorMsg}
              </Alert>
            )}
            {successMsg && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>
                {successMsg}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Başlık *" placeholder="Örn: Sony A7III Kamera" value={form.title} onChange={handleChange('title')}
                    sx={{ '& .MuiOutlinedInput-root': { background: '#f8fafc' } }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Açıklama" placeholder="Eşyanız hakkında detaylı bilgi yazın..." multiline rows={4}
                    value={form.description} onChange={handleChange('description')}
                    sx={{ '& .MuiOutlinedInput-root': { background: '#f8fafc' } }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth select label="Kategori *" value={form.category} onChange={handleChange('category')}
                    sx={{ '& .MuiOutlinedInput-root': { background: '#f8fafc' } }}>
                    {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Günlük Fiyat (₺) *" type="number" value={form.dailyPrice} onChange={handleChange('dailyPrice')}
                    InputProps={{ startAdornment: <InputAdornment position="start"><AttachMoney sx={{ color: '#94a3b8' }} /></InputAdornment>, endAdornment: <InputAdornment position="end">₺/gün</InputAdornment> }}
                    sx={{ '& .MuiOutlinedInput-root': { background: '#f8fafc' } }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth select label="Durum" value={form.condition} onChange={handleChange('condition')}
                    sx={{ '& .MuiOutlinedInput-root': { background: '#f8fafc' } }}>
                    {conditions.map((c) => <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ background: '#f8fafc', borderRadius: '12px', p: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
                    <FormControlLabel
                      control={<Switch checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#10b981' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#10b981' } }} />}
                      label={<Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>Kiraya Müsait</Typography>} />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box className="flex justify-end gap-2 mt-2">
                    <Button variant="outlined" component={Link} to="/catalog" disabled={loading}
                      sx={{ borderColor: '#e2e8f0', color: '#64748b', borderRadius: '12px', px: 4, py: 1.2 }}>
                      İptal
                    </Button>
                    <Button variant="contained" type="submit" disabled={loading} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                      sx={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', borderRadius: '12px', px: 4, py: 1.2, boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>
                      İlanı Yayınla
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

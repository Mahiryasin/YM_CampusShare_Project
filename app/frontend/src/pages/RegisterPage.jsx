import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Card, CardContent,
  InputAdornment, IconButton, Grid, Link as MuiLink, Alert, CircularProgress
} from '@mui/material';
import Email from '@mui/icons-material/Email';
import Lock from '@mui/icons-material/Lock';
import Person from '@mui/icons-material/Person';
import Badge from '@mui/icons-material/Badge';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SchoolOutlined from '@mui/icons-material/SchoolOutlined';
import ArrowForward from '@mui/icons-material/ArrowForward';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  
  // Fields mapped to RegisterRequest DTO
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !studentNumber || !email || !password) {
      setErrorMsg('Lütfen tüm alanları doldurun.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');

    try {
      await register({
        firstName,
        lastName,
        studentNumber,
        email,
        password
      });
      setSuccessMsg('Kayıt işlemi başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      p: 2, position: 'relative', overflow: 'hidden',
    }}>
      <Box sx={{ position: 'absolute', top: -100, left: -80, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)', filter: 'blur(60px)' }} />

      <Card sx={{
        maxWidth: 520, width: '100%', borderRadius: '28px !important',
        boxShadow: '0 25px 80px rgba(0,0,0,0.3)',
        background: 'rgba(255,255,255,0.97)',
        position: 'relative', zIndex: 10,
        '&:hover': { transform: 'none !important' },
      }}>
        <CardContent sx={{ p: { xs: 3.5, sm: 5 } }}>
          <Box className="flex items-center justify-center gap-2 mb-5">
            <Box sx={{ width: 44, height: 44, borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>
              <SchoolOutlined sx={{ color: '#fff', fontSize: 24 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
              Campus<span style={{ color: '#6366f1' }}>Share</span>
            </Typography>
          </Box>

          <Typography sx={{ textAlign: 'center', fontWeight: 700, fontSize: '1.3rem', color: '#1e293b', mb: 0.5 }}>Hesap Oluştur 🎓</Typography>
          <Typography sx={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', mb: 4 }}>Kampüs paylaşım platformuna katıl</Typography>

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

          <Box component="form" onSubmit={handleSubmit} className="flex flex-col gap-2.5">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth label="Ad" placeholder="Mahir"
                  value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: '#94a3b8', fontSize: 20 }} /></InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { background: '#f8fafc' } }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Soyad" placeholder="Yasin"
                  value={lastName} onChange={(e) => setLastName(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: '#94a3b8', fontSize: 20 }} /></InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { background: '#f8fafc' } }} />
              </Grid>
            </Grid>

            <TextField fullWidth label="Öğrenci Numarası" placeholder="2021001234"
              value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Badge sx={{ color: '#94a3b8', fontSize: 20 }} /></InputAdornment> }}
              sx={{ '& .MuiOutlinedInput-root': { background: '#f8fafc' } }} />

            <TextField fullWidth label="E-posta" type="email" placeholder="ornek@edu.tr"
              value={email} onChange={(e) => setEmail(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: '#94a3b8', fontSize: 20 }} /></InputAdornment> }}
              sx={{ '& .MuiOutlinedInput-root': { background: '#f8fafc' } }} />

            <TextField fullWidth label="Şifre" placeholder="En az 6 karakter"
              type={showPassword ? 'text' : 'password'}
              value={password} onChange={(e) => setPassword(e.target.value)}
              helperText="En az 6 karakter olmalıdır"
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#94a3b8', fontSize: 20 }} /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">{showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}</IconButton></InputAdornment>,
              }}
              sx={{ '& .MuiOutlinedInput-root': { background: '#f8fafc' } }} />

            <Box sx={{ background: '#f8fafc', borderRadius: '14px', p: 2, mt: 1 }}>
              {['Kampüs içi güvenli paylaşım', 'Öğrenci doğrulamalı profiller', 'Güven puanı sistemi'].map((b, i) => (
                <Box key={i} className="flex items-center gap-2" sx={{ mb: i < 2 ? 1 : 0 }}>
                  <CheckCircle sx={{ fontSize: 16, color: '#10b981' }} />
                  <Typography sx={{ fontSize: '0.78rem', color: '#475569', fontWeight: 500 }}>{b}</Typography>
                </Box>
              ))}
            </Box>

            <Button fullWidth variant="contained" size="large" type="submit"
              disabled={loading}
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
              sx={{ mt: 1, py: 1.5, borderRadius: '14px', fontSize: '0.95rem', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 8px 24px rgba(99,102,241,0.3)' }}>
              Kayıt Ol
            </Button>
          </Box>

          <Typography sx={{ textAlign: 'center', mt: 3, color: '#94a3b8', fontSize: '0.85rem' }}>
            Zaten hesabın var mı?{' '}
            <MuiLink component={Link} to="/login" sx={{ color: '#6366f1', fontWeight: 700, textDecoration: 'none' }}>Giriş Yap</MuiLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

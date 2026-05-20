import React, { useState } from 'react';
import {
  Container, Box, Typography, TextField, Button, Card,
  CardContent, InputAdornment, IconButton, Divider, Chip,
  Alert, Link as MuiLink, CircularProgress
} from '@mui/material';
import Email from '@mui/icons-material/Email';
import Lock from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SchoolOutlined from '@mui/icons-material/SchoolOutlined';
import Google from '@mui/icons-material/Google';
import GitHub from '@mui/icons-material/GitHub';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [view, setView] = useState('login'); // 'login', 'forgot', 'reset'
  const [resetLoading, setResetLoading] = useState(false);

  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Lütfen tüm alanları doldurun.');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await login(email, password);
      navigate('/catalog');
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || 'E-posta veya şifre hatalı!');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Lütfen e-posta adresinizi girin.');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setResetLoading(true);
    try {
      await authService.forgotPassword(email);
      setSuccessMsg('Doğrulama kodu e-postanıza (veya sunucu konsoluna) gönderildi.');
      setView('reset');
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || 'E-posta gönderilemedi. Lütfen adresi kontrol edin.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email || !token || !newPassword) {
      setErrorMsg('Lütfen tüm alanları doldurun.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('Şifre en az 6 karakter olmalıdır.');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setResetLoading(true);
    try {
      await authService.resetPassword(email, token, newPassword);
      setSuccessMsg('Şifreniz başarıyla güncellendi! Yeni şifrenizle giriş yapabilirsiniz.');
      setView('login');
      setPassword('');
      setToken('');
      setNewPassword('');
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || 'Doğrulama kodu geçersiz veya süresi dolmuş.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      p: 2, position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative elements */}
      <Box sx={{
        position: 'absolute', top: -120, right: -100,
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)',
        filter: 'blur(60px)',
      }} />
      <Box sx={{
        position: 'absolute', bottom: -80, left: -60,
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.1), transparent 70%)',
        filter: 'blur(60px)',
      }} />
      <Box sx={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }} />

      <Card sx={{
        maxWidth: 440, width: '100%', borderRadius: '28px !important',
        boxShadow: '0 25px 80px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.97)',
        position: 'relative', zIndex: 10,
        '&:hover': { transform: 'none !important' },
      }}>
        <CardContent sx={{ p: { xs: 3.5, sm: 5 } }}>
          {/* Logo */}
          <Box className="flex items-center justify-center gap-2 mb-6">
            <Box sx={{
              width: 44, height: 44, borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
            }}>
              <SchoolOutlined sx={{ color: '#fff', fontSize: 24 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
              Campus<span style={{ color: '#6366f1' }}>Share</span>
            </Typography>
          </Box>

          {/* Render Login View */}
          {view === 'login' && (
            <>
              <Typography sx={{ textAlign: 'center', fontWeight: 700, fontSize: '1.4rem', color: '#1e293b', mb: 0.5 }}>
                Hoş Geldin! 👋
              </Typography>
              <Typography sx={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem', mb: 4 }}>
                Hesabına giriş yap ve kampüsünü keşfet
              </Typography>

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

              <Box component="form" onSubmit={handleSubmit} className="flex flex-col gap-3">
                <TextField
                  fullWidth
                  label="E-posta"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@edu.tr"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: '#94a3b8', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: '#f8fafc',
                      '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Şifre"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#94a3b8', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                          {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: '#f8fafc',
                      '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                    },
                  }}
                />

                <Box className="flex justify-end">
                  <MuiLink 
                    onClick={() => { setView('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
                    sx={{ color: '#6366f1', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}
                  >
                    Şifremi Unuttum
                  </MuiLink>
                </Box>

                <Button
                  fullWidth variant="contained" size="large" type="submit"
                  disabled={loading}
                  endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
                  sx={{
                    mt: 1, py: 1.5, borderRadius: '14px', fontSize: '0.95rem',
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
                    '&:hover': {
                      boxShadow: '0 12px 32px rgba(99,102,241,0.4)',
                      background: 'linear-gradient(135deg, #818cf8, #6366f1)',
                    },
                  }}
                >
                  Giriş Yap
                </Button>
              </Box>

              <Divider sx={{ my: 3 }}>
                <Chip label="veya" size="small" sx={{ fontSize: '0.72rem', color: '#94a3b8' }} />
              </Divider>

              <Box className="flex gap-2">
                <Button
                  fullWidth variant="outlined" startIcon={<Google />}
                  sx={{
                    borderColor: '#e2e8f0', color: '#475569',
                    borderRadius: '12px', py: 1.2, fontSize: '0.82rem',
                    '&:hover': { borderColor: '#c7d2fe', background: '#f8fafc', boxShadow: 'none' },
                  }}
                >
                  Google
                </Button>
                <Button
                  fullWidth variant="outlined" startIcon={<GitHub />}
                  sx={{
                    borderColor: '#e2e8f0', color: '#475569',
                    borderRadius: '12px', py: 1.2, fontSize: '0.82rem',
                    '&:hover': { borderColor: '#c7d2fe', background: '#f8fafc', boxShadow: 'none' },
                  }}
                >
                  GitHub
                </Button>
              </Box>

              <Typography sx={{ textAlign: 'center', mt: 3, color: '#94a3b8', fontSize: '0.85rem' }}>
                Hesabın yok mu?{' '}
                <MuiLink
                  component={Link} to="/register"
                  sx={{ color: '#6366f1', fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  Kayıt Ol
                </MuiLink>
              </Typography>
            </>
          )}

          {/* Render Forgot Password View */}
          {view === 'forgot' && (
            <>
              <Typography sx={{ textAlign: 'center', fontWeight: 700, fontSize: '1.4rem', color: '#1e293b', mb: 0.5 }}>
                Şifremi Unuttum 🔑
              </Typography>
              <Typography sx={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem', mb: 4 }}>
                E-posta adresinizi girin, size bir doğrulama kodu gönderelim.
              </Typography>

              {errorMsg && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                  {errorMsg}
                </Alert>
              )}

              <Box component="form" onSubmit={handleForgotPassword} className="flex flex-col gap-3">
                <TextField
                  fullWidth
                  label="E-posta"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@edu.tr"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: '#94a3b8', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: '#f8fafc',
                      '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                    },
                  }}
                />

                <Button
                  fullWidth variant="contained" size="large" type="submit"
                  disabled={resetLoading}
                  endIcon={resetLoading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
                  sx={{
                    mt: 1, py: 1.5, borderRadius: '14px', fontSize: '0.95rem',
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
                    '&:hover': {
                      boxShadow: '0 12px 32px rgba(99,102,241,0.4)',
                      background: 'linear-gradient(135deg, #818cf8, #6366f1)',
                    },
                  }}
                >
                  Kod Gönder
                </Button>

                <Box className="flex justify-center mt-2">
                  <MuiLink 
                    onClick={() => { setView('login'); setErrorMsg(''); setSuccessMsg(''); }}
                    sx={{ color: '#6366f1', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}
                  >
                    Giriş Ekranına Dön
                  </MuiLink>
                </Box>
              </Box>
            </>
          )}

          {/* Render Reset Password View */}
          {view === 'reset' && (
            <>
              <Typography sx={{ textAlign: 'center', fontWeight: 700, fontSize: '1.4rem', color: '#1e293b', mb: 0.5 }}>
                Yeni Şifre Belirle 🆕
              </Typography>
              <Typography sx={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem', mb: 4 }}>
                E-postanıza gönderilen kodu ve yeni şifrenizi girin.
              </Typography>

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

              <Box component="form" onSubmit={handleResetPassword} className="flex flex-col gap-3">
                <TextField
                  fullWidth
                  disabled
                  label="E-posta"
                  type="email"
                  value={email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: '#94a3b8', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: '#f1f5f9',
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Doğrulama Kodu"
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="123456"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: '#f8fafc',
                      '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Yeni Şifre"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#94a3b8', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                          {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: '#f8fafc',
                      '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                    },
                  }}
                />

                <Button
                  fullWidth variant="contained" size="large" type="submit"
                  disabled={resetLoading}
                  endIcon={resetLoading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
                  sx={{
                    mt: 1, py: 1.5, borderRadius: '14px', fontSize: '0.95rem',
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
                    '&:hover': {
                      boxShadow: '0 12px 32px rgba(99,102,241,0.4)',
                      background: 'linear-gradient(135deg, #818cf8, #6366f1)',
                    },
                  }}
                >
                  Şifreyi Güncelle
                </Button>

                <Box className="flex justify-center mt-2">
                  <MuiLink 
                    onClick={() => { setView('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
                    sx={{ color: '#6366f1', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}
                  >
                    Kodu Tekrar Gönder
                  </MuiLink>
                </Box>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

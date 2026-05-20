import React from 'react';
import { Box, Container, Typography, Grid, Card, Button } from '@mui/material';
import Search from '@mui/icons-material/Search';
import HandshakeOutlined from '@mui/icons-material/HandshakeOutlined';
import StarBorder from '@mui/icons-material/StarBorder';
import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import MonetizationOnOutlined from '@mui/icons-material/MonetizationOnOutlined';
import ShieldOutlined from '@mui/icons-material/ShieldOutlined';
import { Link } from 'react-router-dom';

const renterSteps = [
  {
    icon: <Search sx={{ fontSize: 40 }} />,
    title: '1. Keşfet',
    desc: 'Kampüsteki yüzlerce ilanı incele. İhtiyacın olan eşyayı kategorilere veya isme göre hızlıca bul.',
    color: '#3b82f6'
  },
  {
    icon: <HandshakeOutlined sx={{ fontSize: 40 }} />,
    title: '2. Kirala',
    desc: 'Eşya sahibine kiralama talebi gönder. Onaylandıktan sonra kampüs içinde güvenle teslim al.',
    color: '#10b981'
  },
  {
    icon: <StarBorder sx={{ fontSize: 40 }} />,
    title: '3. Değerlendir',
    desc: 'Kullanım sonrası eşyayı iade et ve deneyimini puanla. Kampüs güvenine katkıda bulun.',
    color: '#f59e0b'
  }
];

const ownerSteps = [
  {
    icon: <AddCircleOutlined sx={{ fontSize: 40 }} />,
    title: '1. İlan Ver',
    desc: 'Kullanmadığın elektronik cihazları, kitapları veya spor aletlerini birkaç tıkla kataloğa ekle.',
    color: '#6366f1'
  },
  {
    icon: <CheckCircleOutlined sx={{ fontSize: 40 }} />,
    title: '2. Onayla',
    desc: 'Gelen kiralama taleplerini incele, öğrencinin güven puanına bakarak işlemi onayla.',
    color: '#8b5cf6'
  },
  {
    icon: <MonetizationOnOutlined sx={{ fontSize: 40 }} />,
    title: '3. Kazan',
    desc: 'Eşyalarını güvenli bir şekilde kiraya vererek ek gelir elde et ve tasarruf ekosistemini büyüt.',
    color: '#ec4899'
  }
];

export default function HowItWorksPage() {
  return (
    <Box sx={{ minHeight: '100vh', background: '#f8fafc', pb: 10 }}>
      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
        pt: { xs: 12, md: 16 }, pb: { xs: 8, md: 12 },
        textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <Box sx={{
          position: 'absolute', top: -50, right: '10%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 10 }}>
          <Typography variant="h2" sx={{
            color: '#fff', fontWeight: 900,
            fontSize: { xs: '2.2rem', md: '3.5rem' }, mb: 3
          }}>
            CampusShare <span style={{ color: '#818cf8' }}>Nasıl Çalışır?</span>
          </Typography>
          <Typography sx={{ color: 'rgba(203,213,225,0.9)', fontSize: { xs: '1.1rem', md: '1.25rem' }, lineHeight: 1.6 }}>
            Kampüs içi güvenli paylaşım ekosistemine katılmak çok kolay. İster eşya kirala, ister kiraya ver; her şey öğrenci doğrulamalı ve güvenli.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -5, position: 'relative', zIndex: 20 }}>
        <Grid container spacing={4}>
          {/* Renter Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{
              p: { xs: 3, md: 5 }, borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.04)', border: '1px solid rgba(226,232,240,0.8)',
              height: '100%'
            }}>
              <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>Eşya Kiralamak İstiyorum</Typography>
                <Typography sx={{ color: '#64748b' }}>İhtiyacın olan eşyayı uygun fiyata, güvenle temin et.</Typography>
              </Box>
              
              <Box className="flex flex-col gap-6">
                {renterSteps.map((step, idx) => (
                  <Box key={idx} className="flex gap-4">
                    <Box sx={{
                      minWidth: 70, height: 70, borderRadius: '20px',
                      background: `${step.color}15`, color: step.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {step.icon}
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#1e293b', mb: 0.5 }}>{step.title}</Typography>
                      <Typography sx={{ color: '#64748b', lineHeight: 1.6 }}>{step.desc}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>

          {/* Owner Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{
              p: { xs: 3, md: 5 }, borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.04)', border: '1px solid rgba(226,232,240,0.8)',
              height: '100%'
            }}>
              <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>Eşya Kiraya Vermek İstiyorum</Typography>
                <Typography sx={{ color: '#64748b' }}>Kullanmadığın eşyalarla pasif gelir elde et.</Typography>
              </Box>

              <Box className="flex flex-col gap-6">
                {ownerSteps.map((step, idx) => (
                  <Box key={idx} className="flex gap-4">
                    <Box sx={{
                      minWidth: 70, height: 70, borderRadius: '20px',
                      background: `${step.color}15`, color: step.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {step.icon}
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#1e293b', mb: 0.5 }}>{step.title}</Typography>
                      <Typography sx={{ color: '#64748b', lineHeight: 1.6 }}>{step.desc}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Security Section */}
        <Box sx={{ mt: 8, p: { xs: 4, md: 6 }, background: 'linear-gradient(135deg, #4f46e5, #3b82f6)', borderRadius: '24px', color: '#fff', textAlign: 'center', boxShadow: '0 20px 40px rgba(79,70,229,0.2)' }}>
          <ShieldOutlined sx={{ fontSize: 60, mb: 2, color: '#a5b4fc' }} />
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Güvenlik Her Şeyden Önemli</Typography>
          <Typography sx={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', maxWidth: 700, mx: 'auto', lineHeight: 1.6 }}>
            CampusShare'de sadece edu.tr uzantılı e-postaya sahip doğrulanmış öğrenciler yer alabilir. Her kullanıcının bir güven puanı vardır ve işlemler şeffaf bir şekilde değerlendirilir.
          </Typography>
          <Box sx={{ mt: 5 }}>
             <Button variant="contained" component={Link} to="/register" sx={{ background: '#fff', color: '#4f46e5', fontWeight: 700, px: 4, py: 1.5, borderRadius: '14px', '&:hover': { background: '#f8fafc' } }}>
               Hemen Öğrenci Hesabı Oluştur
             </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

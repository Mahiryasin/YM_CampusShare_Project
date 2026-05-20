import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import RentalsPage from './pages/RentalsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateItemPage from './pages/CreateItemPage';
import HowItWorksPage from './pages/HowItWorksPage';

// Pages where we don't show the navbar (auth pages)
const noNavbarRoutes = ['/login', '/register'];

export default function App() {
  const location = useLocation();
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/catalog/new" element={<CreateItemPage />} />
        <Route path="/rentals" element={<RentalsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

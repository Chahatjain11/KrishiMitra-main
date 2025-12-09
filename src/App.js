import React, { createContext, useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import CropRecommendation from './components/CropRecommendation';
import DiseaseDetection from './components/DiseaseDetection';
import FertilizerCalculator from './components/FertilizerCalculator';
import MarketPrices from './components/MarketPrices';
import Chatbot from './components/Chatbot';
import Profile from './components/Profile';

export const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (en, hi) => en,
});

function AppContainer() {
  const location = useLocation();
  const [language, setLanguage] = useState(() => localStorage.getItem('km_language') || 'en');
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('km_phone') ? true : false);

  useEffect(() => {
    localStorage.setItem('km_language', language);
  }, [language]);

  const t = useMemo(() => {
    return (en, hi) => (language === 'hi' ? hi : en);
  }, [language]);

  const ctxValue = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  const hideNavRoutes = ['/login'];
  const showBottomNav = !hideNavRoutes.includes(location.pathname);

  return (
    <LanguageContext.Provider value={ctxValue}>
      <header className="km-header">
        <div className="km-brand">
          <span className="km-logo">🌾</span>
          <span className="km-title">{t('KrishiMitra', 'कृषि मित्र')}</span>
        </div>
        <div className="km-actions">
          <select
            aria-label="Language"
            className="km-lang"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
          <Link className="km-profile-link" to="/profile" aria-label="Profile">👤</Link>
        </div>
      </header>

      <main className="km-main">
        <Routes>
          <Route path="/" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={<Login onLoginSuccess={() => setIsLoggedIn(true)} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/crops" element={<CropRecommendation />} />
          <Route path="/disease" element={<DiseaseDetection />} />
          <Route path="/fertilizer" element={<FertilizerCalculator />} />
          <Route path="/market" element={<MarketPrices />} />
          <Route path="/chat" element={<Chatbot />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to={isLoggedIn ? '/dashboard' : '/login'} replace />} />
        </Routes>
      </main>

      {showBottomNav && (
        <nav className="km-bottom-nav" aria-label="Primary">
          <Link className="km-nav-link" to="/dashboard">{t('Home', 'मुख्य')}</Link>
          <Link className="km-nav-link" to="/crops">{t('Crops', 'फसल')}</Link>
          <Link className="km-nav-link" to="/disease">{t('Disease', 'रोग')}</Link>
          <Link className="km-nav-link" to="/market">{t('Market', 'बाज़ार')}</Link>
          <Link className="km-nav-link" to="/chat">{t('Chat', 'चैट')}</Link>
        </nav>
      )}
    </LanguageContext.Provider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContainer />
    </BrowserRouter>
  );
}

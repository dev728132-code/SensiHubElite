import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Sensitivity } from './pages/Sensitivity';
import { Premium } from './pages/Premium';
import { Profile } from './pages/Profile';
import { History } from './pages/History';
import { Subscription } from './pages/Subscription';
import { PremiumLibrary } from './pages/PremiumLibrary';
import { SensitivityDetail } from './pages/SensitivityDetail';
import { Login } from './pages/Login';
import { Splash } from './pages/Splash';
import Support from './pages/Support';
import { AuthGuard, AdminGuard } from './components/AuthGuard';
import { AdminPanel } from './pages/admin/AdminPanel';

export function AppInner() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <Splash />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AuthGuard />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="sensitivity" element={<Sensitivity />} />
          <Route path="premium" element={<Premium />} />
          <Route path="profile" element={<Profile />} />
          <Route path="history" element={<History />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="premium-library" element={<PremiumLibrary />} />
          <Route path="sensitivity/:id" element={<SensitivityDetail />} />
          <Route path="support" element={<Support />} />
        </Route>
        <Route element={<AdminGuard />}>
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import IndexPage from './pages/IndexPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import CreateCampaignPage from './pages/CreatecampaignPage';
import NotFoundPage from './pages/NotFoundPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
 
function App() {
  const location = useLocation();
  // Determine which pages should have the main layout
  const noLayoutRoutes = ['/auth'];
  const showLayout = !noLayoutRoutes.includes(location.pathname);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen font-sans">
      {showLayout && <Header />}
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/create" element={<CreateCampaignPage />} /> {/* Add route for new page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {showLayout && <Footer />}
    </div>
  );
}

export default App;

import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import IndexPage from './pages/IndexPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import CreateCampaignPage from './pages/CreatecampaignPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { ThemeProvider } from './contexts/ThemeProvider';
import { UserProvider } from './contexts/UserProvider';
import ProtectedRoute from './components/ProtectedRoute'; // Import the new component

function App() {
  const location = useLocation();
  const noLayoutRoutes = ['/auth'];
  const showLayout = !noLayoutRoutes.includes(location.pathname);

  return (
    <ThemeProvider>
      <UserProvider>
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen font-sans">
          {showLayout && <Header />}
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<IndexPage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/create" element={<CreateCampaignPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Not Found Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          {showLayout && <Footer />}
        </div>
      </UserProvider>
    </ThemeProvider>
  );
}
export default App;
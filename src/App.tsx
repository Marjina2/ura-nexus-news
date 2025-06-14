import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Pricing from '@/pages/Pricing';
import Contact from '@/pages/Contact';
import Dashboard from '@/pages/Dashboard';
import Auth from '@/pages/Auth';
import AccountSettings from '@/pages/AccountSettings';
import NotFound from '@/pages/NotFound';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Article from '@/pages/Article';
import Categories from '@/pages/Categories';
import AIPicks from '@/pages/AIPicks';
import Search from '@/pages/Search';
import AuthCallback from '@/pages/AuthCallback';
import ProfileCompletion from '@/components/auth/ProfileCompletion';
import News from '@/pages/News';
import SpotlightDetailPage from '@/pages/SpotlightDetailPage';
import { useAuth } from '@/contexts/AuthContext';

const queryClient = new QueryClient();

function AppContent() {
  const { needsProfileCompletion, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-ura-black flex items-center justify-center">
        <div className="text-ura-white">Loading...</div>
      </div>
    );
  }

  // Show profile completion if needed
  if (needsProfileCompletion) {
    return <ProfileCompletion />;
  }

  return (
    <div className="min-h-screen bg-pulsee-black text-ura-white">
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/account" element={<AccountSettings />} />
          <Route path="/article" element={<Article />} />
          <Route path="/news" element={<News />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/ai-picks" element={<AIPicks />} />
          <Route path="/search" element={<Search />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/spotlight/:date" element={<SpotlightDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

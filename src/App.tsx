
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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Article from '@/pages/Article';
import Categories from '@/pages/Categories';
import AIPicks from '@/pages/AIPicks';
import Search from '@/pages/Search';
import AuthCallback from '@/pages/AuthCallback';
import News from '@/pages/News';
import SpotlightDetailPage from '@/pages/SpotlightDetailPage';
import ClerkProtectedRoute from '@/components/auth/ClerkProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-pulsee-black text-ura-white">
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={
              <ClerkProtectedRoute>
                <Dashboard />
              </ClerkProtectedRoute>
            } />
            <Route path="/auth" element={<Auth />} />
            <Route path="/account-settings" element={
              <ClerkProtectedRoute>
                <AccountSettings />
              </ClerkProtectedRoute>
            } />
            <Route path="/article/:id" element={<Article />} />
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
    </QueryClientProvider>
  );
}

export default App;

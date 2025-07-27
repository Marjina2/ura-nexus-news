
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/clerk-react';
import { Toaster } from '@/components/ui/toaster';
import ClerkProtectedRoute from '@/components/auth/ClerkProtectedRoute';

// Lazy load pages for better performance
const Index = React.lazy(() => import('@/pages/Index'));
const About = React.lazy(() => import('@/pages/About'));
const Pricing = React.lazy(() => import('@/pages/Pricing'));
const Contact = React.lazy(() => import('@/pages/Contact'));
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Auth = React.lazy(() => import('@/pages/Auth'));
const AccountSettings = React.lazy(() => import('@/pages/AccountSettings'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const Article = React.lazy(() => import('@/pages/Article'));
const Categories = React.lazy(() => import('@/pages/Categories'));
const AIPicks = React.lazy(() => import('@/pages/AIPicks'));
const Search = React.lazy(() => import('@/pages/Search'));
const AuthCallback = React.lazy(() => import('@/pages/AuthCallback'));
const News = React.lazy(() => import('@/pages/News'));
const SpotlightDetailPage = React.lazy(() => import('@/pages/SpotlightDetailPage'));

// Get Clerk publishable key from environment
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your environment variables.");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Reduce memory usage by limiting cache time
      gcTime: 5 * 60 * 1000, // Garbage collect after 5 minutes
      staleTime: 2 * 60 * 1000, // Data is fresh for 2 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: 1, // Reduce retry attempts
    },
  },
});

// Loading component for better UX
const PageLoader = () => (
  <div className="min-h-screen bg-pulsee-black flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-pulsee-black text-ura-white">
          <Router>
            <Suspense fallback={<PageLoader />}>
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
          </Suspense>
        </Router>
        <Toaster />
      </div>
    </QueryClientProvider>
  </ClerkProvider>
  );
}

export default App;

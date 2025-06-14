
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import SecurityWrapper from './components/SecurityWrapper';
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import News from "./pages/News";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import Article from "./pages/Article";
import AccountSettings from "./pages/AccountSettings";
import NotFound from "./pages/NotFound";
import Trending from "./pages/Trending";
import Categories from "./pages/Categories";
import AIPicks from "./pages/AIPicks";
import Search from "./pages/Search";
import Licensing from "./pages/Licensing";
import API from "./pages/API";
import Analytics from "./pages/Analytics";
import Community from "./pages/Community";
import Help from "./pages/Help";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SecurityWrapper>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/news" element={<News />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/article" element={<Article />} />
              <Route path="/account" element={<AccountSettings />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/ai-picks" element={<AIPicks />} />
              <Route path="/search" element={<Search />} />
              <Route path="/licensing" element={<Licensing />} />
              <Route path="/api" element={<API />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/community" element={<Community />} />
              <Route path="/help" element={<Help />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SecurityWrapper>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

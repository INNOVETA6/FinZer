import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FinancialDashboard from "./pages/FinancialDashboard";
import BudgetPlanner from "./pages/BudgetPlanner";
import InvestmentsPage from "./pages/InvestmentsPage";
import ProfilePage from "./pages/ProfilePage";
import LearningHub from "./pages/LearningHub";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword"; 
import ResetPassword from "./pages/ResetPassword"; 
import ProtectedRoute from "./components/ProtectedRoute";
import FinancialChatbot from "./components/FinancialChatbot";
import ArticlePage from "./pages/ArticlePage";
import VisualGuidePage from "./pages/VisualGuidePage";
const queryClient = new QueryClient();

// main.tsx or App.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <FinancialDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/budget-planner"
            element={
              <ProtectedRoute>
                <BudgetPlanner />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <FinancialChatbot />
              </ProtectedRoute>
            }
          />

          <Route
            path="/investments"
            element={
              <ProtectedRoute>
                <InvestmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning-hub"
            element={
              <ProtectedRoute>
                <LearningHub />
              </ProtectedRoute>
            }
          />
          <Route path="/articles/:id" element={<ArticlePage />} />
          <Route path="/visual-guides/:id" element={<VisualGuidePage />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

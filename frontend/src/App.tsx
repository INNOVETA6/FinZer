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
<<<<<<< HEAD
import FinancialChatbot from "./components/FinancialChatbot";

=======
import ProtectedRoute from "./components/ProtectedRoute";
>>>>>>> 54827f6114220b2430cd85aa1cc4bf73083029ee

const queryClient = new QueryClient();

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
<<<<<<< HEAD
          <Route path="/dashboard" element={<FinancialDashboard />} />
          <Route path="/budget-planner" element={<BudgetPlanner />} />
          <Route path="/investments" element={<InvestmentsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="learning-hub" element={<LearningHub />} />
          <Route path="/chatbot" element={<FinancialChatbot />} />
          
=======

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

          {/* 404 Route */}
>>>>>>> 54827f6114220b2430cd85aa1cc4bf73083029ee
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

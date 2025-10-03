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


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/dashboard" element={<FinancialDashboard />} />
          <Route path="/budget-planner" element={<BudgetPlanner />} />
          <Route path="/investments" element={<InvestmentsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="learning-hub" element={<LearningHub />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

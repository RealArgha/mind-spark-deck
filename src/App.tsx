
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import FlashcardsPage from "./pages/FlashcardsPage";
import QuizPage from "./pages/QuizPage";
import UploadSection from "./components/UploadSection";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/upload" element={
            <div className="min-h-screen bg-gradient-to-br from-background to-purple-50/20">
              <div className="container mx-auto">
                <UploadSection />
              </div>
            </div>
          } />
          <Route path="/login" element={<LoginPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

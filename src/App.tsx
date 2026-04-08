import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index.tsx";
import PlannerPage from "./pages/PlannerPage.tsx";
import HumanizerPage from "./pages/HumanizerPage.tsx";
import ExpanderPage from "./pages/ExpanderPage.tsx";
import SummarizerPage from "./pages/SummarizerPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/planner" element={<PlannerPage />} />
            <Route path="/humanizer" element={<HumanizerPage />} />
            <Route path="/expander" element={<ExpanderPage />} />
            <Route path="/summarizer" element={<SummarizerPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import PlannerPage from "./pages/PlannerPage.tsx";
import HumanizerPage from "./pages/HumanizerPage.tsx";
import ExpanderPage from "./pages/ExpanderPage.tsx";
import SummarizerPage from "./pages/SummarizerPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/humanizer" element={<HumanizerPage />} />
          <Route path="/expander" element={<ExpanderPage />} />
          <Route path="/summarizer" element={<SummarizerPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

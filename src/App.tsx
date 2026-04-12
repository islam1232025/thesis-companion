import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AccessGate, useAccessGate } from "@/components/AccessGate";
import Index from "./pages/Index.tsx";
import PlannerPage from "./pages/PlannerPage.tsx";
import HumanizerPage from "./pages/HumanizerPage.tsx";
import ExpanderPage from "./pages/ExpanderPage.tsx";
import SummarizerPage from "./pages/SummarizerPage.tsx";
import PdfStudyPage from "./pages/PdfStudyPage.tsx";
import EmployabilityPage from "./pages/EmployabilityPage.tsx";
import ThesisReviewPage from "./pages/ThesisReviewPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const AppContent = () => {
  const { granted, grant } = useAccessGate();

  if (!granted) {
    return <AccessGate onGranted={grant} />;
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/humanizer" element={<HumanizerPage />} />
        <Route path="/expander" element={<ExpanderPage />} />
        <Route path="/summarizer" element={<SummarizerPage />} />
        <Route path="/pdf-study" element={<PdfStudyPage />} />
        <Route path="/employability" element={<EmployabilityPage />} />
        <Route path="/thesis-review" element={<ThesisReviewPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Batch from "./pages/Batch";
import CSTR from "./pages/CSTR";
import PFR from "./pages/PFR";
import PBR from "./pages/PBR";
import NotFound from "./pages/NotFound";
import LoadingScreen from "./components/LoadingScreen";
import { useState } from "react";

const queryClient = new QueryClient();
const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <QueryClientProvider client={queryClient}>
      {!isLoaded && <LoadingScreen onComplete={() => setIsLoaded(true)} />}
      {isLoaded && (
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/batch" element={<Batch />} />
              <Route path="/cstr" element={<CSTR />} />
              <Route path="/pfr" element={<PFR />} />
              <Route path="/pbr" element={<PBR />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      )}
    </QueryClientProvider>
  );
};

export default App;

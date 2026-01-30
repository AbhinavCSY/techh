import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { PasswordProtection } from "@/components/PasswordProtection";
import Index from "./pages/Index";
import WebApplications from "./pages/WebApplications";
import IncidentDetails from "./pages/IncidentDetails";
import TechStackSlideshow from "./pages/TechStackSlideshow";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PasswordProtection>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/web-apps" element={<WebApplications />} />
              <Route
                path="/incident/:techStackId/:cveId"
                element={<IncidentDetails />}
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </PasswordProtection>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

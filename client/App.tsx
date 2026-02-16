import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { NoNavLayout } from "@/components/NoNavLayout";
import { PasswordProtection } from "@/components/PasswordProtection";
import Index from "./pages/Index";
import WebApplications from "./pages/WebApplications";
import IncidentDetails from "./pages/IncidentDetails";
import TechStackSlideshow from "./pages/TechStackSlideshow";
import ThreatIntel from "./pages/ThreatIntel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Full-screen slideshow route without navigation bar or password protection */}
          <Route
            path="/tech-stack-slideshow"
            element={
              <NoNavLayout>
                <TechStackSlideshow />
              </NoNavLayout>
            }
          />

          {/* All other routes with password protection and navigation bar */}
          <Route
            path="/*"
            element={
              <PasswordProtection>
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/web-apps" element={<WebApplications />} />
                    <Route path="/threat-intel" element={<ThreatIntel />} />
                    <Route
                      path="/incident/:techStackId/:cveId"
                      element={<IncidentDetails />}
                    />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppLayout>
              </PasswordProtection>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

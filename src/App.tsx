
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext"; // Import AppProvider
import { PrivateRoute } from "./components/PrivateRoute";
import { ErrorBoundary } from "./components/ui/ErrorBoundary"; // Import ErrorBoundary for better error handling
import Index from "./pages/Index";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import LdrMachines from "./pages/LdrMachines";
import NotFound from "./pages/NotFound";
import PPMMachines from "./pages/PPMMachines";
import OCMMachines from "./pages/OCMMachines";
import Login from "./pages/Login";
import { useEffect } from "react";
import { LoadingScreen } from "./components/ui/LoadingScreen";

const queryClient = new QueryClient();

const App = () => {
  // Register service worker for push notifications
  useEffect(() => {
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          await navigator.serviceWorker.register('/service-worker.js');
          console.log('Service worker registered');
        } catch (error) {
          console.error('Service worker registration failed:', error);
        }
      }
    };

    registerServiceWorker();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ErrorBoundary>
          <BrowserRouter>
            <AuthProvider>
              <AppProvider>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/ldr-machines" element={<LdrMachines />} />
                    <Route path="/ldr-machines/ppm" element={<PPMMachines />} />
                    <Route path="/ldr-machines/ocm" element={<OCMMachines />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppProvider>
            </AuthProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

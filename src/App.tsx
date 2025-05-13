import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { RoleProvider } from "./contexts/RoleContext";
import { AppProvider } from "./contexts/AppContext";
import { PrivateRoute } from "./components/PrivateRoute";
import { PermissionRoute } from "./components/PermissionRoute";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { SidebarProvider } from "./components/ui/sidebar";
import Index from "./pages/Index";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import LdrMachines from "./pages/LdrMachines";
import NotFound from "./pages/NotFound";
import PPMMachines from "./pages/PPMMachines";
import OCMMachines from "./pages/OCMMachines";
import Training from "./pages/Training";
import Tasks from "./pages/Tasks";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import DepartmentPage from "./pages/DepartmentPage";
import DepartmentPPMMachines from "./pages/DepartmentPPMMachines";
import DepartmentOCMMachines from "./pages/DepartmentOCMMachines";
import { useEffect } from "react";

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
              <RoleProvider>
                <AppProvider>
                  <SidebarProvider>
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/unauthorized" element={<Unauthorized />} />
                      
                      {/* Basic authenticated routes */}
                      <Route element={<PrivateRoute />}>
                        <Route path="/" element={<Index />} />
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/notifications" element={<Notifications />} />
                        
                        {/* Routes that require specific permissions */}
                        <Route element={<PermissionRoute requiredPermission="viewSettings" />}>
                          <Route path="/settings" element={<Settings />} />
                        </Route>
                        
                        <Route element={<PermissionRoute requiredPermission="viewRecords" />}>
                          <Route path="/training" element={<Training />} />
                          
                          {/* Legacy LDR routes - keep for backward compatibility */}
                          <Route path="/ldr-machines" element={<LdrMachines />} />
                          <Route path="/ldr-machines/ppm" element={<PPMMachines />} />
                          <Route path="/ldr-machines/ocm" element={<OCMMachines />} />
                          
                          {/* New department routes */}
                          <Route path="/departments/:departmentId" element={<DepartmentPage />} />
                          <Route path="/departments/:departmentId/ppm" element={<DepartmentPPMMachines />} />
                          <Route path="/departments/:departmentId/ocm" element={<DepartmentOCMMachines />} />
                        </Route>
                      </Route>
                      
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </SidebarProvider>
                </AppProvider>
              </RoleProvider>
            </AuthProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

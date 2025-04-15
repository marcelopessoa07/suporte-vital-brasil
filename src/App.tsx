
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import NotFound from "./pages/NotFound";

// Mobile app pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterSuccess from "./pages/RegisterSuccess";
import Home from "./pages/Home";
import Incidents from "./pages/Incidents";
import IncidentDetails from "./pages/IncidentDetails";
import Family from "./pages/Family";
import Plan from "./pages/Plan";
import Profile from "./pages/Profile";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserCreate from "./pages/admin/AdminUserCreate";
import AdminPlans from "./pages/admin/AdminPlans";
import AdminIncidents from "./pages/admin/AdminIncidents";
import AdminAmbulances from "./pages/admin/AdminAmbulances";

// Central pages
import CentralDashboard from "./pages/central/CentralDashboard";
import CentralPatientView from "./pages/admin/CentralPatientView";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-success" element={<RegisterSuccess />} />
            
            {/* Mobile app routes */}
            <Route path="/home" element={<Home />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/incident/:id" element={<IncidentDetails />} />
            <Route path="/family" element={<Family />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/new" element={<AdminUserCreate />} />
            <Route path="/admin/users/:id" element={<AdminUsers />} />
            <Route path="/admin/plans" element={<AdminPlans />} />
            <Route path="/admin/incidents" element={<AdminIncidents />} />
            <Route path="/admin/ambulances" element={<AdminAmbulances />} />
            <Route path="/admin/incident/:id" element={<IncidentDetails />} />
            
            {/* Central routes */}
            <Route path="/central" element={<CentralDashboard />} />
            <Route path="/central/incidents" element={<AdminIncidents />} />
            <Route path="/central/ambulances" element={<AdminAmbulances />} />
            <Route path="/central/incident/:id" element={<IncidentDetails />} />
            <Route path="/central/patient/:id" element={<CentralPatientView />} />
            
            {/* Redirects */}
            <Route path="/index" element={<Navigate to="/home" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

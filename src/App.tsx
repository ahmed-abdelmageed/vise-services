// App.tsx
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Pages and components
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import AdminLogin from "./pages/AdminLogin";
import ServiceFormPage from "./pages/ServiceFormPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import { Toaster } from "./components/ui/sonner";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "./contexts/language";

const isUserAuthenticated = () => !!localStorage.getItem("userData");
const isAdminAuthenticated = () => localStorage.getItem("adminAuthenticated") === "true";

const ProtectedClientRoute = ({ children }: { children: React.ReactNode }) =>
  isUserAuthenticated() ? children : <Navigate to="/" replace />;

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) =>
  isAdminAuthenticated() ? children : <Navigate to="/gs-8739-admin" replace />;

function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/service/:serviceTitle" element={<ServiceFormPage />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/gs-8739-admin" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/client-dashboard"
              element={
                <ProtectedClientRoute>
                  <ClientDashboard />
                </ProtectedClientRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
        <Toaster position="top-right" />
      </QueryClientProvider>
    </LanguageProvider>
  );
}

export default App;

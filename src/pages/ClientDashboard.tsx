import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { DashboardContent } from "@/components/client/DashboardContent";
import { DashboardLoading } from "@/components/client/DashboardLoading";
import { useClientDashboard } from "@/hooks/useClientDashboard";
import { useNavigate } from "react-router-dom";
import { ClientSection } from "@/types/dashboard";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobilePaddingWrapper } from "@/components/MobilePaddingWrapper";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useLanguage } from "@/contexts/LanguageContext";

const ClientDashboard = () => {
  const { userData, applications, loading, handleLogout } = useClientDashboard();
  const [activeSection, setActiveSection] = useState<ClientSection>("dashboard");
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { language } = useLanguage();

  // For RTL support
  const sidebarPosition = language === "ar" ? "right-0" : "left-0";

  useEffect(() => {
    const changeActiveSection = (event: CustomEvent) => {
      if (event.detail && typeof event.detail === "string") {
        setActiveSection(event.detail as ClientSection);
      }
    };

    document.addEventListener("setActiveSection", changeActiveSection as EventListener);
    return () => {
      document.removeEventListener("setActiveSection", changeActiveSection as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!loading && !userData) {
      navigate("/");
    }
  }, [loading, userData, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-grow flex">
          <DashboardLoading />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-full max-w-full">
        <Header />
        <div className="flex flex-1 overflow-y-auto relative">
          {/* Sidebar with RTL support */}
          <ClientSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            onLogout={handleLogout}
            className={`shrink-0 sticky ${sidebarPosition} top-0 h-fit ${!isMobile ? "min-w-[240px]" : ""}`}
          />

          <main
            className={`flex-1 pt-4 overflow-x-hidden ${
              isMobile ? "pb-20" : "pb-4"
            } px-3 sm:px-6 bg-gray-50`}
          >
            <MobilePaddingWrapper>
              {userData && (
                <DashboardContent
                  activeSection={activeSection}
                  user={userData}
                  applications={applications}
                  loading={loading}
                />
              )}
            </MobilePaddingWrapper>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ClientDashboard;

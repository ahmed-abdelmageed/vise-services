import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { DashboardContent } from "@/components/client/DashboardContent";
import { DashboardLoading } from "@/components/client/DashboardLoading";
import { useClientDashboard } from "@/hooks/useClientDashboard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ClientSection } from "@/types/dashboard";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobilePaddingWrapper } from "@/components/MobilePaddingWrapper";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ClientDashboard = () => {
  const { userData, applications, loading, handleLogout } =
    useClientDashboard();
  const [activeSection, setActiveSection] =
    useState<ClientSection>("dashboard");
  const [searchParams, setSearchParams] = useSearchParams();
  const [userApplications, setUserApplications] = useState<any[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { language, t } = useLanguage();

  // Helper function to validate client section
  const isValidClientSection = (section: string): section is ClientSection => {
    const validSections: ClientSection[] = [
      "dashboard",
      "services",
      "invoices",
      "requests",
      "support",
      "settings",
    ];
    return validSections.includes(section as ClientSection);
  };

  // Initialize active section from URL params on component mount
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") as ClientSection;
    if (tabFromUrl && isValidClientSection(tabFromUrl)) {
      setActiveSection(tabFromUrl);
    } else if (!searchParams.get("tab")) {
      // Set default tab in URL if none exists
      setSearchParams((prev) => {
        prev.set("tab", activeSection);
        return prev;
      });
    }
  }, [searchParams, setSearchParams, activeSection]);

  // Update URL when active section changes
  const handleSetActiveSection = (section: ClientSection) => {
    setActiveSection(section);
    setSearchParams((prev) => {
      prev.set("tab", section);
      return prev;
    });
  };

  // For RTL support
  const sidebarPosition = language === "ar" ? "right-0" : "left-0";

  // Fetch visa applications by user_id
  useEffect(() => {
    const fetchUserVisaApplications = async () => {
      if (!userData?.id) return;

      try {
        setLoadingApplications(true);

        const { data, error } = await supabase
          .from("visa_applications")
          .select("*")
          .eq("user_id", userData.id)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        console.log("Fetched user applications:", data);
        setUserApplications(data || []);
      } catch (error) {
        console.error("Error fetching user applications:", error);
        toast.error(
          t("failedToLoadApplications") || "Failed to load applications"
        );
      } finally {
        setLoadingApplications(false);
      }
    };

    fetchUserVisaApplications();
  }, [userData?.id, t]);

  useEffect(() => {
    const changeActiveSection = (event: CustomEvent) => {
      if (event.detail && typeof event.detail === "string") {
        setActiveSection(event.detail as ClientSection);
      }
    };

    document.addEventListener(
      "setActiveSection",
      changeActiveSection as EventListener
    );
    return () => {
      document.removeEventListener(
        "setActiveSection",
        changeActiveSection as EventListener
      );
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
            setActiveSection={handleSetActiveSection}
            onLogout={handleLogout}
            className={`shrink-0 sticky ${sidebarPosition} top-0 h-fit ${
              !isMobile ? "min-w-[240px]" : ""
            }`}
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
                  onSectionChange={handleSetActiveSection}
                  applications={userApplications}
                  loading={loadingApplications}
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

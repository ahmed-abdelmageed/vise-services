import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart,
  Settings,
  Package,
  LogOut,
  FootprintsIcon,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";

type AdminSection =
  | "dashboard"
  | "clients"
  | "invoices"
  | "analytics"
  | "settings"
  | "visaServices"
  | "footerEditor";

interface AdminSidebarProps {
  activeSection: AdminSection;
  setActiveSection: (section: AdminSection) => void;
  className?: string;
}

export const AdminSidebar = ({
  activeSection,
  setActiveSection,
  className,
}: AdminSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isMobile, setOpenMobile } = useSidebar();

  // Initialize active section from URL params on component mount
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") as AdminSection;
    if (tabFromUrl && isValidAdminSection(tabFromUrl)) {
      setActiveSection(tabFromUrl);
    } else if (!searchParams.get("tab")) {
      // Set default tab in URL if none exists
      setSearchParams((prev) => {
        prev.set("tab", activeSection);
        return prev;
      });
    }
  }, []);

  // Helper function to validate admin section
  const isValidAdminSection = (section: string): section is AdminSection => {
    const validSections: AdminSection[] = [
      "dashboard",
      "clients",
      "invoices",
      "analytics",
      "settings",
      "visaServices",
      "footerEditor",
    ];
    return validSections.includes(section as AdminSection);
  };

  // Update URL when active section changes
  const handleSetActiveSection = (section: AdminSection) => {
    setActiveSection(section);
    setSearchParams((prev) => {
      prev.set("tab", section);
      return prev;
    });
  };

  const menuItems = [
    {
      id: "dashboard" as AdminSection,
      label: t("dashboard"),
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      id: "clients" as AdminSection,
      label: t("clients"),
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: "invoices" as AdminSection,
      label: t("invoices"),
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: "visaServices" as AdminSection,
      label: t("visaServices"),
      icon: <Package className="h-5 w-5" />,
    },
    {
      id: "analytics" as AdminSection,
      label: t("analytics"),
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      id: "settings" as AdminSection,
      label: t("settings"),
      icon: <Settings className="h-5 w-5" />,
    },
    {
      id: "footerEditor" as AdminSection,
      label: t("footerEditor"),
      icon: <FootprintsIcon className="h-5 w-5" />,
    },
  ];

  const handleLogout = async () => {
    try {
      localStorage.removeItem("adminAuthenticated");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  
  return (
    <>
      {/* Sidebar with collapsible and expanded modes */}
      {isCollapsed && !isMobile ? (
        <div
          className={cn(
            `border-r border-gray-200 ${
              language === "ar" ? "border-r-0 border-l" : ""
            }`,
            "w-16 bg-white flex flex-col items-center py-2 transition-all duration-300 ease-in-out overflow-hidden",
            className
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(false)}
          >
            {language === "ar" ? (
              <ChevronLeft className="h-5 w-5 text-visa-dark" />
            ) : (
              <ChevronRight className="h-5 w-5 text-visa-dark" />
            )}
            <span className="sr-only">{t("open")}</span>
          </Button>
          <nav className="mt-4 space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="icon"
                className={cn(
                  "text-visa-dark",
                  activeSection === item.id && "text-visa-gold"
                )}
                onClick={() => handleSetActiveSection(item.id)}
                title={item.label}
              >
                {item.icon}
              </Button>
            ))}
          </nav>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 text-sm py-1.5 flex items-center justify-center"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <Sidebar
          className={cn(
            `border-r border-gray-200 ${
              language === "ar" ? "border-r-0 border-l" : ""
            }`,
            "max-w-[240px] w-[240px] bg-white transition-all duration-300 ease-in-out overflow-hidden",
            className
          )}
          side={language === "ar" ? "right" : "left"}
        >
          <SidebarHeader>
            <div className="p-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-visa-dark truncate">
                {t("adminPortal")}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setOpenMobile(false);
                  if (!isMobile) setIsCollapsed(true);
                }}
              >
                <X className="h-5 w-5 text-visa-dark" />
                <span className="sr-only">{t("close")}</span>
              </Button>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <nav className="space-y-0.5 p-2">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className={`w-full justify-start text-sm py-1.5 ${
                    activeSection === item.id
                      ? "bg-visa-gold text-white hover:bg-visa-gold/90 hover:text-white"
                      : "text-visa-dark hover:bg-visa-light"
                  }`}
                  onClick={() => handleSetActiveSection(item.id)}
                >
                  <div className="flex gap-2">
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </div>
                </Button>
              ))}
            </nav>
          </SidebarContent>
          <SidebarFooter className="p-2 border-t border-gray-200 mt-auto">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 text-sm py-1.5"
              onClick={handleLogout}
            >
              <div className="flex gap-2">
                <LogOut className="h-5 w-5" />
                <span className="">{t("logout")}</span>
              </div>
            </Button>
          </SidebarFooter>
        </Sidebar>
      )}
    </>
  );
};

import React from "react";
import {
  LayoutDashboard,
  Package,
  FileText,
  Ticket,
  Headphones,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ClientSection } from "@/types/dashboard";

interface ClientSidebarProps {
  activeSection: ClientSection;
  setActiveSection: (section: ClientSection) => void;
  onLogout?: () => void;
  className?: string;
}

export const ClientSidebar = ({
  activeSection,
  setActiveSection,
  onLogout,
  className,
}: ClientSidebarProps) => {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

  const menuItems = [
    { id: "dashboard", label: t("dashboard"), icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: "services", label: t("myServices"), icon: <Package className="h-5 w-5" /> },
    { id: "invoices", label: t("myInvoices"), icon: <FileText className="h-5 w-5" /> },
    { id: "requests", label: t("myRequests"), icon: <Ticket className="h-5 w-5" /> },
    { id: "support", label: t("customerSupport"), icon: <Headphones className="h-5 w-5" /> },
    { id: "settings", label: t("accountSettings"), icon: <Settings className="h-5 w-5" /> },
  ] as const;

  const handleMenuItemClick = (section: ClientSection) => {
    setActiveSection(section);
    if (isMobile) setOpen(false);
  };

  const renderMenuItem = (item: (typeof menuItems)[number]) => (
    <Button
      key={item.id}
      variant={activeSection === item.id ? "default" : "ghost"}
      className={cn(
        "w-full justify-start text-sm py-1.5 min-h-[48px]",
        activeSection === item.id
          ? "bg-visa-gold text-white hover:bg-visa-gold/90"
          : "text-visa-dark hover:bg-visa-light"
      )}
      onClick={() => handleMenuItemClick(item.id)}
    >
      {language === "ar" ? (
        <>
          <span className="ms-2 truncate">{item.label}</span>
          {item.icon}
        </>
      ) : (
        <>
          {item.icon}
          <span className="ml-2 truncate">{item.label}</span>
        </>
      )}
    </Button>
  );

  const renderLogoutButton = () => (
    <Button
      variant="ghost"
      className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 text-sm py-1.5 min-h-[48px]"
      onClick={onLogout}
    >
      {language === "ar" ? (
        <>
          <span className="ms-2">{t("logout")}</span>
          <LogOut className="h-5 w-5" />
        </>
      ) : (
        <>
          <LogOut className="h-5 w-5" />
          <span className="ml-2">{t("logout")}</span>
        </>
      )}
    </Button>
  );

  if (isMobile) {
    return (
      <>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-16 left-4 z-40 bg-white shadow-md"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="w-[80vw] sm:max-w-xs p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                <h2 className="text-base font-bold text-visa-dark">{t("clientPortal")}</h2>
              </div>

              <div className="flex-1 p-2 overflow-y-auto space-y-0.5">
                {menuItems.map(renderMenuItem)}
              </div>

              {onLogout && <div className="p-2 border-t">{renderLogoutButton()}</div>}
            </div>
          </SheetContent>
        </Sheet>

        {/* Bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center p-2 z-40 md:hidden">
          {menuItems.slice(0, 5).map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full p-2",
                activeSection === item.id ? "bg-visa-light text-visa-gold" : "text-gray-500"
              )}
              onClick={() => handleMenuItemClick(item.id)}
            >
              {item.icon}
            </Button>
          ))}
        </div>
      </>
    );
  }

  return (
    <Sidebar
      className={cn(
        `border-gray-200 ${language === "ar" ? "border-r-0 border-l" : "border-r"}`,
        "max-w-[240px] w-[240px] bg-white",
        className
      )}
    >
      <SidebarHeader>
        <div className="p-3">
          <h2 className="text-base font-bold text-visa-dark truncate">{t("adminPortal")}</h2>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <nav className="space-y-0.5 p-2">{menuItems.map(renderMenuItem)}</nav>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-gray-200 mt-auto">
        {onLogout && renderLogoutButton()}
      </SidebarFooter>
    </Sidebar>
  );
};

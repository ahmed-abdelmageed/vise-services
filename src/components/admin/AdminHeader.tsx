import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Home, LogOut, Globe, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";

interface AdminHeaderProps {
  className?: string;
  onLogout?: () => void;
}

export const AdminHeader = ({ className, onLogout }: AdminHeaderProps) => {
  const { t, toggleLanguage } = useLanguage();
  const { setOpenMobile } = useSidebar();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default logout behavior
      localStorage.removeItem("adminAuthenticated");
      window.location.href = "/";
    }
  };

  return (
    <header
      className={cn(
        "bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-between shadow-sm z-20 h-[60px]",
        className
      )}
    >
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        {/* Mobile Sidebar Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          onClick={() => setOpenMobile(true)}
          aria-label={t("openSidebar")}
        >
          <Menu className="h-5 w-5 text-visa-dark" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-visa-light transition-colors border border-gray-200"
          aria-label={t("home")}
          asChild
        >
          <Link to="/">
            <Home className="h-5 w-5 text-visa-gold hover:text-visa-dark transition-colors" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold text-visa-dark truncate">
          VISA<span className="text-visa-gold">Services</span>
        </h1>
      </div>

      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLanguage}
          className="flex items-center gap-1 border border-gray-300 hover:bg-visa-light/20"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{t("changeLanguage")}</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-1 border border-gray-300 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4 rtl:rotate-180" />
          <span className="hidden sm:inline">{t("logout")}</span>
        </Button>
      </div>
    </header>
  );
};

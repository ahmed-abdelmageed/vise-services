import React from "react";
import { UserAccountMenu } from "./UserAccountMenu";
import { Button } from "./ui/button";
import { Home, Globe } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  const navigate = useNavigate();
  const { language, toggleLanguage, t } = useLanguage();
  const isMobile = useIsMobile();

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <header
      dir="rtl"
      className={cn(
        "bg-white shadow-lg py-3 z-50 h-fit sticky top-0 flex items-center justify-center",
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {isMobile ? (
              <>
                <MobileMenu />
                <UserAccountMenu />
              </>
            ) : (
              <>
                <UserAccountMenu />
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-visa-light transition-colors border border-gray-200"
                  aria-label={t("home")}
                  onClick={handleHomeClick}
                >
                  <Home className="h-6 w-6 text-visa-gold hover:text-visa-dark transition-colors" />
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-visa-dark truncate mt-2">
            <span className="text-visa-gold">Global</span>  VISA <span className="text-visa-gold">Services</span>
            </h1>
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center justify-center border rounded-full border-gray-300 hover:bg-visa-light/20"
            >
              <Globe className="h-4 w-4" />
              <span className={isMobile ? "sr-only" : "hidden sm:inline"}>
                {t("changeLanguage")}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};


import React from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  LogOut, 
  UserCircle, 
  FileText,
  Settings 
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface UserDropdownContentProps {
  userName: string;
  onLogout: () => Promise<void>;
}

export const UserDropdownContent = ({ userName, onLogout }: UserDropdownContentProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  const handleSetActiveSection = (section: string) => {
    navigate("/client-dashboard");
    setTimeout(() => {
      // Attempt to change the active section
      const event = new CustomEvent('setActiveSection', { detail: section });
      document.dispatchEvent(event);
    }, 100);
  };

  return (
    <DropdownMenuContent 
      align="end" 
      className={isMobile ? "w-[90vw] sm:w-56 mobile-dropdown" : "w-56"}
      sideOffset={isMobile ? 20 : 6}
    >
      <div className="flex flex-col px-2 py-1.5">
        <p className="text-sm font-medium truncate">{userName}</p>
      </div>
      <DropdownMenuSeparator />
      <DropdownMenuItem 
        className="cursor-pointer touch-target"
        onClick={() => navigate("/client-dashboard")}
      >
        <UserCircle className="w-4 h-4 mr-2" />
        <span>{t('dashboard')}</span>
      </DropdownMenuItem>
      <DropdownMenuItem 
        className="cursor-pointer touch-target"
        onClick={() => handleSetActiveSection('services')}
      >
        <FileText className="w-4 h-4 mr-2" />
        <span>{t('myApplications')}</span>
      </DropdownMenuItem>
      <DropdownMenuItem 
        className="cursor-pointer touch-target"
        onClick={() => handleSetActiveSection('settings')}
      >
        <Settings className="w-4 h-4 mr-2" />
        <span>{t('accountSettings')}</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="cursor-pointer text-red-600 touch-target" onClick={onLogout}>
        <LogOut className="w-4 h-4 mr-2" />
        <span>{t('logout')}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};

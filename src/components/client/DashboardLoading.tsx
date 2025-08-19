
import React from "react";
import { Loader } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const DashboardLoading: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <Loader className="w-10 h-10 animate-spin text-visa-gold" />
        <span className="ml-3 text-lg text-visa-dark">{t('loadingDashboard')}</span>
      </div>
    </div>
  );
};

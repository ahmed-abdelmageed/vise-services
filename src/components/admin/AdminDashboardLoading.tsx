
import React from "react";
import { Loader } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const AdminDashboardLoading = () => {
  const { t } = useLanguage();
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <Loader className="h-8 w-8 animate-spin text-visa-gold" />
      <span className="ml-2 text-visa-dark">
        {t('loadingAdminDashboard')}
      </span>
    </div>
  );
};

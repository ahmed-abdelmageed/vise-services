
import React from "react";
import { Loader } from "lucide-react";
import { DashboardOverview } from "@/components/client/DashboardOverview";
import { MyServices } from "@/components/client/MyServices";
import { MyInvoices } from "@/components/client/MyInvoices";
import { MyRequests } from "@/components/client/MyRequests";
import { CustomerSupport } from "@/components/client/CustomerSupport";
import { AccountSettings } from "@/components/client/AccountSettings";
import { useLanguage } from "@/contexts/LanguageContext";
import { ClientSection, UserData } from "@/types/dashboard";

interface DashboardContentProps {
  activeSection: ClientSection;
  user: UserData;
  applications: any[];
  loading: boolean;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ 
  activeSection, 
  user, 
  applications,
  loading 
}) => {
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader className="w-6 h-6 animate-spin text-visa-gold" />
        <span className="ml-2 text-visa-dark text-sm">{t('loading')}</span>
      </div>
    );
  }
  
  switch (activeSection) {
    case "dashboard":
      return <DashboardOverview user={user} applications={applications} />;
    case "services":
      return <MyServices applications={applications} />;
    case "invoices":
      return <MyInvoices />;
    case "requests":
      return <MyRequests />;
    case "support":
      return <CustomerSupport user={user} />;
    case "settings":
      return <AccountSettings user={user} />;
    default:
      return <DashboardOverview user={user} applications={applications} />;
  }
};

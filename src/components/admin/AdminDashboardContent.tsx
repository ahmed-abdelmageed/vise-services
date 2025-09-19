import React from "react";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { ClientsTable } from "@/components/admin/ClientsTable";
import { AnalyticsSection } from "@/components/admin/AnalyticsSection";
import { SettingsSection } from "@/components/admin/SettingsSection";
import { InvoicesSection } from "@/components/admin/InvoicesSection";
import { VisaServicesSection } from "@/components/admin/VisaServicesSection";
import { FooterEditor } from "@/components/admin/FooterEditor";
import { VisaApplication, ClientInvoice } from "@/types/crm";
import { AdminSection } from "@/hooks/useAdminDashboard";

interface AdminDashboardContentProps {
  activeSection: AdminSection;
  customers: VisaApplication[] | undefined;
  invoices: ClientInvoice[] | undefined;
  onDataChanged: () => Promise<void>;
  onDeleteCustomer: (id: string) => Promise<void>;
}

export const AdminDashboardContent: React.FC<AdminDashboardContentProps> = ({
  activeSection,
  customers = [],
  invoices = [],
  onDataChanged,
  onDeleteCustomer,
}) => {
  switch (activeSection) {
    case "dashboard":
      return (
        <DashboardOverview isLoading={false} onDataChanged={onDataChanged} />
      );
    case "clients":
      return (
        <ClientsTable
          isLoading={false}
          onDataChanged={onDataChanged}
          customers={customers}
          invoices={invoices}
          onDeleteCustomer={onDeleteCustomer}
        />
      );
    case "invoices":
      return (
        <InvoicesSection
          isLoading={false}
          invoices={invoices}
          customers={customers}
          onDataChanged={onDataChanged}
        />
      );
    case "visaServices":
      return (
        <VisaServicesSection isLoading={false} onDataChanged={onDataChanged} />
      );
    case "analytics":
      return (
        <AnalyticsSection
          isLoading={false}
          invoices={invoices}
          customers={customers}
          tasks={[]}
        />
      );
    case "settings":
      return (
        <SettingsSection
          isLoading={false}
          settings={{
            emailNotifications: true,
            smsNotifications: false,
            darkMode: false,
          }}
          onUpdateSettings={onDataChanged}
        />
      );
    case "footerEditor":
      return <FooterEditor />;
    default:
      return (
        <DashboardOverview isLoading={false} onDataChanged={onDataChanged} />
      );
  }
};

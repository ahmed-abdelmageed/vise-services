import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminDashboardLoading } from "@/components/admin/AdminDashboardLoading";
import { AdminDashboardContent } from "@/components/admin/AdminDashboardContent";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
// import { useClientDashboard } from "@/hooks/useClientDashboard";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const {
    activeSection,
    setActiveSection,
    customers,
    invoices,
    isLoading,
    handleDataChanged,
    handleDeleteCustomer,
  } = useAdminDashboard();

  // const { handleLogout: supabaseLogout } = useClientDashboard();

  const handleLogout = async () => {
    try {
      localStorage.removeItem("adminAuthenticated");
      // await supabaseLogout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return <AdminDashboardLoading />;
  }

  const sidebarPosition = language === "ar" ? "right-0" : "left-0";

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-full max-w-full">
        <AdminHeader
          className="sticky top-0 z-10 shrink-0"
          onLogout={handleLogout}
        />
        <div className="flex flex-1 overflow-y-auto relative">
          <AdminSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            className={`shrink-0 sticky ${sidebarPosition} top-0 h-fit`}
          />
          <main className="flex-1 p-3 md:p-4 lg:p-5 bg-gray-50 w-full">
            <AdminDashboardContent
              activeSection={activeSection}
              customers={customers}
              invoices={invoices}
              onDataChanged={handleDataChanged}
              onDeleteCustomer={handleDeleteCustomer}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;

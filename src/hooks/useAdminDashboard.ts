import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { VisaApplication, ClientInvoice } from "@/types/crm";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVisaServices } from "./useVisaServicesQuery";

export type AdminSection =
  | "dashboard"
  | "clients"
  | "invoices"
  | "analytics"
  | "settings"
  | "visaServices"
  | "footerEditor";

export const useAdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated =
          localStorage.getItem("adminAuthenticated") === "true";

        if (!isAuthenticated) {
          toast.error("Please log in as admin to access this page");
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        toast.error("Authentication error. Please try logging in again.");
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate]);

  const {
    data: customers,
    isLoading: isLoadingCustomers,
    refetch: refetchCustomers,
  } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("visa_applications")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching customers:", error);
          toast.error(`Failed to load customers: ${error.message}`);
          throw error;
        }

        console.log(`Retrieved ${data?.length || 0} customers from database`);
        return data as VisaApplication[];
      } catch (error) {
        console.error("Error in queryFn:", error);
        toast.error(
          `Unexpected error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        throw error;
      }
    },
    staleTime: 30000,
  });

  const {
    data: invoices,
    isLoading: isLoadingInvoices,
    refetch: refetchInvoices,
  } = useQuery({
    queryKey: ["admin-invoices"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("client_invoices")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching invoices:", error);
          toast.error(`Failed to load invoices: ${error.message}`);
          throw error;
        }

        console.log(`Retrieved ${data?.length || 0} invoices from database`);
        return data as ClientInvoice[];
      } catch (error) {
        console.error("Error in queryFn:", error);
        toast.error(
          `Unexpected error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        throw error;
      }
    },
    staleTime: 30000,
  });

  // Use visa services React Query hook
  const {
    data: visaServices,
    isLoading: isLoadingVisaServices,
    refetch: refetchVisaServices,
  } = useVisaServices({});

  const handleDataChanged = useCallback(async () => {
    try {
      console.log("Refreshing data after operation...");

      await refetchCustomers();
      await refetchInvoices();
      await refetchVisaServices();

      queryClient.invalidateQueries({ queryKey: ["dashboard-applications"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-status-updates"] });
      queryClient.invalidateQueries({ queryKey: ["visa-services"] });

      console.log("Data refresh completed successfully");
      return Promise.resolve();
    } catch (error) {
      console.error("Error during data refresh:", error);
      toast.error("Failed to refresh data. Please try again.");
      return Promise.reject(error);
    }
  }, [refetchCustomers, refetchInvoices, refetchVisaServices, queryClient]);

  const handleDeleteCustomer = useCallback(
    async (id: string) => {
      try {
        console.log(`Deleting customer with ID: ${id}`);
        const { error } = await supabase
          .from("visa_applications")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("Error deleting customer:", error);
          toast.error(`Failed to delete customer: ${error.message}`);
          return;
        }

        toast.success("Customer deleted successfully");

        await handleDataChanged();
      } catch (error) {
        console.error("Error in handleDeleteCustomer:", error);
        toast.error(
          `An error occurred while deleting the customer: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
    [handleDataChanged]
  );

  return {
    activeSection,
    setActiveSection,
    customers,
    invoices,
    visaServices,
    isLoading: isLoadingCustomers || isLoadingInvoices || isLoadingVisaServices,
    handleDataChanged,
    handleDeleteCustomer,
  };
};


import { useState } from "react";
import { VisaApplication, ApplicationStatusType } from "@/types/crm";

export const useClientDialogs = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<VisaApplication | null>(null);
  const [customerDetailsOpen, setCustomerDetailsOpen] = useState(false);
  const [bulkStatusDialogOpen, setBulkStatusDialogOpen] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<ApplicationStatusType>("Pending");
  const [isProcessing, setIsProcessing] = useState(false);

  return {
    deleteDialogOpen,
    setDeleteDialogOpen,
    bulkDeleteDialogOpen,
    setBulkDeleteDialogOpen,
    selectedCustomerId,
    setSelectedCustomerId,
    selectedCustomer,
    setSelectedCustomer,
    customerDetailsOpen,
    setCustomerDetailsOpen,
    bulkStatusDialogOpen,
    setBulkStatusDialogOpen,
    bulkStatus,
    setBulkStatus,
    isProcessing,
    setIsProcessing
  };
};

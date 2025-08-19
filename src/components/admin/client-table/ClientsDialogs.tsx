
import React from "react";
import { VisaApplication, ClientInvoice, ApplicationStatusType } from "@/types/crm";
import { DeleteClientDialog } from "../modals/DeleteClientDialog";
import { BulkStatusDialog } from "../modals/BulkStatusDialog";
import { ClientDetailsDialog } from "../modals/ClientDetailsDialog";

interface ClientsDialogsProps {
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  confirmDelete: () => Promise<void>;
  bulkDeleteDialogOpen: boolean;
  setBulkDeleteDialogOpen: (open: boolean) => void;
  confirmBulkDelete: () => Promise<void>;
  bulkStatusDialogOpen: boolean;
  setBulkStatusDialogOpen: (open: boolean) => void;
  confirmBulkStatusUpdate: () => Promise<void>;
  bulkStatus: ApplicationStatusType;
  setBulkStatus: (status: ApplicationStatusType) => void;
  selectedItems: Set<string>;
  customerDetailsOpen: boolean;
  setCustomerDetailsOpen: (open: boolean) => void;
  selectedCustomer: VisaApplication | null;
  invoices: ClientInvoice[];
  handleEditClient: (id: string) => void;
  isProcessing: boolean;
  onDataChanged?: () => Promise<void>;
}

export const ClientsDialogs: React.FC<ClientsDialogsProps> = ({
  deleteDialogOpen,
  setDeleteDialogOpen,
  confirmDelete,
  bulkDeleteDialogOpen,
  setBulkDeleteDialogOpen,
  confirmBulkDelete,
  bulkStatusDialogOpen,
  setBulkStatusDialogOpen,
  confirmBulkStatusUpdate,
  bulkStatus,
  setBulkStatus,
  selectedItems,
  customerDetailsOpen,
  setCustomerDetailsOpen,
  selectedCustomer,
  invoices,
  handleEditClient,
  isProcessing,
  onDataChanged
}) => {
  return (
    <>
      {/* Delete Confirmation Dialog */}
      <DeleteClientDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        singleClient={true}
        isDeleting={isProcessing}
      />
      
      {/* Bulk Delete Confirmation Dialog */}
      <DeleteClientDialog 
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        onConfirm={confirmBulkDelete}
        singleClient={false}
        clientCount={selectedItems.size}
        isDeleting={isProcessing}
      />
      
      {/* Bulk Status Update Dialog */}
      <BulkStatusDialog 
        open={bulkStatusDialogOpen}
        onOpenChange={setBulkStatusDialogOpen}
        onConfirm={confirmBulkStatusUpdate}
        bulkStatus={bulkStatus}
        setBulkStatus={setBulkStatus}
        selectedItemsCount={selectedItems.size}
      />
      
      {/* Client Details Dialog */}
      <ClientDetailsDialog 
        open={customerDetailsOpen}
        onOpenChange={setCustomerDetailsOpen}
        selectedCustomer={selectedCustomer}
        invoices={invoices}
        onEditClient={handleEditClient}
        onDataChanged={onDataChanged}
      />
    </>
  );
};


import React, { useCallback } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { VisaApplication, ClientInvoice } from "@/types/crm";
import { ClientsTableHeader } from "./ClientsTableHeader";
import { BulkActionsBar } from "./BulkActionsBar";
import { ClientsTableContent } from "./client-table/ClientsTableContent";
import { ClientsDialogs } from "./client-table/ClientsDialogs";
import { useClientsTable } from "@/hooks/useClientsTable";
import { toast } from "sonner";
import { bulkDeleteClients, bulkUpdateClientStatus } from "@/utils/clientOperations";

interface ClientsTableProps {
  customers: VisaApplication[];
  invoices: ClientInvoice[];
  isLoading: boolean;
  onDeleteCustomer: (id: string) => void;
  onDataChanged?: () => Promise<void>;
}

export const ClientsTable = ({ 
  customers, 
  invoices, 
  isLoading, 
  onDeleteCustomer,
  onDataChanged 
}: ClientsTableProps) => {
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredCustomers,
    deleteDialogOpen,
    setDeleteDialogOpen,
    bulkDeleteDialogOpen,
    setBulkDeleteDialogOpen,
    selectedCustomer,
    customerDetailsOpen,
    setCustomerDetailsOpen,
    selectedItems,
    bulkActionsOpen,
    setBulkActionsOpen,
    bulkStatusDialogOpen,
    setBulkStatusDialogOpen,
    bulkStatus,
    setBulkStatus,
    isProcessing,
    setIsProcessing,
    handleDeleteClick,
    confirmDelete,
    handleViewDetails,
    toggleItemSelection,
    selectAll,
    clearSelections,
    handleBulkDelete,
    confirmBulkDelete,
    handleBulkStatusUpdateClick,
    confirmBulkStatusUpdate,
    handleSendEmail,
    handleEditClient,
    handleViewDocuments
  } = useClientsTable({
    customers,
    invoices,
    onDeleteCustomer,
    onDataChanged
  });

  // Enhanced bulk actions with guaranteed state updates
  const performBulkDelete = useCallback(async () => {
    if (selectedItems.size === 0) {
      toast.error("No clients selected");
      return;
    }

    setIsProcessing(true);
    try {
      const clientIds = Array.from(selectedItems);
      const result = await bulkDeleteClients(clientIds);
      
      if (result.success) {
        toast.success(`Successfully deleted ${clientIds.length} clients`);
        
        // Clean up UI state first
        setBulkDeleteDialogOpen(false);
        setBulkActionsOpen(false);
        clearSelections();
        
        // Then refresh data
        if (onDataChanged) {
          await onDataChanged();
        }
      } else {
        toast.error(result.message || "Failed to delete clients");
      }
    } catch (error) {
      console.error("Error in performBulkDelete:", error);
      toast.error(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedItems, setIsProcessing, setBulkDeleteDialogOpen, setBulkActionsOpen, clearSelections, onDataChanged]);

  const performBulkStatusUpdate = useCallback(async () => {
    if (selectedItems.size === 0 || !bulkStatus) {
      toast.error("No clients selected or no status chosen");
      return;
    }

    setIsProcessing(true);
    try {
      const clientIds = Array.from(selectedItems);
      const result = await bulkUpdateClientStatus(clientIds, bulkStatus);
      
      if (result.success) {
        toast.success(`Successfully updated status for ${clientIds.length} clients`);
        
        // Clean up UI state first
        setBulkStatusDialogOpen(false);
        setBulkActionsOpen(false);
        clearSelections();
        
        // Then refresh data
        if (onDataChanged) {
          await onDataChanged();
        }
      } else {
        toast.error(result.message || "Failed to update client status");
      }
    } catch (error) {
      console.error("Error in performBulkStatusUpdate:", error);
      toast.error(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedItems, bulkStatus, setIsProcessing, setBulkStatusDialogOpen, setBulkActionsOpen, clearSelections, onDataChanged]);

  return (
    <div className="space-y-6">
      <ClientsTableHeader 
        searchQuery={searchQuery} 
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Bulk Actions Bar */}
      {bulkActionsOpen && (
        <BulkActionsBar 
          selectedItemsCount={selectedItems.size}
          onUpdateStatus={() => setBulkStatusDialogOpen(true)}
          onDelete={handleBulkDelete}
          onCancel={clearSelections}
          isProcessing={isProcessing}
          showFilters={true}
          onFilter={setStatusFilter}
        />
      )}

      <Card>
        <CardContent className="p-0">
          <ClientsTableContent 
            customers={customers}
            invoices={invoices}
            isLoading={isLoading}
            selectedItems={selectedItems}
            filteredCustomers={filteredCustomers}
            toggleItemSelection={toggleItemSelection}
            selectAll={selectAll}
            setBulkActionsOpen={setBulkActionsOpen}
            onViewDetails={handleViewDetails}
            onViewDocuments={handleViewDocuments}
            onEditClient={handleEditClient}
            onSendEmail={handleSendEmail}
            onDeleteClick={handleDeleteClick}
          />
        </CardContent>
      </Card>
      
      <ClientsDialogs 
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        confirmDelete={confirmDelete}
        bulkDeleteDialogOpen={bulkDeleteDialogOpen}
        setBulkDeleteDialogOpen={setBulkDeleteDialogOpen}
        confirmBulkDelete={performBulkDelete}
        bulkStatusDialogOpen={bulkStatusDialogOpen}
        setBulkStatusDialogOpen={setBulkStatusDialogOpen}
        confirmBulkStatusUpdate={performBulkStatusUpdate}
        bulkStatus={bulkStatus}
        setBulkStatus={setBulkStatus}
        selectedItems={selectedItems}
        customerDetailsOpen={customerDetailsOpen}
        setCustomerDetailsOpen={setCustomerDetailsOpen}
        selectedCustomer={selectedCustomer}
        invoices={invoices}
        handleEditClient={handleEditClient}
        isProcessing={isProcessing}
        onDataChanged={onDataChanged}
      />
    </div>
  );
};

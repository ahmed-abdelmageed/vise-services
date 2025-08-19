
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { VisaApplication, ApplicationStatusType } from "@/types/crm";
import { deleteClient, bulkDeleteClients, bulkUpdateClientStatus } from "@/utils/clientOperations";

interface UseClientActionsProps {
  onDeleteCustomer: (id: string) => void;
  onDataChanged?: () => Promise<void>;
  setIsProcessing: (isProcessing: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setSelectedCustomerId: (id: string | null) => void;
  selectedCustomerId: string | null;
  setBulkDeleteDialogOpen: (open: boolean) => void;
  setBulkStatusDialogOpen: (open: boolean) => void;
  clearSelections: () => void;
}

export const useClientActions = ({
  onDeleteCustomer,
  onDataChanged,
  setIsProcessing,
  setDeleteDialogOpen,
  setSelectedCustomerId,
  selectedCustomerId,
  setBulkDeleteDialogOpen,
  setBulkStatusDialogOpen,
  clearSelections
}: UseClientActionsProps) => {
  
  const handleDeleteClick = useCallback((id: string) => {
    console.log("Delete clicked for ID:", id);
    setSelectedCustomerId(id);
    setDeleteDialogOpen(true);
  }, [setSelectedCustomerId, setDeleteDialogOpen]);

  const confirmDelete = useCallback(async () => {
    if (selectedCustomerId) {
      console.log("Confirming delete for ID:", selectedCustomerId);
      setIsProcessing(true);
      
      try {
        toast.loading('Deleting client and associated files...');
        const success = await deleteClient(selectedCustomerId);
        
        if (success) {
          toast.dismiss();
          toast.success('Client and all associated data deleted successfully');
          
          // First, clean up UI state
          setDeleteDialogOpen(false);
          setSelectedCustomerId(null);
          
          // Then call the parent component's delete handler to update the UI
          onDeleteCustomer(selectedCustomerId);
          
          // Finally, refresh data if needed
          if (onDataChanged) {
            try {
              await onDataChanged();
            } catch (refreshError) {
              console.error('Error refreshing data after delete:', refreshError);
              toast.error(`Error refreshing data: ${refreshError instanceof Error ? refreshError.message : 'Unknown error'}`);
            }
          }
        } else {
          toast.dismiss();
          toast.error('Failed to delete client. Please try again.');
        }
      } catch (error) {
        toast.dismiss();
        console.error('Error during delete:', error);
        toast.error(`Deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsProcessing(false);
      }
    }
  }, [selectedCustomerId, setIsProcessing, setDeleteDialogOpen, setSelectedCustomerId, onDeleteCustomer, onDataChanged]);
  
  const handleBulkDelete = useCallback(() => {
    console.log("Bulk delete requested");
    setBulkDeleteDialogOpen(true);
  }, [setBulkDeleteDialogOpen]);
  
  const confirmBulkDelete = useCallback(async (selectedItems: Set<string>) => {
    const idsToDelete = Array.from(selectedItems);
    console.log("Confirming bulk delete for IDs:", idsToDelete);
    
    if (idsToDelete.length === 0) {
      toast.error('No clients selected for deletion');
      return;
    }
    
    setIsProcessing(true);
    toast.loading(`Deleting ${idsToDelete.length} clients and their associated files...`);
    
    try {
      const result = await bulkDeleteClients(idsToDelete);
      
      toast.dismiss();
      if (result.success) {
        toast.success(`Successfully deleted ${idsToDelete.length} clients`);
        
        // Clean up UI state first
        clearSelections();
        setBulkDeleteDialogOpen(false);
        
        // Then refresh data
        if (onDataChanged) {
          try {
            await onDataChanged();
          } catch (refreshError) {
            console.error('Error refreshing data after bulk delete:', refreshError);
            toast.error(`Error refreshing data: ${refreshError instanceof Error ? refreshError.message : 'Unknown error'}`);
          }
        }
      } else {
        toast.error(result.message || 'Failed to delete clients');
      }
    } catch (error) {
      toast.dismiss();
      console.error('Error during bulk delete:', error);
      toast.error(`Failed to delete clients: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  }, [setIsProcessing, clearSelections, setBulkDeleteDialogOpen, onDataChanged]);
  
  const handleBulkStatusUpdateClick = useCallback(() => {
    setBulkStatusDialogOpen(true);
  }, [setBulkStatusDialogOpen]);
  
  const confirmBulkStatusUpdate = useCallback(async (selectedItems: Set<string>, bulkStatus: ApplicationStatusType) => {
    const idsToUpdate = Array.from(selectedItems);
    
    if (idsToUpdate.length === 0) {
      toast.error('No clients selected for status update');
      return;
    }
    
    setIsProcessing(true);
    toast.loading(`Updating status for ${idsToUpdate.length} clients...`);
    
    try {
      const result = await bulkUpdateClientStatus(idsToUpdate, bulkStatus);
      
      toast.dismiss();
      if (result.success) {
        toast.success(`Successfully updated ${idsToUpdate.length} clients to ${bulkStatus}`);
        
        // Clean up UI state first
        clearSelections();
        setBulkStatusDialogOpen(false);
        
        // Then refresh data
        if (onDataChanged) {
          try {
            await onDataChanged();
          } catch (refreshError) {
            console.error('Error refreshing data after status update:', refreshError);
            toast.error(`Error refreshing data: ${refreshError instanceof Error ? refreshError.message : 'Unknown error'}`);
          }
        }
      } else {
        toast.error(result.message || 'Failed to update client statuses');
      }
    } catch (error) {
      toast.dismiss();
      console.error('Error during bulk status update:', error);
      toast.error(`Failed to update client statuses: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  }, [setIsProcessing, clearSelections, setBulkStatusDialogOpen, onDataChanged]);

  return {
    handleDeleteClick,
    confirmDelete,
    handleBulkDelete,
    confirmBulkDelete,
    handleBulkStatusUpdateClick,
    confirmBulkStatusUpdate
  };
};

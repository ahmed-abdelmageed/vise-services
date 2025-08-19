
import { VisaApplication, ClientInvoice } from "@/types/crm";
import { useClientFilters } from "./useClientFilters";
import { useClientSelection } from "./useClientSelection";
import { useClientDialogs } from "./useClientDialogs";
import { useClientActions } from "./useClientActions";
import { useClientOperations } from "./useClientOperations";

interface UseClientsTableProps {
  customers: VisaApplication[];
  invoices: ClientInvoice[];
  onDeleteCustomer: (id: string) => void;
  onDataChanged?: () => Promise<void>;
}

export const useClientsTable = ({
  customers,
  invoices,
  onDeleteCustomer,
  onDataChanged
}: UseClientsTableProps) => {
  // Use smaller hooks
  const { 
    searchQuery, 
    setSearchQuery, 
    statusFilter, 
    setStatusFilter, 
    filteredCustomers 
  } = useClientFilters(customers);

  const {
    selectedItems,
    bulkActionsOpen,
    setBulkActionsOpen,
    toggleItemSelection,
    selectAll,
    clearSelections
  } = useClientSelection();
  
  const {
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
  } = useClientDialogs();
  
  const {
    handleDeleteClick,
    confirmDelete,
    handleBulkDelete,
    confirmBulkDelete: _confirmBulkDelete,
    handleBulkStatusUpdateClick,
    confirmBulkStatusUpdate: _confirmBulkStatusUpdate
  } = useClientActions({
    onDeleteCustomer,
    onDataChanged,
    setIsProcessing,
    setDeleteDialogOpen,
    setSelectedCustomerId,
    selectedCustomerId,
    setBulkDeleteDialogOpen,
    setBulkStatusDialogOpen,
    clearSelections
  });
  
  const confirmBulkDelete = () => _confirmBulkDelete(selectedItems);
  const confirmBulkStatusUpdate = () => _confirmBulkStatusUpdate(selectedItems, bulkStatus);
  
  const { 
    handleViewDetails: _handleViewDetails,
    handleSendEmail: _handleSendEmail,
    handleEditClient,
    handleViewDocuments: _handleViewDocuments
  } = useClientOperations();
  
  // Wrap the operations to pass the necessary parameters
  const handleViewDetails = (customer: VisaApplication) => 
    _handleViewDetails(customer, setSelectedCustomer, setCustomerDetailsOpen);
  
  const handleSendEmail = (clientId: string) => 
    _handleSendEmail(clientId, customers);
  
  const handleViewDocuments = (clientId: string) => 
    _handleViewDocuments(clientId, customers, setSelectedCustomer, setCustomerDetailsOpen);

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredCustomers,
    deleteDialogOpen,
    setDeleteDialogOpen,
    bulkDeleteDialogOpen,
    setBulkDeleteDialogOpen,
    selectedCustomerId,
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
  };
};


import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { VisaApplication, ClientInvoice } from "@/types/crm";
import { ClientRow } from "../ClientRow";
import { EmptyState } from "../EmptyState";

interface ClientsTableContentProps {
  customers: VisaApplication[];
  invoices: ClientInvoice[];
  isLoading: boolean;
  selectedItems: Set<string>;
  filteredCustomers: VisaApplication[];
  toggleItemSelection: (id: string) => void;
  selectAll?: (ids: string[]) => void;
  setBulkActionsOpen: (open: boolean) => void;
  onViewDetails: (customer: VisaApplication) => void;
  onViewDocuments: (id: string) => void;
  onEditClient: (id: string) => void;
  onSendEmail: (id: string) => void;
  onDeleteClick: (id: string) => void;
}

export const ClientsTableContent: React.FC<ClientsTableContentProps> = ({
  customers,
  invoices,
  isLoading,
  selectedItems,
  filteredCustomers,
  toggleItemSelection,
  selectAll,
  setBulkActionsOpen,
  onViewDetails,
  onViewDocuments,
  onEditClient,
  onSendEmail,
  onDeleteClick,
}) => {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      if (selectAll) {
        selectAll(filteredCustomers.map(c => c.id));
      } else {
        // Fallback if selectAll is not provided
        filteredCustomers.forEach(customer => {
          if (!selectedItems.has(customer.id)) {
            toggleItemSelection(customer.id);
          }
        });
      }
      setBulkActionsOpen(true);
    } else {
      // Unselect all
      filteredCustomers.forEach(customer => {
        if (selectedItems.has(customer.id)) {
          toggleItemSelection(customer.id);
        }
      });
      setBulkActionsOpen(false);
    }
  };

  const allSelected = filteredCustomers.length > 0 && filteredCustomers.every(c => selectedItems.has(c.id));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <div className="flex items-center justify-center">
              <Checkbox 
                checked={allSelected}
                onCheckedChange={handleSelectAll}
                disabled={filteredCustomers.length === 0}
              />
            </div>
          </TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Ref ID</TableHead>
          <TableHead>Country</TableHead>
          <TableHead className="hidden md:table-cell">Service Type</TableHead>
          <TableHead className="hidden lg:table-cell">Submitted</TableHead>
          <TableHead className="hidden md:table-cell">Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={8}>
              <EmptyState 
                isLoading={true} 
                title="Loading clients..." 
                description="Please wait while we fetch client data."
              />
            </TableCell>
          </TableRow>
        ) : filteredCustomers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8}>
              <EmptyState 
                title="No clients found" 
                description="There are no clients matching your current filters."
              />
            </TableCell>
          </TableRow>
        ) : (
          filteredCustomers.map((customer) => {
            // Get related invoices for this customer
            const customerInvoices = invoices.filter(inv => inv.client_id === customer.id);
            
            return (
              <ClientRow 
                key={customer.id}
                customer={customer}
                customerInvoices={customerInvoices}
                selected={selectedItems.has(customer.id)}
                onSelect={toggleItemSelection}
                onViewDetails={onViewDetails}
                onViewDocuments={onViewDocuments}
                onEditClient={onEditClient}
                onSendEmail={onSendEmail}
                onDeleteClick={onDeleteClick}
              />
            );
          })
        )}
      </TableBody>
    </Table>
  );
};

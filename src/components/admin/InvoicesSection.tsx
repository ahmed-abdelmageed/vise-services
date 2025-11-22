import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Download,
  Plus,
  Eye,
  Loader,
  Check,
  X,
  CreditCard,
  FileText,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "./StatusBadge";
import { toast } from "sonner";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { VisaApplication, ClientInvoice, InvoiceStatusType } from "@/types/crm";
import { downloadInvoicePDF } from "@/utils/invoicePDF";
import { fetchApplicationByInvoiceClientId } from "@/api/invoices";
import { InvoicePreviewModal } from "@/components/client/InvoicePreviewModal";
import { useFooterInfo } from "@/hooks/useFooterInfo";

interface CreateInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  clients: VisaApplication[];
}

const CreateInvoiceDialog: React.FC<CreateInvoiceDialogProps> = ({
  isOpen,
  onClose,
  clients,
}) => {
  const [selectedClient, setSelectedClient] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const queryClient = useQueryClient();

  const createInvoiceMutation = useMutation({
    mutationFn: async (invoiceData: Partial<ClientInvoice>) => {
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(
        Math.random() * 10000
      )
        .toString()
        .padStart(4, "0")}`;

      const { data, error } = await supabase.from("client_invoices").insert([
        {
          invoice_number: invoiceNumber,
          client_id: invoiceData.client_id,
          amount: invoiceData.amount,
          currency: "﷼",
          status: "Unpaid",
          issue_date: new Date().toISOString(),
          due_date: invoiceData.due_date,
          service_description: invoiceData.service_description,
        },
      ]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice created successfully");
      onClose();
      // Reset form
      setSelectedClient("");
      setAmount("");
      setDescription("");
      setDueDate("");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create invoice");
    },
  });

  const handleCreateInvoice = () => {
    if (!selectedClient || !amount || !dueDate) {
      toast.error("Please fill all required fields");
      return;
    }

    createInvoiceMutation.mutate({
      client_id: selectedClient,
      amount: parseFloat(amount),
      due_date: dueDate,
      service_description: description,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>
            Create a new invoice for a client. The invoice will be marked as
            unpaid by default.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="client" className="text-sm font-medium">
              Client
            </label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.first_name} {client.last_name || ""} ({client.email}
                    )
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Service Description
            </label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Visa Application Processing"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Amount (﷼)
            </label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="dueDate" className="text-sm font-medium">
              Due Date
            </label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateInvoice}
            className="bg-visa-gold hover:bg-visa-gold/90"
            disabled={createInvoiceMutation.isPending}
          >
            {createInvoiceMutation.isPending ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Create Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface InvoicesSectionProps {
  invoices: any[];
  customers: any[];
  isLoading: boolean;
  onDataChanged?: () => Promise<void>;
}

export const InvoicesSection = ({
  isLoading: propsLoading,
  onDataChanged,
}: InvoicesSectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkStatusDialogOpen, setBulkStatusDialogOpen] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<InvoiceStatusType>("Paid");
  const [selectedInvoice, setSelectedInvoice] = useState<ClientInvoice | null>(
    null
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const queryClient = useQueryClient();

  // Get footer info for company details
  const { data: footerData, isLoading: footerLoading } = useFooterInfo();

  const { data: invoices, isLoading: isLoadingInvoices } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_invoices")
        .select("*, client:client_id(first_name, last_name, email)")
        .order("issue_date", { ascending: false });

      if (error) throw error;
      return data as (ClientInvoice & {
        client: { first_name: string; last_name: string; email: string };
      })[];
    },
  });

  const { data: clients, isLoading: isLoadingClients } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("visa_applications")
        .select("id, first_name, last_name, email")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as VisaApplication[];
    },
  });

  const deleteInvoicesMutation = useMutation({
    mutationFn: async (invoiceIds: string[]) => {
      const { error } = await supabase
        .from("client_invoices")
        .delete()
        .in("id", invoiceIds);

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success(
        `${selectedInvoices.length} invoice(s) deleted successfully`
      );
      setSelectedInvoices([]);
      setDeleteDialogOpen(false);
      if (onDataChanged) {
        onDataChanged();
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete invoices");
    },
  });

  const updateInvoiceStatusMutation = useMutation({
    mutationFn: async ({
      invoiceIds,
      status,
    }: {
      invoiceIds: string[];
      status: string;
    }) => {
      const { error } = await supabase
        .from("client_invoices")
        .update({ status })
        .in("id", invoiceIds);

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success(
        `${selectedInvoices.length} invoice(s) marked as ${bulkStatus}`
      );
      setSelectedInvoices([]);
      setBulkStatusDialogOpen(false);
      if (onDataChanged) {
        onDataChanged();
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update invoice status");
    },
  });

  const isLoading =
    isLoadingInvoices || isLoadingClients || propsLoading || footerLoading;

  const handleCreateInvoice = () => {
    setCreateDialogOpen(true);
  };

  const handleViewInvoice = (invoice: ClientInvoice) => {
    setSelectedInvoice(invoice);
    setIsPreviewOpen(true);
  };

  const handleDownloadInvoice = async (invoice: ClientInvoice) => {
    console.log("🚀 ~ handleDownloadInvoice ~ invoice:", invoice);

    try {
      // Fetch application data using the invoice client_id
      const applicationResponse = await fetchApplicationByInvoiceClientId(
        invoice.client_id
      );

      if (!applicationResponse) {
        toast.error("Application data not found");
        return;
      }

      console.log("🚀 ~ Application data fetched:", applicationResponse);

      console.log(
        `🚀 ~ handleDownloadInvoice ~ applicationResponse.first_name + " " + applicationResponse.last_name:`,
        applicationResponse?.first_name + " " + applicationResponse?.last_name
      );

      // Enhance invoice object with application data
      const enhancedInvoice = {
        ...invoice,
        customer_name:
          applicationResponse.first_name + " " + applicationResponse.last_name,
        customer_email: applicationResponse.email || "Email Not Available",
      };

      // Now download the invoice with the enhanced data
      await downloadInvoicePDF(enhancedInvoice, "ar", footerData); // Admin section defaults to English
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error(
        "Error fetching application or downloading invoice:",
        error
      );
      toast.error("Failed to download invoice");
    }
  };

  const handleDeleteSelected = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDeleteSelected = () => {
    deleteInvoicesMutation.mutate(selectedInvoices);
  };

  const handleUpdateStatus = () => {
    setBulkStatusDialogOpen(true);
  };

  const confirmUpdateStatus = () => {
    updateInvoiceStatusMutation.mutate({
      invoiceIds: selectedInvoices,
      status: bulkStatus,
    });
  };

  const toggleSelectInvoice = (id: string) => {
    if (selectedInvoices.includes(id)) {
      setSelectedInvoices(
        selectedInvoices.filter((invoiceId) => invoiceId !== id)
      );
    } else {
      setSelectedInvoices([...selectedInvoices, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map((invoice) => invoice.id));
    }
    setSelectAll(!selectAll);
  };

  // Process and filter invoices
  const processedInvoices =
    invoices?.map((invoice) => {
      return {
        ...invoice,
        clientName: invoice.client
          ? `${invoice.client.first_name} ${invoice.client.last_name || ""}`
          : "Unknown Client",
        formattedAmount: `${invoice.amount} ${invoice.currency}`,
      };
    }) || [];

  // Filter invoices based on search term and status filter
  const filteredInvoices = processedInvoices.filter(
    (invoice) =>
      (invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoice_number
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (invoice.service_description &&
          invoice.service_description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))) &&
      (statusFilter === "all" || invoice.status === statusFilter)
  );

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch (e) {
      return "Invalid date";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader className="h-8 w-8 animate-spin text-visa-gold mb-4" />
        <p className="text-visa-dark">Loading invoice data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-visa-dark">Invoices</h1>
        <div className="flex space-x-2">
          {selectedInvoices.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={handleUpdateStatus}>
                <Check className="h-4 w-4 mr-2" />
                Mark as Paid
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleDeleteSelected}
              >
                <X className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </>
          )}
          <Button
            className="bg-visa-gold hover:bg-visa-gold/90"
            onClick={handleCreateInvoice}
          >
            <Plus className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search invoices..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Unpaid">Unpaid</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all invoices"
                />
              </TableHead>
              <TableHead>Invoice Number</TableHead>
              <TableHead>Client Name</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className={
                    selectedInvoices.includes(invoice.id) ? "bg-blue-50" : ""
                  }
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedInvoices.includes(invoice.id)}
                      onCheckedChange={() => toggleSelectInvoice(invoice.id)}
                      aria-label={`Select invoice ${invoice.invoice_number}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {invoice.invoice_number}
                  </TableCell>
                  <TableCell>{invoice.clientName}</TableCell>
                  <TableCell>{formatDate(invoice.issue_date)}</TableCell>
                  <TableCell>{formatDate(invoice.due_date)}</TableCell>
                  <TableCell>
                    {invoice.service_description || "Visa Services"}
                  </TableCell>
                  <TableCell>{invoice.formattedAmount}</TableCell>
                  <TableCell>
                    <StatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="View Invoice"
                        onClick={() => handleViewInvoice(invoice)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Download Invoice"
                        onClick={() => handleDownloadInvoice(invoice)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-8 text-gray-500"
                >
                  No invoices found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Invoice Dialog */}
      <CreateInvoiceDialog
        isOpen={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        clients={clients || []}
      />

      {/* Delete Selected Invoices Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {selectedInvoices.length} Invoices?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The selected invoices will be
              permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteSelected}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Status Update Dialog */}
      <AlertDialog
        open={bulkStatusDialogOpen}
        onOpenChange={setBulkStatusDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Update {selectedInvoices.length} Invoices to {bulkStatus}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will change the status of all selected invoices.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Select
              value={bulkStatus}
              onValueChange={(value) =>
                setBulkStatus(value as InvoiceStatusType)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Unpaid">Unpaid</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmUpdateStatus}
              className="bg-visa-gold hover:bg-visa-gold/90"
            >
              Update Status
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Invoice Preview Modal */}
      {selectedInvoice && (
        <InvoicePreviewModal
          invoice={selectedInvoice}
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false);
            setSelectedInvoice(null);
          }}
          onDownload={(invoiceId) => {
            if (selectedInvoice) {
              handleDownloadInvoice(selectedInvoice);
            }
          }}
          onPay={(invoiceId) => {
            // Admin section doesn't need pay functionality
            toast.info("Payment functionality not available in admin section");
          }}
        />
      )}
    </div>
  );
};

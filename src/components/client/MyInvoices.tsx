
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Eye, CreditCard, Loader } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { format } from "date-fns";
import { toast } from "sonner";
import { ClientInvoice } from "@/types/crm";

export const MyInvoices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch real invoices from the database
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['client-invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_invoices')
        .select('*')
        .order('issue_date', { ascending: false });
      
      if (error) throw error;
      return data as ClientInvoice[];
    },
    // If there's no data, fall back to the mock data
    placeholderData: [],
  });

  // If no real invoices are found, use these mock invoices
  const mockInvoices = [
    {
      id: "INV-2023-072",
      invoice_number: "INV-2023-072",
      issue_date: "2023-09-15",
      due_date: "2023-09-30",
      service_description: "Tourist Visa Application",
      amount: 450,
      currency: "﷼",
      status: "Paid",
    },
    {
      id: "INV-2023-078",
      invoice_number: "INV-2023-078",
      issue_date: "2023-10-01",
      due_date: "2023-10-15",
      service_description: "Document Translation",
      amount: 250,
      currency: "﷼",
      status: "Paid",
    },
    {
      id: "INV-2023-082",
      invoice_number: "INV-2023-082",
      issue_date: "2023-10-20",
      due_date: "2023-11-05",
      service_description: "Visa Consultation",
      amount: 150,
      currency: "﷼",
      status: "Unpaid",
    },
    {
      id: "INV-2023-087",
      invoice_number: "INV-2023-087",
      issue_date: "2023-11-01",
      due_date: "2023-11-15",
      service_description: "Express Processing",
      amount: 100,
      currency: "﷼",
      status: "Unpaid",
    },
  ];

  // Combine real and mock data, prioritizing real data
  const displayInvoices = invoices && invoices.length > 0 
    ? invoices 
    : mockInvoices as unknown as ClientInvoice[];

  // Filter invoices based on search term and status
  const filteredInvoices = displayInvoices.filter(
    (invoice) =>
      (invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (invoice.service_description && invoice.service_description.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (statusFilter === "all" || invoice.status === statusFilter)
  );

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch (e) {
      return dateString;
    }
  };

  const handleViewInvoice = (id: string) => {
    // In a real app, this would open a modal with invoice details
    toast.info(`Viewing invoice ${id}`);
  };

  const handleDownloadInvoice = (id: string) => {
    // In a real app, this would download the invoice PDF
    toast.info(`Downloading invoice ${id}`);
  };

  const handlePayInvoice = (id: string) => {
    // In a real app, this would open a payment gateway
    toast.info(`Processing payment for invoice ${id}`);
  };

  const handlePayAll = () => {
    // In a real app, this would process payment for all unpaid invoices
    const unpaidInvoices = filteredInvoices.filter(invoice => invoice.status === "Unpaid");
    toast.info(`Processing payment for ${unpaidInvoices.length} invoices`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-visa-gold mb-4" />
        <p className="text-visa-dark">Loading invoices...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-visa-dark">My Invoices</h1>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
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
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Invoices</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Unpaid">Unpaid</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice Number</TableHead>
              <TableHead>Date</TableHead>
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
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                  <TableCell>{formatDate(invoice.issue_date)}</TableCell>
                  <TableCell>{invoice.due_date ? formatDate(invoice.due_date) : 'N/A'}</TableCell>
                  <TableCell>{invoice.service_description || 'Visa Services'}</TableCell>
                  <TableCell>{invoice.amount} {invoice.currency}</TableCell>
                  <TableCell>
                    <StatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="View Invoice Details"
                        onClick={() => handleViewInvoice(invoice.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Download Invoice"
                        onClick={() => handleDownloadInvoice(invoice.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {invoice.status === "Unpaid" && (
                        <Button 
                          size="sm" 
                          variant="default" 
                          className="bg-visa-gold hover:bg-visa-gold/90" 
                          title="Pay Now"
                          onClick={() => handlePayInvoice(invoice.id)}
                        >
                          <CreditCard className="h-4 w-4 mr-1" /> Pay
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No invoices found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredInvoices.some(invoice => invoice.status === "Unpaid") && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex justify-between items-center">
          <div>
            <h3 className="font-medium text-yellow-800">You have unpaid invoices</h3>
            <p className="text-sm text-yellow-700">Please pay your invoices before the due date to avoid service interruptions.</p>
          </div>
          <Button 
            className="bg-visa-gold hover:bg-visa-gold/90"
            onClick={handlePayAll}
          >
            <CreditCard className="h-4 w-4 mr-2" /> Pay All
          </Button>
        </div>
      )}
    </div>
  );
};

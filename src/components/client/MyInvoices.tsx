
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
import { useLanguage } from "@/contexts/LanguageContext";

export const MyInvoices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { t, language } = useLanguage();

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
    toast.info(t('viewingInvoice').replace('{id}', id));
  };

  const handleDownloadInvoice = (id: string) => {
    // In a real app, this would download the invoice PDF
    toast.info(t('downloadingInvoice').replace('{id}', id));
  };

  const handlePayInvoice = (id: string) => {
    // In a real app, this would open a payment gateway
    toast.info(t('processingPaymentForInvoice').replace('{id}', id));
  };

  const handlePayAll = () => {
    // In a real app, this would process payment for all unpaid invoices
    const unpaidInvoices = filteredInvoices.filter(invoice => invoice.status === "Unpaid");
    toast.info(t('processingPaymentForInvoices').replace('{count}', unpaidInvoices.length.toString()));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-visa-gold mb-4" />
        <p className="text-visa-dark">{t('loadingInvoices')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className={language === "ar" ? "text-right" : "text-left"}>
        <h1 className="text-2xl font-bold text-visa-dark">{t('myInvoices')}</h1>
      </div>
      
      <div className={`flex flex-col sm:flex-row items-center gap-4 ${language === "ar" ? "sm:flex-row-reverse" : ""}`}>
        <div className="relative w-full sm:max-w-xs">
          <Search className={`absolute top-2.5 h-4 w-4 text-gray-500 ${language === "ar" ? "right-2.5" : "left-2.5"}`} />
          <Input
            type="search"
            placeholder={t('searchInvoices')}
            className={language === "ar" ? "pr-9 text-right" : "pl-9 text-left"}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className={`w-full sm:w-[180px] ${language === "ar" ? "order-1" : ""}`}>
            <SelectValue placeholder={t('filterByStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allInvoices')}</SelectItem>
            <SelectItem value="Paid">{t('paid')}</SelectItem>
            <SelectItem value="Unpaid">{t('unpaid')}</SelectItem>
            <SelectItem value="Overdue">{t('overdue')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={language === "ar" ? "text-right" : ""}>{t('invoiceNumber')}</TableHead>
              <TableHead className={language === "ar" ? "text-right" : ""}>{t('date')}</TableHead>
              <TableHead className={language === "ar" ? "text-right" : ""}>{t('dueDate')}</TableHead>
              <TableHead className={language === "ar" ? "text-right" : ""}>{t('service')}</TableHead>
              <TableHead className={language === "ar" ? "text-right" : ""}>{t('amount')}</TableHead>
              <TableHead className={language === "ar" ? "text-right" : ""}>{t('status')}</TableHead>
              <TableHead className={language === "ar" ? "text-left" : "text-right"}>{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className={`font-medium ${language === "ar" ? "text-right" : ""}`}>{invoice.invoice_number}</TableCell>
                  <TableCell className={language === "ar" ? "text-right" : ""}>{formatDate(invoice.issue_date)}</TableCell>
                  <TableCell className={language === "ar" ? "text-right" : ""}>{invoice.due_date ? formatDate(invoice.due_date) : t('notAvailable')}</TableCell>
                  <TableCell className={language === "ar" ? "text-right" : ""}>{invoice.service_description || t('visaServices')}</TableCell>
                  <TableCell className={language === "ar" ? "text-right" : ""}>{invoice.amount} {invoice.currency}</TableCell>
                  <TableCell className={language === "ar" ? "text-right" : ""}>
                    <StatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell className={language === "ar" ? "text-left" : "text-right"}>
                    <div className={`flex items-center space-x-2 ${language === "ar" ? "justify-start space-x-reverse" : "justify-end"}`}>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title={t('viewInvoiceDetails')}
                        onClick={() => handleViewInvoice(invoice.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title={t('downloadInvoice')}
                        onClick={() => handleDownloadInvoice(invoice.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {invoice.status === "Unpaid" && (
                        <Button 
                          size="sm" 
                          variant="default" 
                          className="bg-visa-gold hover:bg-visa-gold/90" 
                          title={t('payNow')}
                          onClick={() => handlePayInvoice(invoice.id)}
                        >
                          <CreditCard className={`h-4 w-4 ${language === "ar" ? "ml-1" : "mr-1"}`} /> {t('pay')}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  {t('noInvoicesFound')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredInvoices.some(invoice => invoice.status === "Unpaid") && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex justify-between items-center">
          <div className={language === "ar" ? "text-right" : ""}>
            <h3 className="font-medium text-yellow-800">{t('unpaidInvoicesWarning')}</h3>
            <p className="text-sm text-yellow-700">{t('unpaidInvoicesDescription')}</p>
          </div>
          <Button 
            className="bg-visa-gold hover:bg-visa-gold/90"
            onClick={handlePayAll}
          >
            <CreditCard className={`h-4 w-4 ${language === "ar" ? "ml-2" : "mr-2"}`} /> {t('payAll')}
          </Button>
        </div>
      )}
    </div>
  );
};

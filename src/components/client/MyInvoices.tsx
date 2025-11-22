import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
import { StatusBadge } from "@/components/admin/StatusBadge";
import { format } from "date-fns";
import { toast } from "sonner";
import { ClientInvoice } from "@/types/crm";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  useInvoices,
  useInvoicesByClient,
  useUpdateInvoiceStatus,
} from "@/hooks/useInvoicesQuery";
import { useCurrentUserId } from "@/hooks/useUserQuery";
import { InvoicePreviewModal } from "./InvoicePreviewModal";
import { PaymentModal } from "./PaymentModal";
import { downloadInvoicePDF } from "@/utils/invoicePDF";
import { useApplicationByInvoice } from "@/hooks/useApplicationByInvoice";
import { fetchApplicationByInvoiceClientId } from "@/api/invoices";
import { useFooterInfo } from "@/hooks/useFooterInfo";

export const MyInvoices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<ClientInvoice | null>(
    null
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const { t, language } = useLanguage();

  // Get current user ID
  const { data: currentUserId, isLoading: userLoading } = useCurrentUserId();

  // Get footer info for company details
  const { data: footerData, isLoading: footerLoading } = useFooterInfo();

  // Use React Query hook to fetch invoices for the current user
  const {
    data: invoicesData,
    isLoading,
    error,
    refetch,
  } = useInvoicesByClient(currentUserId || "", !!currentUserId);

  // Mutation for updating invoice status
  const { mutate: updateInvoiceStatus } = useUpdateInvoiceStatus();

  // Transform the data to match ClientInvoice format
  const invoices: ClientInvoice[] =
    invoicesData?.map((item) => ({
      id: item.id!,
      invoice_number: item.invoice_number,
      client_id: item.client_id!,
      amount: item.amount,
      currency: item.currency || "﷼",
      status: item.status,
      issue_date: item.issue_date!,
      due_date: item.due_date,
      payment_date: item.payment_date,
      service_description: item.service_description,
      created_at: item.created_at!,
      updated_at: item.updated_at!,
      order_id: item.order_id || null,
    })) || [];

  // Combine real and mock data, prioritizing real data
  const displayInvoices =
    invoices && invoices.length > 0
      ? invoices
      : ([] as unknown as ClientInvoice[]);

  // Filter invoices based on search term and status
  const filteredInvoices = displayInvoices.filter(
    (invoice) =>
      (invoice.invoice_number
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        (invoice.service_description &&
          invoice.service_description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))) &&
      (statusFilter === "all" || invoice.status === statusFilter)
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return t("notAvailable");
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch (e) {
      return dateString;
    }
  };

  const handleViewInvoice = (invoice: ClientInvoice) => {
    setSelectedInvoice(invoice);
    setIsPreviewOpen(true);
  };

  const handleDownloadInvoice = async (invoice: ClientInvoice) => {
    console.log("🚀 ~ handleDownloadInvoice ~ invoice:", invoice);

    try {
      // Show loading state
      toast.info(t("fetchingApplicationData"));

      // Fetch application data using the invoice client_id
      const applicationResponse = await fetchApplicationByInvoiceClientId(
        invoice.client_id
      );

      if (!applicationResponse) {
        toast.error(t("applicationDataNotFound"));
        return;
      }

      console.log("🚀 ~ Application data fetched:", applicationResponse);

      console.log(
        `🚀 ~ handleDownloadInvoice ~ applicationResponse.first_name + " " + applicationResponse.last_name,:`,
        applicationResponse.first_name + " " + applicationResponse.last_name
      );

      // Enhance invoice object with application data
      const enhancedInvoice = {
        ...invoice,
        customer_name:
          applicationResponse.first_name + " " + applicationResponse.last_name,
        customer_email: applicationResponse.email || "Email Not Available",
      };

      // Now download the invoice with the enhanced data
      await downloadInvoicePDF(enhancedInvoice, "en", footerData);
      toast.success(t("invoiceDownloaded"));
    } catch (error) {
      console.error(
        "Error fetching application or downloading invoice:",
        error
      );
      toast.error(t("downloadError"));
    }
  };

  const handlePayInvoice = (invoice: ClientInvoice) => {
    setSelectedInvoice(invoice);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = (paymentData: any) => {
    if (selectedInvoice) {
      // Update invoice status to paid
      updateInvoiceStatus(
        {
          id: selectedInvoice.id,
          status: "Paid",
        },
        {
          onSuccess: () => {
            toast.success(t("paymentSuccessful"));
            setIsPaymentOpen(false);
            setSelectedInvoice(null);
            refetch(); // Refresh the invoices list
          },
          onError: (error) => {
            console.error("Error updating invoice status:", error);
            toast.error(t("paymentUpdateError"));
          },
        }
      );
    }
  };

  const handlePayAll = () => {
    const unpaidInvoices = filteredInvoices.filter(
      (invoice) => invoice.status === "Pending" || invoice.status === "Unpaid"
    );

    if (unpaidInvoices.length === 0) {
      toast.info(t("noUnpaidInvoices"));
      return;
    }

    // For demo purposes, we'll just show a toast
    // In a real app, this would open a bulk payment interface
    toast.info(
      t("processingPaymentForInvoices").replace(
        "{count}",
        unpaidInvoices.length.toString()
      )
    );
  };

  if (isLoading || userLoading || footerLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-visa-gold mb-4" />
        <p className="text-visa-dark">{t("loadingInvoices")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">Error loading invoices</p>
        <p className="text-gray-500">Please try refreshing the page</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className={language === "ar" ? "text-right" : "text-left"}>
        <h1 className="text-2xl font-bold text-visa-dark">{t("myInvoices")}</h1>
      </div>

      <div
        className={`flex flex-col sm:flex-row items-center gap-4 ${
          language === "ar" ? "sm:flex-row-reverse" : ""
        }`}
      >
        <div className="relative w-full sm:max-w-xs">
          <Search
            className={`absolute top-2.5 h-4 w-4 text-gray-500 ${
              language === "ar" ? "right-2.5" : "left-2.5"
            }`}
          />
          <Input
            type="search"
            placeholder={t("searchInvoices")}
            className={language === "ar" ? "pr-9 text-right" : "pl-9 text-left"}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger
            className={`w-full sm:w-[180px] ${
              language === "ar" ? "order-1" : ""
            }`}
          >
            <SelectValue placeholder={t("filterByStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allInvoices")}</SelectItem>
            <SelectItem value="Paid">{t("paid")}</SelectItem>
            <SelectItem value="Pending">{t("unpaid")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={language === "ar" ? "text-right" : ""}>
                {t("invoiceNumber")}
              </TableHead>
              <TableHead className={language === "ar" ? "text-right" : ""}>
                {t("date")}
              </TableHead>
              <TableHead className={language === "ar" ? "text-right" : ""}>
                {t("dueDate")}
              </TableHead>
              <TableHead className={language === "ar" ? "text-right" : ""}>
                {t("service")}
              </TableHead>
              <TableHead className={language === "ar" ? "text-right" : ""}>
                {t("amount")}
              </TableHead>
              <TableHead className={language === "ar" ? "text-right" : ""}>
                {t("status")}
              </TableHead>
              <TableHead
                className={language === "ar" ? "text-left" : "text-right"}
              >
                {t("actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell
                    className={`font-medium ${
                      language === "ar" ? "text-right" : ""
                    }`}
                  >
                    {invoice.invoice_number}
                  </TableCell>
                  <TableCell className={language === "ar" ? "text-right" : ""}>
                    {formatDate(invoice.issue_date)}
                  </TableCell>
                  <TableCell className={language === "ar" ? "text-right" : ""}>
                    {invoice.due_date
                      ? formatDate(invoice.due_date)
                      : t("notAvailable")}
                  </TableCell>
                  <TableCell className={language === "ar" ? "text-right" : ""}>
                    {invoice.service_description || t("visaServices")}
                  </TableCell>
                  <TableCell className={language === "ar" ? "text-right" : ""}>
                    {invoice.amount} {invoice.currency}
                  </TableCell>
                  <TableCell className={language === "ar" ? "text-right" : ""}>
                    <StatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell
                    className={language === "ar" ? "text-left" : "text-right"}
                  >
                    <div
                      className={`flex items-center space-x-2 ${
                        language === "ar"
                          ? "justify-start space-x-reverse"
                          : "justify-end"
                      }`}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        title={t("viewInvoiceDetails")}
                        onClick={() => handleViewInvoice(invoice)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title={t("downloadInvoice")}
                        onClick={() => handleDownloadInvoice(invoice)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {(invoice.status === "Pending" ||
                        invoice.status === "Unpaid") && (
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-visa-gold hover:bg-visa-gold/90"
                          title={t("payNow")}
                          onClick={() => handlePayInvoice(invoice)}
                        >
                          <CreditCard
                            className={`h-4 w-4 ${
                              language === "ar" ? "ml-1" : "mr-1"
                            }`}
                          />{" "}
                          {t("pay")}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  {t("noInvoicesFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* {filteredInvoices.some(invoice => invoice.status === "Pending" || invoice.status === "Unpaid") && (
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
      )} */}

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
            setIsPreviewOpen(false);
            setIsPaymentOpen(true);
          }}
        />
      )}

      {/* Payment Modal */}
      {selectedInvoice && (
        <PaymentModal
          invoice={selectedInvoice}
          isOpen={isPaymentOpen}
          onClose={() => {
            setIsPaymentOpen(false);
            setSelectedInvoice(null);
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

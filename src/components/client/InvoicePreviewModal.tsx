import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, CreditCard, X } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface InvoicePreviewModalProps {
  invoice: any;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (invoiceId: string) => void;
  onPay: (invoiceId: string) => void;
}

export const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onDownload,
  onPay,
}) => {
  const { t, language } = useLanguage();

  if (!invoice) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return t("notAvailable");
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (e) {
      return dateString;
    }
  };

  const calculateTax = (amount: number) => {
    return (amount * 0.15).toFixed(2); // 15% VAT
  };

  const totalWithTax = (amount: number) => {
    return (amount + parseFloat(calculateTax(amount))).toFixed(2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle
            className={`text-xl font-bold ${
              language === "ar" ? "text-right" : "text-left"
            }`}
          >
            {t("invoicePreview")}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Invoice Content */}
        <div className="bg-white p-8 border rounded-lg space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b pb-6">
            <div className={language === "ar" ? "text-right" : "text-left"}>
              <h1 className="text-3xl font-bold text-visa-dark mb-2">
                {language === "ar" ? "فاتورة" : "INVOICE"}
              </h1>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>{t("company")}:</strong> Vise Services
                </p>
                <p>
                  <strong>{t("email")}:</strong> info@viseservices.com
                </p>
                <p>
                  <strong>{t("phone")}:</strong> +966 11 234 5678
                </p>
              </div>
            </div>
            <div
              className={`${
                language === "ar" ? "text-left" : "text-right"
              } space-y-2`}
            >
              <div className="text-right">
                <StatusBadge status={invoice.status} />
              </div>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>{t("invoiceNumber")}:</strong>{" "}
                  {invoice.invoice_number}
                </p>
                <p>
                  <strong>{t("issueDate")}:</strong>{" "}
                  {formatDate(invoice.issue_date)}
                </p>
                {invoice.due_date && (
                  <p>
                    <strong>{t("dueDate")}:</strong>{" "}
                    {formatDate(invoice.due_date)}
                  </p>
                )}
                {invoice.payment_date && (
                  <p>
                    <strong>{t("paymentDate")}:</strong>{" "}
                    {formatDate(invoice.payment_date)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
            <div className={language === "ar" ? "text-right" : "text-left"}>
              <h3 className="font-semibold text-visa-dark mb-2">
                {t("billTo")}:
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>{invoice.customer_name || t("notAvailable")}</p>
                <p>{invoice.customer_email || t("notAvailable")}</p>
                <p>
                  {t("clientId")}: {invoice.client_id}
                </p>
              </div>
            </div>
            <div className={language === "ar" ? "text-right" : "text-left"}>
              <h3 className="font-semibold text-visa-dark mb-2">
                {t("invoiceDetails")}:
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>{t("currency")}:</strong> {invoice.currency || "SAR"}
                </p>
                <p>
                  <strong>{t("createdAt")}:</strong>{" "}
                  {formatDate(invoice.created_at)}
                </p>
                {invoice.updated_at && (
                  <p>
                    <strong>{t("lastUpdated")}:</strong>{" "}
                    {formatDate(invoice.updated_at)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Services Table */}
          <div>
            <h3
              className={`font-semibold text-visa-dark mb-4 ${
                language === "ar" ? "text-right" : "text-left"
              }`}
            >
              {t("services")}:
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className={`px-4 py-3 text-sm font-medium text-gray-900 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {t("description")}
                    </th>
                    <th
                      className={`px-4 py-3 text-sm font-medium text-gray-900 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {t("quantity")}
                    </th>
                    <th
                      className={`px-4 py-3 text-sm font-medium text-gray-900 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {t("unitPrice")}
                    </th>
                    <th
                      className={`px-4 py-3 text-sm font-medium text-gray-900 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {t("total")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td
                      className={`px-4 py-3 text-sm text-gray-900 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {invoice.service_description || t("visaServices")}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm text-gray-900 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      1
                    </td>
                    <td
                      className={`px-4 py-3 text-sm text-gray-900 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {invoice.amount} {invoice.currency || "SAR"}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm text-gray-900 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {invoice.amount} {invoice.currency || "SAR"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div
            className={`flex justify-end ${
              language === "ar" ? "flex-row-reverse" : ""
            }`}
          >
            <div className="w-64 space-y-2">
              {/* <div className="flex justify-between text-sm">
                <span>{t("subtotal")}:</span>
                <span>
                  {invoice.amount} {invoice.currency || "SAR"}
                </span>
              </div> */}
              {/* <div className="flex justify-between text-sm">
                <span>{t("tax")} (15%):</span>
                <span>
                  {calculateTax(invoice.amount)} {invoice.currency || "SAR"}
                </span>
              </div> */}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>{t("totalAmount")}:</span>
                <span>
                  {invoice.amount} {invoice.currency || "SAR"}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className={`text-sm text-gray-600 text-center pt-6 border-t ${
              language === "ar" ? "text-right" : "text-left"
            }`}
          >
            <p>{t("invoiceFooter")}</p>
            <p className="mt-2 font-medium">{t("thankYou")}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className={`flex gap-3 pt-4 border-t ${
            language === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          {/* <Button
            variant="outline"
            onClick={() => onDownload(invoice.id)}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {t('download')}
          </Button> */}

          {(invoice.status === "Pending" || invoice.status === "Unpaid") && (
            <Button
              onClick={() => onPay(invoice.id)}
              className="bg-visa-gold hover:bg-visa-gold/90 flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              {t("payNow")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Loader,
  CheckCircle,
  XCircle,
  X,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  useInitiatePayment,
  useManualCheckPaymentStatus,
} from "@/hooks/usePaymentQuery";
import { generateOrderId } from "@/api/payment";
import { useApplicationByInvoice } from "@/hooks/useApplicationByInvoice";
import { useUpdateInvoiceStatusByOrderId } from "@/hooks/useUpdateInvoiceStatusByOrderId";
import { toast } from "sonner";

interface PaymentModalProps {
  invoice: any;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (paymentData: any) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const { t, language } = useLanguage();
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "checking" | "success" | "failed" | "timeout"
  >("idle");
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [statusCheckInterval, setStatusCheckInterval] =
    useState<NodeJS.Timeout | null>(null);

  const { mutate: initiatePayment, isPending: isInitiatingPayment } =
    useInitiatePayment();
  const { mutate: checkPaymentStatus } = useManualCheckPaymentStatus();
  const { mutate: updateInvoiceStatus } = useUpdateInvoiceStatusByOrderId();

  // Fetch application data when invoice with client_id is available
  const { 
    data: applicationData, 
    isLoading: isLoadingApplication,
    error: applicationError 
  } = useApplicationByInvoice(invoice?.client_id || "", !!invoice?.client_id);

  // Log application data when it changes
  useEffect(() => {
    if (applicationData) {
      console.log("🚀 ~ PaymentModal ~ Fetched application data:", applicationData);
    }
    if (applicationError) {
      console.error("Error fetching application data:", applicationError);
      toast.error("Failed to load application details");
    }
  }, [applicationData, applicationError]);

  // Clean up interval on unmount or when modal closes
  useEffect(() => {
    if (!isOpen && statusCheckInterval) {
      clearInterval(statusCheckInterval);
      setStatusCheckInterval(null);
    }
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [isOpen, statusCheckInterval]);

  // Function to start checking payment status
  const startPaymentStatusCheck = (paymentId: string, orderId: string) => {
    const interval = setInterval(() => {
      checkPaymentStatus(
        {
          paymentId,
          orderId,
        },
        {
          onSuccess: (response) => {
            if (response.payment_status === "completed") {
              clearInterval(interval);
              setStatusCheckInterval(null);
              setPaymentStatus("success");

              // Update invoice status to paid
              if (orderId) {
                updateInvoiceStatus({
                  orderId,
                  paymentData: {
                    payment_id: paymentId,
                    transaction_id: response.transaction_id
                  }
                });
              }

              // Only call onPaymentSuccess when payment is actually completed
              onPaymentSuccess({
                payment_id: paymentId,
                order_id: orderId,
                transaction_id: response.transaction_id,
                amount: invoice.amount,
                currency: invoice.currency || "SAR",
              });

              toast.success(t("paymentSuccessful"));
            } else if (
              response.payment_status === "failed" ||
              response.payment_status === "cancelled"
            ) {
              clearInterval(interval);
              setStatusCheckInterval(null);
              setPaymentStatus("failed");
              toast.error(t("paymentFailed"));
            }
            // If status is still 'pending', continue checking
          },
          onError: (error) => {
            console.error("Error checking payment status:", error);
            // Continue checking despite errors, unless it's been too long
          },
        }
      );
    }, 5000); // Check every 5 seconds

    setStatusCheckInterval(interval);

    // Stop checking after 10 minutes (timeout)
    setTimeout(() => {
      if (interval) {
        clearInterval(interval);
        setStatusCheckInterval(null);
        if (paymentStatus === "checking") {
          setPaymentStatus("timeout");
          toast.warning(t("paymentVerificationTimeout"));
        }
      }
    }, 600000); // 10 minutes
  };

  const handlePayment = async () => {
    console.log("🚀 ~ handlePayment ~ invoice:", invoice);
    console.log("🚀 ~ handlePayment ~ applicationData:", applicationData);
    if (!invoice) return;

    // Check if application data is available
    if (!applicationData) {
      toast.error("Application data not loaded. Please try again.");
      return;
    }

    setPaymentStatus("processing");

    // Use application data to enhance payment information
    const paymentData = {
      amount: invoice.amount,
      currency: invoice.currency || "SAR",
      order_id: invoice.order_id || applicationData.order_id,
      description: invoice.service_description || `${applicationData.service_type} - ${applicationData.country}`,
      customer_email: applicationData.email || invoice.customer_email || "customer@example.com",
      customer_name: `${applicationData.first_name} ${applicationData.last_name}` || invoice.customer_name || "Customer",
      customer_phone: applicationData.phone,
      return_url: `${window.location.origin}/payment/return?order_id=${invoice.order_id || applicationData.order_id}`,
      callback_url: `${window.location.origin}/api/payment/callback`,
    };

    console.log("🚀 ~ Payment data with application info:", paymentData);

    initiatePayment(paymentData, {
      onSuccess: (response) => {
        if (response.status === "success" && response.payment_url) {
          setPaymentUrl(response.payment_url);
          setPaymentId(response.payment_id || "");
          setPaymentStatus("checking");

          // Start checking payment status periodically
          if (response.payment_id) {
            startPaymentStatusCheck(response.payment_id, invoice.order_id);
          }

          // The payment window opening is handled in the payment API
          toast.info(t("paymentWindowOpened"));
        } else {
          setPaymentStatus("failed");
          toast.error(response.error_message || t("paymentFailed"));
        }
      },
      onError: (error) => {
        setPaymentStatus("failed");
        toast.error(t("paymentFailed"));
        console.error("Payment error:", error);
      },
    });
  };

  const handleClose = () => {
    // Clean up any running status checks
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
      setStatusCheckInterval(null);
    }

    setPaymentStatus("idle");
    setPaymentUrl(null);
    setPaymentId("");
    onClose();
  };

  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-md"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle
            className={`text-xl font-bold ${
              language === "ar" ? "text-right" : "text-left"
            }`}
          >
            {t("paymentProcess")}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Summary */}
          <div
            className={`bg-gray-50 p-4 rounded-lg ${
              language === "ar" ? "text-right" : "text-left"
            }`}
          >
            <h3 className="font-semibold text-visa-dark mb-2">
              {t("paymentSummary")}
              {isLoadingApplication && (
                <Loader className="inline h-4 w-4 animate-spin text-visa-gold ml-2" />
              )}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t("invoiceNumber")}:</span>
                <span className="font-medium">{invoice.invoice_number}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("service")}:</span>
                <span className="font-medium">
                  {invoice.service_description || t("visaServices")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t("amount")}:</span>
                <span className="font-bold text-lg">
                  {invoice.amount} {invoice.currency || "SAR"}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="text-center">
            {paymentStatus === "idle" && (
              <div className="space-y-4">
                <CreditCard className="h-12 w-12 mx-auto text-visa-gold" />
                <p className="text-gray-600">{t("readyToProcess")}</p>
                <Button
                  onClick={handlePayment}
                  disabled={isInitiatingPayment}
                  className="w-full bg-visa-gold hover:bg-visa-gold/90"
                >
                  {isInitiatingPayment ? (
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CreditCard className="h-4 w-4 mr-2" />
                  )}
                  {t("processPayment")}
                </Button>
              </div>
            )}

            {paymentStatus === "processing" && (
              <div className="space-y-4">
                <Loader className="h-12 w-12 mx-auto text-visa-gold animate-spin" />
                <p className="text-gray-600">{t("processingPayment")}</p>
                <p className="text-sm text-gray-500">{t("doNotClose")}</p>
              </div>
            )}

            {paymentStatus === "checking" && (
              <div className="space-y-4">
                <div className="animate-pulse rounded-full h-12 w-12 bg-yellow-300 mx-auto flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-800" />
                </div>
                <p className="text-gray-600">{t("checkingPaymentStatus")}</p>
                <p className="text-sm text-gray-500">
                  {t("pleaseWaitPaymentVerification")}
                </p>
                {paymentUrl && (
                  <a
                    href={paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-visa-gold hover:underline text-sm"
                  >
                    {t("reopenPaymentWindow")}
                  </a>
                )}
              </div>
            )}

            {paymentStatus === "success" && (
              <div className="space-y-4">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
                <p className="text-green-600 font-medium">
                  {t("paymentSuccessful")}
                </p>
                <p className="text-sm text-gray-500">{t("paymentCompleted")}</p>
                <Button onClick={handleClose} className="w-full">
                  {t("close")}
                </Button>
              </div>
            )}

            {paymentStatus === "failed" && (
              <div className="space-y-4">
                <XCircle className="h-12 w-12 mx-auto text-red-500" />
                <p className="text-red-600 font-medium">{t("paymentFailed")}</p>
                <p className="text-sm text-gray-500">{t("paymentError")}</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setPaymentStatus("idle")}
                    variant="outline"
                    className="flex-1"
                  >
                    {t("tryAgain")}
                  </Button>
                  <Button onClick={handleClose} className="flex-1">
                    {t("close")}
                  </Button>
                </div>
              </div>
            )}

            {paymentStatus === "timeout" && (
              <div className="space-y-4">
                <div className="rounded-full h-12 w-12 bg-orange-100 mx-auto flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <p className="text-orange-600 font-medium">
                  {t("paymentVerificationTimeout")}
                </p>
                <p className="text-sm text-gray-600">
                  {t("paymentMayStillBeProcessing")}
                </p>
                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      if (paymentId && invoice.order_id) {
                        setPaymentStatus("checking");
                        startPaymentStatusCheck(paymentId, invoice.order_id);
                      }
                    }}
                    className="w-full bg-visa-gold hover:bg-visa-gold/90"
                  >
                    {t("checkStatusAgain")}
                  </Button>
                  <Button
                    onClick={() => setPaymentStatus("idle")}
                    variant="outline"
                    className="w-full"
                  >
                    {t("startNewPayment")}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {paymentUrl && (
            <div
              className={`text-sm text-gray-500 ${
                language === "ar" ? "text-right" : "text-left"
              }`}
            >
              <p>{t("paymentWindowOpened")}</p>
              <a
                href={paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-visa-gold hover:underline"
              >
                {t("openPaymentLink")}
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
